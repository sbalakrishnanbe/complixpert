"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Clock, 
  Shield,
  TrendingUp,
  Users,
  Target,
  FileText,
  Eye,
  Volume2,
  Image,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Star,
  ThumbsUp,
  ThumbsDown,
  Info,
  ExternalLink,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Maximize2
} from 'lucide-react';
import { AnalysisResult } from '@/lib/ai';
import { VideoMetadata, VideoProcessor } from '@/lib/video-analysis';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadialBarChart, RadialBar, Legend, LineChart, Line, Area, AreaChart } from 'recharts';

interface AnalysisResultsProps {
  result: AnalysisResult;
  platform: string;
  timestamp: Date;
  videoMetadata?: VideoMetadata | null;
  analysisType: 'text' | 'video';
  onExport: () => void;
}

// Mock video thumbnails for demonstration
const videoThumbnails = [
  {
    timestamp: 0,
    title: "Opening Scene",
    description: "Video introduction and title sequence",
    imageUrl: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    issues: 0,
    status: "clean"
  },
  {
    timestamp: 30,
    title: "Main Content",
    description: "Primary content delivery section",
    imageUrl: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    issues: 1,
    status: "warning"
  },
  {
    timestamp: 90,
    title: "Product Showcase",
    description: "Featured product demonstration",
    imageUrl: "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    issues: 0,
    status: "clean"
  },
  {
    timestamp: 150,
    title: "Call to Action",
    description: "Engagement and subscription prompt",
    imageUrl: "https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    issues: 2,
    status: "critical"
  },
  {
    timestamp: 210,
    title: "Closing Credits",
    description: "End screen and related content",
    imageUrl: "https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=400&h=225",
    issues: 0,
    status: "clean"
  }
];

export function AnalysisResults({ 
  result, 
  platform, 
  timestamp, 
  videoMetadata, 
  analysisType,
  onExport 
}: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'copyright': return Shield;
      case 'content_policy': return AlertTriangle;
      case 'platform_requirements': return Target;
      case 'monetization_policy': return TrendingUp;
      case 'visual_content': return Eye;
      case 'audio_content': return Volume2;
      default: return FileText;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  // Enhanced data for charts with more comprehensive analysis
  const severityData = result.issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Add mock data if no real issues exist for demonstration
  const enhancedSeverityData = Object.keys(severityData).length === 0 ? {
    low: 3,
    medium: 2,
    high: 1,
    critical: 0
  } : severityData;

  const pieData = Object.entries(enhancedSeverityData).map(([severity, count]) => ({
    name: severity.charAt(0).toUpperCase() + severity.slice(1),
    value: count,
    percentage: Math.round((count / Object.values(enhancedSeverityData).reduce((a, b) => a + b, 0)) * 100),
    color: severity === 'critical' ? '#ef4444' : 
           severity === 'high' ? '#f97316' : 
           severity === 'medium' ? '#eab308' : '#22c55e'
  }));

  const categoryData = result.issues.reduce((acc, issue) => {
    const category = issue.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Enhanced category data with mock data for demonstration
  const enhancedCategoryData = Object.keys(categoryData).length === 0 ? {
    'Content Policy': 2,
    'Copyright': 1,
    'Visual Content': 2,
    'Audio Content': 1,
    'Platform Requirements': 0
  } : categoryData;

  const barData = Object.entries(enhancedCategoryData).map(([category, count]) => ({
    category: category.length > 12 ? category.substring(0, 12) + '...' : category,
    fullCategory: category,
    count,
    percentage: Math.round((count / Object.values(enhancedCategoryData).reduce((a, b) => a + b, 0)) * 100)
  }));

  const scoreData = [
    { name: 'Overall Score', value: result.overallScore, color: '#3b82f6' },
    { name: 'Confidence', value: result.confidence, color: '#8b5cf6' }
  ];

  // Timeline data for issue distribution
  const timelineData = [
    { time: '0-30s', issues: 1, severity: 'low' },
    { time: '30-60s', issues: 2, severity: 'medium' },
    { time: '60-90s', issues: 0, severity: 'none' },
    { time: '90-120s', issues: 1, severity: 'high' },
    { time: '120-150s', issues: 3, severity: 'medium' },
    { time: '150-180s', issues: 2, severity: 'critical' },
    { time: '180-210s', issues: 0, severity: 'none' },
    { time: '210s+', issues: 1, severity: 'low' }
  ];

  const getThumbnailStatus = (status: string) => {
    switch (status) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'warning': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'clean': return 'border-green-500 bg-green-50 dark:bg-green-950/20';
      default: return 'border-slate-300 dark:border-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'clean': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Info className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Rest of the component code... */}
    </div>
  );
}