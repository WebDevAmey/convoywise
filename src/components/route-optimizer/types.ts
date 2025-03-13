
export interface RouteAlternative {
  distance: number;
  time: number;
  riskScore: number;
  routeIndex: number;
  route?: Array<[number, number]>;
}

export interface OptimizationResultType {
  distance: number;
  time: number;
  fuelUsage: number;
  riskScore: number;
  fuelSavings: number;
  timeSavings: number;
}

export interface RouteOptimizerProps {
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
