#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 CompliXpert Setup Demo\n');

// Generate a secure random secret
const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create demo environment file
const createDemoEnv = () => {
  const envContent = `# Google Cloud Configuration
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-credentials.json

# Default Google Cloud Project Settings (UPDATE THESE!)
GOOGLE_CLOUD_PROJECT_ID=your-google-cloud-project-id
GOOGLE_CLOUD_LOCATION=us-central1

# NextJS Configuration
NEXTAUTH_SECRET=${generateSecret()}
NEXTAUTH_URL=http://localhost:3000
`;

  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Created .env.local with demo configuration');
};

// Create demo credentials file
const createDemoCredentials = () => {
  const credentialsContent = {
    "type": "service_account",
    "project_id": "demo-project-replace-me",
    "private_key_id": "demo-key-id",
    "private_key": "-----BEGIN PRIVATE KEY-----\nDEMO_PRIVATE_KEY_REPLACE_WITH_REAL_KEY\n-----END PRIVATE KEY-----\n",
    "client_email": "demo-service-account@demo-project.iam.gserviceaccount.com",
    "client_id": "123456789",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/demo-service-account%40demo-project.iam.gserviceaccount.com"
  };

  fs.writeFileSync('google-cloud-credentials.json', JSON.stringify(credentialsContent, null, 2));
  console.log('✅ Created demo google-cloud-credentials.json (REPLACE WITH REAL CREDENTIALS!)');
};

// Main setup
const main = () => {
  console.log('Setting up demo configuration...\n');

  // Create demo files
  createDemoEnv();
  createDemoCredentials();

  console.log('\n📋 Next Steps:\n');
  console.log('1. 🔧 Set up your Google Cloud Project:');
  console.log('   - Go to https://console.cloud.google.com');
  console.log('   - Create a new project or select existing one');
  console.log('   - Enable Vertex AI API');
  console.log('   - Create a service account with Vertex AI permissions\n');
  
  console.log('2. 🔑 Replace the demo credentials:');
  console.log('   - Update GOOGLE_CLOUD_PROJECT_ID in .env.local');
  console.log('   - Replace google-cloud-credentials.json with your real service account file\n');
  
  console.log('3. 🚀 Start the application:');
  console.log('   npm run dev\n');
  
  console.log('4. 🧪 Test the integration:');
  console.log('   - http://localhost:3000/api/test-auth-simple');
  console.log('   - http://localhost:3000/api/test-vertex?projectId=YOUR_PROJECT_ID\n');
  
  console.log('⚠️  WARNING: The demo credentials will NOT work for real API calls!');
  console.log('   You must replace them with valid Google Cloud credentials.\n');
  
  console.log('📖 For detailed setup instructions, see README.md');
};

main();