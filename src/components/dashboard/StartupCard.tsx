
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Users, MapPin } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StartupCardProps {
  name: string;
  description: string;
  raisedAmount: string;
  targetAmount: string;
  progress: number;
  investorsCount: number;
  sector: string;
  location: string;
  logo: string;
  yourInvestment?: string;
}

const StartupCard = ({
  name,
  description,
  raisedAmount,
  targetAmount,
  progress,
  investorsCount,
  sector,
  location,
  logo,
  yourInvestment
}: StartupCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 h-24 relative">
          <div className="absolute -bottom-8 left-4 bg-white rounded-full border-4 border-white overflow-hidden">
            <img src={logo} alt={name} className="w-16 h-16 object-cover" />
          </div>
          <div className="absolute top-2 right-2">
            <Badge className="bg-black/60 text-white hover:bg-black/80">{sector}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-10 pb-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              {location}
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Raised: <span className="font-medium">{raisedAmount}</span></span>
              <span>Target: <span className="font-medium">{targetAmount}</span></span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex items-center gap-1 text-sm">
            <Users className="h-3 w-3" />
            <span>{investorsCount} investors</span>
          </div>
          
          {yourInvestment && (
            <div className="bg-primary/10 text-primary p-2 rounded-md text-sm">
              Your investment: <span className="font-bold">{yourInvestment}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 pt-3 pb-3">
        <div className="w-full grid grid-cols-2 gap-2">
          <Button variant={yourInvestment ? "outline" : "default"} size="sm" className="w-full">
            {yourInvestment ? "Add More" : "Invest Now"}
          </Button>
          <Button variant="secondary" size="sm" className="w-full">
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StartupCard;
