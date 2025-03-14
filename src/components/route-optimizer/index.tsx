
import React, { useState } from 'react';
import AnimatedTransition from '@/components/AnimatedTransition';
import RouteAlternatives from './RouteAlternatives';
import OptimizationResults from './OptimizationResults';
import { useRouteOptimizer } from './useRouteOptimizer';
import { RouteOptimizerProps } from './types';
import ConvoyChatInterface from './ConvoyChatInterface';

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ 
  onRouteChange,
  className = ''
}) => {
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  
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

  const handleOptimizeRouteWithCallback = () => {
    setOptimizationComplete(false);
    handleOptimizeRoute();
    // Set timeout to simulate route calculation completion
    setTimeout(() => {
      setOptimizationComplete(true);
    }, 2000);
  };

  return (
    <AnimatedTransition className={`panel h-full flex flex-col ${className}`}>
      <div className="flex-1 overflow-auto">
        <ConvoyChatInterface
          startLocation={startLocation}
          endLocation={endLocation}
          convoySize={convoySize}
          safetyPreference={safetyPreference}
          avoidOptions={avoidOptions}
          isOptimizing={isOptimizing}
          optimizationComplete={optimizationComplete}
          onStartLocationChange={setStartLocation}
          onEndLocationChange={setEndLocation}
          onConvoySizeChange={setConvoySize}
          onSafetyPreferenceChange={setSafetyPreference}
          onAvoidOptionsChange={setAvoidOptions}
          onOptimizeRoute={handleOptimizeRouteWithCallback}
        />
      </div>
      
      {optimizationComplete && alternativeRoutes.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <RouteAlternatives
            routes={alternativeRoutes}
            selectedRouteIndex={selectedRouteIndex}
            onRouteSelection={handleRouteSelection}
            safetyPreference={safetyPreference}
          />
          
          <OptimizationResults result={optimizationResult} />
        </div>
      )}
    </AnimatedTransition>
  );
};

export default RouteOptimizer;
