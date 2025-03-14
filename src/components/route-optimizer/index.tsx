
import React from 'react';
import AnimatedTransition from '@/components/AnimatedTransition';
import RouteAlternatives from './RouteAlternatives';
import OptimizationResults from './OptimizationResults';
import { useRouteOptimizer } from './useRouteOptimizer';
import { RouteOptimizerProps } from './types';
import ConvoyPlannerForm from './ConvoyPlannerForm';

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
    convoySize,
    avoidOptions,
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
  } = useRouteOptimizer(onRouteChange);

  return (
    <AnimatedTransition className={`panel p-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-4 text-convoy-text">Convoy Route Planner</h2>
      
      <ConvoyPlannerForm
        startLocation={startLocation}
        endLocation={endLocation}
        convoySize={convoySize}
        safetyPreference={safetyPreference}
        avoidOptions={avoidOptions}
        isOptimizing={isOptimizing}
        onStartLocationChange={setStartLocation}
        onEndLocationChange={setEndLocation}
        onConvoySizeChange={setConvoySize}
        onSafetyPreferenceChange={setSafetyPreference}
        onAvoidOptionsChange={setAvoidOptions}
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
