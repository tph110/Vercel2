import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Download, FileText } from "lucide-react";
import { Loader2 } from "lucide-react";

interface AnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  findings: string[];
  timestamp: string;
}

interface ResultsPanelProps {
  isProcessing: boolean;
  result: AnalysisResult | null;
  onAnalyzeAnother: () => void;
}

export default function ResultsPanel({ 
  isProcessing, 
  result, 
  onAnalyzeAnother 
}: ResultsPanelProps) {
  
  if (isProcessing) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" data-testid="icon-processing" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground" data-testid="text-processing-title">
              Analyzing Image
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="text-processing-description">
              Our AI is examining your dermatoscope image...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto">
            <FileText className="h-12 w-12 text-muted-foreground" data-testid="icon-waiting" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground" data-testid="text-waiting-title">
              Awaiting Analysis
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="text-waiting-description">
              Upload a dermatoscope image to begin AI-powered skin cancer risk assessment
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'high':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="h-8 w-8" />;
      case 'medium':
      case 'high':
        return <AlertTriangle className="h-8 w-8" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-8 space-y-6">
      <Card className="p-6 space-y-6" data-testid="card-analysis-result">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold text-foreground" data-testid="text-result-title">
              Analysis Complete
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="text-result-timestamp">
              {result.timestamp}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-4 p-6 rounded-lg bg-muted/50 ${getRiskColor(result.riskLevel)}`}>
          {getRiskIcon(result.riskLevel)}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h4 className="text-xl font-semibold capitalize" data-testid="text-risk-level">
                {result.riskLevel} Risk
              </h4>
              <Badge variant="secondary" data-testid="badge-confidence">
                {result.confidence}% Confidence
              </Badge>
            </div>
            <p className="text-sm mt-1 opacity-90" data-testid="text-risk-description">
              {result.riskLevel === 'low' 
                ? 'No significant abnormalities detected' 
                : result.riskLevel === 'medium'
                ? 'Some features warrant professional consultation'
                : 'Urgent professional medical evaluation recommended'}
            </p>
          </div>
        </div>

        {result.findings.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-foreground" data-testid="text-findings-title">
              Detailed Findings
            </h4>
            <div className="space-y-2">
              {result.findings.map((finding, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-md bg-card border border-card-border"
                  data-testid={`finding-item-${index}`}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <p className="text-sm text-foreground font-mono flex-1">{finding}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t space-y-3">
          <div className="flex gap-3">
            <Button 
              className="flex-1" 
              onClick={onAnalyzeAnother}
              data-testid="button-analyze-another"
            >
              Analyze Another Image
            </Button>
            <Button 
              variant="outline"
              onClick={() => console.log('Download report clicked')}
              data-testid="button-download-report"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-muted/30" data-testid="card-disclaimer">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Medical Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for proper medical evaluation and care.
        </p>
      </Card>
    </div>
  );
}
