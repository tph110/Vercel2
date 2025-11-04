import { z } from "zod";

export const analysisResultSchema = z.object({
  riskLevel: z.enum(['low', 'medium', 'high']),
  confidence: z.number(),
  findings: z.array(z.string()),
  timestamp: z.string(),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
