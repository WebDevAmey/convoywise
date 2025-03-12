
// Simulated data - in a real app, these would come from a real API
export const generateRandomRoute = (startPoint: [number, number], endPoint: [number, number], waypoints = 2): Array<[number, number]> => {
  const route: Array<[number, number]> = [startPoint];
  
  // Generate waypoints between start and end
  for (let i = 0; i < waypoints; i++) {
    const progress = (i + 1) / (waypoints + 1);
    
    // Linear interpolation with some randomness
    const lat = startPoint[0] + (endPoint[0] - startPoint[0]) * progress + (Math.random() - 0.5) * 0.1;
    const lng = startPoint[1] + (endPoint[1] - startPoint[1]) * progress + (Math.random() - 0.5) * 0.1;
    
    route.push([lat, lng]);
  }
  
  route.push(endPoint);
  return route;
};

export const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
  // Haversine formula to calculate distance between two points on a sphere (Earth)
  const toRadian = (degree: number) => degree * Math.PI / 180;
  const R = 6371; // Earth's radius in kilometers
  
  const lat1 = toRadian(point1[0]);
  const lon1 = toRadian(point1[1]);
  const lat2 = toRadian(point2[0]);
  const lon2 = toRadian(point2[1]);
  
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1) * Math.cos(lat2) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const calculateRouteTotalDistance = (route: Array<[number, number]>): number => {
  let totalDistance = 0;
  
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += calculateDistance(route[i], route[i + 1]);
  }
  
  return totalDistance;
};

export const estimateTravelTime = (distanceKm: number, avgSpeedKmh: number = 60): number => {
  return distanceKm / avgSpeedKmh; // Time in hours
};

export const formatDuration = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  
  return `${h}h ${m}m`;
};

export const getSampleLocations = () => [
  { name: "New York", coordinates: [40.7128, -74.0060] },
  { name: "Los Angeles", coordinates: [34.0522, -118.2437] },
  { name: "Chicago", coordinates: [41.8781, -87.6298] },
  { name: "Houston", coordinates: [29.7604, -95.3698] },
  { name: "Phoenix", coordinates: [33.4484, -112.0740] },
  { name: "San Antonio", coordinates: [29.4241, -98.4936] },
  { name: "San Diego", coordinates: [32.7157, -117.1611] },
  { name: "Dallas", coordinates: [32.7767, -96.7970] },
  { name: "San Jose", coordinates: [37.3382, -121.8863] },
  { name: "Austin", coordinates: [30.2672, -97.7431] },
];

export const getRandomRiskFactor = (): number => {
  return Math.random() * 100;
};

export interface RiskArea {
  center: [number, number];
  radius: number; // in km
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
}

export const getSampleRiskAreas = (): RiskArea[] => [
  {
    center: [39.8283, -98.5795],
    radius: 300,
    riskLevel: 'medium',
    description: 'Weather alert: Thunderstorms expected in this region'
  },
  {
    center: [37.7749, -122.4194],
    radius: 150,
    riskLevel: 'high',
    description: 'Traffic congestion due to construction work'
  },
  {
    center: [40.7128, -74.0060],
    radius: 200,
    riskLevel: 'low',
    description: 'Minor delay due to local event'
  },
];

export const findOptimalRoute = (start: [number, number], end: [number, number], riskAreas: RiskArea[]): Array<[number, number]> => {
  // This is a simplified example
  // In a real application, this would implement a proper routing algorithm like A*
  // that considers risk areas as obstacles or weighted zones
  
  // For demo purposes, we'll generate a route and then slightly modify it to avoid high-risk areas
  const baseRoute = generateRandomRoute(start, end, 3);
  let optimizedRoute = [...baseRoute];
  
  // Simple algorithm: For each high-risk area, check if any waypoint is inside it
  // If so, move the waypoint slightly away from the center of the risk area
  riskAreas.forEach(area => {
    if (area.riskLevel === 'high') {
      optimizedRoute = optimizedRoute.map(point => {
        const distance = calculateDistance(point, area.center);
        
        // If point is inside high-risk area
        if (distance < area.radius) {
          // Calculate direction from risk center to point
          const direction: [number, number] = [
            point[0] - area.center[0],
            point[1] - area.center[1]
          ];
          
          // Normalize direction
          const magnitude = Math.sqrt(direction[0]**2 + direction[1]**2);
          const normalized: [number, number] = magnitude === 0 
            ? [0, 0] 
            : [direction[0] / magnitude, direction[1] / magnitude];
          
          // Move point outside the risk area (plus some margin)
          const moveDistance = (area.radius - distance + 0.05) / 111; // rough conversion to degrees
          return [
            point[0] + normalized[0] * moveDistance,
            point[1] + normalized[1] * moveDistance
          ] as [number, number];
        }
        
        return point;
      });
    }
  });
  
  return optimizedRoute;
};
