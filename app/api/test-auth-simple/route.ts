import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Google Cloud authentication...');
    
    // Test 1: Check environment variable
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    console.log('📁 Credentials path:', credentialsPath);
    
    if (!credentialsPath) {
      return NextResponse.json(
        { error: 'GOOGLE_APPLICATION_CREDENTIALS environment variable not set' },
        { status: 500 }
      );
    }
    
    // Test 2: Check if file exists
    const fs = await import('fs');
    const path = await import('path');
    
    const fullPath = path.resolve(credentialsPath);
    console.log('📂 Full path:', fullPath);
    
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: `Credentials file not found at: ${fullPath}` },
        { status: 500 }
      );
    }
    
    // Test 3: Try to read the file
    let credentials: any;
    try {
      credentials = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      console.log('✅ Credentials file read successfully');
      console.log('🔑 Project ID:', credentials.project_id);
      console.log('👤 Client Email:', credentials.client_email);
    } catch (readError) {
      return NextResponse.json(
        { error: 'Failed to parse credentials file', details: readError },
        { status: 500 }
      );
    }
    
    // Test 4: Try to get access token
    try {
      const { GoogleAuth } = await import('google-auth-library');
      const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      
      console.log('🔐 Creating Google Auth client...');
      const client = await auth.getClient();
      console.log('✅ Google Auth client created');
      
      console.log('🎫 Getting access token...');
      const token = await client.getAccessToken();
      console.log('✅ Access token obtained');
      
      return NextResponse.json({
        success: true,
        message: 'Google Cloud authentication successful',
        projectId: credentials.project_id,
        clientEmail: credentials.client_email,
        hasToken: !!token.token
      });
      
    } catch (authError) {
      console.error('❌ Authentication failed:', authError);
      return NextResponse.json(
        { 
          error: 'Google Cloud authentication failed',
          details: authError instanceof Error ? authError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
    
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