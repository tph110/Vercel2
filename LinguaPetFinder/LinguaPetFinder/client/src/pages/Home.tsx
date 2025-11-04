import { useState } from "react";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import ResultsPanel from "@/components/ResultsPanel";
import { Button } from "@/components/ui/button";

interface AnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  findings: string[];
  timestamp: string;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setSelectedImage(preview);
    setResult(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    
    try {
      // Create FormData and append the image file
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Call the backend API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image');
      }

      const analysisResult: AnalysisResult = await response.json();
      setResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing image:', error);
      // Show error to user
      setResult({
        riskLevel: 'medium',
        confidence: 0,
        findings: [
          'Error processing image',
          error instanceof Error ? error.message : 'Please try again',
          'If the problem persists, please contact support'
        ],
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzeAnother = () => {
    handleClearImage();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 grid lg:grid-cols-2 grid-cols-1">
        <div className="border-r border-border flex flex-col">
          <div className="flex-1">
            <UploadZone
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onClearImage={handleClearImage}
              isProcessing={isProcessing}
            />
          </div>
          
          {selectedImage && !result && (
            <div className="p-6 border-t border-border">
              <Button 
                className="w-full"
                size="lg"
                onClick={handleAnalyze}
                disabled={isProcessing}
                data-testid="button-analyze-image"
              >
                {isProcessing ? 'Analyzing...' : 'Analyze Image'}
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <ResultsPanel
            isProcessing={isProcessing}
            result={result}
            onAnalyzeAnother={handleAnalyzeAnother}
          />
        </div>
      </main>
    </div>
  );
}
