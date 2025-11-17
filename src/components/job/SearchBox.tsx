'use client';

import { useState, FormEvent } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '../ui';
import { JobSearchCriteria } from '@/types';

interface SearchBoxProps {
  onSearch: (criteria: JobSearchCriteria) => void;
  loading?: boolean;
  initialValue?: JobSearchCriteria;
  showFilters?: boolean;
  placeholder?: string;
}

const SearchBox = ({
  onSearch,
  loading = false,
  initialValue = {},
  showFilters = true,
  placeholder = 'Search for jobs, companies, or keywords...'
}: SearchBoxProps) => {
  const [query, setQuery] = useState(initialValue.query || '');
  const [location, setLocation] = useState(initialValue.location?.[0] || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const criteria: JobSearchCriteria = {
      query: query.trim(),
      location: location ? [location] : undefined,
      ...initialValue,
    };

    onSearch(criteria);
  };

  const popularSearches = [
    'Software Developer',
    'Data Analyst',
    'Product Manager',
    'Digital Marketing',
    'Business Analyst',
    'Content Writer'
  ];

  const popularLocations = [
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Pune',
    'Hyderabad',
    'Chennai'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="pl-10 text-lg h-12"
            />
          </div>

          <div className="flex gap-3">
            {showFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center space-x-2"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            )}

            <Button
              type="submit"
              loading={loading}
              className="px-8 h-12 text-base font-medium"
            >
              Search Jobs
            </Button>
          </div>
        </div>

        {location && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Location:</span>
            <span className="font-medium">{location}</span>
            <button
              type="button"
              onClick={() => setLocation('')}
              className="text-red-600 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}
      </form>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="space-y-2">
                {popularLocations.map((loc) => (
                  <label key={loc} className="flex items-center">
                    <input
                      type="radio"
                      name="location"
                      value={loc}
                      checked={location === loc}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Popular Searches
              </label>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    type="button"
                    onClick={() => setQuery(search)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popular Search Suggestions */}
      {!showAdvancedFilters && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.slice(0, 4).map((search) => (
              <button
                key={search}
                type="button"
                onClick={() => setQuery(search)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;