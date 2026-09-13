import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartConfig } from '../types';

interface ChartRendererProps {
  config: ChartConfig;
}

const COLORS = [
  '#f59e0b', // amber-500
  '#0284c7', // sky-600
  '#10b981', // emerald-500
  '#8b5cf6', // violet-500
  '#f43f5e', // rose-500
  '#14b8a6', // teal-500
  '#6366f1', // indigo-500
  '#eab308', // yellow-500
];

export const ChartRenderer: React.FC<ChartRendererProps> = ({ config }) => {
  const { chartType, title, xKey, yKey, data } = config;

  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-stone-500 text-xs italic bg-stone-50 rounded-lg border border-stone-200">
        No chart data available to plot
      </div>
    );
  }

  // Derive value key if not directly supplied
  const effectiveYKey = yKey || Object.keys(data[0]).find((k) => k !== xKey) || '';

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
      {title && (
        <h4 className="text-sm font-semibold text-stone-800 mb-3 tracking-tight">
          {title}
        </h4>
      )}

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e7e5e4',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Pie
                data={data}
                dataKey={effectiveYKey}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={35}
                paddingAngle={3}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 11, fill: '#78716c' }}
                tickLine={false}
                axisLine={{ stroke: '#e7e5e4' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#78716c' }}
                tickLine={false}
                axisLine={{ stroke: '#e7e5e4' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e7e5e4',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line
                type="monotone"
                dataKey={effectiveYKey}
                stroke="#0284c7"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0284c7' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            // Bar / Histogram default
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 11, fill: '#78716c' }}
                tickLine={false}
                axisLine={{ stroke: '#e7e5e4' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#78716c' }}
                tickLine={false}
                axisLine={{ stroke: '#e7e5e4' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e7e5e4',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar
                dataKey={effectiveYKey}
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={chartType === 'histogram' ? '#f59e0b' : COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
