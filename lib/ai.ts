import { z } from 'zod';

const AnalysisSchema = z.object({
  monetizationEligible: z.boolean(),
  overallScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  issues: z.array(
    z.object({
      category: z.enum([
        'copyright',
        'content_policy',
        'platform_requirements',
        'monetization_policy',
        'visual_content',
        'audio_content',
      ]),
      severity: z.enum(['low', 'medium', 'high', 'critical']),
      description: z.string(),
      recommendation: z.string(),
      impact: z.string(),
      timestamp: z.number().optional(),
    })
  ),
  recommendations: z.array(z.string()),
  platformSpecific: z.object({
    notes: z.array(z.string()),
    requirements: z.array(z.string()),
  }),
  contentAnalysis: z.object({
    visualElements: z.array(z.string()),
    audioQuality: z.string(),
    contentType: z.string(),
    appropriateAudience: z.string(),
    estimatedEngagement: z.string(),
  }),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function analyzeVideoContent(
  videoData: any,
  platform: string,
  projectId: string,
  location: string,
  additionalContext?: string
): Promise<AnalysisResult> {
  // Convert audioData to base64 for transmission
  const payload = { ...videoData };
  if (payload.audioData) {
    payload.audioDataBase64 = arrayBufferToBase64(payload.audioData);
    delete payload.audioData;
  }

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'video',
      payload: {
        videoData: payload,
        platform,
        additionalContext,
      },
      projectId,
      location,
    }),
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  return response.json();
}

export async function analyzeContent(
  content: string,
  platform: string,
  projectId: string,
  location: string
): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'text',
      payload: {
        content,
        platform,
      },
      projectId,
      location,
    }),
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  return response.json();
}
