'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartDataPoint {
  [key: string]: string | number;
}

interface TrendChartProps {
  title: string;
  data: ChartDataPoint[];
  dataKey: string;
  xAxisKey: string;
  type?: 'line' | 'bar';
  color?: string;
  height?: number;
}

export function TrendChart({
  title,
  data,
  dataKey,
  xAxisKey,
  type = 'line',
  color = '#f97316',
  height = 300,
}: TrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={dataKey} fill={color} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}