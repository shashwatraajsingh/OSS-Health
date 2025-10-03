import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const MetricsChart = ({ title, data }) => {
  return (
    <div className="metric-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      
      {/* Bar Chart */}
      <div className="mb-8">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value) => [`${value}`, 'Score']}
              labelStyle={{ color: '#374151' }}
            />
            <Bar 
              dataKey="score" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart */}
      <div>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
            />
            <Radar
              name="Health Score"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Tooltip 
              formatter={(value) => [`${value}`, 'Score']}
              labelStyle={{ color: '#374151' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsChart;
