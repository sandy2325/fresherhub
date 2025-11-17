'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookmarkIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  ClockIcon,
  ExternalLinkIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { Button } from '../ui';
import { Job, JobCardProps } from '@/types';

const JobCard = ({ job, onSave, onApply, isSaved = false, compact = false }: JobCardProps) => {
  const [saved, setSaved] = useState(isSaved);
  const [saveLoading, setSaveLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (saveLoading || !onSave) return;

    setSaveLoading(true);
    try {
      await onSave(job.id);
      setSaved(!saved);
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleApply = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (applyLoading || !onApply) return;

    setApplyLoading(true);
    try {
      await onApply(job);
    } catch (error) {
      console.error('Error applying to job:', error);
    } finally {
      setApplyLoading(false);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not disclosed';
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `₹${min.toLocaleString()}+`;
    return `Up to ₹${max!.toLocaleString()}`;
  };

  const formatExperience = (min?: number, max?: number) => {
    if (!min && !max) return 'Any experience';
    if (min === 0 && max === 1) return '0-1 year';
    if (min === 0 && max) return `0-${max} years`;
    if (min && max) return `${min}-${max} years`;
    if (min) return `${min}+ years`;
    return `Up to ${max} years`;
  };

  const timeAgo = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const cardClasses = compact
    ? 'bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 group'
    : 'bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 group';

  return (
    <div className={cardClasses}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            {/* Company Logo */}
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {job.companyLogoUrl ? (
                <img
                  src={job.companyLogoUrl}
                  alt={job.companyName}
                  className="w-8 h-8 rounded"
                />
              ) : (
                <BuildingOfficeIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/jobs/${job.id}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 group-hover:line-clamp-none"
              >
                {job.title}
              </Link>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <span className="font-medium">{job.companyName}</span>
                <span className="mx-2">•</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {job.source}
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            loading={saveLoading}
            className="flex-shrink-0 ml-2"
            title={saved ? 'Remove from saved' : 'Save job'}
          >
            {saved ? (
              <BookmarkIconSolid className="h-5 w-5 text-blue-600" />
            ) : (
              <BookmarkIcon className="h-5 w-5 text-gray-400 hover:text-blue-600" />
            )}
          </Button>
        </div>

        {/* Job Details */}
        <div className="space-y-2 mb-4 flex-1">
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{job.location}</span>
          </div>

          {/* Experience */}
          {job.experienceMin !== undefined || job.experienceMax !== undefined ? (
            <div className="flex items-center text-sm text-gray-600">
              <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{formatExperience(job.experienceMin, job.experienceMax)}</span>
            </div>
          ) : null}

          {/* Salary */}
          <div className="flex items-center text-sm text-gray-600">
            <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
            {job.currency !== 'INR' && (
              <span className="ml-1 text-xs">{job.currency}</span>
            )}
          </div>

          {/* Job Type */}
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
          </div>

          {/* Skills (if not compact and skills exist) */}
          {!compact && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {job.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Posted {timeAgo(job.postedAt)}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={handleApply}
              loading={applyLoading}
              className="flex items-center space-x-1"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              <span>Apply Now</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;