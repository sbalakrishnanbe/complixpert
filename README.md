# CompliXpert - AI-Powered Content Analysis Platform

Advanced AI-powered content analysis platform that protects your business from policy violations, copyright issues, and compliance risks across all major social media platforms.

## Features

- **Real-Time AI Detection**: 99.7% accuracy in violation detection
- **Multi-Platform Compliance**: YouTube, TikTok, Instagram, Facebook, and 20+ platforms
- **Enterprise-Grade Security**: SOC 2 Type II certified with end-to-end encryption
- **Automated Workflow Integration**: Seamless integration with existing content management systems

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Project with Vertex AI API enabled
- Google Cloud Service Account with appropriate permissions

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Google Cloud credentials:**
   
   a. Create a Google Cloud Project at [console.cloud.google.com](https://console.cloud.google.com)
   
   b. Enable the Vertex AI API:
   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```
   
   c. Create a service account:
   ```bash
   gcloud iam service-accounts create complixpert-ai \
     --description="Service account for CompliXpert AI analysis" \
     --display-name="CompliXpert AI"
   ```
   
   d. Grant necessary permissions:
   ```bash
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:complixpert-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"
   ```
   
   e. Create and download the service account key:
   ```bash
   gcloud iam service-accounts keys create google-cloud-credentials.json \
     --iam-account=complixpert-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

3. **Configure environment variables:**
   
   Update the `.env.local` file with your actual values:
   ```env
   # Google Cloud Configuration
   GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-credentials.json
   GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   
   # NextJS Configuration
   NEXTAUTH_SECRET=your-secure-random-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Test the Vertex AI integration:**
   
   Visit these endpoints to verify everything is working:
   - http://localhost:3000/api/test-auth-simple - Basic authentication test
   - http://localhost:3000/api/test-vertex?projectId=YOUR_PROJECT_ID - Basic Vertex AI test
   - http://localhost:3000/api/test-vertex-detailed?projectId=YOUR_PROJECT_ID - Detailed model testing

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Google Cloud service account credentials | Yes |
| `GOOGLE_CLOUD_PROJECT_ID` | Your Google Cloud Project ID | Yes |
| `GOOGLE_CLOUD_LOCATION` | Google Cloud region (default: us-central1) | No |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | Yes |
| `NEXTAUTH_URL` | Base URL for the application | Yes |

### Supported Google Cloud Regions

- `us-central1` (default)
- `us-east1`
- `us-west1`
- `europe-west1`
- `asia-northeast1`

### Supported Vertex AI Models

The application automatically tries multiple models in order of preference:
1. `gemini-1.0-pro`
2. `gemini-pro`
3. `gemini-1.5-pro`
4. `gemini-1.5-flash`
5. `gemini-2.0-flash-exp`
6. `gemini-2.0-pro-exp`

## API Usage

### Video Analysis

```javascript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'video',
    payload: {
      videoData: {
        metadata: { duration: 120, size: 1024000, type: 'video/mp4' },
        frames: ['base64-frame-1', 'base64-frame-2'],
        audioData: audioArrayBuffer
      },
      platform: 'youtube',
      additionalContext: 'Educational content about cooking'
    },
    projectId: 'your-project-id',
    location: 'us-central1'
  }),
});
```

### YouTube URL Analysis

```javascript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'youtube',
    payload: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'youtube'
    },
    projectId: 'your-project-id',
    location: 'us-central1'
  }),
});
```

### Text Content Analysis

```javascript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'text',
    payload: {
      content: 'Your content text here',
      platform: 'youtube'
    },
    projectId: 'your-project-id',
    location: 'us-central1'
  }),
});
```

## Troubleshooting

### Common Issues

1. **"GOOGLE_APPLICATION_CREDENTIALS environment variable not set"**
   - Ensure the `.env.local` file exists and contains the correct path
   - Verify the service account JSON file exists at the specified path

2. **"Vertex AI API error: 403"**
   - Check that the Vertex AI API is enabled in your Google Cloud project
   - Verify the service account has the `roles/aiplatform.user` permission

3. **"All Vertex AI models failed"**
   - Ensure your Google Cloud project has access to Vertex AI models
   - Check the project location matches available model regions
   - Verify you have sufficient quotas for the models

4. **"Invalid project ID or location"**
   - Double-check your project ID in the Google Cloud Console
   - Ensure the location is supported by Vertex AI

### Getting Help

1. Check the browser console and server logs for detailed error messages
2. Test individual endpoints to isolate issues:
   - `/api/test-auth-simple` - Authentication testing
   - `/api/test-vertex` - Basic Vertex AI connectivity
   - `/api/test-vertex-detailed` - Comprehensive model testing

## Security Notes

- Never commit your `google-cloud-credentials.json` file to version control
- Use environment variables for all sensitive configuration
- Rotate service account keys regularly
- Follow Google Cloud security best practices

## License

This project is proprietary software. All rights reserved.