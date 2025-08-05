import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const AnalysisSchema = z.object({
  monetizationEligible: z.boolean(),
  overallScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  issues: z.array(z.object({
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
  })),
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

type AnalysisResult = z.infer<typeof AnalysisSchema>;

interface VideoMetadata {
  duration: number;
  size: number;
  type: string;
}

interface VideoAnalysisData {
  metadata: VideoMetadata;
  frames: string[];
  audioData?: ArrayBuffer;
}

// Get Google Cloud access token
async function getAccessToken(): Promise<string> {
  const { GoogleAuth } = await import('google-auth-library');
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token || '';
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Extract YouTube video ID from URL
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Analyze uploaded video content
async function analyzeVideoContent(
  videoData: VideoAnalysisData,
  platform: string,
  projectId: string,
  location: string,
  additionalContext?: string
): Promise<AnalysisResult> {
  // Try multiple models in order of preference
  const models = [
    'gemini-1.0-pro',
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-2.0-flash-exp',
    'gemini-2.0-pro-exp'
  ];
  
  let lastError: Error | null = null;
  
  for (const model of models) {
    try {
      return await analyzeVideoWithModel(videoData, platform, projectId, location, additionalContext, model);
    } catch (error) {
      console.log(`Model ${model} failed for video analysis, trying next...`);
      lastError = error as Error;
      continue;
    }
  }
  
  // If all models fail, throw the last error
  throw lastError || new Error('All Vertex AI models failed for video analysis');
}

async function analyzeVideoWithModel(
  videoData: VideoAnalysisData,
  platform: string,
  projectId: string,
  location: string,
  additionalContext?: string,
  model: string = 'gemini-1.0-pro'
): Promise<AnalysisResult> {
  const textPrompt = `
    YOUTUBE MONETIZATION POLICY COMPLIANCE ANALYSIS
    
    Analyze this video content comprehensively for YouTube monetization eligibility based on the latest YouTube Partner Program policies as of 2025.
    
    Video Metadata:
    - Duration: ${videoData.metadata.duration} seconds
    - File Size: ${videoData.metadata.size} bytes
    - Type: ${videoData.metadata.type}
    - Platform: ${platform}
    
    Additional Context: ${additionalContext || 'None provided'}
    
    Frame Analysis: I have ${videoData.frames.length} frames extracted from the video for visual analysis.
    
    CRITICAL YOUTUBE POLICY AREAS TO EVALUATE:

    1. **INAUTHENTIC CONTENT POLICY** (July 15, 2025 Update):
       - Check for mass-produced or repetitive content
       - Identify template-based content with minimal variation
       - Assess if content is made primarily for views vs. viewer value
       - Flag content that lacks original creation or significant modification
       - Look for content that is easily replicable at scale

    2. **ADVERTISER-FRIENDLY CONTENT GUIDELINES**:
       - Violence and dangerous acts
       - Inappropriate language and profanity
       - Adult content and sexual themes
       - Controversial or sensitive subjects
       - Harmful or dangerous content
       - Hateful and derogatory content
       - Recreational drugs and drug-related content

    3. **COMMUNITY GUIDELINES COMPLIANCE**:
       - Spam, deceptive practices, and scams
       - Nudity and sexual content
       - Child safety violations
       - Harmful or dangerous content
       - Harassment and cyberbullying
       - Hate speech
       - Violent or graphic content

    4. **COPYRIGHT AND RIGHTS MANAGEMENT**:
       - Copyrighted music usage
       - Video clips from movies, TV shows, or other creators
       - Images or graphics with copyright issues
       - Fair use considerations
       - Content ID potential matches

    5. **CREATOR RESPONSIBILITY AND INTEGRITY**:
       - On and off-platform behavior standards
       - Misleading metadata (titles, thumbnails, descriptions)
       - Artificial engagement manipulation
       - Deceptive practices or fraud
       - Creator authenticity verification

    6. **YOUTUBE PARTNER PROGRAM REQUIREMENTS**:
       - Content originality and authenticity
       - Compliance with monetization policies
       - Adherence to community guidelines
       - Copyright compliance
       - Suitable for most advertisers

    ANALYSIS REQUIREMENTS:
    - Provide specific scores for each policy area (0-100)
    - Identify exact policy violations with severity levels
    - Give actionable recommendations for compliance
    - Assess monetization impact (none/limited/demonetized/channel_strike)
    - Consider timestamp-specific issues in the video
    - Evaluate thumbnail compliance if visible
    - Assess title and description optimization potential

    For YouTube specifically, be extra strict about:
    - Repetitive content patterns
    - Content that appears mass-produced
    - Lack of educational or entertainment value
    - Copyright-infringing material
    - Content unsuitable for advertisers
    - Community guideline violations

    Provide detailed, actionable feedback that helps creators understand exactly what needs to be changed for monetization eligibility.

    Respond with valid JSON matching this structure:
    {
      "monetizationEligible": boolean,
      "overallScore": number (0-100),
      "confidence": number (0-100),
      "issues": [
        {
          "category": "string",
          "severity": "string",
          "description": "string",
          "recommendation": "string", 
          "impact": "string",
          "timestamp": number (optional),
          "youtubeSpecific": {
            "policyViolated": "string",
            "complianceLevel": "string",
            "monetizationImpact": "string"
          }
        }
      ],
      "recommendations": ["string"],
      "platformSpecific": {
        "notes": ["string"],
        "requirements": ["string"],
        "youtubeMonetization": {
          "eligibilityStatus": "string",
          "partnerProgramRequirements": {
            "subscribersCheck": boolean,
            "watchHoursCheck": boolean,
            "communityGuidelinesCheck": boolean,
            "copyrightStrikesCheck": boolean
          },
          "adSuitability": {
            "overallRating": "string",
            "contentRating": "string",
            "advertiserFriendly": boolean
          },
          "contentAuthenticity": {
            "originalContent": boolean,
            "massProduced": boolean,
            "repetitiveContent": boolean,
            "templateBased": boolean
          }
        }
      },
      "contentAnalysis": {
        "visualElements": ["string"],
        "audioQuality": "string",
        "contentType": "string",
        "appropriateAudience": "string",
        "estimatedEngagement": "string",
        "youtubeOptimization": {
          "thumbnailCompliance": boolean,
          "titleOptimization": "string",
          "descriptionQuality": "string",
          "contentLength": "string",
          "engagementFactors": ["string"]
        }
      },
      "youtubeCompliance": {
        "advertiserFriendlyScore": number,
        "communityGuidelinesScore": number,
        "copyrightComplianceScore": number,
        "authenticityScore": number,
        "overallMonetizationScore": number,
        "policyBreakdown": [
          {
            "policy": "string",
            "status": "string",
            "score": number,
            "details": "string"
          }
        ]
      }
    }
  `;

  try {
    const accessToken = await getAccessToken();
    
    // Clean and validate projectId and location
    const cleanProjectId = projectId.trim();
    const cleanLocation = location.trim();
    
    if (!cleanProjectId || !cleanLocation) {
      throw new Error('Invalid project ID or location');
    }
    
    const response = await fetch(
      `https://${cleanLocation}-aiplatform.googleapis.com/v1/projects/${cleanProjectId}/locations/${cleanLocation}/publishers/google/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: textPrompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 8192,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vertex AI API Error:', response.status, errorText);
      throw new Error(`Vertex AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('No content received from Vertex AI');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return AnalysisSchema.parse(result);
  } catch (error) {
    console.error('Vertex AI Analysis Error:', error);
    throw error;
  }
}

// Analyze YouTube video URL
async function analyzeYouTubeVideo(
  videoUrl: string,
  platform: string,
  projectId: string,
  location: string
): Promise<AnalysisResult> {
  // Try multiple models in order of preference
  const models = [
    'gemini-1.0-pro',
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-2.0-flash-exp',
    'gemini-2.0-pro-exp'
  ];
  
  let lastError: Error | null = null;
  
  for (const model of models) {
    try {
      return await analyzeYouTubeWithModel(videoUrl, platform, projectId, location, model);
    } catch (error) {
      console.log(`Model ${model} failed for YouTube analysis, trying next...`);
      lastError = error as Error;
      continue;
    }
  }
  
  // If all models fail, throw the last error
  throw lastError || new Error('All Vertex AI models failed for YouTube analysis');
}

async function analyzeYouTubeWithModel(
  videoUrl: string,
  platform: string,
  projectId: string,
  location: string,
  model: string = 'gemini-1.0-pro'
): Promise<AnalysisResult> {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  const textPrompt = `
    YOUTUBE MONETIZATION POLICY COMPLIANCE ANALYSIS FOR EXISTING VIDEO
    
    Analyze this existing YouTube video for monetization eligibility based on the latest YouTube Partner Program policies as of 2025.
    
    Video URL: ${videoUrl}
    Video ID: ${videoId}
    Platform: ${platform}
    
    CRITICAL YOUTUBE POLICY AREAS TO EVALUATE:

    1. **INAUTHENTIC CONTENT POLICY** (July 15, 2025 Update):
       - Check for mass-produced or repetitive content
       - Identify template-based content with minimal variation
       - Assess if content is made primarily for views vs. viewer value
       - Flag content that lacks original creation or significant modification
       - Look for content that is easily replicable at scale

    2. **ADVERTISER-FRIENDLY CONTENT GUIDELINES**:
       - Violence and dangerous acts
       - Inappropriate language and profanity
       - Adult content and sexual themes
       - Controversial or sensitive subjects
       - Harmful or dangerous content
       - Hateful and derogatory content
       - Recreational drugs and drug-related content

    3. **COMMUNITY GUIDELINES COMPLIANCE**:
       - Spam, deceptive practices, and scams
       - Nudity and sexual content
       - Child safety violations
       - Harmful or dangerous content
       - Harassment and cyberbullying
       - Hate speech
       - Violent or graphic content

    4. **COPYRIGHT AND RIGHTS MANAGEMENT**:
       - Copyrighted music usage
       - Video clips from movies, TV shows, or other creators
       - Images or graphics with copyright issues
       - Fair use considerations
       - Content ID potential matches

    5. **CREATOR RESPONSIBILITY AND INTEGRITY**:
       - On and off-platform behavior standards
       - Misleading metadata (titles, thumbnails, descriptions)
       - Artificial engagement manipulation
       - Deceptive practices or fraud
       - Creator authenticity verification

    6. **YOUTUBE PARTNER PROGRAM REQUIREMENTS**:
       - Content originality and authenticity
       - Compliance with monetization policies
       - Adherence to community guidelines
       - Copyright compliance
       - Suitable for most advertisers

    ANALYSIS REQUIREMENTS:
    - Provide specific scores for each policy area (0-100)
    - Identify exact policy violations with severity levels
    - Give actionable recommendations for compliance
    - Assess monetization impact (none/limited/demonetized/channel_strike)
    - Consider timestamp-specific issues in the video
    - Evaluate thumbnail compliance if visible
    - Assess title and description optimization potential

    For YouTube specifically, be extra strict about:
    - Repetitive content patterns
    - Content that appears mass-produced
    - Lack of educational or entertainment value
    - Copyright-infringing material
    - Content unsuitable for advertisers
    - Community guideline violations

    Provide detailed, actionable feedback that helps creators understand exactly what needs to be changed for monetization eligibility.

    Respond with valid JSON matching this structure:
    {
      "monetizationEligible": boolean,
      "overallScore": number (0-100),
      "confidence": number (0-100),
      "issues": [
        {
          "category": "string",
          "severity": "string",
          "description": "string",
          "recommendation": "string", 
          "impact": "string",
          "timestamp": number (optional),
          "youtubeSpecific": {
            "policyViolated": "string",
            "complianceLevel": "string",
            "monetizationImpact": "string"
          }
        }
      ],
      "recommendations": ["string"],
      "platformSpecific": {
        "notes": ["string"],
        "requirements": ["string"],
        "youtubeMonetization": {
          "eligibilityStatus": "string",
          "partnerProgramRequirements": {
            "subscribersCheck": boolean,
            "watchHoursCheck": boolean,
            "communityGuidelinesCheck": boolean,
            "copyrightStrikesCheck": boolean
          },
          "adSuitability": {
            "overallRating": "string",
            "contentRating": "string",
            "advertiserFriendly": boolean
          },
          "contentAuthenticity": {
            "originalContent": boolean,
            "massProduced": boolean,
            "repetitiveContent": boolean,
            "templateBased": boolean
          }
        }
      },
      "contentAnalysis": {
        "visualElements": ["string"],
        "audioQuality": "string",
        "contentType": "string",
        "appropriateAudience": "string",
        "estimatedEngagement": "string",
        "youtubeOptimization": {
          "thumbnailCompliance": boolean,
          "titleOptimization": "string",
          "descriptionQuality": "string",
          "contentLength": "string",
          "engagementFactors": ["string"]
        }
      },
      "youtubeCompliance": {
        "advertiserFriendlyScore": number,
        "communityGuidelinesScore": number,
        "copyrightComplianceScore": number,
        "authenticityScore": number,
        "overallMonetizationScore": number,
        "policyBreakdown": [
          {
            "policy": "string",
            "status": "string",
            "score": number,
            "details": "string"
          }
        ]
      }
    }
  `;

  try {
    const accessToken = await getAccessToken();
    
    // Clean and validate projectId and location
    const cleanProjectId = projectId.trim();
    const cleanLocation = location.trim();
    
    if (!cleanProjectId || !cleanLocation) {
      throw new Error('Invalid project ID or location');
    }
    
    const response = await fetch(
      `https://${cleanLocation}-aiplatform.googleapis.com/v1/projects/${cleanProjectId}/locations/${cleanLocation}/publishers/google/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: textPrompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 8192,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vertex AI API Error:', response.status, errorText);
      throw new Error(`Vertex AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('No content received from Vertex AI');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return AnalysisSchema.parse(result);
  } catch (error) {
    console.error('Vertex AI Analysis Error:', error);
    throw error;
  }
}

// Analyze text content
async function analyzeContent(
  content: string,
  platform: string,
  projectId: string,
  location: string
): Promise<AnalysisResult> {
  // Try multiple models in order of preference
  const models = [
    'gemini-1.0-pro',
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-2.0-flash-exp',
    'gemini-2.0-pro-exp'
  ];
  
  let lastError: Error | null = null;
  
  for (const model of models) {
    try {
      return await analyzeContentWithModel(content, platform, projectId, location, model);
    } catch (error) {
      console.log(`Model ${model} failed for text analysis, trying next...`);
      lastError = error as Error;
      continue;
    }
  }
  
  // If all models fail, throw the last error
  throw lastError || new Error('All Vertex AI models failed for text analysis');
}

async function analyzeContentWithModel(
  content: string,
  platform: string,
  projectId: string,
  location: string,
  model: string = 'gemini-1.0-pro'
): Promise<AnalysisResult> {
  const textPrompt = `
    YOUTUBE MONETIZATION POLICY COMPLIANCE ANALYSIS
    
    Analyze this content description for YouTube monetization eligibility based on the latest YouTube Partner Program policies as of 2025.
    
    Content: ${content}
    Platform: ${platform}
    
    CRITICAL YOUTUBE POLICY AREAS TO EVALUATE:

    1. **INAUTHENTIC CONTENT POLICY** (July 15, 2025 Update):
       - Check for mass-produced or repetitive content
       - Identify template-based content with minimal variation
       - Assess if content is made primarily for views vs. viewer value
       - Flag content that lacks original creation or significant modification
       - Look for content that is easily replicable at scale

    2. **ADVERTISER-FRIENDLY CONTENT GUIDELINES**:
       - Violence and dangerous acts
       - Inappropriate language and profanity
       - Adult content and sexual themes
       - Controversial or sensitive subjects
       - Harmful or dangerous content
       - Hateful and derogatory content
       - Recreational drugs and drug-related content

    3. **COMMUNITY GUIDELINES COMPLIANCE**:
       - Spam, deceptive practices, and scams
       - Nudity and sexual content
       - Child safety violations
       - Harmful or dangerous content
       - Harassment and cyberbullying
       - Hate speech
       - Violent or graphic content

    4. **COPYRIGHT AND RIGHTS MANAGEMENT**:
       - Copyrighted music usage
       - Video clips from movies, TV shows, or other creators
       - Images or graphics with copyright issues
       - Fair use considerations
       - Content ID potential matches

    5. **CREATOR RESPONSIBILITY AND INTEGRITY**:
       - On and off-platform behavior standards
       - Misleading metadata (titles, thumbnails, descriptions)
       - Artificial engagement manipulation
       - Deceptive practices or fraud
       - Creator authenticity verification

    6. **YOUTUBE PARTNER PROGRAM REQUIREMENTS**:
       - Content originality and authenticity
       - Compliance with monetization policies
       - Adherence to community guidelines
       - Copyright compliance
       - Suitable for most advertisers

    ANALYSIS REQUIREMENTS:
    - Provide specific scores for each policy area (0-100)
    - Identify exact policy violations with severity levels
    - Give actionable recommendations for compliance
    - Assess monetization impact (none/limited/demonetized/channel_strike)
    - Consider timestamp-specific issues in the video
    - Evaluate thumbnail compliance if visible
    - Assess title and description optimization potential

    For YouTube specifically, be extra strict about:
    - Repetitive content patterns
    - Content that appears mass-produced
    - Lack of educational or entertainment value
    - Copyright-infringing material
    - Content unsuitable for advertisers
    - Community guideline violations

    Provide detailed, actionable feedback that helps creators understand exactly what needs to be changed for monetization eligibility.

    Respond with valid JSON matching this structure:
    {
      "monetizationEligible": boolean,
      "overallScore": number (0-100),
      "confidence": number (0-100),
      "issues": [
        {
          "category": "string",
          "severity": "string",
          "description": "string",
          "recommendation": "string", 
          "impact": "string",
          "timestamp": number (optional),
          "youtubeSpecific": {
            "policyViolated": "string",
            "complianceLevel": "string",
            "monetizationImpact": "string"
          }
        }
      ],
      "recommendations": ["string"],
      "platformSpecific": {
        "notes": ["string"],
        "requirements": ["string"],
        "youtubeMonetization": {
          "eligibilityStatus": "string",
          "partnerProgramRequirements": {
            "subscribersCheck": boolean,
            "watchHoursCheck": boolean,
            "communityGuidelinesCheck": boolean,
            "copyrightStrikesCheck": boolean
          },
          "adSuitability": {
            "overallRating": "string",
            "contentRating": "string",
            "advertiserFriendly": boolean
          },
          "contentAuthenticity": {
            "originalContent": boolean,
            "massProduced": boolean,
            "repetitiveContent": boolean,
            "templateBased": boolean
          }
        }
      },
      "contentAnalysis": {
        "visualElements": ["string"],
        "audioQuality": "string",
        "contentType": "string",
        "appropriateAudience": "string",
        "estimatedEngagement": "string",
        "youtubeOptimization": {
          "thumbnailCompliance": boolean,
          "titleOptimization": "string",
          "descriptionQuality": "string",
          "contentLength": "string",
          "engagementFactors": ["string"]
        }
      },
      "youtubeCompliance": {
        "advertiserFriendlyScore": number,
        "communityGuidelinesScore": number,
        "copyrightComplianceScore": number,
        "authenticityScore": number,
        "overallMonetizationScore": number,
        "policyBreakdown": [
          {
            "policy": "string",
            "status": "string",
            "score": number,
            "details": "string"
          }
        ]
      }
    }
  `;

  try {
    const accessToken = await getAccessToken();
    
    // Clean and validate projectId and location
    const cleanProjectId = projectId.trim();
    const cleanLocation = location.trim();
    
    if (!cleanProjectId || !cleanLocation) {
      throw new Error('Invalid project ID or location');
    }
    
    const response = await fetch(
      `https://${cleanLocation}-aiplatform.googleapis.com/v1/projects/${cleanProjectId}/locations/${cleanLocation}/publishers/google/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: textPrompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 8192,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vertex AI API Error:', response.status, errorText);
      throw new Error(`Vertex AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('No content received from Vertex AI');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return AnalysisSchema.parse(result);
  } catch (error) {
    console.error('Vertex AI Analysis Error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, payload, projectId, location } = body;

    if (!projectId || !location) {
      return NextResponse.json(
        { error: 'Google Cloud Project ID and Location are required' },
        { status: 400 }
      );
    }

    let result: AnalysisResult;

    if (type === 'video') {
      const { videoData, platform, additionalContext } = payload;
      
      // Convert base64 audio data back to ArrayBuffer if present
      if (videoData.audioDataBase64) {
        videoData.audioData = base64ToArrayBuffer(videoData.audioDataBase64);
        delete videoData.audioDataBase64;
      }
      
      result = await analyzeVideoContent(videoData, platform, projectId, location, additionalContext);
    } else if (type === 'youtube') {
      const { videoUrl, platform } = payload;
      result = await analyzeYouTubeVideo(videoUrl, platform, projectId, location);
    } else if (type === 'text') {
      const { content, platform } = payload;
      result = await analyzeContent(content, platform, projectId, location);
    } else {
      return NextResponse.json(
        { error: 'Invalid analysis type' },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Analysis Error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Analysis failed';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : 'Unknown error'
      },
      { status: 500 }
    );
  }
}