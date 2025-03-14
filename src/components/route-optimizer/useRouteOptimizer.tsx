
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  getSampleLocations, 
  calculateRouteTotalDistance, 
  estimateTravelTime,
  generateAlternativeRoutes
} from '@/utils/mapUtils';
import { generateRiskFactors, calculateRiskScore } from '@/utils/riskAnalysisUtils';
import { RouteAlternative, OptimizationResultType, AvoidOptions, ConvoySize } from './types';

export function useRouteOptimizer(onRouteChange?: (
  startPoint: [number, number], 
  endPoint: [number, number], 
  waypoints: Array<[number, number]>,
  safetyPreference?: number,
  selectedRouteIndex?: number,
  avoidBridges?: boolean,
  convoySize?: string,
  avoidOptions?: AvoidOptions
) => void) {
  const locations = getSampleLocations();
  
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [safetyPreference, setSafetyPreference] = useState(50);
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
    // Update avoidBridges when avoidOptions.bridges changes
    setAvoidBridges(avoidOptions.bridges);
  }, [avoidOptions.bridges]);
  
  useEffect(() => {
    if (startLocation && endLocation) {
      const startCoords = getCoordinates(startLocation);
      const endCoords = getCoordinates(endLocation);
      const waypointCoords = waypoints.map(wp => getCoordinates(wp));
      
      onRouteChange?.(
        startCoords, 
        endCoords, 
        waypointCoords, 
        safetyPreference, 
        selectedRouteIndex, 
        avoidBridges,
        convoySize,
        avoidOptions
      );
    }
  }, [
    startLocation, 
    endLocation, 
    waypoints, 
    safetyPreference, 
    selectedRouteIndex, 
    avoidBridges, 
    convoySize, 
    avoidOptions, 
    onRouteChange
  ]);
  
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
        
        // Apply convoy size impact on speed
        let speedFactor = 1.0;
        switch(convoySize) {
          case 'small': speedFactor = 1.0; break;
          case 'medium': speedFactor = 0.95; break;
          case 'large': speedFactor = 0.9; break;
          case 'extra-large': speedFactor = 0.85; break;
          case 'massive': speedFactor = 0.75; break;
        }
        
        // Apply avoidance options impact on speed and risk
        if (avoidOptions.bridges) speedFactor *= 0.95;
        if (avoidOptions.hillTerrain) speedFactor *= 0.9;
        if (avoidOptions.urbanAreas) speedFactor *= 0.85;
        if (avoidOptions.waterCrossings) speedFactor *= 0.95;
        if (avoidOptions.narrowRoads) speedFactor *= 0.9;
        if (avoidOptions.unpavedRoads) speedFactor *= 0.8;
        
        const baseSpeed = safetyPreference < 30 ? 70 : 60;
        const time = estimateTravelTime(distance, baseSpeed * speedFactor);
        
        const riskFactors = generateRiskFactors(route);
        let riskScore = calculateRiskScore(riskFactors);
        
        // Apply avoidance options impact on risk score
        if (avoidOptions.bridges) riskScore *= 0.8;
        if (avoidOptions.hillTerrain) riskScore *= 0.85;
        if (avoidOptions.urbanAreas) riskScore *= 0.7;
        if (avoidOptions.waterCrossings) riskScore *= 0.8;
        if (avoidOptions.narrowRoads) riskScore *= 0.9;
        if (avoidOptions.unpavedRoads) riskScore *= 0.85;
        
        return {
          route,
          distance,
          time,
          riskScore,
          routeIndex: index
        };
      });
      
      const sortedRoutes = [...routesWithMetrics].sort((a, b) => {
        // Calculate total avoidance factor
        const avoidFactorCount = Object.values(avoidOptions).filter(Boolean).length;
        const avoidFactor = avoidFactorCount > 0 ? 0.1 * avoidFactorCount : 0;
        
        // Combine safety preference with avoidance factors
        const effectiveSafetyWeight = (safetyPreference / 100) + avoidFactor;
        const speedWeight = 1 - effectiveSafetyWeight;
        
        const aScore = (a.riskScore * effectiveSafetyWeight) + (a.time * speedWeight);
        const bScore = (b.riskScore * effectiveSafetyWeight) + (b.time * speedWeight);
        
        return aScore - bScore;
      });
      
      setSelectedRouteIndex(sortedRoutes[0].routeIndex);
      setAlternativeRoutes(sortedRoutes);
      
      const bestRoute = sortedRoutes[0];
      
      // Consider convoy size for fuel consumption
      let fuelFactor = 1.0;
      switch(convoySize) {
        case 'small': fuelFactor = 0.8; break;
        case 'medium': fuelFactor = 1.0; break;
        case 'large': fuelFactor = 1.3; break;
        case 'extra-large': fuelFactor = 1.6; break;
        case 'massive': fuelFactor = 2.0; break;
      }
      
      const avgFuelConsumptionPerKm = 0.3 * fuelFactor;
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
      
      onRouteChange?.(
        startCoords, 
        endCoords, 
        waypointCoords, 
        safetyPreference, 
        sortedRoutes[0].routeIndex, 
        avoidBridges, 
        convoySize,
        avoidOptions
      );
      
      toast.success('Route optimized successfully');
    }, 1500);
  };
  
  const handleRouteSelection = (routeIndex: number) => {
    setSelectedRouteIndex(routeIndex);
    
    if (startLocation && endLocation) {
      const startCoords = getCoordinates(startLocation);
      const endCoords = getCoordinates(endLocation);
      const waypointCoords = waypoints.map(wp => getCoordinates(wp));
      
      onRouteChange?.(
        startCoords, 
        endCoords, 
        waypointCoords, 
        safetyPreference, 
        routeIndex, 
        avoidBridges,
        convoySize,
        avoidOptions
      );
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
    convoySize,
    avoidOptions,
    alternativeRoutes,
    selectedRouteIndex,
    optimizationResult,
    setStartLocation,
    setEndLocation,
    setSafetyPreference,
    setAvoidBridges,
    setConvoySize,
    setAvoidOptions,
    handleAddWaypoint,
    handleRemoveWaypoint,
    handleWaypointChange,
    handleOptimizeRoute,
    handleRouteSelection
  };
}
