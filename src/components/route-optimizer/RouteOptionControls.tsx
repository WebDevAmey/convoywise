
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  PlusIcon, 
  TrashIcon, 
  CalculatorIcon, 
  RefreshCcwIcon,
  ZapIcon, 
  ShieldIcon,
  AnchorIcon
} from 'lucide-react';
import { getSampleLocations } from '@/utils/mapUtils';

interface RouteOptionControlsProps {
  startLocation: string;
  endLocation: string;
  waypoints: string[];
  safetyPreference: number;
  avoidBridges: boolean;
  isOptimizing: boolean;
  onStartLocationChange: (value: string) => void;
  onEndLocationChange: (value: string) => void;
  onWaypointChange: (index: number, value: string) => void;
  onAddWaypoint: () => void;
  onRemoveWaypoint: (index: number) => void;
  onSafetyPreferenceChange: (value: number) => void;
  onAvoidBridgesChange: (checked: boolean) => void;
  onOptimizeRoute: () => void;
}

const RouteOptionControls: React.FC<RouteOptionControlsProps> = ({
  startLocation,
  endLocation,
  waypoints,
  safetyPreference,
  avoidBridges,
  isOptimizing,
  onStartLocationChange,
  onEndLocationChange,
  onWaypointChange,
  onAddWaypoint,
  onRemoveWaypoint,
  onSafetyPreferenceChange,
  onAvoidBridgesChange,
  onOptimizeRoute
}) => {
  const locations = getSampleLocations();
  
  const getSafetySpeedPreferenceLabel = () => {
    if (safetyPreference < 25) return "Maximum Speed";
    if (safetyPreference < 40) return "Prioritize Speed";
    if (safetyPreference < 60) return "Balanced";
    if (safetyPreference < 80) return "Prioritize Safety";
    return "Maximum Safety";
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Location</label>
        <select
          value={startLocation}
          onChange={(e) => onStartLocationChange(e.target.value)}
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
          onChange={(e) => onEndLocationChange(e.target.value)}
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
              onChange={(e) => onWaypointChange(index, e.target.value)}
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
            onClick={() => onRemoveWaypoint(index)}
          >
            <TrashIcon size={18} className="text-gray-500" />
          </Button>
        </div>
      ))}
      
      <div className="flex items-center space-x-2 mt-1 mb-1">
        <Checkbox 
          id="avoidBridges" 
          checked={avoidBridges}
          onCheckedChange={(checked) => onAvoidBridgesChange(checked === true)}
        />
        <label
          htmlFor="avoidBridges"
          className="text-sm font-medium leading-none flex items-center gap-1.5 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          <AnchorIcon size={14} className="text-convoy-primary" />
          Avoid bridges (reduces risk, may increase travel time)
        </label>
      </div>
      
      <div className="pt-3 pb-1">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Route Preference: {getSafetySpeedPreferenceLabel()}
        </label>
        <div className="flex items-center gap-3">
          <ZapIcon size={18} className="text-convoy-warning" />
          <Slider
            value={[safetyPreference]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => onSafetyPreferenceChange(values[0])}
            className="flex-1"
          />
          <ShieldIcon size={18} className="text-convoy-primary" />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Speed</span>
          <span>Balanced</span>
          <span>Safety</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full sm:w-auto flex items-center gap-2"
          onClick={onAddWaypoint}
          disabled={waypoints.length >= 3}
        >
          <PlusIcon size={16} />
          Add Waypoint
        </Button>
        
        <Button
          variant="default"
          size="sm"
          className="w-full sm:w-auto flex items-center gap-2 bg-convoy-primary hover:bg-convoy-primary/90"
          onClick={onOptimizeRoute}
          disabled={!startLocation || !endLocation || isOptimizing}
        >
          {isOptimizing ? (
            <RefreshCcwIcon size={16} className="animate-spin" />
          ) : (
            <CalculatorIcon size={16} />
          )}
          {isOptimizing ? 'Optimizing...' : 'Calculate Routes'}
        </Button>
      </div>
    </div>
  );
};

export default RouteOptionControls;
