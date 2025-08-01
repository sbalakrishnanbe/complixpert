export interface VideoMetadata {
  duration: number;
  size: number;
  type: string;
  name: string;
  lastModified: number;
}

export interface VideoAnalysisData {
  metadata: VideoMetadata;
  frames: string[]; // Base64 encoded frames
  audioData?: ArrayBuffer;
  transcript?: string;
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
          lastModified: file.lastModified
        });
      };
      
      video.onerror = () => reject(new Error('Failed to load video metadata'));
      video.src = URL.createObjectURL(file);
    });
  }

  static async extractFrames(file: File, count: number = 5): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      const frames: string[] = [];
      let currentFrame = 0;
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const interval = video.duration / count;
        
        const captureFrame = () => {
          if (currentFrame >= count) {
            resolve(frames);
            return;
          }
          
          video.currentTime = currentFrame * interval;
        };
        
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frameData = canvas.toDataURL('image/jpeg', 0.8);
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
}