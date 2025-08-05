"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Video, 
  X, 
  Play, 
  Pause, 
  FileVideo, 
  Clock, 
  HardDrive,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { VideoProcessor, VideoMetadata } from '@/lib/video-analysis';

interface VideoUploadProps {
  onVideoSelect: (file: File, metadata: VideoMetadata) => void;
  isProcessing?: boolean;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
}

export function VideoUpload({ 
  onVideoSelect, 
  isProcessing = false,
  maxSize = 100,
  acceptedFormats = ['video/mp4', 'video/webm', 'video/mov', 'video/avi']
}: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setUploadProgress(0);

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      setError(`Unsupported file format. Please use: ${acceptedFormats.join(', ')}`);
      return;
    }

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Extract metadata
      const videoMetadata = await VideoProcessor.extractMetadata(file);
      
      // Complete progress
      setUploadProgress(100);
      clearInterval(progressInterval);

      // Set file and metadata
      setSelectedFile(file);
      setMetadata(videoMetadata);
      setVideoUrl(URL.createObjectURL(file));
      
      // Notify parent component
      onVideoSelect(file, videoMetadata);
      
    } catch (err) {
      setError('Failed to process video file. Please try again.');
      console.error('Video processing error:', err);
    }
  }, [maxSize, acceptedFormats, onVideoSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': acceptedFormats.map(format => '.' + format.split('/')[1])
    },
    multiple: false,
    disabled: isProcessing
  });

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setMetadata(null);
    setVideoUrl(null);
    setUploadProgress(0);
    setError(null);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
  };

  const togglePlayback = () => {
    const video = document.getElementById('preview-video') as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (selectedFile && metadata) {
    return (
      <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Video Ready for Analysis
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedFile.name}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Video Preview */}
          {videoUrl && (
            <div className="mb-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  id="preview-video"
                  src={videoUrl}
                  className="w-full h-48 object-contain"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  controls={false}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={togglePlayback}
                    className="bg-white/90 hover:bg-white text-slate-900"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Video Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600 dark:text-slate-400">
                {VideoProcessor.formatDuration(metadata.duration)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <HardDrive className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600 dark:text-slate-400">
                {VideoProcessor.formatFileSize(metadata.size)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FileVideo className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600 dark:text-slate-400">
                {metadata.type.split('/')[1].toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600 dark:text-slate-400">
                Ready
              </span>
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Processing video...
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card 
        {...getRootProps()} 
        className={`border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' 
            : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <CardContent className="p-8">
          <input {...getInputProps()} />
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
              <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {isDragActive ? 'Drop your video here' : 'Upload Video File'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Drag and drop your video file here, or click to browse
              </p>
              
              <Button 
                variant="outline" 
                disabled={isProcessing}
                className="mb-4"
              >
                <Video className="mr-2 h-4 w-4" />
                Choose Video File
              </Button>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p>Supported formats: MP4, WebM, MOV, AVI</p>
              <p>Maximum file size: {maxSize}MB</p>
              <p>Recommended: 1080p resolution, 30fps</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Uploading and processing video...
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {uploadProgress}%
              </span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}