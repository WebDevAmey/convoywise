
import React from 'react';
import AnimatedTransition from '@/components/AnimatedTransition';
import RouteOptionControls from './RouteOptionControls';
import RouteAlternatives from './RouteAlternatives';
import OptimizationResults from './OptimizationResults';
import { useRouteOptimizer } from './useRouteOptimizer';
import { RouteOptimizerProps } from './types';

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ 
  onRouteChange,
  className = ''
}) => {
  const {
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
  } = useRouteOptimizer(onRouteChange);

  return (
    <AnimatedTransition className={`panel p-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-4 text-convoy-text">Route Optimizer</h2>
      
      <RouteOptionControls
        startLocation={startLocation}
        endLocation={endLocation}
        waypoints={waypoints}
        safetyPreference={safetyPreference}
        avoidBridges={avoidBridges}
        isOptimizing={isOptimizing}
        onStartLocationChange={setStartLocation}
        onEndLocationChange={setEndLocation}
        onWaypointChange={handleWaypointChange}
        onAddWaypoint={handleAddWaypoint}
        onRemoveWaypoint={handleRemoveWaypoint}
        onSafetyPreferenceChange={setSafetyPreference}
        onAvoidBridgesChange={setAvoidBridges}
        onOptimizeRoute={handleOptimizeRoute}
      />
      
      <RouteAlternatives
        routes={alternativeRoutes}
        selectedRouteIndex={selectedRouteIndex}
        onRouteSelection={handleRouteSelection}
        safetyPreference={safetyPreference}
      />
      
      <OptimizationResults result={optimizationResult} />
    </AnimatedTransition>
  );
};

export default RouteOptimizer;
