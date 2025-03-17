
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Filter } from 'lucide-react';
import StartupCard from './StartupCard';

const TrendingStartups = () => {
  // Mock data for trending startups
  const trendingStartups = [
    {
      name: "AgroTech Solutions",
      description: "AI-powered farming solutions for small and medium farmers",
      raisedAmount: "₹3.5 Cr",
      targetAmount: "₹6 Cr",
      progress: 58,
      investorsCount: 234,
      sector: "Agriculture",
      location: "Hyderabad",
      logo: "/placeholder.svg"
    },
    {
      name: "Electrify",
      description: "Electric vehicle charging network across metropolitan cities",
      raisedAmount: "₹8.2 Cr",
      targetAmount: "₹12 Cr",
      progress: 68,
      investorsCount: 312,
      sector: "EV Infrastructure",
      location: "Chennai",
      logo: "/placeholder.svg"
    },
    {
      name: "LearnWise",
      description: "Personalized learning platforms for K-12 students",
      raisedAmount: "₹5.1 Cr",
      targetAmount: "₹7 Cr",
      progress: 72,
      investorsCount: 189,
      sector: "EdTech",
      location: "Bangalore",
      logo: "/placeholder.svg"
    },
    {
      name: "MetaMed",
      description: "VR-based medical training and simulation platform",
      raisedAmount: "₹2.8 Cr",
      targetAmount: "₹5 Cr",
      progress: 56,
      investorsCount: 145,
      sector: "MedTech",
      location: "Mumbai",
      logo: "/placeholder.svg"
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-xl">Trending Startups</h3>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {trendingStartups.map((startup, index) => (
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
      
      <div className="flex justify-center mt-8">
        <Button variant="outline">View More Startups</Button>
      </div>
    </>
  );
};

export default TrendingStartups;
