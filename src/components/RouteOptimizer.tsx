import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCcwIcon, PlusIcon, TrashIcon, ChevronRightIcon, CalculatorIcon, ShieldIcon, ZapIcon, BarChart2Icon, TruckIcon, PackageIcon, MountainIcon, BridgeIcon, HomeIcon, AlertTriangleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getSampleLocations, 
  calculateRouteTotalDistance, 
  estimateTravelTime, 
  formatDuration,
  generateRandomRoute,
  generateAlternativeRoutes
} from '@/utils/mapUtils';
import { generateRiskFactors, calculateRiskScore, getRiskLevel, getRiskColor } from '@/utils/riskAnalysisUtils';
import AnimatedTransition from './AnimatedTransition';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface RouteOptimizerProps {
  onRouteChange?: (
    startPoint: [number, number], 
    endPoint: [number, number], 
    waypoints: Array<[number, number]>,
    safetyPreference?: number,
    selectedRouteIndex?: number
  ) => void;
  className?: string;
}

interface AvoidanceOptions {
  terrain: {
    denseTerrain: boolean;
    mountains: boolean;
    forests: boolean;
  };
  infrastructure: {
    bridges: boolean;
    tunnels: boolean;
    narrowRoads: boolean;
  };
  settlements: {
    villages: boolean;
    urbanAreas: boolean;
    checkpoints: boolean;
  };
}

interface ConvoySpecs {
  size: 'small' | 'medium' | 'large';
  vehicles: number;
  personnel: number;
  cargo: 'light' | 'medium' | 'heavy';
  specialEquipment: boolean;
}

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ 
  onRouteChange,
  className = ''
}) => {
  const locations = getSampleLocations();
  
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [safetyPreference, setSafetyPreference] = useState(50); // 0-100 scale (0: speed, 100: safety)
  const [alternativeRoutes, setAlternativeRoutes] = useState<Array<{
    distance: number;
    time: number;
    riskScore: number;
    routeIndex: number;
  }>>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState<{
    distance: number;
    time: number;
    fuelUsage: number;
    riskScore: number;
    fuelSavings: number;
    timeSavings: number;
  } | null>(null);
  
  const [avoidanceOptions, setAvoidanceOptions] = useState<AvoidanceOptions>({
    terrain: {
      denseTerrain: false,
      mountains: false,
      forests: false
    },
    infrastructure: {
      bridges: false,
      tunnels: false,
      narrowRoads: false
    },
    settlements: {
      villages: false,
      urbanAreas: false,
      checkpoints: false
    }
  });
  
  const [convoySpecs, setConvoySpecs] = useState<ConvoySpecs>({
    size: 'medium',
    vehicles: 5,
    personnel: 20,
    cargo: 'medium',
    specialEquipment: false
  });
  
  const [prioritizeSafety, setPrioritizeSafety] = useState(false);
  
  const getCoordinates = (locationName: string): [number, number] => {
    const location = locations.find(loc => loc.name === locationName);
    return location ? location.coordinates as [number, number] : [0, 0];
  };
  
  useEffect(() => {
    if (locations.length >= 2) {
      setStartLocation(locations[0].name);
      setEndLocation(locations[1].name);
    }
  }, []);
  
  useEffect(() => {
    if (startLocation && endLocation) {
      const startCoords = getCoordinates(startLocation);
      const endCoords = getCoordinates(endLocation);
      const waypointCoords = waypoints.map(wp => getCoordinates(wp));
      
      onRouteChange?.(startCoords, endCoords, waypointCoords, safetyPreference, selectedRouteIndex);
    }
  }, [startLocation, endLocation, waypoints, safetyPreference, selectedRouteIndex, onRouteChange]);
  
  const handleAddWaypoint = () => {
    if (waypoints.length < 3) {
      const usedLocations = [startLocation, endLocation, ...waypoints];
      const availableLocations = locations.filter(loc => !usedLocations.includes(loc.name));
      
      if (availableLocations.length > 0) {
        setWaypoints([...waypoints, availableLocations[0].name]);
      } else {
        toast.error('No more available locations');
      }
    } else {
      toast.warning('Maximum 3 waypoints allowed');
    }
  };
  
  const handleRemoveWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };
  
  const handleOptimizeRoute = () => {
    setIsOptimizing(true);
    
    setTimeout(() => {
      const startCoords = getCoordinates(startLocation);
      const endCoords = getCoordinates(endLocation);
      const waypointCoords = waypoints.map(wp => getCoordinates(wp));
      
      const routes = generateAlternativeRoutes(startCoords, endCoords, [], 3);
      
      const routesWithMetrics = routes.map((route, index) => {
        const distance = calculateRouteTotalDistance(route);
        
        let speedAdjustment = 0;
        if (convoySpecs.size === 'large') speedAdjustment -= 10;
        else if (convoySpecs.size === 'small') speedAdjustment += 5;
        
        if (convoySpecs.cargo === 'heavy') speedAdjustment -= 10;
        else if (convoySpecs.cargo === 'light') speedAdjustment += 5;
        
        const baseSpeed = safetyPreference < 30 ? 70 : 60;
        const adjustedSpeed = Math.max(30, baseSpeed + speedAdjustment);
        
        const time = estimateTravelTime(distance, adjustedSpeed);
        
        const riskFactors = generateRiskFactors(route);
        
        let riskAdjustment = 0;
        
        if (avoidanceOptions.terrain.denseTerrain) riskAdjustment += 10;
        if (avoidanceOptions.terrain.mountains) riskAdjustment += 15;
        if (avoidanceOptions.terrain.forests) riskAdjustment += 5;
        
        if (avoidanceOptions.infrastructure.bridges) riskAdjustment += 20;
        if (avoidanceOptions.infrastructure.tunnels) riskAdjustment += 15;
        if (avoidanceOptions.infrastructure.narrowRoads) riskAdjustment += 10;
        
        if (avoidanceOptions.settlements.villages) riskAdjustment += 10;
        if (avoidanceOptions.settlements.urbanAreas) riskAdjustment += 20;
        if (avoidanceOptions.settlements.checkpoints) riskAdjustment += 30;
        
        if (convoySpecs.size === 'large') riskAdjustment += 15;
        if (convoySpecs.specialEquipment) riskAdjustment += 10;
        
        const baseRiskScore = calculateRiskScore(riskFactors);
        const adjustedRiskScore = Math.min(100, baseRiskScore + riskAdjustment * (index === 0 ? 0.5 : 1));
        
        return {
          route,
          distance,
          time,
          riskScore: adjustedRiskScore,
          routeIndex: index
        };
      });
      
      let sortedRoutes;
      
      if (prioritizeSafety) {
        sortedRoutes = [...routesWithMetrics].sort((a, b) => a.riskScore - b.riskScore);
      } else {
        sortedRoutes = [...routesWithMetrics].sort((a, b) => {
          const aScore = (a.riskScore * (safetyPreference / 100)) + (a.time * (1 - safetyPreference / 100));
          const bScore = (b.riskScore * (safetyPreference / 100)) + (b.time * (1 - safetyPreference / 100));
          return aScore - bScore;
        });
      }
      
      setSelectedRouteIndex(sortedRoutes[0].routeIndex);
      
      setAlternativeRoutes(sortedRoutes);
      
      const bestRoute = sortedRoutes[0];
      
      let fuelConsumptionMultiplier = 1.0;
      if (convoySpecs.size === 'large') fuelConsumptionMultiplier = 1.5;
      else if (convoySpecs.size === 'small') fuelConsumptionMultiplier = 0.8;
      
      if (convoySpecs.cargo === 'heavy') fuelConsumptionMultiplier *= 1.3;
      else if (convoySpecs.cargo === 'light') fuelConsumptionMultiplier *= 0.9;
      
      const avgFuelConsumptionPerKm = 0.3 * fuelConsumptionMultiplier;
      const fuelUsage = bestRoute.distance * avgFuelConsumptionPerKm;
      
      const otherRoutes = sortedRoutes.slice(1);
      const avgOtherDistance = otherRoutes.reduce((sum, r) => sum + r.distance, 0) / otherRoutes.length;
      const avgOtherTime = otherRoutes.reduce((sum, r) => sum + r.time, 0) / otherRoutes.length;
      const avgOtherFuel = avgOtherDistance * avgFuelConsumptionPerKm;
      
      setOptimizationResult({
        distance: bestRoute.distance,
        time: bestRoute.time,
        fuelUsage: fuelUsage,
        riskScore: bestRoute.riskScore,
        fuelSavings: avgOtherFuel - fuelUsage,
        timeSavings: avgOtherTime - bestRoute.time
      });
      
      setIsOptimizing(false);
      
      onRouteChange?.(startCoords, endCoords, waypointCoords, safetyPreference, sortedRoutes[0].routeIndex);
      
      toast.success('Routes optimized successfully');
    }, 1500);
  };
  
  const handleRouteSelection = (routeIndex: number) => {
    setSelectedRouteIndex(routeIndex);
    
    if (startLocation && endLocation) {
      const startCoords = getCoordinates(startLocation);
      const endCoords = getCoordinates(endLocation);
      const waypointCoords = waypoints.map(wp => getCoordinates(wp));
      
      onRouteChange?.(startCoords, endCoords, waypointCoords, safetyPreference, routeIndex);
    }
  };
  
  const handleConvoySizeChange = (size: 'small' | 'medium' | 'large') => {
    const vehicleCount = size === 'small' ? 3 : size === 'medium' ? 5 : 10;
    const personnelCount = size === 'small' ? 12 : size === 'medium' ? 20 : 40;
    
    setConvoySpecs(prev => ({
      ...prev,
      size,
      vehicles: vehicleCount,
      personnel: personnelCount
    }));
  };
  
  const toggleAvoidanceOption = (
    category: 'terrain' | 'infrastructure' | 'settlements',
    option: string,
    value: boolean
  ) => {
    setAvoidanceOptions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [option]: value
      }
    }));
  };
  
  const getSafetySpeedPreferenceLabel = () => {
    if (safetyPreference < 25) return "Maximum Speed";
    if (safetyPreference < 40) return "Prioritize Speed";
    if (safetyPreference < 60) return "Balanced";
    if (safetyPreference < 80) return "Prioritize Safety";
    return "Maximum Safety";
  };
  
  const getRiskLevelLabel = (score: number) => {
    const level = getRiskLevel(score);
    return (
      <span className={`convoy-badge ${getRiskColor(level)} px-2 py-1`}>
        {level.toUpperCase()}
      </span>
    );
  };
  
  return (
    <AnimatedTransition className={`panel p-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-4 text-convoy-text">Route Optimizer</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Location</label>
          <select
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            className="convoy-select"
          >
            <option value="">Select start location</option>
            {locations.map((loc) => (
              <option key={`start-${loc.name}`} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Location</label>
          <select
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            className="convoy-select"
          >
            <option value="">Select end location</option>
            {locations.map((loc) => (
              <option key={`end-${loc.name}`} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
        
        {waypoints.map((waypoint, index) => (
          <div key={`waypoint-${index}`} className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waypoint {index + 1}
              </label>
              <select
                value={waypoint}
                onChange={(e) => {
                  const newWaypoints = [...waypoints];
                  newWaypoints[index] = e.target.value;
                  setWaypoints(newWaypoints);
                }}
                className="convoy-select"
              >
                <option value="">Select waypoint</option>
                {locations.map((loc) => (
                  <option key={`wp-${index}-${loc.name}`} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="mt-6"
              onClick={() => handleRemoveWaypoint(index)}
            >
              <TrashIcon size={18} className="text-gray-500" />
            </Button>
          </div>
        ))}
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="convoy-specifications">
            <AccordionTrigger className="text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2">
                <TruckIcon size={16} />
                Convoy Specifications
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Convoy Size
                  </label>
                  <Select 
                    value={convoySpecs.size} 
                    onValueChange={(value: 'small' | 'medium' | 'large') => handleConvoySizeChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select convoy size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (3 vehicles, 12 personnel)</SelectItem>
                      <SelectItem value="medium">Medium (5 vehicles, 20 personnel)</SelectItem>
                      <SelectItem value="large">Large (10 vehicles, 40 personnel)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo Type
                  </label>
                  <Select 
                    value={convoySpecs.cargo} 
                    onValueChange={(value: 'light' | 'medium' | 'heavy') => setConvoySpecs(prev => ({...prev, cargo: value}))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select cargo type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light Cargo</SelectItem>
                      <SelectItem value="medium">Medium Cargo</SelectItem>
                      <SelectItem value="heavy">Heavy Cargo/Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="special-equipment" 
                    checked={convoySpecs.specialEquipment}
                    onCheckedChange={(checked) => setConvoySpecs(prev => ({...prev, specialEquipment: checked === true}))}
                  />
                  <label
                    htmlFor="special-equipment"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Special/Sensitive Equipment
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="avoidance-options">
            <AccordionTrigger className="text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2">
                <AlertTriangleIcon size={16} />
                Threat Avoidance Options
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                    <MountainIcon size={14} /> Terrain
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-dense-terrain" 
                        checked={avoidanceOptions.terrain.denseTerrain}
                        onCheckedChange={(checked) => toggleAvoidanceOption('terrain', 'denseTerrain', checked === true)}
                      />
                      <label htmlFor="avoid-dense-terrain" className="text-sm">
                        Dense Terrain
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-mountains" 
                        checked={avoidanceOptions.terrain.mountains}
                        onCheckedChange={(checked) => toggleAvoidanceOption('terrain', 'mountains', checked === true)}
                      />
                      <label htmlFor="avoid-mountains" className="text-sm">
                        Mountains
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-forests" 
                        checked={avoidanceOptions.terrain.forests}
                        onCheckedChange={(checked) => toggleAvoidanceOption('terrain', 'forests', checked === true)}
                      />
                      <label htmlFor="avoid-forests" className="text-sm">
                        Forests
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                    <BridgeIcon size={14} /> Infrastructure
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-bridges" 
                        checked={avoidanceOptions.infrastructure.bridges}
                        onCheckedChange={(checked) => toggleAvoidanceOption('infrastructure', 'bridges', checked === true)}
                      />
                      <label htmlFor="avoid-bridges" className="text-sm">
                        Bridges
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-tunnels" 
                        checked={avoidanceOptions.infrastructure.tunnels}
                        onCheckedChange={(checked) => toggleAvoidanceOption('infrastructure', 'tunnels', checked === true)}
                      />
                      <label htmlFor="avoid-tunnels" className="text-sm">
                        Tunnels
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-narrow-roads" 
                        checked={avoidanceOptions.infrastructure.narrowRoads}
                        onCheckedChange={(checked) => toggleAvoidanceOption('infrastructure', 'narrowRoads', checked === true)}
                      />
                      <label htmlFor="avoid-narrow-roads" className="text-sm">
                        Narrow Roads
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                    <HomeIcon size={14} /> Settlements
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-villages" 
                        checked={avoidanceOptions.settlements.villages}
                        onCheckedChange={(checked) => toggleAvoidanceOption('settlements', 'villages', checked === true)}
                      />
                      <label htmlFor="avoid-villages" className="text-sm">
                        Villages
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-urban-areas" 
                        checked={avoidanceOptions.settlements.urbanAreas}
                        onCheckedChange={(checked) => toggleAvoidanceOption('settlements', 'urbanAreas', checked === true)}
                      />
                      <label htmlFor="avoid-urban-areas" className="text-sm">
                        Urban Areas
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="avoid-checkpoints" 
                        checked={avoidanceOptions.settlements.checkpoints}
                        onCheckedChange={(checked) => toggleAvoidanceOption('settlements', 'checkpoints', checked === true)}
                      />
                      <label htmlFor="avoid-checkpoints" className="text-sm">
                        Checkpoints
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="pt-3 pb-1">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Route Preference: {getSafetySpeedPreferenceLabel()}
          </label>
          <div className="flex items-center gap-3">
            <ZapIcon size={18} className="text-convoy-warning" />
            <Slider
              value={[safetyPreference]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => setSafetyPreference(values[0])}
              className="flex-1"
            />
            <ShieldIcon size={18} className="text-convoy-primary" />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Speed</span>
            <span>Balanced</span>
            <span>Safety</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 pt-1">
          <Checkbox 
            id="safest-route" 
            checked={prioritizeSafety}
            onCheckedChange={(checked) => setPrioritizeSafety(checked === true)}
          />
          <label
            htmlFor="safest-route"
            className="text-sm font-medium leading-none text-gray-700"
          >
            Always choose safest route (ignores speed preference)
          </label>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={handleAddWaypoint}
            disabled={waypoints.length >= 3}
          >
            <PlusIcon size={16} />
            Add Waypoint
          </Button>
          
          <Button
            variant="default"
            size="sm"
            className="w-full sm:w-auto flex items-center gap-2 bg-convoy-primary hover:bg-convoy-primary/90"
            onClick={handleOptimizeRoute}
            disabled={!startLocation || !endLocation || isOptimizing}
          >
            {isOptimizing ? (
              <RefreshCcwIcon size={16} className="animate-spin" />
            ) : (
              <CalculatorIcon size={16} />
            )}
            {isOptimizing ? 'Optimizing...' : 'Calculate Routes'}
          </Button>
        </div>
        
        {alternativeRoutes.length > 0 && (
          <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-100 animate-fade-in">
            <h3 className="font-medium text-convoy-text mb-3 flex items-center gap-1.5">
              <BarChart2Icon size={16} />
              Available Routes
            </h3>
            
            <div className="space-y-3">
              {alternativeRoutes.map((route, index) => {
                const riskLevel = getRiskLevel(route.riskScore);
                
                return (
                  <button 
                    key={`route-option-${index}`}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedRouteIndex === route.routeIndex
                        ? 'bg-convoy-primary/10 border-convoy-primary/30'
                        : 'bg-white hover:bg-gray-50 border-gray-100'
                    }`}
                    onClick={() => handleRouteSelection(route.routeIndex)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        Route {index + 1}
                        {index === 0 && prioritizeSafety && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Safest
                          </span>
                        )}
                        {index === 0 && !prioritizeSafety && safetyPreference > 50 && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Safer
                          </span>
                        )}
                        {index === 0 && !prioritizeSafety && safetyPreference < 50 && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Faster
                          </span>
                        )}
                        {index === 0 && !prioritizeSafety && safetyPreference === 50 && (
                          <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                            Balanced
                          </span>
                        )}
                      </div>
                      <div className={`convoy-badge ${getRiskColor(riskLevel)}`}>
                        {riskLevel.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <ZapIcon size={14} />
                        <span>{formatDuration(route.time)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldIcon size={14} />
                        <span>Risk: {route.riskScore.toFixed(1)}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1.5">
                        <ChevronRightIcon size={14} />
                        <span>{route.distance.toFixed(1)} km</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {optimizationResult && (
          <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-100 animate-fade-in">
            <h3 className="font-medium text-convoy-text mb-2">Optimization Results</h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Total Distance</p>
                <p className="font-medium">{optimizationResult.distance.toFixed(1)} km</p>
              </div>
              
              <div>
                <p className="text-gray-500">Estimated Time</p>
                <p className="font-medium">{formatDuration(optimizationResult.time)}</p>
              </div>
              
              <div>
                <p className="text-gray-500">Est. Fuel Usage</p>
                <p className="font-medium">{optimizationResult.fuelUsage.toFixed(1)} L</p>
              </div>
              
              <div>
                <p className="text-gray-500">Risk Level</p>
                <p className="font-medium">{getRiskLevelLabel(optimizationResult.riskScore)}</p>
              </div>
              
              <div className="col-span-2 mt-2 p-2 bg-green-50 rounded-lg border border-green-100">
                <p className="text-green-800 font-medium text-xs">Optimization Savings</p>
                <div className="flex justify-between mt-1 text-sm">
                  <span>⏱️ {formatDuration(optimizationResult.timeSavings)} saved</span>
                  <span>🛢️ {optimizationResult.fuelSavings.toFixed(1)} L saved</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                variant="link" 
                size="sm" 
                className="text-convoy-primary p-0 h-auto text-sm font-medium"
              >
                View Detailed Report
                <ChevronRightIcon size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AnimatedTransition>
  );
};

export default RouteOptimizer;
