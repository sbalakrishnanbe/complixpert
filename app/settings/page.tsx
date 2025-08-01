"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Settings, Cloud, Shield, Info, Save, Eye, EyeOff } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [projectId, setProjectId] = useState('');
  const [location, setLocation] = useState('us-central1');
  const [showProjectId, setShowProjectId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved Google Cloud settings from localStorage
    const savedProjectId = localStorage.getItem('google_cloud_project_id');
    const savedLocation = localStorage.getItem('google_cloud_location');
    if (savedProjectId) {
      setProjectId(savedProjectId);
    }
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  const validateProjectId = (id: string): boolean => {
    // Google Cloud Project IDs must be 6-30 characters, lowercase letters, digits, and hyphens
    const regex = /^[a-z0-9-]{6,30}$/;
    return regex.test(id);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      if (projectId.trim()) {
        // Validate project ID format
        if (!validateProjectId(projectId.trim())) {
          toast.error('Invalid Project ID format. Must be 6-30 characters, lowercase letters, digits, and hyphens only.');
          setIsLoading(false);
          return;
        }
        
        localStorage.setItem('google_cloud_project_id', projectId.trim());
        localStorage.setItem('google_cloud_location', location);
        toast.success('Google Cloud settings saved successfully!');
      } else {
        localStorage.removeItem('google_cloud_project_id');
        localStorage.removeItem('google_cloud_location');
        toast.success('Google Cloud settings cleared successfully!');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSettings = () => {
    setProjectId('');
    setLocation('us-central1');
    localStorage.removeItem('google_cloud_project_id');
    localStorage.removeItem('google_cloud_location');
    toast.success('Settings cleared successfully!');
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Settings className="h-8 w-8" />
            <span>Settings</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Configure your Google Cloud settings and preferences
          </p>
        </div>

        {/* Google Cloud Configuration */}
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cloud className="h-6 w-6 text-blue-600" />
              <span>Google Cloud Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your Google Cloud project settings for Gemini 1.5 Pro analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You need a Google Cloud project with Vertex AI API enabled to use Gemini 1.5 Pro for content analysis. 
                Visit the{' '}
                <a 
                  href="https://console.cloud.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Google Cloud Console
                </a>{' '}
                to create a project and enable the Vertex AI API.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectId">Google Cloud Project ID</Label>
                <div className="relative">
                  <Input
                    id="projectId"
                    type={showProjectId ? 'text' : 'password'}
                    placeholder="your-project-id"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10"
                    onClick={() => setShowProjectId(!showProjectId)}
                  >
                    {showProjectId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Find your Project ID in the{' '}
                  <a 
                    href="https://console.cloud.google.com/home/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Google Cloud Console
                  </a>. Must be 6-30 characters, lowercase letters, digits, and hyphens only.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-12 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="us-central1">us-central1 (Iowa)</option>
                  <option value="us-east1">us-east1 (South Carolina)</option>
                  <option value="us-west1">us-west1 (Oregon)</option>
                  <option value="europe-west1">europe-west1 (Belgium)</option>
                  <option value="europe-west4">europe-west4 (Netherlands)</option>
                  <option value="asia-northeast1">asia-northeast1 (Tokyo)</option>
                  <option value="asia-southeast1">asia-southeast1 (Singapore)</option>
                </select>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Choose the region closest to your location for better performance.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleClearSettings}
                  disabled={!projectId}
                >
                  Clear
                </Button>
              </div>
            </div>

            <Separator />

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Notice:</strong> Your Google Cloud settings are stored locally in your browser 
                and are never sent to our servers. They are used solely for making requests to Google Cloud's 
                Vertex AI API on your behalf.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>
              Follow these steps to set up Google Cloud for content analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Create a Google Cloud Project</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Visit the{' '}
                    <a 
                      href="https://console.cloud.google.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      Google Cloud Console
                    </a>{' '}
                    and create a new project or select an existing one.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Enable Vertex AI API</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    In your project, go to APIs & Services → Library and enable the Vertex AI API.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Set up Authentication</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Create a service account and download the JSON key file. Set the GOOGLE_APPLICATION_CREDENTIALS 
                    environment variable to point to this file.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Configure Settings</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Enter your Project ID and select your preferred location in the form above.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Information */}
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Usage Information</CardTitle>
            <CardDescription>
              Information about Google Cloud usage and costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                When using Google Cloud Vertex AI, you'll be charged directly by Google based on their 
                current pricing for Gemini 1.5 Pro. Each content analysis uses tokens based on the content size. 
                Monitor your usage in the{' '}
                <a 
                  href="https://console.cloud.google.com/billing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Google Cloud Console
                </a>.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}