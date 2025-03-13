import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  RefreshCcwIcon, 
  PlusIcon, 
  TrashIcon, 
  ChevronRightIcon, 
  CalculatorIcon, 
  ShieldIcon, 
  ZapIcon, 
  BarChart2Icon,
  AnchorIcon
} from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';

interface RouteOptimizerProps {
  onRouteChange?: (
    startPoint: [number, number], 
    endPoint: [number, number], 
    waypoints: Array<[number, number]>,
    safetyPreference?: number,
    selectedRouteIndex?: number,
    avoidBridges?: boolean
  ) => void;
  className?: string;
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
  const [avoidBridges, setAvoidBridges] = useState(false);
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
      
      onRouteChange?.(startCoords, endCoords, waypointCoords, safetyPreference, selectedRouteIndex, avoidBridges);
    }
  }, [startLocation, endLocation, waypoints, safetyPreference, selectedRouteIndex, avoidBridges, onRouteChange]);
  
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
        const speedPenalty = avoidBridges && safetyPreference > 30 ? 0.85 : 1;
        const speed = safetyPreference < 30 ? 70 : 60;
        const time = estimateTravelTime(distance, speed * speedPenalty);
        
        const riskFactors = generateRiskFactors(route);
        let riskScore = calculateRiskScore(riskFactors);
        
        if (avoidBridges) {
          riskScore = riskScore * 0.8;
        }
        
        return {
          route,
          distance,
          time,
          riskScore,
          routeIndex: index
        };
      });
      
      const sortedRoutes = [...routesWithMetrics].sort((a, b) => {
        const bridgeFactor = avoidBridges ? 0.2 : 0;
        const aScore = (a.riskScore * ((safetyPreference / 100) + bridgeFactor)) + 
                      (a.time * (1 - (safetyPreference / 100) - bridgeFactor));
        const bScore = (b.riskScore * ((safetyPreference / 100) + bridgeFactor)) + 
                      (b.time * (1 - (safetyPreference / 100) - bridgeFactor));
        return aScore - bScore;
      });
      
      setSelectedRouteIndex(sortedRoutes[0].routeIndex);
      setAlternativeRoutes(sortedRoutes);
      
      const bestRoute = sortedRoutes[0];
      
      const avgFuelConsumptionPerKm = 0.3;
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
      
      onRouteChange?.(startCoords, endCoords, waypointCoords, safetyPreference, sortedRoutes[0].routeIndex, avoidBridges);
      
      toast.success('Routes optimized successfully');
    }, 1500);
  };
  
  const handleRouteSelection = (routeIndex: number) => {
    setSelectedRouteIndex(routeIndex);
    
    if (startLocation && endLocation) {
      const startCoords = getCoordinates(startLocation);
      const endCoords = getCoordinates(endLocation);
      const waypointCoords = waypoints.map(wp => getCoordinates(wp));
      
      onRouteChange?.(startCoords, endCoords, waypointCoords, safetyPreference, routeIndex, avoidBridges);
    }
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
        
        <div className="flex items-center space-x-2 mt-1 mb-1">
          <Checkbox 
            id="avoidBridges" 
            checked={avoidBridges}
            onCheckedChange={(checked) => setAvoidBridges(checked === true)}
          />
          <label
            htmlFor="avoidBridges"
            className="text-sm font-medium leading-none flex items-center gap-1.5 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <AnchorIcon size={14} className="text-convoy-primary" />
            Avoid bridges (reduces risk, may increase travel time)
          </label>
        </div>
        
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
                        {index === 0 && safetyPreference > 50 && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Safest
                          </span>
                        )}
                        {index === 0 && safetyPreference < 50 && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Fastest
                          </span>
                        )}
                        {index === 0 && safetyPreference === 50 && (
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
