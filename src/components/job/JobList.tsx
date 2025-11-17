import { JobListProps } from '@/types';
import JobCard from './JobCard';
import Skeleton from '../ui/Skeleton';

const JobList = ({ jobs, loading = false, onSaveJob, onApplyJob, savedJobs = [] }: JobListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1 space-y-2">
                  <Skeleton width="70%" height={20} />
                  <Skeleton width="50%" height={16} />
                </div>
                <Skeleton variant="rectangular" width={40} height={40} />
              </div>
              <div className="space-y-2">
                <Skeleton width="60%" height={14} />
                <Skeleton width="40%" height={14} />
                <Skeleton width="50%" height={14} />
              </div>
              <div className="flex justify-between pt-4">
                <Skeleton width="80px" height={12} />
                <Skeleton width="100px" height={32} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your search terms or filters to find more opportunities.
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Try broader search terms</p>
          <p>• Remove some filters</p>
          <p>• Check for typos</p>
          <p>• Browse by location or job type</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onSave={onSaveJob}
          onApply={onApplyJob}
          isSaved={savedJobs.includes(job.id)}
        />
      ))}
    </div>
  );
};

export default JobList;