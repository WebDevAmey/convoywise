
import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-16">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-convoy-primary/10 text-convoy-primary text-sm font-medium mb-2">
          <span className="w-2 h-2 rounded-full bg-convoy-primary mr-2"></span>
          Optimize Your Fleet Operations
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-convoy-text text-balance">
          Intelligent Convoy Optimization & Risk Evaluation
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto text-balance">
          Streamline your fleet operations with AI-powered route optimization and real-time risk assessment to enhance efficiency and safety.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            className="convoy-button flex items-center gap-2 text-base"
            onClick={() => {
              const element = document.getElementById('route-planner');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get Started
            <ArrowRightIcon size={18} />
          </Button>
          
          <Button className="convoy-button-secondary text-base">
            Learn More
          </Button>
        </div>
      </div>
      
      <div className="w-full max-w-5xl mx-auto mt-16 animate-slide-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
        <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md animate-pulse-subtle">
                <MapIcon size={32} className="text-convoy-primary" />
              </div>
              <span className="text-convoy-text font-medium">Interactive Fleet Demo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Import at the top of the file
import { MapIcon } from 'lucide-react';

export default Hero;
