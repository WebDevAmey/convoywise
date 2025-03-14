
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import MapView from '@/components/MapView';
import RouteOptimizer from '@/components/route-optimizer';
import { getSampleLocations } from '@/utils/mapUtils';
import { AvoidOptions, ConvoySize } from '@/components/route-optimizer/types';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

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
      
      <main className="container mx-auto px-4 py-8">
        <div className="mt-16">
          <ResizablePanelGroup direction="horizontal" className="min-h-[80vh] rounded-lg border">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full">
                <RouteOptimizer onRouteChange={handleRouteChange} className="h-full" />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={50} minSize={30}>
              <MapView 
                startPoint={startPoint}
                endPoint={endPoint}
                waypoints={waypoints}
                showOptimizedRoute={true}
                showAlternativeRoutes={true}
                selectedRouteIndex={selectedRouteIndex}
                safetyPreference={safetyPreference}
                avoidBridges={avoidBridges}
                className="h-full"
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </main>
    </div>
  );
};

export default Index;
