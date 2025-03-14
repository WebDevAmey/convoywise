
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
    avoidBridges?: boolean,
    convoySize?: string,
    avoidOptions?: AvoidOptions
  ) => void;
  className?: string;
}

export interface AvoidOptions {
  bridges: boolean;
  hillTerrain: boolean;
  urbanAreas: boolean;
  waterCrossings: boolean;
  narrowRoads: boolean;
  unpavedRoads: boolean;
}

export type ConvoySize = 'small' | 'medium' | 'large' | 'extra-large' | 'massive';

