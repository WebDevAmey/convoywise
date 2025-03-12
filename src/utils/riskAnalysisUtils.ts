import { calculateDistance } from "./mapUtils";

export interface RiskFactor {
  id: string;
  name: string;
  category: 'weather' | 'security' | 'infrastructure' | 'traffic' | 'political';
  icon: string;
  description: string;
  impact: number; // 0-100 scale
  probability: number; // 0-100 scale
  mitigation: string;
}

export const calculateRiskScore = (factors: RiskFactor[]): number => {
  if (factors.length === 0) return 0;
  
  let totalRisk = 0;
  
  for (const factor of factors) {
    // Risk score formula: impact * probability / 100 (to keep it in 0-100 range)
    totalRisk += (factor.impact * factor.probability) / 100;
  }
  
  // Average risk score across all factors
  return Math.min(100, totalRisk / factors.length);
};

export const getRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  if (score < 80) return 'high';
  return 'critical';
};

export const getRiskColor = (level: 'low' | 'medium' | 'high' | 'critical'): string => {
  switch (level) {
    case 'low': return 'bg-convoy-secondary text-white';
    case 'medium': return 'bg-convoy-warning text-convoy-text';
    case 'high': return 'bg-orange-500 text-white';
    case 'critical': return 'bg-convoy-danger text-white';
    default: return 'bg-gray-500 text-white';
  }
};

// Mock data generation for demo purposes
export const generateRiskFactors = (route: Array<[number, number]>): RiskFactor[] => {
  const weatherRisks = [
    { name: 'Heavy Rain', description: 'Precipitation exceeding 10mm/h expected along route', impact: 40, probability: 65, mitigation: 'Equip vehicles with all-weather tires and reduce speed in affected areas.' },
    { name: 'Strong Winds', description: 'Wind gusts exceeding 50km/h predicted', impact: 35, probability: 45, mitigation: 'Avoid high-sided vehicles or secure cargo with additional straps.' },
    { name: 'Extreme Heat', description: 'Temperatures exceeding 38°C forecasted', impact: 30, probability: 70, mitigation: 'Ensure cooling systems are operational and provide extra water supplies.' },
    { name: 'Fog Patches', description: 'Visibility reduced to less than 100m in some areas', impact: 55, probability: 30, mitigation: 'Reduce speed and maintain greater following distance between vehicles.' },
    { name: 'Snow/Ice', description: 'Road surface may be slippery due to freezing conditions', impact: 60, probability: 20, mitigation: 'Use winter tires and carry snow chains if available.' },
  ];
  
  const securityRisks = [
    { name: 'High Crime Area', description: 'Route passes through areas with elevated theft risk', impact: 50, probability: 40, mitigation: 'Implement additional security protocols and avoid overnight stops in these areas.' },
    { name: 'Cargo Theft Risk', description: 'Recent reports of cargo theft along this corridor', impact: 70, probability: 25, mitigation: 'Use tamper-evident seals and GPS tracking for high-value cargo.' },
    { name: 'Unauthorized Access', description: 'Potential unauthorized access to vehicles during stops', impact: 45, probability: 35, mitigation: 'Ensure all vehicles are secured when unattended and drivers remain vigilant.' },
    { name: 'Civil Unrest', description: 'Protests or demonstrations reported near route', impact: 65, probability: 20, mitigation: 'Monitor local news and prepare alternative routes if necessary.' },
  ];
  
  const infrastructureRisks = [
    { name: 'Poor Road Conditions', description: 'Road surface deterioration reported on segments of the route', impact: 40, probability: 60, mitigation: 'Reduce speed in affected areas and monitor vehicle suspension systems.' },
    { name: 'Bridge Weight Restrictions', description: 'Weight-limited bridges must be navigated', impact: 55, probability: 30, mitigation: 'Verify vehicle weights and consider alternative routes for heavier vehicles.' },
    { name: 'Construction Zones', description: 'Active construction may cause delays and lane closures', impact: 35, probability: 75, mitigation: 'Plan for extended transit times and follow all temporary traffic controls.' },
    { name: 'Limited Fuel Stations', description: 'Sparse availability of refueling points along route', impact: 45, probability: 40, mitigation: 'Ensure vehicles begin with full tanks and carry reserve fuel where appropriate.' },
  ];
  
  const trafficRisks = [
    { name: 'Heavy Congestion', description: 'High traffic volumes expected during transit hours', impact: 30, probability: 80, mitigation: 'Consider schedule adjustments to avoid peak traffic periods.' },
    { name: 'Accident Hotspot', description: 'Route includes segments with higher-than-average collision rates', impact: 60, probability: 35, mitigation: 'Maintain heightened awareness and reduced speed in these areas.' },
    { name: 'Limited Overtaking', description: 'Sections with restricted passing opportunities for larger vehicles', impact: 25, probability: 65, mitigation: 'Plan for slower average speeds and potential convoy separation.' },
  ];
  
  const politicalRisks = [
    { name: 'Border Crossing Delays', description: 'Extended processing times at border checkpoints', impact: 40, probability: 50, mitigation: 'Prepare all documentation in advance and monitor border waiting times.' },
    { name: 'Changing Regulations', description: 'Recent or pending changes to transportation regulations', impact: 35, probability: 45, mitigation: 'Ensure compliance with latest requirements and maintain documentation.' },
    { name: 'Local Restrictions', description: 'Municipal restrictions on commercial vehicle movement', impact: 30, probability: 55, mitigation: 'Verify route compliance with all local ordinances and time-of-day restrictions.' },
  ];
  
  const allRiskCategories = [
    { category: 'weather', risks: weatherRisks, icon: 'cloud-rain' },
    { category: 'security', risks: securityRisks, icon: 'shield' },
    { category: 'infrastructure', risks: infrastructureRisks, icon: 'road' },
    { category: 'traffic', risks: trafficRisks, icon: 'car' },
    { category: 'political', risks: politicalRisks, icon: 'landmark' },
  ];
  
  // For demo purposes, select a subset of risks
  const routeLength = route.reduce((total, point, index) => {
    if (index === 0) return 0;
    return total + calculateDistance(route[index - 1], point);
  }, 0);
  
  // More risks for longer routes
  const numRisks = Math.min(8, Math.max(3, Math.floor(routeLength / 100)));
  
  // Randomly select risks from different categories
  const selectedRisks: RiskFactor[] = [];
  for (let i = 0; i < numRisks; i++) {
    const categoryIndex = Math.floor(Math.random() * allRiskCategories.length);
    const category = allRiskCategories[categoryIndex];
    
    const riskIndex = Math.floor(Math.random() * category.risks.length);
    const risk = category.risks[riskIndex];
    
    // Avoid duplicates
    if (!selectedRisks.find(r => r.name === risk.name)) {
      selectedRisks.push({
        id: `risk-${i}-${Date.now()}`,
        name: risk.name,
        category: category.category as any,
        icon: category.icon,
        description: risk.description,
        impact: risk.impact,
        probability: risk.probability,
        mitigation: risk.mitigation
      });
    }
  }
  
  return selectedRisks;
};

// Natural language processing mock function
// In a real application, this would use a proper NLP library or API
export const analyzeRouteWithNLP = (startLocation: string, endLocation: string, riskFactors: RiskFactor[]): string => {
  const riskScore = calculateRiskScore(riskFactors);
  const riskLevel = getRiskLevel(riskScore);
  
  // Count risks by category
  const categoryCounts: Record<string, number> = {};
  riskFactors.forEach(risk => {
    categoryCounts[risk.category] = (categoryCounts[risk.category] || 0) + 1;
  });
  
  // Find the top risk category
  let topCategory = 'none';
  let topCount = 0;
  
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > topCount) {
      topCategory = category;
      topCount = count;
    }
  });
  
  // Find the highest impact risk
  let highestImpactRisk = riskFactors[0] || { name: 'none', impact: 0 };
  riskFactors.forEach(risk => {
    if (risk.impact > highestImpactRisk.impact) {
      highestImpactRisk = risk;
    }
  });
  
  // Generate natural language summary
  const summaries = {
    low: `The route from ${startLocation} to ${endLocation} presents minimal risk concerns. The primary consideration is ${highestImpactRisk.name.toLowerCase()}, but overall transit conditions are favorable.`,
    
    medium: `Your journey from ${startLocation} to ${endLocation} shows moderate risk levels, with ${topCategory} factors being the most prevalent. Pay particular attention to ${highestImpactRisk.name.toLowerCase()}, which presents the highest potential impact.`,
    
    high: `Caution is strongly advised for the ${startLocation} to ${endLocation} route. Significant ${topCategory} risks have been identified, especially ${highestImpactRisk.name.toLowerCase()}. Consider implementing all recommended mitigation strategies before proceeding.`,
    
    critical: `WARNING: The route from ${startLocation} to ${endLocation} presents critical risk levels. Multiple high-impact factors have been identified, predominantly in the ${topCategory} category. The ${highestImpactRisk.name.toLowerCase()} risk is particularly severe. Route reconsideration is advised.`
  };
  
  return summaries[riskLevel] || summaries.medium;
};

// Function to generate recommendations based on risk factors
export const generateRecommendations = (riskFactors: RiskFactor[]): string[] => {
  const recommendations: string[] = [];
  
  // Basic recommendations that always apply
  recommendations.push(
    "Ensure all drivers have been briefed on identified risk factors",
    "Maintain regular communication checkpoints throughout the journey"
  );
  
  // Add specific recommendations based on risk categories present
  const categories = new Set(riskFactors.map(r => r.category));
  
  if (categories.has('weather')) {
    recommendations.push(
      "Check weather forecasts immediately before departure and at regular intervals",
      "Equip vehicles with appropriate weather contingency supplies"
    );
  }
  
  if (categories.has('security')) {
    recommendations.push(
      "Implement enhanced security protocols for vehicle and cargo",
      "Brief drivers on security awareness and incident reporting procedures"
    );
  }
  
  if (categories.has('infrastructure')) {
    recommendations.push(
      "Verify route accessibility for all vehicle types in the convoy",
      "Prepare for potential detours around infrastructure limitations"
    );
  }
  
  if (categories.has('traffic')) {
    recommendations.push(
      "Consider adjusting departure times to avoid peak congestion periods",
      "Maintain flexible scheduling to accommodate unexpected delays"
    );
  }
  
  if (categories.has('political')) {
    recommendations.push(
      "Ensure all cross-border documentation is current and accessible",
      "Verify compliance with all regional regulations along the route"
    );
  }
  
  // Add recommendations for high impact risks
  const highImpactRisks = riskFactors.filter(r => r.impact > 50);
  highImpactRisks.forEach(risk => {
    recommendations.push(risk.mitigation);
  });
  
  // Deduplicate and return
  return [...new Set(recommendations)];
};
