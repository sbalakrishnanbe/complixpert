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

    console.log('🔍 Starting detailed Vertex AI test...');
    console.log('📋 Project ID:', projectId);
    console.log('🌍 Location:', location);

    // Test 1: Authentication
    console.log('🔐 Testing authentication...');
    const accessToken = await getAccessToken();
    console.log('✅ Authentication successful');

    // Test 2: List available models
    console.log('📋 Testing model list...');
    const listResponse = await fetch(
      `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/models`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('📊 List models response status:', listResponse.status);
    
    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error('❌ List models failed:', errorText);
      return NextResponse.json(
        { 
          error: 'Failed to list models',
          status: listResponse.status,
          details: errorText
        },
        { status: 500 }
      );
    }

    const listData = await listResponse.json();
    console.log('✅ Models listed successfully');
    console.log('📋 Available models:', listData.models?.length || 0);

    // Test 3: Try specific models
    const modelsToTest = [
      'gemini-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'text-bison',
      'chat-bison'
    ];

    const results = [];

    for (const modelName of modelsToTest) {
      console.log(`🧪 Testing model: ${modelName}`);
      
      try {
        const testResponse = await fetch(
          `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelName}:generateContent`,
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
                    { text: 'Hello, this is a test.' }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 50,
              }
            })
          }
        );

        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log(`✅ ${modelName}: SUCCESS`);
          results.push({
            model: modelName,
            status: 'SUCCESS',
            response: testData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
          });
        } else {
          const errorText = await testResponse.text();
          console.log(`❌ ${modelName}: FAILED (${testResponse.status})`);
          results.push({
            model: modelName,
            status: 'FAILED',
            error: `${testResponse.status}: ${errorText.substring(0, 200)}`
          });
        }
      } catch (error) {
        console.log(`❌ ${modelName}: ERROR`);
        results.push({
          model: modelName,
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Find working models
    const workingModels = results.filter(r => r.status === 'SUCCESS');
    const failedModels = results.filter(r => r.status !== 'SUCCESS');

    return NextResponse.json({
      success: workingModels.length > 0,
      message: workingModels.length > 0 
        ? `Found ${workingModels.length} working model(s)` 
        : 'No working models found',
      workingModels,
      failedModels,
      projectId,
      location,
      totalModelsTested: modelsToTest.length
    });

  } catch (error) {
    console.error('❌ Detailed test failed:', error);
    return NextResponse.json(
      { 
        error: 'Detailed test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 