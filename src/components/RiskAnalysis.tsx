import React, { useState, useEffect } from 'react';
import { 
  ShieldAlertIcon, 
  CloudRainIcon, 
  ShieldIcon, 
  RadarIcon, 
  CarIcon, 
  LandmarkIcon 
} from 'lucide-react';
import { 
  generateRiskFactors, 
  RiskFactor, 
  calculateRiskScore, 
  getRiskLevel, 
  getRiskColor,
  analyzeRouteWithNLP,
  generateRecommendations
} from '@/utils/riskAnalysisUtils';
import AnimatedTransition from './AnimatedTransition';

interface RiskAnalysisProps {
  route: Array<[number, number]>;
  startLocation: string;
  endLocation: string;
  className?: string;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ 
  route,
  startLocation = 'Starting Point',
  endLocation = 'Destination',
  className = ''
}) => {
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [riskScore, setRiskScore] = useState(0);
  const [riskSummary, setRiskSummary] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  useEffect(() => {
    if (route.length > 1) {
      // Generate risk factors based on the route
      const factors = generateRiskFactors(route);
      setRiskFactors(factors);
      
      // Calculate overall risk score
      const score = calculateRiskScore(factors);
      setRiskScore(score);
      
      // Generate NLP summary
      const summary = analyzeRouteWithNLP(startLocation, endLocation, factors);
      setRiskSummary(summary);
      
      // Generate recommendations
      const recs = generateRecommendations(factors);
      setRecommendations(recs);
    }
  }, [route, startLocation, endLocation]);
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weather':
        return <CloudRainIcon size={16} />;
      case 'security':
        return <ShieldIcon size={16} />;
      case 'infrastructure':
        return <RadarIcon size={16} />;
      case 'traffic':
        return <CarIcon size={16} />;
      case 'political':
        return <LandmarkIcon size={16} />;
      default:
        return <ShieldAlertIcon size={16} />;
    }
  };
  
  const riskLevel = getRiskLevel(riskScore);
  const levelColor = getRiskColor(riskLevel).split(' ')[0]; // Extract only the bg color class
  
  const categories = Array.from(new Set(riskFactors.map(r => r.category)));
  const filteredRiskFactors = activeCategory
    ? riskFactors.filter(r => r.category === activeCategory)
    : riskFactors;
  
  return (
    <AnimatedTransition className={`panel p-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-convoy-text">
        <ShieldAlertIcon size={20} />
        Risk Analysis
      </h2>
      
      <div className="mb-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
          <h3 className="font-medium text-convoy-text mb-2">Route Risk Summary</h3>
          <p className="text-sm text-gray-600">{riskSummary}</p>
          
          <div className="mt-4 flex items-center gap-3">
            <div className="bg-gray-100 rounded-full h-2 flex-1 overflow-hidden">
              <div 
                className={`h-full ${levelColor}`} 
                style={{ width: `${riskScore}%` }}
              ></div>
            </div>
            <div className={`convoy-badge ${getRiskColor(riskLevel)}`}>
              {riskLevel.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Risk Factor Categories */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors
            ${activeCategory === null
              ? 'bg-convoy-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          onClick={() => setActiveCategory(null)}
        >
          All Risks
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors
              ${activeCategory === category
                ? 'bg-convoy-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            onClick={() => setActiveCategory(category)}
          >
            {getCategoryIcon(category)}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Risk Factors */}
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
        {filteredRiskFactors.map((factor, index) => (
          <AnimatedTransition 
            key={factor.id} 
            className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-100 shadow-sm transition-all hover:shadow-md"
            delay={index * 100}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {getCategoryIcon(factor.category)}
                </div>
                <div>
                  <h4 className="font-medium text-convoy-text">{factor.name}</h4>
                  <p className="text-xs text-gray-500">{factor.category}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="inline-block px-2 py-0.5 rounded bg-gray-100 text-xs font-medium text-gray-700">
                  Impact: {factor.impact}/100
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-2">{factor.description}</p>
            
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Probability</span>
                <span>{factor.probability}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-1.5 w-full overflow-hidden">
                <div 
                  className="bg-convoy-primary h-full"
                  style={{ width: `${factor.probability}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-3 text-xs border-t border-gray-100 pt-2">
              <span className="font-medium text-gray-700">Mitigation:</span>
              <span className="text-gray-600 ml-1">{factor.mitigation}</span>
            </div>
          </AnimatedTransition>
        ))}
        
        {filteredRiskFactors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No risk factors found for the selected category.
          </div>
        )}
      </div>
      
      {/* Recommendations */}
      <div className="mt-6">
        <h3 className="font-medium text-convoy-text mb-3">Recommendations</h3>
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-convoy-primary/10 text-convoy-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default RiskAnalysis;
