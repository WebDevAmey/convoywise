
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Zap, Shield, Search, BarChart3, Users, Star } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';
import GlassPanel from '@/components/ui/glassmorphism';
import StartupCard from '@/components/dashboard/StartupCard';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Featured startups data
  const featuredStartups = [
    {
      name: "RuralTech",
      description: "Empowering rural India with digital tools and connectivity",
      raisedAmount: "₹4.2 Cr",
      targetAmount: "₹7 Cr",
      progress: 60,
      investorsCount: 156,
      sector: "Digital Inclusion",
      location: "Jaipur",
      logo: "/placeholder.svg"
    },
    {
      name: "EcoPackage",
      description: "Sustainable packaging solutions from agricultural waste",
      raisedAmount: "₹2.8 Cr",
      targetAmount: "₹5 Cr",
      progress: 56,
      investorsCount: 112,
      sector: "Sustainability",
      location: "Delhi",
      logo: "/placeholder.svg"
    },
    {
      name: "HealthAI",
      description: "AI-powered diagnostics for rural healthcare",
      raisedAmount: "₹6.5 Cr",
      targetAmount: "₹10 Cr",
      progress: 65,
      investorsCount: 230,
      sector: "Healthcare",
      location: "Bengaluru",
      logo: "/placeholder.svg"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-convoy-light to-white overflow-x-hidden">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="px-3 py-1 text-sm mb-2">
                Revolutionizing Startup Funding
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                Invest in India's Most <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Promising Startups</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground">
                Connect with innovative Indian startups, track your investments, and be part of the next big success story.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="rounded-full gap-2">
                      Start Investing Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <AuthForm onSuccess={() => setShowAuthDialog(false)} />
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" size="lg" className="rounded-full" onClick={() => navigate('/dashboard')}>
                  Explore Startups
                </Button>
              </div>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-primary">2,000+</span> investors have joined already
                </p>
              </div>
            </div>
            
            <div className="relative">
              <GlassPanel intensity="medium" className="p-6 md:p-8 transform hover:scale-[1.02] transition-all duration-500">
                <div className="absolute -top-3 -right-3">
                  <Badge className="bg-primary text-white px-3 py-1">
                    <TrendingUp className="h-3.5 w-3.5 mr-1" />
                    Trending
                  </Badge>
                </div>
                
                <div className="max-w-sm mx-auto">
                  <img 
                    src="/placeholder.svg" 
                    alt="Startup showcase" 
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  
                  <h3 className="text-xl font-bold mb-2">Innovative AgriTech Solutions</h3>
                  <p className="text-muted-foreground text-sm mb-4">Revolutionizing Indian agriculture with AI and IoT technology</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>₹4.2 Cr raised</span>
                      <span>70% of target</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  
                  <Button className="w-full">View Details</Button>
                </div>
              </GlassPanel>
              
              <div className="absolute -z-10 top-1/2 -right-24 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute -z-10 top-1/4 -left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose FundForge?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We provide a comprehensive platform for both investors and startups to connect, grow, and succeed together.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Discovery</h3>
              <p className="text-muted-foreground">
                AI-powered recommendations help you discover startups aligned with your investment goals.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Portfolio Tracking</h3>
              <p className="text-muted-foreground">
                Comprehensive analytics and real-time updates on all your investments in one place.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Due Diligence</h3>
              <p className="text-muted-foreground">
                Every startup is thoroughly vetted to ensure quality investment opportunities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Investments</h3>
              <p className="text-muted-foreground">
                Streamlined process to invest in startups with just a few clicks.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Insights</h3>
              <p className="text-muted-foreground">
                Connect with other investors and share knowledge to make informed decisions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rewards Program</h3>
              <p className="text-muted-foreground">
                Earn points and unlock exclusive benefits as you grow your investment portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Startups */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Startups</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover some of the most promising startups currently raising funds on our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStartups.map((startup, index) => (
              <StartupCard 
                key={index}
                name={startup.name}
                description={startup.description}
                raisedAmount={startup.raisedAmount}
                targetAmount={startup.targetAmount}
                progress={startup.progress}
                investorsCount={startup.investorsCount}
                sector={startup.sector}
                location={startup.location}
                logo={startup.logo}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="rounded-full gap-2" onClick={() => navigate('/dashboard')}>
              View All Startups
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-3xl mx-4 my-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Investment Journey?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Join thousands of investors who are already funding the future of India's innovation ecosystem.
          </p>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full gap-2">
                Create Your Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <AuthForm />
            </DialogContent>
          </Dialog>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">FundForge</h3>
              <p className="text-muted-foreground mb-4">Connecting India's most innovative startups with passionate investors.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">For Investors</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">How It Works</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Browse Startups</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Investment Guide</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">For Startups</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Apply for Funding</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Resources</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Founder Community</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2023 FundForge. All rights reserved.</p>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-primary">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-primary">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
