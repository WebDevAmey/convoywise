
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  CalculatorIcon, 
  RefreshCcwIcon,
  ZapIcon, 
  ShieldIcon,
  AnchorIcon,
  TruckIcon,
  MountainIcon,
  BuildingIcon,
  WavesIcon,
  RoadIcon,
  SplitIcon
} from 'lucide-react';
import { getSampleLocations } from '@/utils/mapUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AvoidOptions, ConvoySize } from './types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ConvoyPlannerFormProps {
  startLocation: string;
  endLocation: string;
  convoySize: ConvoySize;
  safetyPreference: number;
  avoidOptions: AvoidOptions;
  isOptimizing: boolean;
  onStartLocationChange: (value: string) => void;
  onEndLocationChange: (value: string) => void;
  onConvoySizeChange: (value: ConvoySize) => void;
  onSafetyPreferenceChange: (value: number) => void;
  onAvoidOptionsChange: (options: AvoidOptions) => void;
  onOptimizeRoute: () => void;
}

const ConvoyPlannerForm: React.FC<ConvoyPlannerFormProps> = ({
  startLocation,
  endLocation,
  convoySize,
  safetyPreference,
  avoidOptions,
  isOptimizing,
  onStartLocationChange,
  onEndLocationChange,
  onConvoySizeChange,
  onSafetyPreferenceChange,
  onAvoidOptionsChange,
  onOptimizeRoute
}) => {
  const locations = getSampleLocations();
  
  const handleAvoidOptionChange = (option: keyof AvoidOptions, checked: boolean) => {
    onAvoidOptionsChange({
      ...avoidOptions,
      [option]: checked
    });
  };

  const convoyOptions: { value: ConvoySize; label: string; description: string }[] = [
    { value: 'small', label: 'Small', description: '1-3 vehicles' },
    { value: 'medium', label: 'Medium', description: '4-7 vehicles' },
    { value: 'large', label: 'Large', description: '8-12 vehicles' },
    { value: 'extra-large', label: 'Extra Large', description: '13-20 vehicles' },
    { value: 'massive', label: 'Massive', description: '21+ vehicles' },
  ];

  return (
    <div className="space-y-6 bg-background p-5 rounded-lg border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-location" className="text-sm font-medium mb-1.5 block">
            Start Location
          </Label>
          <Select value={startLocation} onValueChange={onStartLocationChange}>
            <SelectTrigger id="start-location" className="w-full">
              <SelectValue placeholder="Select start location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={`start-${loc.name}`} value={loc.name}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="end-location" className="text-sm font-medium mb-1.5 block">
            Destination
          </Label>
          <Select value={endLocation} onValueChange={onEndLocationChange}>
            <SelectTrigger id="end-location" className="w-full">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={`end-${loc.name}`} value={loc.name}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium mb-3 block">Convoy Size</Label>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {convoyOptions.map((option) => (
            <div
              key={option.value}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all 
                ${convoySize === option.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/20'}`}
              onClick={() => onConvoySizeChange(option.value)}
            >
              <TruckIcon 
                size={24} 
                className={convoySize === option.value ? 'text-primary' : 'text-muted-foreground'} 
              />
              <div className="text-sm font-medium mt-2">{option.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium mb-3 block">Route Optimization Priority</Label>
        <div className="bg-card p-4 rounded-lg border border-border">
          <Tabs defaultValue={safetyPreference < 50 ? "speed" : "safety"} onValueChange={(value) => {
            onSafetyPreferenceChange(value === "speed" ? 20 : 80);
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="speed" className="flex gap-2 items-center">
                <ZapIcon size={16} className="text-warning" />
                <span>Prioritize Speed</span>
              </TabsTrigger>
              <TabsTrigger value="safety" className="flex gap-2 items-center">
                <ShieldIcon size={16} className="text-primary" />
                <span>Prioritize Safety</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="speed" className="mt-3 text-sm text-muted-foreground">
              Optimizing for the fastest route. This may include higher risk areas.
            </TabsContent>
            <TabsContent value="safety" className="mt-3 text-sm text-muted-foreground">
              Optimizing for the safest route. This may increase travel time.
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium mb-3 block">Avoid Options</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="avoid-bridges" 
              checked={avoidOptions.bridges}
              onCheckedChange={(checked) => handleAvoidOptionChange('bridges', checked === true)}
            />
            <Label
              htmlFor="avoid-bridges"
              className="text-sm flex items-center gap-1.5"
            >
              <AnchorIcon size={14} className="text-primary" />
              Bridges
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="avoid-hill-terrain" 
              checked={avoidOptions.hillTerrain}
              onCheckedChange={(checked) => handleAvoidOptionChange('hillTerrain', checked === true)}
            />
            <Label
              htmlFor="avoid-hill-terrain"
              className="text-sm flex items-center gap-1.5"
            >
              <MountainIcon size={14} className="text-primary" />
              Hill Terrain
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="avoid-urban-areas" 
              checked={avoidOptions.urbanAreas}
              onCheckedChange={(checked) => handleAvoidOptionChange('urbanAreas', checked === true)}
            />
            <Label
              htmlFor="avoid-urban-areas"
              className="text-sm flex items-center gap-1.5"
            >
              <BuildingIcon size={14} className="text-primary" />
              Urban Areas
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="avoid-water-crossings" 
              checked={avoidOptions.waterCrossings}
              onCheckedChange={(checked) => handleAvoidOptionChange('waterCrossings', checked === true)}
            />
            <Label
              htmlFor="avoid-water-crossings"
              className="text-sm flex items-center gap-1.5"
            >
              <WavesIcon size={14} className="text-primary" />
              Water Crossings
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="avoid-narrow-roads" 
              checked={avoidOptions.narrowRoads}
              onCheckedChange={(checked) => handleAvoidOptionChange('narrowRoads', checked === true)}
            />
            <Label
              htmlFor="avoid-narrow-roads"
              className="text-sm flex items-center gap-1.5"
            >
              <SplitIcon size={14} className="text-primary" />
              Narrow Roads
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="avoid-unpaved-roads" 
              checked={avoidOptions.unpavedRoads}
              onCheckedChange={(checked) => handleAvoidOptionChange('unpavedRoads', checked === true)}
            />
            <Label
              htmlFor="avoid-unpaved-roads"
              className="text-sm flex items-center gap-1.5"
            >
              <RoadIcon size={14} className="text-primary" />
              Unpaved Roads
            </Label>
          </div>
        </div>
      </div>
      
      <Button
        variant="default"
        size="lg"
        className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90"
        onClick={onOptimizeRoute}
        disabled={!startLocation || !endLocation || isOptimizing}
      >
        {isOptimizing ? (
          <RefreshCcwIcon size={16} className="animate-spin" />
        ) : (
          <CalculatorIcon size={16} />
        )}
        {isOptimizing ? 'Calculating Optimal Route...' : 'Calculate Route'}
      </Button>
    </div>
  );
};

export default ConvoyPlannerForm;
