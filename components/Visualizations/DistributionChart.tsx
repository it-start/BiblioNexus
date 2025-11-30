import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Citation } from '../../types';

interface DistributionChartProps {
  citations: Citation[];
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ citations }) => {
  // Aggregate citations by book
  const dataMap = citations.reduce((acc, curr) => {
    const book = curr.book.trim();
    acc[book] = (acc[book] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(dataMap)
    .map(([name, count]) => ({ name, count: count as number }))
    .sort((a, b) => b.count - a.count); // Sort by frequency

  if (data.length === 0) return null;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{fontSize: 10, fill: '#4b5563'}} 
            interval={0}
            angle={-25}
            textAnchor="end"
            height={50}
          />
          <YAxis allowDecimals={false} tick={{fontSize: 12, fill: '#4b5563'}} />
          <Tooltip 
            cursor={{fill: '#f3f4f6'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Bar dataKey="count" name="Verses Cited" radius={[4, 4, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
               <Cell key={`cell-${index}`} fill="#4338ca" fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};