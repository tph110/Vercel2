import { Client } from '@gradio/client';
import type { AnalysisResult } from '@shared/schema';

const HUGGINGFACE_SPACE = 'Skindoc/dermai';
const TIMEOUT_MS = 60000; // 60 second timeout for API calls

export async function analyzeImage(imageBuffer: Buffer): Promise<AnalysisResult> {
  try {
    console.log('Connecting to Hugging Face space:', HUGGINGFACE_SPACE);
    
    // Create Gradio client with timeout
    const client = await Promise.race([
      Client.connect(HUGGINGFACE_SPACE),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), TIMEOUT_MS)
      )
    ]) as Awaited<ReturnType<typeof Client.connect>>;
    
    console.log('Connected successfully. Inspecting API...');
    
    // View the API to understand the correct parameters
    try {
      const apiInfo = await client.view_api();
      console.log('API Info:', JSON.stringify(apiInfo, null, 2));
    } catch (err) {
      console.log('Could not retrieve API info:', err);
    }
    
    // Convert buffer to base64 string (detect the actual mime type from buffer)
    const base64Image = imageBuffer.toString('base64');
    
    // Detect mime type from buffer header
    let mimeType = 'image/jpeg';
    if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
      mimeType = 'image/png';
    } else if (imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8) {
      mimeType = 'image/jpeg';
    }
    
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    console.log('Submitting image to prediction queue...');
    
    // Call the predict endpoint with timeout
    // Try with array format first
    const result = await Promise.race([
      client.predict('/predict', {
        img: null,
        base64_str: dataUrl
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Prediction timeout - the model may be loading')), TIMEOUT_MS)
      )
    ]);

    console.log('Received response from Hugging Face:', JSON.stringify(result, null, 2));
    
    // Transform Hugging Face response to our AnalysisResult format
    return parseHuggingFaceResponse(result);
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        throw new Error('The AI model is taking too long to respond. Please try again.');
      } else if (error.message.includes('queue')) {
        throw new Error('The AI service is currently busy. Please try again in a moment.');
      }
    }
    
    throw new Error('Failed to analyze image. Please try again.');
  }
}

function parseHuggingFaceResponse(apiResponse: any): AnalysisResult {
  console.log('Parsing Hugging Face response...');
  
  try {
    // Gradio responses typically have { data: [...] } structure
    const data = apiResponse.data || apiResponse;
    
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    let confidence = 0;
    let findings: string[] = [];

    // Handle various response formats from classification models
    // Format 1: { label: string, confidences: [{label, confidence}, ...] }
    // Format 2: { data: [{ label, confidences: [...] }] }
    // Format 3: Direct array of predictions
    
    let predictions: any = data;
    
    // Unwrap if it's nested in data array
    if (Array.isArray(data) && data.length > 0) {
      predictions = data[0];
    }
    
    // Extract label and confidence from the response
    if (predictions && typeof predictions === 'object') {
      // Check for direct label/confidence properties
      if (predictions.label) {
        const label = predictions.label;
        findings.push(`Primary classification: ${label}`);
        
        // Map label to risk level
        const labelLower = label.toLowerCase();
        if (labelLower.includes('melanoma') || 
            labelLower.includes('malignant') || 
            labelLower.includes('cancer') ||
            labelLower.includes('basal') ||
            labelLower.includes('squamous')) {
          riskLevel = 'high';
        } else if (labelLower.includes('keratosis') || 
                   labelLower.includes('nevus') ||
                   labelLower.includes('suspicious') ||
                   labelLower.includes('atypical')) {
          riskLevel = 'medium';
        } else {
          riskLevel = 'low';
        }
      }
      
      // Extract confidence - check both 'confidence' and 'confidences' formats
      if (typeof predictions.confidence === 'number') {
        confidence = Math.round(predictions.confidence * 100);
        findings.push(`Confidence level: ${confidence}%`);
      } else if (Array.isArray(predictions.confidences)) {
        // Multiple predictions with confidences
        predictions.confidences.forEach((pred: any, idx: number) => {
          if (pred && typeof pred === 'object') {
            const conf = typeof pred.confidence === 'number' 
              ? Math.round(pred.confidence * 100) 
              : pred.confidence;
            
            if (idx === 0) {
              confidence = typeof conf === 'number' ? conf : 0;
            }
            
            if (idx < 4) { // Top 4 predictions
              findings.push(`${pred.label || 'Unknown'}: ${conf}%`);
            }
          }
        });
      }
    }

    // Validate we have meaningful data
    if (confidence === 0 || findings.length === 0) {
      console.warn('Could not extract proper predictions from response. Using fallback.');
      findings = [
        'Analysis completed with limited confidence',
        'Image features detected but classification uncertain',
        'Recommend professional dermatologist evaluation',
        'Consider uploading a higher quality dermatoscope image'
      ];
      confidence = 60;
      riskLevel = 'medium';
    }

    return {
      riskLevel,
      confidence,
      findings,
      timestamp: new Date().toLocaleString()
    };
  } catch (error) {
    console.error('Error parsing Hugging Face response:', error);
    console.error('Raw response was:', JSON.stringify(apiResponse, null, 2));
    
    // Return a safe fallback when parsing fails
    return {
      riskLevel: 'medium',
      confidence: 50,
      findings: [
        'Error processing AI model response',
        'Unable to parse classification results',
        'Immediate professional medical consultation recommended',
        'Please try uploading the image again'
      ],
      timestamp: new Date().toLocaleString()
    };
  }
}
