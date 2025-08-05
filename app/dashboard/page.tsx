"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Shield,
  Loader2,
  Video,
  FileText,
  AlertTriangle,
  Settings,
  Youtube
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { VideoUpload } from '@/components/video-upload';
import { AnalysisResults } from '@/components/analysis-results';
import { analyzeContent, analyzeVideoContent, analyzeYouTubeVideo, AnalysisResult } from '@/lib/ai';
import { VideoProcessor, VideoMetadata, VideoAnalysisData } from '@/lib/video-analysis';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [script, setScript] = useState('');
  const [platform, setPlatform] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisTimestamp, setAnalysisTimestamp] = useState<Date | null>(null);
  const [analysisType, setAnalysisType] = useState<'text' | 'video' | 'youtube'>('video');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  
  // Video-specific state
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  // YouTube URL state
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const user = authService.getCurrentUser();

  // Load Google Cloud settings from localStorage on component mount
  useEffect(() => {
    const storedProjectId = localStorage.getItem('google_cloud_project_id');
    const storedLocation = localStorage.getItem('google_cloud_location');
    setProjectId(storedProjectId);
    setLocation(storedLocation);
  }, []);

  const validateGoogleCloudSettings = (): boolean => {
    return !!(projectId && location);
  };

  const handleVideoSelect = (file: File, metadata: VideoMetadata) => {
    setSelectedVideo(file);
    setVideoMetadata(metadata);
    toast.success('Video uploaded successfully! Ready for analysis.');
  };

  const handleAnalyzeVideo = async () => {
    if (!validateGoogleCloudSettings()) {
      toast.error('Google Cloud Project ID and location are required. Please configure them in Settings.');
      return;
    }

    if (!selectedVideo || !videoMetadata) {
      toast.error('Please upload a video file first');
      return;
    }

    if (!platform) {
      toast.error('Please select a platform');
      return;
    }

    setIsAnalyzing(true);
    setProcessingProgress(0);
    
    try {
      // Step 1: Enhanced video processing (30%)
      setProcessingProgress(30);
      toast.info('Processing video content with enhanced analysis...');
      const videoAnalysisData = await VideoProcessor.processVideoForAnalysis(selectedVideo);
      
      // Step 2: YouTube requirements check (50%)
      setProcessingProgress(50);
      toast.info('Checking YouTube compliance requirements...');
      const youtubeRequirements = VideoProcessor.checkYouTubeRequirements(videoAnalysisData.metadata);
      const qualityRating = VideoProcessor.getVideoQualityRating(videoAnalysisData.metadata, videoAnalysisData.qualityMetrics);
      
      // Step 3: AI Analysis (80%)
      setProcessingProgress(80);
      toast.info('Running advanced YouTube monetization policy analysis...');
      const additionalContext = `
        Title: ${title}
        Description: ${description}
        Script: ${script}
        
        Video Quality Analysis:
        - Resolution: ${videoAnalysisData.metadata.width}x${videoAnalysisData.metadata.height}
        - Quality Rating: ${qualityRating}
        - Brightness: ${videoAnalysisData.qualityMetrics.averageBrightness}%
        - Contrast: ${videoAnalysisData.qualityMetrics.contrast}%
        - Sharpness: ${videoAnalysisData.qualityMetrics.sharpness}%
        - Colorfulness: ${videoAnalysisData.qualityMetrics.colorfulness}%
        
        YouTube Requirements Check:
        - Duration: ${youtubeRequirements.durationCheck ? 'PASS' : 'FAIL'}
        - Resolution: ${youtubeRequirements.resolutionCheck ? 'PASS' : 'FAIL'}
        - Aspect Ratio: ${youtubeRequirements.aspectRatioCheck ? 'PASS' : 'FAIL'}
        - File Size: ${youtubeRequirements.sizeCheck ? 'PASS' : 'FAIL'}
        - Format: ${youtubeRequirements.formatCheck ? 'PASS' : 'FAIL'}
        
        Frame Analysis: ${videoAnalysisData.frames.length} frames extracted at timestamps: ${videoAnalysisData.frameTimestamps.map(t => VideoProcessor.formatDuration(t)).join(', ')}
        Thumbnails: ${videoAnalysisData.thumbnails.length} thumbnail candidates generated
      `;
      
      const result = await analyzeVideoContent(videoAnalysisData, platform, additionalContext, projectId!, location!);
      
      // Step 4: Complete (100%)
      setProcessingProgress(100);
      setAnalysisResult(result);
      setAnalysisTimestamp(new Date());
      
      if (result.monetizationEligible) {
        toast.success('✅ Video analysis completed! Content appears eligible for YouTube monetization.');
      } else {
        toast.warning('⚠️ Video analysis completed! Issues detected that may affect monetization.');
      }
      
    } catch (error) {
      toast.error('Analysis failed. Please check your Google Cloud settings and try again.');
      console.error('Video analysis error:', error);
    } finally {
      setIsAnalyzing(false);
      setProcessingProgress(0);
    }
  };

  const handleAnalyzeYouTube = async () => {
    if (!validateGoogleCloudSettings()) {
      toast.error('Google Cloud Project ID and location are required. Please configure them in Settings.');
      return;
    }

    if (!youtubeUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    if (!platform) {
      toast.error('Please select a platform');
      return;
    }

    setIsAnalyzing(true);
    setProcessingProgress(0);
    
    try {
      // Step 1: Validate YouTube URL (20%)
      setProcessingProgress(20);
      toast.info('Validating YouTube URL...');
      
      // Step 2: AI Analysis (80%)
      setProcessingProgress(80);
      toast.info('Analyzing YouTube video for monetization compliance...');
      
      const result = await analyzeYouTubeVideo(youtubeUrl, platform, projectId!, location!);
      
      // Step 3: Complete (100%)
      setProcessingProgress(100);
      setAnalysisResult(result);
      setAnalysisTimestamp(new Date());
      
      if (result.monetizationEligible) {
        toast.success('✅ YouTube video analysis completed! Content appears eligible for monetization.');
      } else {
        toast.warning('⚠️ YouTube video analysis completed! Issues detected that may affect monetization.');
      }
      
    } catch (error) {
      toast.error('Analysis failed. Please check your Google Cloud settings and try again.');
      console.error('YouTube analysis error:', error);
    } finally {
      setIsAnalyzing(false);
      setProcessingProgress(0);
    }
  };

  const handleAnalyzeText = async () => {
    if (!validateGoogleCloudSettings()) {
      toast.error('Google Cloud Project ID and location are required. Please configure them in Settings.');
      return;
    }

    if (!title.trim() && !description.trim() && !script.trim()) {
      toast.error('Please provide at least one content field to analyze');
      return;
    }

    if (!platform) {
      toast.error('Please select a platform');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const content = `Title: ${title}\nDescription: ${description}\nScript: ${script}`;
      const result = await analyzeContent(content, platform, projectId!, location!);
      setAnalysisResult(result);
      setAnalysisTimestamp(new Date());
      toast.success('Content analysis completed successfully!');
    } catch (error) {
      toast.error('Analysis failed. Please check your Google Cloud settings and try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (!analysisResult) return;

    const exportData = `
Content Verifier AI - Analysis Report
Generated: ${analysisTimestamp?.toLocaleString()}
Platform: ${platform}
Analysis Type: ${analysisType === 'video' ? 'Video File Analysis' : analysisType === 'youtube' ? 'YouTube URL Analysis' : 'Text Content Analysis'}

OVERALL ASSESSMENT
Monetization Eligible: ${analysisResult.monetizationEligible ? 'YES' : 'NO'}
Overall Score: ${analysisResult.overallScore}/100
Confidence Level: ${analysisResult.confidence}%

${videoMetadata ? `
VIDEO INFORMATION
Duration: ${VideoProcessor.formatDuration(videoMetadata.duration)}
File Size: ${VideoProcessor.formatFileSize(videoMetadata.size)}
Format: ${videoMetadata.type}
` : ''}

${youtubeUrl ? `
YOUTUBE URL
URL: ${youtubeUrl}
` : ''}

CONTENT ANALYSIS
Visual Elements: ${analysisResult.contentAnalysis?.visualElements.join(', ') || 'N/A'}
Audio Quality: ${analysisResult.contentAnalysis?.audioQuality || 'N/A'}
Content Type: ${analysisResult.contentAnalysis?.contentType || 'N/A'}
Target Audience: ${analysisResult.contentAnalysis?.appropriateAudience || 'N/A'}
Engagement Potential: ${analysisResult.contentAnalysis?.estimatedEngagement || 'N/A'}

IDENTIFIED ISSUES
${analysisResult.issues.map((issue, index) => `
${index + 1}. ${issue.description}
   Category: ${issue.category.replace('_', ' ').toUpperCase()}
   Severity: ${issue.severity.toUpperCase()}
   Impact: ${issue.impact}
   Recommendation: ${issue.recommendation}
   ${issue.timestamp ? `Timestamp: ${VideoProcessor.formatDuration(issue.timestamp)}` : ''}
`).join('')}

GENERAL RECOMMENDATIONS
${analysisResult.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

PLATFORM-SPECIFIC NOTES
${analysisResult.platformSpecific.notes.map((note, index) => `• ${note}`).join('\n')}

PLATFORM REQUIREMENTS
${analysisResult.platformSpecific.requirements.map((req, index) => `• ${req}`).join('\n')}
    `.trim();

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Analysis report exported successfully!');
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Upload your video files or analyze content for monetization compliance and get actionable insights
          </p>
        </div>

        {/* Google Cloud Settings Warning */}
        {!validateGoogleCloudSettings() && (
          <Alert className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                Google Cloud Project ID and location are required for content analysis. Please configure them in Settings.
              </span>
              <Button variant="outline" size="sm" asChild>
                <a href="/settings" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Go to Settings</span>
                </a>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Analysis Form */}
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-6 w-6 text-blue-600" />
              <span>Content Analysis</span>
            </CardTitle>
            <CardDescription>
              Upload video files for comprehensive AI analysis or provide content details for text-based analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Analysis Type Tabs */}
            <Tabs value={analysisType} onValueChange={(value) => setAnalysisType(value as 'text' | 'video' | 'youtube')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="video" className="flex items-center space-x-2">
                  <Video className="h-4 w-4" />
                  <span>Video File Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Text Content Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="youtube" className="flex items-center space-x-2">
                  <Youtube className="h-4 w-4" />
                  <span>YouTube URL Analysis</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="space-y-6">
                {/* Video Upload */}
                <div className="space-y-4">
                  <Label>Video File</Label>
                  <VideoUpload 
                    onVideoSelect={handleVideoSelect}
                    isProcessing={isAnalyzing}
                    maxSize={500} // 500MB limit
                  />
                </div>

                {/* Platform Selection */}
                <div className="space-y-2">
                  <Label htmlFor="platform-video">Target Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="instagram">Instagram Reels</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="generic">Generic/Multiple Platforms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Optional Context */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title-video">Video Title (Optional)</Label>
                    <Input
                      id="title-video"
                      placeholder="Enter your video title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description-video">Description (Optional)</Label>
                    <Input
                      id="description-video"
                      placeholder="Brief description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleAnalyzeVideo} 
                  disabled={isAnalyzing || !selectedVideo || !validateGoogleCloudSettings()}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Video... {processingProgress > 0 && `${processingProgress}%`}
                    </>
                  ) : (
                    <>
                      <Video className="mr-2 h-5 w-5" />
                      Analyze Video Content
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="text" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Video Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter your video title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="platform">Target Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="instagram">Instagram Reels</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="generic">Generic/Multiple Platforms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Video Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter your video description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="script">Video Script/Content</Label>
                  <Textarea
                    id="script"
                    placeholder="Enter your video script or describe the content"
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    rows={6}
                  />
                </div>

                <Button 
                  onClick={handleAnalyzeText} 
                  disabled={isAnalyzing || !validateGoogleCloudSettings()}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Content...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Analyze Text Content
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="youtube" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="youtube-url">YouTube URL</Label>
                  <Input
                    id="youtube-url"
                    placeholder="Enter a YouTube video URL"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform-youtube">Target Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="instagram">Instagram Reels</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="generic">Generic/Multiple Platforms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleAnalyzeYouTube} 
                  disabled={isAnalyzing || !youtubeUrl.trim() || !validateGoogleCloudSettings()}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing YouTube URL...
                    </>
                  ) : (
                    <>
                      <Youtube className="mr-2 h-5 w-5" />
                      Analyze YouTube URL
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            {/* Processing Progress */}
            {isAnalyzing && processingProgress > 0 && (
              <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Processing video content...
                    </span>
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {processingProgress}%
                    </span>
                  </div>
                  <Progress value={processingProgress} className="h-2" />
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && analysisTimestamp && (
          <AnalysisResults
            result={analysisResult}
            platform={platform}
            timestamp={analysisTimestamp}
            videoMetadata={videoMetadata}
            analysisType={analysisType}
            onExport={handleExport}
          />
        )}
      </div>
    </DashboardLayout>
  );
}