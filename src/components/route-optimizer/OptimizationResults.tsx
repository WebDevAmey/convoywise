
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from 'lucide-react';
import { formatDuration } from '@/utils/mapUtils';
import { getRiskLevel, getRiskColor } from '@/utils/riskAnalysisUtils';
import { OptimizationResultType } from './types';

interface OptimizationResultsProps {
  result: OptimizationResultType | null;
}

const OptimizationResults: React.FC<OptimizationResultsProps> = ({ result }) => {
  if (!result) return null;
  
  const getRiskLevelLabel = (score: number) => {
    const level = getRiskLevel(score);
    return (
      <span className={`convoy-badge ${getRiskColor(level)} px-2 py-1`}>
        {level.toUpperCase()}
      </span>
    );
  };
  
  return (
    <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-100 animate-fade-in">
      <h3 className="font-medium text-convoy-text mb-2">Optimization Results</h3>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Total Distance</p>
          <p className="font-medium">{result.distance.toFixed(1)} km</p>
        </div>
        
        <div>
          <p className="text-gray-500">Estimated Time</p>
          <p className="font-medium">{formatDuration(result.time)}</p>
        </div>
        
        <div>
          <p className="text-gray-500">Est. Fuel Usage</p>
          <p className="font-medium">{result.fuelUsage.toFixed(1)} L</p>
        </div>
        
        <div>
          <p className="text-gray-500">Risk Level</p>
          <p className="font-medium">{getRiskLevelLabel(result.riskScore)}</p>
        </div>
        
        <div className="col-span-2 mt-2 p-2 bg-green-50 rounded-lg border border-green-100">
          <p className="text-green-800 font-medium text-xs">Optimization Savings</p>
          <div className="flex justify-between mt-1 text-sm">
            <span>⏱️ {formatDuration(result.timeSavings)} saved</span>
            <span>🛢️ {result.fuelSavings.toFixed(1)} L saved</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <Button 
          variant="link" 
          size="sm" 
          className="text-convoy-primary p-0 h-auto text-sm font-medium"
        >
          View Detailed Report
          <ChevronRightIcon size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default OptimizationResults;
