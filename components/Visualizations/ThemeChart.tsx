import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Theme, AppLanguage } from '../../types';

/**
 * Props for the ThemeChart component.
 * @property data - An array of themes to be visualized.
 * @property language - The language to be used for the component's text.
 */
interface ThemeChartProps {
  data: Theme[];
  language?: AppLanguage;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#8dd1e1'];

/**
 * A component that displays a bar chart of themes and their scores.
 *
 * @param data - An array of themes to be visualized.
 * @param language - The language to be used for the component's text.
 * @returns A React component that renders a bar chart.
 */
export const ThemeChart: React.FC<ThemeChartProps> = ({ data, language = AppLanguage.ENGLISH }) => {
  const t = {
    noData: language === AppLanguage.RUSSIAN ? "Нет тематических данных." : "No thematic data available."
  };

  if (!data || data.length === 0) return <div className="text-gray-500 italic">{t.noData}</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={100} 
            tick={{fontSize: 12, fill: '#4b5563'}} 
          />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
             {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
