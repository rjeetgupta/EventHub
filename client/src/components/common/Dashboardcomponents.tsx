'use client';

import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { LucideIcon } from 'lucide-react';

// DASHBOARD HEADER

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  actionButton?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    disabled?: boolean;
  };
}

export function DashboardHeader({ title, subtitle, actionButton }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {actionButton && (
        <Button
          onClick={actionButton.onClick}
          disabled={actionButton.disabled}
          className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
        >
          <actionButton.icon className="w-4 h-4 mr-2" />
          {actionButton.label}
        </Button>
      )}
    </div>
  );
}

// STATS CARD

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, iconColor, borderColor }: StatCardProps) {
  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

// STATS GRID

interface StatsGridProps {
  stats: StatCardProps[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

// CHART CARD

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// LINE CHART

interface LineChartData {
  [key: string]: string | number;
}

interface LineChartCardProps {
  title: string;
  data: LineChartData[];
  dataKey: string;
  xAxisKey: string;
  height?: number;
  color?: string;
}

export function LineChartCard({ 
  title, 
  data, 
  dataKey, 
  xAxisKey, 
  height = 300,
  color = '#f97316' 
}: LineChartCardProps) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// BAR CHART

interface BarChartCardProps {
  title: string;
  data: LineChartData[];
  dataKey: string;
  xAxisKey: string;
  height?: number;
  color?: string;
}

export function BarChartCard({ 
  title, 
  data, 
  dataKey, 
  xAxisKey, 
  height = 300,
  color = '#fb923c' 
}: BarChartCardProps) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// PIE CHART

interface PieChartCardProps {
  title: string;
  data: { name: string; value: number }[];
  height?: number;
  colors?: string[];
}

const DEFAULT_COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa'];

export function PieChartCard({ 
  title, 
  data, 
  height = 300,
  colors = DEFAULT_COLORS 
}: PieChartCardProps) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => entry.name}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// QUICK ACTION CARD

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
  iconColor: string;
  borderColor: string;
}

export function QuickActionCard({ 
  icon: Icon, 
  title, 
  subtitle, 
  onClick, 
  iconColor,
  borderColor 
}: QuickActionCardProps) {
  return (
    <Card 
      className={`${borderColor} hover:border-opacity-60 cursor-pointer transition-all`}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 ${iconColor} rounded-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// QUICK ACTIONS GRID

interface QuickActionsGridProps {
  actions: QuickActionCardProps[];
}

export function QuickActionsGrid({ actions }: QuickActionsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {actions.map((action, index) => (
        <QuickActionCard key={index} {...action} />
      ))}
    </div>
  );
}

// DATA TABLE

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  cell?: (value: any, row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({ 
  title, 
  columns, 
  data, 
  isLoading,
  emptyMessage = 'No data available' 
}: DataTableProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns?.map((column, index) => (
                  <TableHead key={index} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column, colIndex) => {
                    const value = typeof column.accessor === 'function' 
                      ? column.accessor(row)
                      : row[column.accessor];
                    
                    return (
                      <TableCell key={colIndex} className={column.className}>
                        {/* {column.cell ? column.cell(value, row) : value} */}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ACTIVITY FEED

interface Activity {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  time: string;
}

interface ActivityFeedProps {
  title: string;
  activities: Activity[];
}

export function ActivityFeed({ title, activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`flex items-start gap-3 ${index !== activities.length - 1 ? 'pb-3 border-b' : ''}`}
            >
              <activity.icon className={`w-5 h-5 ${activity.iconColor} mt-0.5`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ACTION BUTTONS

interface ActionButton {
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'outline' | 'destructive' | 'default';
  label?: string;
}

interface ActionButtonsProps {
  buttons: ActionButton[];
}

export function ActionButtons({ buttons }: ActionButtonsProps) {
  return (
    <div className="flex justify-end gap-2">
      {buttons.map((button, index) => (
        <Button
          key={index}
          size="sm"
          variant={button.variant || 'outline'}
          onClick={button.onClick}
          className="h-8 w-8 p-0"
        >
          <button.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}

// STATUS BADGE

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const variants = {
    success: 'bg-green-500 hover:bg-green-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    error: 'bg-red-500 hover:bg-red-600',
    info: 'bg-blue-500 hover:bg-blue-600',
    default: 'bg-gray-500 hover:bg-gray-600',
  };

  return (
    <Badge className={variants[variant]}>
      {status}
    </Badge>
  );
}