
import React from 'react';
import { ChevronRightIcon, ZapIcon, ShieldIcon } from 'lucide-react';
import { formatDuration } from '@/utils/mapUtils';
import { getRiskLevel, getRiskColor } from '@/utils/riskAnalysisUtils';
import { RouteAlternative } from './types';

interface RouteAlternativesProps {
  routes: RouteAlternative[];
  selectedRouteIndex: number;
  onRouteSelection: (routeIndex: number) => void;
  safetyPreference: number;
}

const RouteAlternatives: React.FC<RouteAlternativesProps> = ({
  routes,
  selectedRouteIndex,
  onRouteSelection,
  safetyPreference
}) => {
  if (routes.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-100 animate-fade-in">
      <h3 className="font-medium text-convoy-text mb-3 flex items-center gap-1.5">
        <RouteAlternativesIcon />
        Available Routes
      </h3>
      
      <div className="space-y-3">
        {routes.map((route, index) => {
          const riskLevel = getRiskLevel(route.riskScore);
          
          return (
            <button 
              key={`route-option-${index}`}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedRouteIndex === route.routeIndex
                  ? 'bg-convoy-primary/10 border-convoy-primary/30'
                  : 'bg-white hover:bg-gray-50 border-gray-100'
              }`}
              onClick={() => onRouteSelection(route.routeIndex)}
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
  );
};

// Helper component for the icon
const RouteAlternativesIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};

export default RouteAlternatives;
