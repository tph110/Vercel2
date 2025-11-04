import ResultsPanel from '../ResultsPanel';

export default function ResultsPanelExample() {
  const mockResult = {
    riskLevel: 'medium' as const,
    confidence: 87,
    findings: [
      'Asymmetry detected in lesion border (ABCDE criterion A)',
      'Irregular border patterns observed in northeast quadrant',
      'Color variation present with brown and darker pigmentation',
      'Diameter measurement: 6.2mm (slightly above threshold)'
    ],
    timestamp: new Date().toLocaleString()
  };

  return (
    <div className="h-[800px]">
      <ResultsPanel
        isProcessing={false}
        result={mockResult}
        onAnalyzeAnother={() => console.log('Analyze another clicked')}
      />
    </div>
  );
}
