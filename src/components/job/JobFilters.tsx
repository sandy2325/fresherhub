'use client';

import { useState } from 'react';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Button, Input, Select } from '../ui';
import { JobFiltersProps, JobSearchCriteria, JobType } from '@/types';

const JobFilters = ({ filters, onFiltersChange, loading = false }: JobFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const jobTypes: Array<{ value: JobType; label: string }> = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' },
  ];

  const experienceLevels = [
    { value: '0', label: 'Fresher (0 years)' },
    { value: '1', label: '1 year' },
    { value: '2', label: '2 years' },
    { value: '3', label: '3 years' },
    { value: '5', label: '5 years' },
    { value: '10', label: '10+ years' },
  ];

  const salaryRanges = [
    { value: '', label: 'Any salary' },
    { value: '300000', label: '₹3 LPA+' },
    { value: '600000', label: '₹6 LPA+' },
    { value: '1000000', label: '₹10 LPA+' },
    { value: '1500000', label: '₹15 LPA+' },
    { value: '2000000', label: '₹20 LPA+' },
  ];

  const popularLocations = [
    'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai',
    'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Indore', 'Chandigarh'
  ];

  const handleLocationChange = (location: string, checked: boolean) => {
    const currentLocations = filters.location || [];
    const newLocations = checked
      ? [...currentLocations, location]
      : currentLocations.filter(loc => loc !== location);

    onFiltersChange({
      ...filters,
      location: newLocations.length > 0 ? newLocations : undefined,
    });
  };

  const handleJobTypeChange = (jobType: JobType, checked: boolean) => {
    const currentTypes = filters.jobTypes || [];
    const newTypes = checked
      ? [...currentTypes, jobType]
      : currentTypes.filter(type => type !== jobType);

    onFiltersChange({
      ...filters,
      jobTypes: newTypes.length > 0 ? newTypes : undefined,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    setIsExpanded(false);
  };

  const hasActiveFilters = !!(
    filters.location?.length ||
    filters.jobTypes?.length ||
    filters.experienceMin !== undefined ||
    filters.experienceMax !== undefined ||
    filters.salaryMin !== undefined ||
    filters.salaryMax !== undefined
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-blue-600 font-medium"
        >
          <FunnelIcon className="h-5 w-5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full ml-2">
              Active
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Filters Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block p-6 space-y-6`}>
        {/* Search Query */}
        <div>
          <Input
            type="text"
            value={filters.query || ''}
            onChange={(e) => onFiltersChange({ ...filters, query: e.target.value || undefined })}
            placeholder="Search jobs, skills, companies..."
            label="Search"
          />
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {popularLocations.map((location) => (
              <label key={location} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.location?.includes(location) || false}
                  onChange={(e) => handleLocationChange(location, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700">{location}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Job Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Job Type</label>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <label key={type.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.jobTypes?.includes(type.value) || false}
                  onChange={(e) => handleJobTypeChange(type.value, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              value={filters.experienceMin?.toString() || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                experienceMin: e.target.value ? parseInt(e.target.value) : undefined,
              })}
              label="Min Experience"
              options={experienceLevels}
              disabled={loading}
            />
          </div>
          <div>
            <Select
              value={filters.experienceMax?.toString() || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                experienceMax: e.target.value ? parseInt(e.target.value) : undefined,
              })}
              label="Max Experience"
              options={experienceLevels}
              disabled={loading}
            />
          </div>
        </div>

        {/* Salary Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              value={filters.salaryMin?.toString() || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                salaryMin: e.target.value ? parseInt(e.target.value) : undefined,
              })}
              label="Min Salary (per year)"
              options={salaryRanges}
              disabled={loading}
            />
          </div>
          <div>
            <Select
              value={filters.salaryMax?.toString() || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                salaryMax: e.target.value ? parseInt(e.target.value) : undefined,
              })}
              label="Max Salary (per year)"
              options={salaryRanges}
              disabled={loading}
            />
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <Select
            value={filters.sortBy || 'latest'}
            onChange={(e) => onFiltersChange({
              ...filters,
              sortBy: e.target.value as any,
            })}
            label="Sort By"
            options={[
              { value: 'latest', label: 'Latest Posted' },
              { value: 'relevant', label: 'Most Relevant' },
              { value: 'salary_high', label: 'Highest Salary' },
              { value: 'salary_low', label: 'Lowest Salary' },
            ]}
            disabled={loading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {hasActiveFilters ? 'Filters applied' : 'No filters applied'}
          </div>
          <div className="flex space-x-3">
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearAllFilters} disabled={loading}>
                Clear All
              </Button>
            )}
            <Button
              onClick={() => setIsExpanded(false)}
              disabled={loading}
              className="lg:hidden"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;