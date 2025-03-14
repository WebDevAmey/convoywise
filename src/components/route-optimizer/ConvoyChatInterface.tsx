
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TruckIcon, SendIcon } from 'lucide-react';
import { ConvoySize, AvoidOptions } from './types';
import { getSampleLocations } from '@/utils/mapUtils';

interface Message {
  role: 'system' | 'user';
  content: React.ReactNode;
}

interface ConvoyChatInterfaceProps {
  startLocation: string;
  endLocation: string;
  convoySize: ConvoySize;
  safetyPreference: number;
  avoidOptions: AvoidOptions;
  isOptimizing: boolean;
  optimizationComplete: boolean;
  onStartLocationChange: (value: string) => void;
  onEndLocationChange: (value: string) => void;
  onConvoySizeChange: (value: ConvoySize) => void;
  onSafetyPreferenceChange: (value: number) => void;
  onAvoidOptionsChange: (options: AvoidOptions) => void;
  onOptimizeRoute: () => void;
}

const ConvoyChatInterface: React.FC<ConvoyChatInterfaceProps> = ({
  startLocation,
  endLocation,
  convoySize,
  safetyPreference,
  avoidOptions,
  isOptimizing,
  optimizationComplete,
  onStartLocationChange,
  onEndLocationChange,
  onConvoySizeChange,
  onSafetyPreferenceChange,
  onAvoidOptionsChange,
  onOptimizeRoute
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState<'start' | 'end' | 'size' | 'priority' | 'avoid' | 'done'>('start');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const locations = getSampleLocations();

  // Initial system message when component loads
  useEffect(() => {
    setMessages([
      {
        role: 'system',
        content: (
          <div>
            <p>Welcome to ConvoyWise Planner. Let's plan your convoy route.</p>
            <p className="mt-2">What is your <strong>starting location</strong>?</p>
            <div className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                {locations.slice(0, 4).map((loc) => (
                  <Button 
                    key={loc.name} 
                    variant="outline" 
                    size="sm" 
                    className="justify-start"
                    onClick={() => handleLocationSelect(loc.name)}
                  >
                    {loc.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )
      }
    ]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    if (currentStep === 'start') {
      onStartLocationChange(location);
      setMessages([
        ...messages,
        { role: 'user', content: `Starting from: ${location}` },
        { 
          role: 'system', 
          content: (
            <div>
              <p>Great! Now, what is your <strong>destination</strong>?</p>
              <div className="mt-3">
                <div className="grid grid-cols-2 gap-2">
                  {locations
                    .filter(loc => loc.name !== location)
                    .slice(0, 4)
                    .map((loc) => (
                      <Button 
                        key={loc.name} 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => handleDestinationSelect(loc.name)}
                      >
                        {loc.name}
                      </Button>
                    ))}
                </div>
              </div>
            </div>
          )
        }
      ]);
      setCurrentStep('end');
      setCurrentInput('');
    }
  };

  // Handle destination selection
  const handleDestinationSelect = (location: string) => {
    onEndLocationChange(location);
    setMessages([
      ...messages,
      { role: 'user', content: `Destination: ${location}` },
      { 
        role: 'system', 
        content: (
          <div>
            <p>What <strong>size</strong> is your convoy?</p>
            <div className="mt-3">
              <RadioGroup
                value={convoySize}
                onValueChange={(value) => handleConvoySizeSelect(value as ConvoySize)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="convoy-small" />
                  <Label htmlFor="convoy-small" className="flex items-center gap-2">
                    <TruckIcon size={14} /> Small (1-3 vehicles)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="convoy-medium" />
                  <Label htmlFor="convoy-medium" className="flex items-center gap-2">
                    <TruckIcon size={16} /> Medium (4-7 vehicles)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="convoy-large" />
                  <Label htmlFor="convoy-large" className="flex items-center gap-2">
                    <TruckIcon size={18} /> Large (8-12 vehicles)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="extra-large" id="convoy-xl" />
                  <Label htmlFor="convoy-xl" className="flex items-center gap-2">
                    <TruckIcon size={20} /> Extra Large (13-20 vehicles)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="massive" id="convoy-massive" />
                  <Label htmlFor="convoy-massive" className="flex items-center gap-2">
                    <TruckIcon size={22} /> Massive (21+ vehicles)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        ) 
      }
    ]);
    setCurrentStep('size');
  };

  // Handle convoy size selection
  const handleConvoySizeSelect = (size: ConvoySize) => {
    onConvoySizeChange(size);
    
    const sizeLabel = {
      'small': 'Small (1-3 vehicles)',
      'medium': 'Medium (4-7 vehicles)',
      'large': 'Large (8-12 vehicles)',
      'extra-large': 'Extra Large (13-20 vehicles)',
      'massive': 'Massive (21+ vehicles)'
    }[size];

    setMessages([
      ...messages,
      { role: 'user', content: `Convoy size: ${sizeLabel}` },
      { 
        role: 'system', 
        content: (
          <div>
            <p>What's your <strong>priority</strong> for this route?</p>
            <div className="mt-3">
              <RadioGroup
                value={safetyPreference < 50 ? "speed" : "safety"}
                onValueChange={(value) => handlePrioritySelect(value === "speed" ? 20 : 80)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="speed" id="priority-speed" />
                  <Label htmlFor="priority-speed">Optimize for speed (faster but potentially riskier)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="safety" id="priority-safety" />
                  <Label htmlFor="priority-safety">Optimize for safety (safer but potentially slower)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        ) 
      }
    ]);
    setCurrentStep('priority');
  };

  // Handle priority selection
  const handlePrioritySelect = (safetyValue: number) => {
    onSafetyPreferenceChange(safetyValue);
    const priorityLabel = safetyValue < 50 ? "Optimize for speed" : "Optimize for safety";
    
    setMessages([
      ...messages,
      { role: 'user', content: priorityLabel },
      { 
        role: 'system', 
        content: (
          <div>
            <p>Are there any <strong>terrain or infrastructure types</strong> you'd like to avoid?</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="avoid-bridges" 
                  checked={avoidOptions.bridges}
                  onCheckedChange={(checked) => handleAvoidOptionChange('bridges', checked === true)}
                />
                <Label htmlFor="avoid-bridges">Bridges</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="avoid-hill-terrain" 
                  checked={avoidOptions.hillTerrain}
                  onCheckedChange={(checked) => handleAvoidOptionChange('hillTerrain', checked === true)}
                />
                <Label htmlFor="avoid-hill-terrain">Hill Terrain</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="avoid-urban-areas" 
                  checked={avoidOptions.urbanAreas}
                  onCheckedChange={(checked) => handleAvoidOptionChange('urbanAreas', checked === true)}
                />
                <Label htmlFor="avoid-urban-areas">Urban Areas</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="avoid-water-crossings" 
                  checked={avoidOptions.waterCrossings}
                  onCheckedChange={(checked) => handleAvoidOptionChange('waterCrossings', checked === true)}
                />
                <Label htmlFor="avoid-water-crossings">Water Crossings</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="avoid-narrow-roads" 
                  checked={avoidOptions.narrowRoads}
                  onCheckedChange={(checked) => handleAvoidOptionChange('narrowRoads', checked === true)}
                />
                <Label htmlFor="avoid-narrow-roads">Narrow Roads</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="avoid-unpaved-roads" 
                  checked={avoidOptions.unpavedRoads}
                  onCheckedChange={(checked) => handleAvoidOptionChange('unpavedRoads', checked === true)}
                />
                <Label htmlFor="avoid-unpaved-roads">Unpaved Roads</Label>
              </div>
              
              <Button
                className="mt-2 w-full"
                onClick={calculateRoute}
              >
                Calculate Optimal Route
              </Button>
            </div>
          </div>
        ) 
      }
    ]);
    setCurrentStep('avoid');
  };

  // Handle avoid option change
  const handleAvoidOptionChange = (option: keyof AvoidOptions, checked: boolean) => {
    onAvoidOptionsChange({
      ...avoidOptions,
      [option]: checked
    });
  };

  // Calculate route
  const calculateRoute = () => {
    // Create a list of avoided options
    const avoidedOptions = Object.entries(avoidOptions)
      .filter(([_, value]) => value)
      .map(([key, _]) => {
        switch(key) {
          case 'bridges': return 'Bridges';
          case 'hillTerrain': return 'Hill Terrain';
          case 'urbanAreas': return 'Urban Areas';
          case 'waterCrossings': return 'Water Crossings';
          case 'narrowRoads': return 'Narrow Roads';
          case 'unpavedRoads': return 'Unpaved Roads';
          default: return key;
        }
      });

    // Display user's avoid preferences
    setMessages([
      ...messages,
      { 
        role: 'user', 
        content: avoidedOptions.length > 0 
          ? `Avoiding: ${avoidedOptions.join(', ')}` 
          : "No special avoidance preferences" 
      },
      {
        role: 'system',
        content: (
          <div>
            <p>Calculating optimal route from <strong>{startLocation}</strong> to <strong>{endLocation}</strong>...</p>
            {isOptimizing && (
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-ping"></div>
                <p className="text-sm text-muted-foreground">Processing route data...</p>
              </div>
            )}
          </div>
        )
      }
    ]);
    
    setCurrentStep('done');
    onOptimizeRoute();
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    if (currentStep === 'start') {
      const validLocation = locations.find(loc => 
        loc.name.toLowerCase() === currentInput.toLowerCase()
      );
      
      if (validLocation) {
        handleLocationSelect(validLocation.name);
      } else {
        setMessages([
          ...messages,
          { role: 'user', content: currentInput },
          { 
            role: 'system', 
            content: "I couldn't find that location in our database. Please select from one of the suggested locations." 
          }
        ]);
      }
    }
    setCurrentInput('');
  };

  // Update messages when optimization completes
  useEffect(() => {
    if (currentStep === 'done' && !isOptimizing && optimizationComplete) {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          role: 'system',
          content: (
            <div>
              <p className="font-medium">Route optimization complete!</p>
              <p className="mt-1">The optimal route has been calculated and is displayed on the map. You can view the route details and alternatives in the panels below.</p>
              <p className="mt-2">Feel free to ask if you'd like to plan another route.</p>
            </div>
          )
        }
      ]);
    }
  }, [isOptimizing, optimizationComplete, currentStep]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-muted border border-border'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={currentInput}
            onChange={handleInputChange}
            placeholder={
              currentStep === 'start' 
                ? "Type a starting location..."
                : "Type your message..."
            }
            disabled={currentStep !== 'start' || isOptimizing}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={currentStep !== 'start' || !currentInput || isOptimizing}
          >
            <SendIcon size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ConvoyChatInterface;
