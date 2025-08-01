"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Zap, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  PlayCircle, 
  TrendingUp, 
  Users,
  Eye,
  Clock,
  BarChart3,
  Lock,
  Award,
  Star,
  ChevronLeft,
  ChevronRight,
  Scan,
  AlertTriangle,
  FileVideo,
  Brain,
  Globe,
  Verified,
  CreditCard,
  Calendar,
  Headphones,
  Database,
  Infinity,
  Layers,
  Workflow,
  Gauge,
  ShieldCheck,
  Rocket,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const carouselSlides = [
  {
    id: 1,
    title: "AI-Powered Video Analysis",
    subtitle: "Advanced Content Scanning Technology",
    description: "Our cutting-edge AI analyzes every frame, audio track, and metadata element to detect potential policy violations before they impact your platform.",
    features: ["Real-time processing", "99.7% accuracy rate", "Multi-platform support"],
    visual: {
      icon: Brain,
      color: "from-blue-600 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50"
    },
    metrics: { processed: "2.3M", accuracy: "99.7%", speed: "< 30s" }
  },
  {
    id: 2,
    title: "Real-Time Policy Detection",
    subtitle: "Instant Violation Identification",
    description: "Detect copyright infringement, inappropriate content, and platform policy violations instantly with our comprehensive rule engine.",
    features: ["Instant alerts", "Custom rule sets", "Automated flagging"],
    visual: {
      icon: AlertTriangle,
      color: "from-orange-600 to-red-600",
      bgColor: "from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50"
    },
    metrics: { violations: "15K", prevented: "98.2%", response: "< 5s" }
  },
  {
    id: 3,
    title: "Streamlined Moderation Workflow",
    subtitle: "Efficient Content Management",
    description: "Integrate seamlessly with your existing workflow. Review, approve, or reject content with intelligent recommendations and detailed analysis reports.",
    features: ["Workflow automation", "Team collaboration", "Audit trails"],
    visual: {
      icon: Target,
      color: "from-green-600 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50"
    },
    metrics: { efficiency: "+340%", time: "75%", teams: "500+" }
  },
  {
    id: 4,
    title: "Enterprise Trust & Security",
    subtitle: "Industry-Leading Compliance",
    description: "Trusted by Fortune 500 companies with enterprise-grade security, 99.9% uptime, and comprehensive compliance certifications.",
    features: ["SOC 2 certified", "GDPR compliant", "24/7 monitoring"],
    visual: {
      icon: Shield,
      color: "from-purple-600 to-indigo-600",
      bgColor: "from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50"
    },
    metrics: { uptime: "99.9%", clients: "1000+", countries: "50+" }
  }
];

export default function CompliXpertLanding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    
    // Auto-advance carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/auth/signin');
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const currentSlideData = carouselSlides[currentSlide];
  const IconComponent = currentSlideData.visual.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  CompliXpert
                </span>
                <div className="text-xs text-slate-600 dark:text-slate-400 -mt-1">
                  Content Policy Defense
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Button onClick={() => router.push('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => router.push('/auth/signin')}>
                    Sign In
                  </Button>
                  <Button onClick={() => router.push('/auth/signup')} className="bg-blue-600 hover:bg-blue-700">
                    Start Free Trial
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Split Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Marketing Content */}
            <div className="space-y-8">
              <div>
                <Badge className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-4 py-2">
                  <Verified className="h-4 w-4 mr-2" />
                  Trusted by 1000+ Companies
                </Badge>
                <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                  Your First Line of
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Content Policy Defense
                  </span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  Advanced AI-powered content analysis that protects your platform from policy violations, 
                  copyright issues, and compliance risks before they impact your business.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg text-slate-700 dark:text-slate-300">99.7% accuracy in violation detection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg text-slate-700 dark:text-slate-300">Real-time analysis in under 30 seconds</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg text-slate-700 dark:text-slate-300">Enterprise-grade security & compliance</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-4 text-lg font-semibold border-2"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>

            {/* Right Column - Carousel */}
            <div className="relative">
              <Card className={`border-0 shadow-2xl bg-gradient-to-br ${currentSlideData.visual.bgColor} overflow-hidden transition-all duration-500`}>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${currentSlideData.visual.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <Badge className="mb-3 bg-white/80 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                      {currentSlideData.subtitle}
                    </Badge>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                      {currentSlideData.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                      {currentSlideData.description}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {currentSlideData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(currentSlideData.metrics).map(([key, value], index) => (
                      <div key={index} className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                        <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {value}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Carousel Controls */}
              <div className="flex items-center justify-center mt-6 space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex space-x-2">
                  {carouselSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentSlide 
                          ? 'bg-blue-600 w-8' 
                          : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why CompliXpert Section */}
      <section className="py-24 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Why CompliXpert?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              The most comprehensive content policy defense system trusted by industry leaders worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Real-Time AI Detection</CardTitle>
                <CardDescription>
                  Advanced machine learning algorithms analyze content in real-time, detecting policy violations with 99.7% accuracy before they go live.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Multi-Platform Compliance</CardTitle>
                <CardDescription>
                  Comprehensive coverage across YouTube, TikTok, Instagram, Facebook, and 20+ other platforms with platform-specific policy enforcement.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Workflow className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Automated Workflow Integration</CardTitle>
                <CardDescription>
                  Seamlessly integrate with your existing content management systems and automate moderation workflows for maximum efficiency.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Actionable Insights</CardTitle>
                <CardDescription>
                  Get detailed reports and recommendations that help you understand policy violations and improve your content strategy proactively.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Enterprise-Grade Security</CardTitle>
                <CardDescription>
                  SOC 2 Type II certified with end-to-end encryption, GDPR compliance, and 99.9% uptime SLA for mission-critical operations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Scalable Performance</CardTitle>
                <CardDescription>
                  Built to handle millions of content pieces daily with auto-scaling infrastructure that grows with your platform's needs.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Enterprise-Grade Content Protection
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              One comprehensive solution for all your content policy needs
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm ${!isAnnual ? 'text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${isAnnual ? 'text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
                Annual
              </span>
              {isAnnual && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Save 20%
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing Card */}
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5" />
            <CardContent className="relative p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      CompliXpert Pro
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Complete content protection suite
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900 dark:text-slate-100">
                    ${isAnnual ? '399' : '499'}
                  </span>
                  <span className="text-xl text-slate-600 dark:text-slate-400 ml-2">
                    /month
                  </span>
                  {isAnnual && (
                    <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                      Billed annually - Save $1,200/year
                    </div>
                  )}
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileVideo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        Unlimited Video Analysis
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Process unlimited video content with real-time analysis
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        Up to 50 Team Members
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Collaborate with your entire content moderation team
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        10TB Cloud Storage
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Secure cloud storage for all your content and reports
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Headphones className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        24/7 Priority Support
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Dedicated support team with 1-hour response time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        Multi-Platform Integration
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Connect with YouTube, TikTok, Instagram, and more
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        Enterprise Security
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        SOC 2 Type II, GDPR compliant, end-to-end encryption
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Start 14-Day Free Trial
                </Button>
                
                <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span>30-day money back</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Badges */}
          <div className="flex items-center justify-center space-x-8 mt-12">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <Lock className="h-5 w-5" />
              <span className="text-sm font-medium">256-bit SSL</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">SOC 2 Certified</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <Verified className="h-5 w-5" />
              <span className="text-sm font-medium">ISO 27001</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                CompliXpert
              </span>
              <div className="text-xs text-slate-600 dark:text-slate-400 -mt-1">
                Content Policy Defense
              </div>
            </div>
          </div>
          <p className="text-center text-slate-600 dark:text-slate-400">
            © 2024 CompliXpert. Your first line of content policy defense. Protecting platforms worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
}