
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  getSampleLocations, 
  calculateRouteTotalDistance, 
  estimateTravelTime,
  generateAlternativeRoutes
} from '@/utils/mapUtils';
import { generateRiskFactors, calculateRiskScore } from '@/utils/riskAnalysisUtils';
import { RouteAlternative, OptimizationResultType } from './types';

export function useRouteOptimizer(onRouteChange?: (
  startPoint: [number, number], 
  endPoint: [number, number], 
  waypoints: Array<[number, number]>,
  safetyPreference?: number,
  selectedRouteIndex?: number,
  avoidBridges?: boolean
) => void) {
  const locations = getSampleLocations();
  
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [safetyPreference, setSafetyPreference] = useState(50);
  const [avoidBridges, setAvoidBridges] = useState(false);
  const [alternativeRoutes, setAlternativeRoutes] = useState<RouteAlternative[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResultType | null>(null);
  
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
  
  const getCoordinates = (locationName: string): [number, number] => {
    const location = locations.find(loc => loc.name === locationName);
    return location ? location.coordinates as [number, number] : [0, 0];
  };
  
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
  
  const handleWaypointChange = (index: number, value: string) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index] = value;
    setWaypoints(newWaypoints);
  };
  
  return {
    startLocation,
    endLocation,
    waypoints,
    isOptimizing,
    safetyPreference,
    avoidBridges,
    alternativeRoutes,
    selectedRouteIndex,
    optimizationResult,
    setStartLocation,
    setEndLocation,
    setSafetyPreference,
    setAvoidBridges,
    handleAddWaypoint,
    handleRemoveWaypoint,
    handleWaypointChange,
    handleOptimizeRoute,
    handleRouteSelection
  };
}
