"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2,
  DollarSign,
  Crown,
  Gift,
  Bell,
  Star,
  TrendingUp,
  Eye,
  Play,
  Zap,
  Award,
  Verified,
  CreditCard,
  Banknote,
  Coffee,
  Calendar,
  Target,
  AlertCircle,
  X
} from 'lucide-react';

interface CreatorMetrics {
  followers: number;
  engagement: number;
  monthlyViews: number;
  revenue: number;
}

interface MonetizationHeroProps {
  creatorName?: string;
  isVerified?: boolean;
  metrics?: CreatorMetrics;
  hasActiveSubscriptions?: boolean;
  sponsorshipActive?: boolean;
}

export function MonetizationHero({ 
  creatorName = "Content Creator",
  isVerified = true,
  metrics = {
    followers: 125000,
    engagement: 8.5,
    monthlyViews: 2500000,
    revenue: 15420
  },
  hasActiveSubscriptions = true,
  sponsorshipActive = true
}: MonetizationHeroProps) {
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const subscriptionTiers = [
    {
      id: 'supporter',
      name: 'Supporter',
      price: 4.99,
      icon: Heart,
      color: 'bg-pink-500',
      benefits: ['Early access', 'Exclusive posts', 'Community chat']
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      icon: Crown,
      color: 'bg-yellow-500',
      benefits: ['All Supporter perks', 'Monthly Q&A', 'Behind-the-scenes']
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 19.99,
      icon: Star,
      color: 'bg-purple-500',
      benefits: ['All Premium perks', '1-on-1 sessions', 'Custom content']
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-20" />
      
      {/* Sponsorship Disclosure Banner */}
      {sponsorshipActive && (
        <div className="relative z-10 bg-orange-100 dark:bg-orange-900/30 border-b border-orange-200 dark:border-orange-800">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-orange-800 dark:text-orange-200 font-medium">
                Sponsored Content - This post contains paid partnerships
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Notification Bar */}
      <div className="relative z-10 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5" />
              <span className="text-sm font-medium">
                🎉 New tier unlocked! Premium subscribers get 20% off merchandise
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Creator Profile Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-2xl">
                {creatorName.charAt(0)}
              </div>
              {isVerified && (
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Verified className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="absolute -top-2 -left-2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Crown className="h-5 w-5 text-white" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {creatorName}
              {isVerified && (
                <CheckCircle className="inline-block ml-3 h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              )}
            </h1>

            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Premium content creator specializing in monetization strategies and audience growth. 
              Join thousands of subscribers for exclusive insights and behind-the-scenes content.
            </p>

            {/* Verification Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-4 py-2 text-sm font-semibold">
                <Shield className="h-4 w-4 mr-2" />
                Platform Verified
              </Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-4 py-2 text-sm font-semibold">
                <Award className="h-4 w-4 mr-2" />
                Top Creator 2024
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 px-4 py-2 text-sm font-semibold">
                <Star className="h-4 w-4 mr-2" />
                Premium Partner
              </Badge>
            </div>
          </div>

          {/* Metrics Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {formatNumber(metrics.followers)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Followers</div>
                <div className="mt-2 flex items-center justify-center text-green-600 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% this month
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {metrics.engagement}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Engagement</div>
                <div className="mt-2">
                  <Progress value={metrics.engagement * 10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {formatNumber(metrics.monthlyViews)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Monthly Views</div>
                <div className="mt-2 flex items-center justify-center text-purple-600 text-xs">
                  <Play className="h-3 w-3 mr-1" />
                  +8.2% vs last month
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  ${formatNumber(metrics.revenue)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Monthly Revenue</div>
                <div className="mt-2 flex items-center justify-center text-green-600 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  +23.1% growth
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monetization Actions */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Subscription Tiers */}
            <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Join the Community
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Get exclusive access to premium content and direct creator interaction
                  </p>
                </div>

                <div className="space-y-4">
                  {subscriptionTiers.map((tier) => {
                    const IconComponent = tier.icon;
                    return (
                      <div
                        key={tier.id}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedTier === tier.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                        onClick={() => setSelectedTier(tier.id)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${tier.color} rounded-full flex items-center justify-center`}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                {tier.name}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                ${tier.price}/month
                              </p>
                            </div>
                          </div>
                          {selectedTier === tier.id && (
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div className="space-y-2">
                          {tier.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button 
                  className="w-full mt-6 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg"
                  disabled={!selectedTier}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-6">
              {/* One-time Support */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Coffee className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Buy me a coffee
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Support with a one-time tip
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[3, 5, 10].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        className="h-10 font-semibold hover:bg-green-100 dark:hover:bg-green-900"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Gift className="h-4 w-4 mr-2" />
                    Send Tip
                  </Button>
                </CardContent>
              </Card>

              {/* Exclusive Content */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Premium Content
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Unlock exclusive videos & tutorials
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Available now</span>
                      <span className="font-semibold text-purple-600">12 videos</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Play className="h-4 w-4 mr-2" />
                    Access Premium
                  </Button>
                </CardContent>
              </Card>

              {/* Merchandise */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <Banknote className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Official Merch
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Limited edition items available
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                      20% OFF
                    </Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      For subscribers only
                    </span>
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    <Target className="h-4 w-4 mr-2" />
                    Shop Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call-to-Action Section */}
          <div className="text-center">
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-12">
                <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                  Ready to Join the Community?
                </h3>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Get instant access to exclusive content, live sessions, and a supportive community 
                  of like-minded creators and entrepreneurs.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-white text-blue-600 hover:bg-slate-100 font-semibold px-8 py-4 text-lg"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Start Free Trial
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Preview
                  </Button>
                </div>

                <div className="mt-8 flex items-center justify-center space-x-6 text-sm opacity-80">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Secure payments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span>30-day guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}