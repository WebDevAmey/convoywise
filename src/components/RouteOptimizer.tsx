
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcwIcon, PlusIcon, TrashIcon, ChevronRightIcon, CalculatorIcon } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getSampleLocations, 
  calculateRouteTotalDistance, 
  estimateTravelTime, 
  formatDuration,
  generateRandomRoute 
} from '@/utils/mapUtils';
import { generateRiskFactors, calculateRiskScore, getRiskLevel, getRiskColor } from '@/utils/riskAnalysisUtils';
import AnimatedTransition from './AnimatedTransition';

interface RouteOptimizerProps {
  onRouteChange?: (startPoint: [number, number], endPoint: [number, number], waypoints: Array<[number, number]>) => void;
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
  const [optimizationResult, setOptimizationResult] = useState<{
    distance: number;
    time: number;
    fuelUsage: number;
    riskScore: number;
    fuelSavings: number;
    timeSavings: number;
  } | null>(null);
  
  // Convert location names to coordinates
  const getCoordinates = (locationName: string): [number, number] => {
    const location = locations.find(loc => loc.name === locationName);
    return location ? location.coordinates : [0, 0];
  };
  
  // Initialize with default values
  useEffect(() => {
    if (locations.length >= 2) {
      setStartLocation(locations[0].name);
      setEndLocation(locations[1].name);
    }
  }, []);
  
  // Notify parent component when route changes
  useEffect(() => {
    if (startLocation && endLocation) {
      const startCoords = getCoordinates(startLocation);
      const endCoords = getCoordinates(endLocation);
      const waypointCoords = waypoints.map(wp => getCoordinates(wp));
      
      onRouteChange?.(startCoords, endCoords, waypointCoords);
    }
  }, [startLocation, endLocation, waypoints, onRouteChange]);
  
  const handleAddWaypoint = () => {
    if (waypoints.length < 3) {
      // Find locations not already used
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
    
    // Simulate optimization process
    setTimeout(() => {
      const startCoords = getCoordinates(startLocation);
      const endCoords = getCoordinates(endLocation);
      const waypointCoords = waypoints.map(wp => getCoordinates(wp));
      
      // Original route for comparison
      const originalRoute = [startCoords, ...waypointCoords, endCoords];
      const originalDistance = calculateRouteTotalDistance(originalRoute);
      const originalTime = estimateTravelTime(originalDistance);
      
      // Simulated optimized route with minor improvements
      const optimizedRoute = generateRandomRoute(startCoords, endCoords, waypointCoords.length);
      const optimizedDistance = calculateRouteTotalDistance(optimizedRoute) * 0.85; // 15% distance reduction
      const optimizedTime = estimateTravelTime(optimizedDistance) * 0.8; // 20% time reduction
      
      // Calculate risk score
      const riskFactors = generateRiskFactors(optimizedRoute);
      const riskScore = calculateRiskScore(riskFactors);
      
      // Simulate fuel calculations (very simplified)
      const avgFuelConsumptionPerKm = 0.3; // liters per km
      const originalFuel = originalDistance * avgFuelConsumptionPerKm;
      const optimizedFuel = optimizedDistance * avgFuelConsumptionPerKm;
      
      setOptimizationResult({
        distance: optimizedDistance,
        time: optimizedTime,
        fuelUsage: optimizedFuel,
        riskScore: riskScore,
        fuelSavings: originalFuel - optimizedFuel,
        timeSavings: originalTime - optimizedTime
      });
      
      setIsOptimizing(false);
      
      // Notify the change
      onRouteChange?.(startCoords, endCoords, waypointCoords);
      
      toast.success('Route optimized successfully');
    }, 1500);
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
            {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
          </Button>
        </div>
        
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
