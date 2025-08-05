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
        'inauthentic_content',
        'advertiser_friendly',
        'community_guidelines',
        'creator_responsibility',
        'creator_integrity',
        'youtube_specific'
      ]),
      severity: z.enum(['low', 'medium', 'high', 'critical']),
      description: z.string(),
      recommendation: z.string(),
      impact: z.string(),
      timestamp: z.number().optional(),
      youtubeSpecific: z.object({
        policyViolated: z.string().optional(),
        complianceLevel: z.enum(['compliant', 'warning', 'violation', 'critical_violation']).optional(),
        monetizationImpact: z.enum(['none', 'limited', 'demonetized', 'channel_strike']).optional(),
      }).optional(),
    })
  ),
  recommendations: z.array(z.string()),
  platformSpecific: z.object({
    notes: z.array(z.string()),
    requirements: z.array(z.string()),
    youtubeMonetization: z.object({
      eligibilityStatus: z.enum(['eligible', 'limited', 'ineligible', 'under_review']),
      partnerProgramRequirements: z.object({
        subscribersCheck: z.boolean(),
        watchHoursCheck: z.boolean(),
        communityGuidelinesCheck: z.boolean(),
        copyrightStrikesCheck: z.boolean(),
      }),
      adSuitability: z.object({
        overallRating: z.enum(['suitable', 'limited', 'not_suitable']),
        contentRating: z.string(),
        advertiserFriendly: z.boolean(),
      }),
      contentAuthenticity: z.object({
        originalContent: z.boolean(),
        massProduced: z.boolean(),
        repetitiveContent: z.boolean(),
        templateBased: z.boolean(),
      }),
    }).optional(),
  }),
  contentAnalysis: z.object({
    visualElements: z.array(z.string()),
    audioQuality: z.string(),
    contentType: z.string(),
    appropriateAudience: z.string(),
    estimatedEngagement: z.string(),
    youtubeOptimization: z.object({
      thumbnailCompliance: z.boolean(),
      titleOptimization: z.string(),
      descriptionQuality: z.string(),
      contentLength: z.string(),
      engagementFactors: z.array(z.string()),
    }).optional(),
  }),
  youtubeCompliance: z.object({
    advertiserFriendlyScore: z.number().min(0).max(100),
    communityGuidelinesScore: z.number().min(0).max(100),
    copyrightComplianceScore: z.number().min(0).max(100),
    authenticityScore: z.number().min(0).max(100),
    overallMonetizationScore: z.number().min(0).max(100),
    policyBreakdown: z.array(z.object({
      policy: z.string(),
      status: z.enum(['pass', 'warning', 'fail']),
      score: z.number().min(0).max(100),
      details: z.string(),
    })),
  }).optional(),
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
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'video',
      payload: {
        videoData: {
          ...videoData,
          audioDataBase64: videoData.audioData ? arrayBufferToBase64(videoData.audioData) : undefined,
        },
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

export async function analyzeYouTubeVideo(
  videoUrl: string,
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
      type: 'youtube',
      payload: {
        videoUrl,
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
