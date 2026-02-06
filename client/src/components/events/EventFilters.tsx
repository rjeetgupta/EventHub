'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Filter, ChevronDown, X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { fetchDepartments } from '@/store/slices/departmentSlice';

interface EventFiltersProps {
  filters: {
    departments: string[];
    categories: string[];
    dateRange: string;
    mode: string;
  };
  onDepartmentChange: (departments: string[]) => void;
  onCategoryChange: (categories: string[]) => void;
  onDateRangeChange: (range: string) => void;
  onModeChange: (mode: string) => void;
  onReset: () => void;
}

const CATEGORIES = [
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Competition'
];

const DATE_RANGES = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Custom', value: 'custom' }
];

const MODES = ['All', 'Online', 'Offline', 'Hybrid'];

export function EventFilters({
  filters,
  onDepartmentChange,
  onCategoryChange,
  onDateRangeChange,
  onModeChange,
  onReset
}: EventFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { departments } = useAppSelector((state) => state.departments)

  const toggleDepartment = (deptId: string, checked: boolean) => {
    onDepartmentChange(
      checked
        ? [...filters.departments, deptId]
        : filters.departments.filter((d) => d !== deptId)
    );
  };

  const toggleCategory = (cat: string, checked: boolean) => {
    onCategoryChange(
      checked
        ? [...filters.categories, cat]
        : filters.categories.filter((c) => c !== cat)
    );
  };

  const activeFilterCount = 
    filters.departments.length + 
    filters.categories.length + 
    (filters.dateRange ? 1 : 0) + 
    (filters.mode !== 'All' ? 1 : 0);
  
  useEffect(() => {
    dispatch(fetchDepartments())
  }, [dispatch])

  const departmentMap = useMemo(() => {
    return Object.fromEntries(
      (departments ?? []).map(d => [d.id, d.name])
    );
  }, [departments]);
  

  return (
    <Card className="border-orange-500/20">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Department Filter */}
          <div className="relative flex-1">
            <Button
              variant="outline"
              className="w-full justify-between border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500"
              onClick={() => setOpenDropdown(openDropdown === 'department' ? null : 'department')}
            >
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Department</span>
                {filters.departments.length > 0 && (
                  <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">
                    {filters.departments.length}
                  </Badge>
                )}
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            
            {openDropdown === 'department' && (
              <Card className="absolute top-full mt-2 w-full z-50 shadow-lg border-orange-500/30 max-h-80 overflow-auto">
                <CardContent className="p-3 space-y-2">
                  {departments?.map(dept => (
                    <div key={dept.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dept-${dept.id}`}
                        checked={filters.departments.includes(dept.id)}
                        onCheckedChange={(checked) =>
                          toggleDepartment(dept.id, Boolean(checked))
                        }                     
                      />
                      <Label
                        htmlFor={`dept-${dept.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {dept.name}
                      </Label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative flex-1">
            <Button
              variant="outline"
              className="w-full justify-between border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500"
              onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
            >
              <div className="flex items-center space-x-2">
                <span>Category</span>
                {filters.categories.length > 0 && (
                  <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">
                    {filters.categories.length}
                  </Badge>
                )}
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            
            {openDropdown === 'category' && (
              <Card className="absolute top-full mt-2 w-full z-50 shadow-lg border-orange-500/30">
                <CardContent className="p-3 space-y-2">
                  {CATEGORIES.map(cat => (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${cat}`}
                        checked={filters.categories.includes(cat)}
                        onCheckedChange={(checked) =>
                          toggleCategory(cat, Boolean(checked))
                        }
                      />
                      <Label
                        htmlFor={`cat-${cat}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {cat}
                      </Label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Date Range Filter */}
          <div className="relative flex-1">
            <Button
              variant="outline"
              className="w-full justify-between border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500"
              onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
            >
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4" />
                <span>{DATE_RANGES.find(d => d.value === filters.dateRange)?.label || 'All Time'}</span>
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            
            {openDropdown === 'date' && (
              <Card className="absolute top-full mt-2 w-full z-50 shadow-lg border-orange-500/30">
                <CardContent className="p-2">
                  {DATE_RANGES.map(range => (
                    <button
                      key={range.value}
                      onClick={() => {
                        onDateRangeChange(range.value);
                        setOpenDropdown(null);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-orange-500/10 rounded-md transition-colors text-sm"
                    >
                      {range.label}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Mode Filter */}
          <div className="relative flex-1">
            <Button
              variant="outline"
              className="w-full justify-between border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500"
              onClick={() => setOpenDropdown(openDropdown === 'mode' ? null : 'mode')}
            >
              <span>{filters.mode}</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            
            {openDropdown === 'mode' && (
              <Card className="absolute top-full mt-2 w-full z-50 shadow-lg border-orange-500/30">
                <CardContent className="p-2">
                  {MODES.map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        onModeChange(mode);
                        setOpenDropdown(null);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-orange-500/10 rounded-md transition-colors text-sm"
                    >
                      {mode}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Reset Button */}
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              onClick={onReset}
              className="border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500"
            >
              <X className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            {filters.departments.map(dept => (
              <Badge
                key={dept}
                variant="outline"
                className="border-orange-500/30 text-orange-500 cursor-pointer hover:bg-orange-500/10"
                onClick={() => toggleDepartment(dept, false)}
              >
                 {departmentMap[dept] ?? dept}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            {filters.categories.map(cat => (
              <Badge
                key={cat}
                variant="outline"
                className="border-blue-500/30 text-blue-500 cursor-pointer hover:bg-blue-500/10"
                onClick={() => toggleCategory(cat, false)}
              >
                {cat}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}