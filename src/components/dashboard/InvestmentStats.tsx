
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';

const InvestmentStats = () => {
  // Mock data for sector distribution
  const sectorData = [
    { name: 'Tech', value: 45 },
    { name: 'Healthcare', value: 20 },
    { name: 'Fintech', value: 15 },
    { name: 'Education', value: 10 },
    { name: 'Others', value: 10 },
  ];
  
  // Mock data for performance chart
  const performanceData = [
    { month: 'Jan', value: 1000 },
    { month: 'Feb', value: 1500 },
    { month: 'Mar', value: 1300 },
    { month: 'Apr', value: 1800 },
    { month: 'May', value: 2000 },
    { month: 'Jun', value: 2500 },
  ];
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Investment Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Sector Distribution</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {sectorData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div style={{ backgroundColor: COLORS[index % COLORS.length] }} className="w-3 h-3 rounded-full"></div>
                <span>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Portfolio Performance</h4>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0A84FF" 
                  strokeWidth={2}
                  dot={{ stroke: '#0A84FF', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentStats;
