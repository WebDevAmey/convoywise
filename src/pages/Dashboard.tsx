
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, TrendingUp, Users, Award, BarChart3, Wallet, Star } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StartupCard from '@/components/dashboard/StartupCard';
import TrendingStartups from '@/components/dashboard/TrendingStartups';
import InvestmentStats from '@/components/dashboard/InvestmentStats';
import UserProfile from '@/components/dashboard/UserProfile';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discover');
  
  // Mock user data
  const user = {
    name: 'Alex Johnson',
    role: 'Investor',
    avatar: '/placeholder.svg',
    balance: '₹25,00,000',
    investmentsCount: 12,
    achievements: ['Top Backer', 'Early Adopter']
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-convoy-light to-white">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">FundForge</h1>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Discover</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px]">
                      <NavigationMenuLink className="flex items-center gap-2 p-2 hover:bg-muted rounded-md" onClick={() => navigate('/trending')}>
                        <TrendingUp className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Trending Startups</div>
                          <p className="text-sm text-muted-foreground">Explore what's hot in the startup scene</p>
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink className="flex items-center gap-2 p-2 hover:bg-muted rounded-md" onClick={() => navigate('/categories')}>
                        <BarChart3 className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Categories</div>
                          <p className="text-sm text-muted-foreground">Browse startups by industry</p>
                        </div>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Invest</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px]">
                      <NavigationMenuLink className="flex items-center gap-2 p-2 hover:bg-muted rounded-md" onClick={() => navigate('/opportunities')}>
                        <Wallet className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Investment Opportunities</div>
                          <p className="text-sm text-muted-foreground">Find your next investment</p>
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink className="flex items-center gap-2 p-2 hover:bg-muted rounded-md" onClick={() => navigate('/portfolio')}>
                        <BarChart3 className="h-5 w-5" />
                        <div>
                          <div className="font-medium">My Portfolio</div>
                          <p className="text-sm text-muted-foreground">Track your investments</p>
                        </div>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/notifications')}>
              <span className="relative">
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              </span>
            </Button>
            
            <UserProfile user={user} />
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h2>
              <p className="text-muted-foreground">Discover promising startups and track your investments</p>
            </div>
            
            <Tabs defaultValue="discover" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="discover">Discover</TabsTrigger>
                <TabsTrigger value="investments">My Investments</TabsTrigger>
                <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              </TabsList>
              
              <TabsContent value="discover" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TrendingStartups />
                </div>
              </TabsContent>
              
              <TabsContent value="investments" className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Your Active Investments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <StartupCard 
                    name="GreenTech Solutions"
                    description="Sustainable energy solutions for urban environments"
                    raisedAmount="₹1.2 Cr"
                    targetAmount="₹2 Cr"
                    progress={60}
                    investorsCount={124}
                    sector="Clean Energy"
                    location="Bangalore"
                    logo="/placeholder.svg"
                    yourInvestment="₹5,00,000"
                  />
                  <StartupCard 
                    name="MedAssist AI"
                    description="AI-driven healthcare diagnostics platform"
                    raisedAmount="₹8.5 Cr"
                    targetAmount="₹10 Cr"
                    progress={85}
                    investorsCount={342}
                    sector="Healthcare"
                    location="Mumbai"
                    logo="/placeholder.svg"
                    yourInvestment="₹2,50,000"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="watchlist" className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Your Watchlist</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <StartupCard 
                    name="FinEdge"
                    description="Decentralized finance for the unbanked population"
                    raisedAmount="₹4.2 Cr"
                    targetAmount="₹7 Cr"
                    progress={60}
                    investorsCount={189}
                    sector="Fintech"
                    location="Pune"
                    logo="/placeholder.svg"
                  />
                  <StartupCard 
                    name="EduLearn"
                    description="Personalized learning platform for students"
                    raisedAmount="₹2.8 Cr"
                    targetAmount="₹5 Cr"
                    progress={56}
                    investorsCount={165}
                    sector="EdTech"
                    location="Delhi"
                    logo="/placeholder.svg"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card className="glass-morphism">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Investment Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{user.balance}</div>
                <p className="text-sm text-muted-foreground mt-1">Available for investing</p>
                <Button className="w-full mt-4">Add Funds</Button>
              </CardContent>
            </Card>
            
            <InvestmentStats />
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Achievements</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {user.achievements.map((achievement, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-accent/50 rounded-md">
                    <Award className="text-secondary h-5 w-5" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full text-primary text-sm">View All Achievements</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
