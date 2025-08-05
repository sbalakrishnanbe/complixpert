import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const location = searchParams.get('location') || 'us-central1';

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Test 1: Authentication
    console.log('Testing Google Cloud authentication...');
    const accessToken = await getAccessToken();
    console.log('✅ Authentication successful');

    // Test 2: Model availability
    console.log('Testing model availability...');
    const response = await fetch(
      `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-pro:generateContent`,
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
                { text: 'Hello, this is a test message. Please respond with "Test successful" if you can read this.' }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 100,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Model test failed:', response.status, errorText);
      return NextResponse.json(
        { 
          error: 'Model test failed',
          status: response.status,
          details: errorText
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    console.log('✅ Model test successful');
    
    return NextResponse.json({
      success: true,
      message: 'Vertex AI is working correctly',
      modelResponse: content,
      projectId,
      location
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 