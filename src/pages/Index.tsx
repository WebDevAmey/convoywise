
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import MapView from '@/components/MapView';
import RouteOptimizer from '@/components/route-optimizer';
import AnimatedTransition from '@/components/AnimatedTransition';
import { getSampleLocations } from '@/utils/mapUtils';
import { MapIcon } from 'lucide-react';
import { AvoidOptions, ConvoySize } from '@/components/route-optimizer/types';

const Index = () => {
  const locations = getSampleLocations();
  
  const [startPoint, setStartPoint] = useState<[number, number]>(locations[0].coordinates);
  const [endPoint, setEndPoint] = useState<[number, number]>(locations[1].coordinates);
  const [waypoints, setWaypoints] = useState<Array<[number, number]>>([]);
  const [startLocation, setStartLocation] = useState(locations[0].name);
  const [endLocation, setEndLocation] = useState(locations[1].name);
  const [safetyPreference, setSafetyPreference] = useState(50);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [avoidBridges, setAvoidBridges] = useState(false);
  const [convoySize, setConvoySize] = useState<ConvoySize>('medium');
  const [avoidOptions, setAvoidOptions] = useState<AvoidOptions>({
    bridges: false,
    hillTerrain: false,
    urbanAreas: false,
    waterCrossings: false,
    narrowRoads: false,
    unpavedRoads: false
  });
  
  const handleRouteChange = (
    start: [number, number], 
    end: [number, number], 
    points: Array<[number, number]>,
    safety?: number,
    routeIndex?: number,
    bridges?: boolean,
    convoy?: string,
    avoid?: AvoidOptions
  ) => {
    setStartPoint(start);
    setEndPoint(end);
    setWaypoints(points);
    
    if (safety !== undefined) {
      setSafetyPreference(safety);
    }
    
    if (routeIndex !== undefined) {
      setSelectedRouteIndex(routeIndex);
    }
    
    if (bridges !== undefined) {
      setAvoidBridges(bridges);
    }
    
    if (convoy !== undefined) {
      setConvoySize(convoy as ConvoySize);
    }
    
    if (avoid !== undefined) {
      setAvoidOptions(avoid);
    }
    
    // Update location names
    const startLoc = locations.find(loc => 
      loc.coordinates[0] === start[0] && loc.coordinates[1] === start[1]
    );
    
    const endLoc = locations.find(loc => 
      loc.coordinates[0] === end[0] && loc.coordinates[1] === end[1]
    );
    
    if (startLoc) setStartLocation(startLoc.name);
    if (endLoc) setEndLocation(endLoc.name);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-convoy-light to-white">
      <NavBar />
      
      <main className="container mx-auto px-4 py-20">
        <Hero />
        
        <section id="route-planner" className="mt-16 mb-20 scroll-mt-20">
          <AnimatedTransition>
            <h2 className="text-2xl md:text-3xl font-bold text-convoy-text text-center mb-2">
              Intelligent Convoy Planner
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Plan and optimize your convoy routes with AI-powered analysis to maximize safety and efficiency.
            </p>
          </AnimatedTransition>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MapView 
                startPoint={startPoint}
                endPoint={endPoint}
                waypoints={waypoints}
                showOptimizedRoute={true}
                showAlternativeRoutes={true}
                selectedRouteIndex={selectedRouteIndex}
                safetyPreference={safetyPreference}
                avoidBridges={avoidBridges}
                className="h-[600px]"
              />
            </div>
            
            <div className="space-y-6">
              <RouteOptimizer onRouteChange={handleRouteChange} />
            </div>
          </div>
        </section>
        
        <section className="mb-20">
          <AnimatedTransition className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-convoy-primary/10 text-convoy-primary text-sm font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-convoy-primary mr-2"></span>
              Advanced Fleet Management
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-convoy-text mb-4">
              Route Optimization for Efficiency
            </h2>
            
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our system leverages advanced algorithms to analyze various data sources and provide optimized routes, helping you make informed decisions.
            </p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                title="Data Integration"
                description="Integrates with multiple data sources including weather services, traffic APIs, and security databases to provide comprehensive route analysis."
                delay={0}
              />
              
              <FeatureCard 
                title="Predictive Analytics"
                description="Uses machine learning algorithms to predict potential issues before they occur, allowing proactive route planning."
                delay={100}
              />
              
              <FeatureCard 
                title="Real-time Monitoring"
                description="Continuously monitors your convoy's progress and provides real-time alerts about changing conditions or emerging issues."
                delay={200}
              />
            </div>
          </AnimatedTransition>
        </section>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-convoy-primary text-white mr-2">
                <MapIcon size={18} />
              </div>
              <span className="font-semibold text-convoy-text">ConvoyWise</span>
            </div>
            
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} ConvoyWise. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, delay = 0 }) => (
  <AnimatedTransition 
    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
    delay={delay}
  >
    <div className="w-12 h-12 rounded-full bg-convoy-primary/10 flex items-center justify-center mb-4 mx-auto">
      <div className="w-6 h-6 rounded-full bg-convoy-primary/20 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-convoy-primary"></div>
      </div>
    </div>
    
    <h3 className="text-lg font-semibold text-convoy-text mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </AnimatedTransition>
);

export default Index;
