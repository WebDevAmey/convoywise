
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Users, MapPin, Calendar, BarChart3, Briefcase, Award, Star, Globe, PieChart, ArrowUp, TrendingUp, FileText, MessageSquare } from 'lucide-react';

const StartupProfile = () => {
  const [investAmount, setInvestAmount] = useState<number>(5000);

  const startup = {
    name: 'AgriTech Solutions',
    tagline: 'Revolutionizing farming with AI and IoT',
    description: 'AgriTech Solutions is developing smart farming solutions that help farmers increase crop yield while reducing resource usage through AI-powered analytics and IoT sensor networks.',
    logoUrl: '/placeholder.svg',
    coverImageUrl: '/placeholder.svg',
    location: 'Bengaluru, India',
    founded: '2021',
    team: [
      { name: 'Rajiv Sharma', role: 'CEO & Founder', avatar: '/placeholder.svg' },
      { name: 'Priya Mehta', role: 'CTO', avatar: '/placeholder.svg' },
      { name: 'Anand Patel', role: 'Head of Operations', avatar: '/placeholder.svg' },
    ],
    raisedAmount: '₹3.5 Cr',
    targetAmount: '₹6 Cr',
    progress: 58,
    investorsCount: 234,
    sector: 'Agriculture',
    stage: 'Seed',
    pitch: 'AgriTech Solutions is addressing the critical challenge of food security in India by empowering farmers with technology. Our IoT sensors and AI-powered recommendations help farmers optimize irrigation, fertilization, and pest control, resulting in up to 30% higher yields and 20% lower water usage.',
    traction: [
      { metric: 'Farmers Onboarded', value: '500+' },
      { metric: 'Land Coverage', value: '2,000+ acres' },
      { metric: 'Yield Improvement', value: '25%' },
      { metric: 'Water Savings', value: '20%' },
    ],
    updates: [
      { date: 'May 15, 2023', title: 'Partnership with State Agricultural University', content: 'We\'ve partnered with Karnataka Agricultural University to validate and improve our AI models.' },
      { date: 'Apr 3, 2023', title: 'Product Launch', content: 'Successfully launched our smart sensor array and mobile app for farmers.' },
      { date: 'Feb 12, 2023', title: 'Seed Funding', content: 'Raised initial seed funding of ₹1.5 Cr from angel investors.' },
    ],
    documents: [
      { name: 'Pitch Deck', type: 'PDF' },
      { name: 'Financial Projections', type: 'Spreadsheet' },
      { name: 'Market Analysis', type: 'PDF' },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-convoy-light to-white">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img 
          src={startup.coverImageUrl} 
          alt={`${startup.name} cover`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end">
          <div className="container p-6 flex items-center gap-6">
            <div className="bg-white rounded-xl p-2 shadow-lg">
              <img 
                src={startup.logoUrl} 
                alt={startup.name} 
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
              />
            </div>
            <div className="text-white">
              <h1 className="text-2xl md:text-4xl font-bold">{startup.name}</h1>
              <p className="text-white/80 text-sm md:text-base">{startup.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-primary/70">{startup.sector}</Badge>
                <Badge className="bg-secondary/70">{startup.stage}</Badge>
                <div className="flex items-center text-xs text-white/80 gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{startup.location}</span>
                </div>
                <div className="flex items-center text-xs text-white/80 gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Founded: {startup.founded}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="traction">Traction</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">About {startup.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{startup.description}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Pitch</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{startup.pitch}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="traction" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {startup.traction.map((item, i) => (
                        <div key={i} className="bg-muted/50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary">{item.value}</div>
                          <div className="text-sm text-muted-foreground">{item.metric}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Growth Chart</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <div className="text-muted-foreground text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 text-muted" />
                      <p>Growth visualization would appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="team" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Founding Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {startup.team.map((member, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg">
                          <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className="w-24 h-24 rounded-full object-cover mb-3"
                          />
                          <h3 className="font-bold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="updates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Company Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {startup.updates.map((update, i) => (
                        <div key={i} className="border-l-2 border-primary pl-4 pb-6">
                          <div className="text-sm text-muted-foreground mb-1">{update.date}</div>
                          <h3 className="font-bold text-lg mb-1">{update.title}</h3>
                          <p className="text-muted-foreground">{update.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {startup.documents.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-xs text-muted-foreground">{doc.type}</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="discussion" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Investor Discussion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted" />
                      <h3 className="text-lg font-medium mb-2">Join the conversation</h3>
                      <p className="text-muted-foreground mb-4">Connect with other investors and ask questions to the team</p>
                      <Button>Start Discussion</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader className="pb-2">
                <CardTitle>Funding Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Raised: <span className="font-medium">{startup.raisedAmount}</span></span>
                    <span>Target: <span className="font-medium">{startup.targetAmount}</span></span>
                  </div>
                  <Progress value={startup.progress} className="h-2" />
                  <div className="flex items-center gap-1 text-sm mt-2">
                    <Users className="h-3 w-3" />
                    <span>{startup.investorsCount} investors</span>
                  </div>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Invest Now</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Invest in {startup.name}</DialogTitle>
                      <DialogDescription>
                        Set your investment amount. Minimum investment is ₹5,000.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Investment Amount (₹)</Label>
                        <Input 
                          id="amount" 
                          type="number" 
                          value={investAmount} 
                          onChange={(e) => setInvestAmount(Number(e.target.value))}
                          min={5000}
                          step={1000}
                        />
                      </div>
                      <div>
                        <Label>
                          <div className="flex justify-between mb-2">
                            <span>Adjust Amount</span>
                            <span>₹{investAmount.toLocaleString()}</span>
                          </div>
                        </Label>
                        <Slider 
                          defaultValue={[5000]} 
                          max={500000} 
                          min={5000} 
                          step={1000}
                          onValueChange={(value) => setInvestAmount(value[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>₹5,000</span>
                          <span>₹500,000</span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Confirm Investment</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="w-full">Add to Watchlist</Button>
                
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Investment Terms</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Minimum Investment</span>
                      <span>₹5,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Equity Offered</span>
                      <span>8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valuation Cap</span>
                      <span>₹75 Cr</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StartupProfile;
