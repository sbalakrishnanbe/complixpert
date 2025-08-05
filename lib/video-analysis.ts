export interface VideoMetadata {
  duration: number;
  size: number;
  type: string;
  name: string;
  lastModified: number;
  width?: number;
  height?: number;
  frameRate?: number;
  bitrate?: number;
}

export interface VideoAnalysisData {
  metadata: VideoMetadata;
  frames: string[]; // Base64 encoded frames
  thumbnails: string[]; // Base64 encoded thumbnails at different timestamps
  audioData?: ArrayBuffer;
  transcript?: string;
  frameTimestamps: number[]; // Timestamps for each frame
  qualityMetrics: {
    averageBrightness: number;
    contrast: number;
    sharpness: number;
    colorfulness: number;
  };
}

export class VideoProcessor {
  static async extractMetadata(file: File): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        resolve({
          duration: video.duration,
          size: file.size,
          type: file.type,
          name: file.name,
          lastModified: file.lastModified,
          width: video.videoWidth,
          height: video.videoHeight,
          frameRate: 30, // Default assumption
          bitrate: Math.round(file.size * 8 / video.duration) // Estimated bitrate
        });
      };
      
      video.onerror = () => reject(new Error('Failed to load video metadata'));
      video.src = URL.createObjectURL(file);
    });
  }

  static async extractFrames(file: File, count: number = 8): Promise<{frames: string[], timestamps: number[]}> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      const frames: string[] = [];
      const timestamps: number[] = [];
      let currentFrame = 0;
      
      video.onloadedmetadata = () => {
        // Set canvas size to video dimensions for better quality
        canvas.width = Math.min(video.videoWidth, 1920); // Max 1920px width
        canvas.height = Math.min(video.videoHeight, 1080); // Max 1080px height
        
        // Calculate smart intervals - avoid first and last 5% of video
        const startTime = video.duration * 0.05;
        const endTime = video.duration * 0.95;
        const effectiveDuration = endTime - startTime;
        const interval = effectiveDuration / (count - 1);
        
        const captureFrame = () => {
          if (currentFrame >= count) {
            resolve({frames, timestamps});
            return;
          }
          
          const timestamp = startTime + (currentFrame * interval);
          video.currentTime = timestamp;
          timestamps.push(timestamp);
        };
        
        video.onseeked = () => {
          // Scale video to fit canvas while maintaining aspect ratio
          const videoAspect = video.videoWidth / video.videoHeight;
          const canvasAspect = canvas.width / canvas.height;
          
          let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
          
          if (videoAspect > canvasAspect) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / videoAspect;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * videoAspect;
            offsetX = (canvas.width - drawWidth) / 2;
          }
          
          // Clear canvas and draw video frame
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
          
          // Convert to base64 with good quality for analysis
          const frameData = canvas.toDataURL('image/jpeg', 0.9);
          frames.push(frameData);
          currentFrame++;
          captureFrame();
        };
        
        captureFrame();
      };
      
      video.onerror = () => reject(new Error('Failed to process video'));
      video.src = URL.createObjectURL(file);
    });
  }

  static async extractThumbnails(file: File, count: number = 5): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      const thumbnails: string[] = [];
      let currentThumbnail = 0;
      
      video.onloadedmetadata = () => {
        // Thumbnail size optimized for YouTube requirements
        canvas.width = 1280;
        canvas.height = 720;
        
        const interval = video.duration / (count + 1);
        
        const captureThumbnail = () => {
          if (currentThumbnail >= count) {
            resolve(thumbnails);
            return;
          }
          
          video.currentTime = (currentThumbnail + 1) * interval;
        };
        
        video.onseeked = () => {
          // Calculate scaling to fill canvas (crop if necessary)
          const videoAspect = video.videoWidth / video.videoHeight;
          const canvasAspect = canvas.width / canvas.height;
          
          let sourceX = 0, sourceY = 0, sourceWidth = video.videoWidth, sourceHeight = video.videoHeight;
          
          if (videoAspect > canvasAspect) {
            // Video is wider - crop horizontally
            sourceWidth = video.videoHeight * canvasAspect;
            sourceX = (video.videoWidth - sourceWidth) / 2;
          } else {
            // Video is taller - crop vertically
            sourceHeight = video.videoWidth / canvasAspect;
            sourceY = (video.videoHeight - sourceHeight) / 2;
          }
          
          ctx.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
          
          const thumbnailData = canvas.toDataURL('image/jpeg', 0.95);
          thumbnails.push(thumbnailData);
          currentThumbnail++;
          captureThumbnail();
        };
        
        captureThumbnail();
      };
      
      video.onerror = () => reject(new Error('Failed to process video for thumbnails'));
      video.src = URL.createObjectURL(file);
    });
  }

  static async analyzeImageQuality(imageData: string): Promise<{
    averageBrightness: number;
    contrast: number;
    sharpness: number;
    colorfulness: number;
  }> {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve({ averageBrightness: 50, contrast: 50, sharpness: 50, colorfulness: 50 });
        return;
      }
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let totalBrightness = 0;
        let totalR = 0, totalG = 0, totalB = 0;
        let minBrightness = 255, maxBrightness = 0;
        
        // Sample every 4th pixel for performance
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          const brightness = (r + g + b) / 3;
          totalBrightness += brightness;
          totalR += r;
          totalG += g;
          totalB += b;
          
          minBrightness = Math.min(minBrightness, brightness);
          maxBrightness = Math.max(maxBrightness, brightness);
        }
        
        const pixelCount = data.length / 16;
        const averageBrightness = totalBrightness / pixelCount;
        const contrast = maxBrightness - minBrightness;
        
        // Simple colorfulness calculation
        const avgR = totalR / pixelCount;
        const avgG = totalG / pixelCount;
        const avgB = totalB / pixelCount;
        const colorfulness = Math.sqrt(
          Math.pow(avgR - avgG, 2) + 
          Math.pow(avgG - avgB, 2) + 
          Math.pow(avgB - avgR, 2)
        );
        
        // Estimate sharpness using edge detection (simplified)
        let edgeSum = 0;
        for (let y = 1; y < canvas.height - 1; y += 4) {
          for (let x = 1; x < canvas.width - 1; x += 4) {
            const idx = (y * canvas.width + x) * 4;
            const current = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            const right = (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3;
            const bottom = (data[idx + canvas.width * 4] + data[idx + canvas.width * 4 + 1] + data[idx + canvas.width * 4 + 2]) / 3;
            
            edgeSum += Math.abs(current - right) + Math.abs(current - bottom);
          }
        }
        const sharpness = edgeSum / (canvas.width * canvas.height / 16);
        
        resolve({
          averageBrightness: Math.round((averageBrightness / 255) * 100),
          contrast: Math.round((contrast / 255) * 100),
          sharpness: Math.min(100, Math.round(sharpness / 10)),
          colorfulness: Math.min(100, Math.round(colorfulness / 50))
        });
      };
      
      img.src = imageData;
    });
  }

  static async extractAudio(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read audio data'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  static async processVideoForAnalysis(file: File): Promise<VideoAnalysisData> {
    try {
      // Extract metadata
      const metadata = await this.extractMetadata(file);
      
      // Extract frames with timestamps
      const {frames, timestamps} = await this.extractFrames(file, 8);
      
      // Extract thumbnails
      const thumbnails = await this.extractThumbnails(file, 5);
      
      // Extract audio
      const audioData = await this.extractAudio(file);
      
      // Analyze quality of first frame as representative
      const qualityMetrics = frames.length > 0 ? 
        await this.analyzeImageQuality(frames[0]) : 
        { averageBrightness: 50, contrast: 50, sharpness: 50, colorfulness: 50 };
      
      return {
        metadata,
        frames,
        thumbnails,
        audioData,
        frameTimestamps: timestamps,
        qualityMetrics
      };
    } catch (error) {
      console.error('Error processing video for analysis:', error);
      throw error;
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  static getVideoQualityRating(metadata: VideoMetadata, qualityMetrics: any): string {
    const resolution = metadata.width && metadata.height ? metadata.width * metadata.height : 0;
    
    if (resolution >= 1920 * 1080 && qualityMetrics.sharpness > 70) {
      return 'Excellent (1080p+)';
    } else if (resolution >= 1280 * 720 && qualityMetrics.sharpness > 50) {
      return 'Good (720p+)';
    } else if (resolution >= 854 * 480) {
      return 'Fair (480p)';
    } else {
      return 'Poor (Below 480p)';
    }
  }

  static checkYouTubeRequirements(metadata: VideoMetadata): {
    durationCheck: boolean;
    resolutionCheck: boolean;
    aspectRatioCheck: boolean;
    sizeCheck: boolean;
    formatCheck: boolean;
  } {
    const duration = metadata.duration;
    const width = metadata.width || 0;
    const height = metadata.height || 0;
    const size = metadata.size;
    const format = metadata.type;

    return {
      durationCheck: duration >= 1 && duration <= 43200, // 1 second to 12 hours
      resolutionCheck: width >= 640 && height >= 360, // Minimum 360p
      aspectRatioCheck: Math.abs((width / height) - (16 / 9)) < 0.5 || Math.abs((width / height) - (4 / 3)) < 0.2,
      sizeCheck: size <= 256 * 1024 * 1024 * 1024, // 256GB limit
      formatCheck: ['video/mp4', 'video/webm', 'video/mov', 'video/avi'].includes(format)
    };
  }
}