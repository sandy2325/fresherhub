'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { JobList, JobFilters, SearchBox } from '@/components/job';
import { Button } from '@/components/ui';
import { Job, JobSearchCriteria, JobSearchResponse } from '@/types';

// Mock data for demonstration
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    companyName: 'TechCorp Solutions',
    companyLogoUrl: '',
    location: 'Bangalore, Karnataka',
    salaryMin: 800000,
    salaryMax: 1500000,
    currency: 'INR',
    experienceMin: 0,
    experienceMax: 2,
    description: 'We are looking for a talented Frontend Developer...',
    requirements: 'React, TypeScript, HTML, CSS',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind'],
    jobType: 'full-time',
    source: 'Naukri',
    sourceJobId: 'naukri_12345',
    sourceApplyUrl: 'https://www.naukri.com/job-listings/12345',
    postedAt: '2024-01-15T10:00:00Z',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Junior Data Analyst',
    companyName: 'DataPro Analytics',
    location: 'Mumbai, Maharashtra',
    salaryMin: 600000,
    salaryMax: 1000000,
    currency: 'INR',
    experienceMin: 0,
    experienceMax: 1,
    description: 'Looking for a Data Analyst to join our team...',
    requirements: 'Python, SQL, Excel, Data Visualization',
    skills: ['Python', 'SQL', 'Excel', 'Data Visualization', 'Statistics'],
    jobType: 'full-time',
    source: 'Indeed',
    sourceJobId: 'indeed_67890',
    sourceApplyUrl: 'https://www.indeed.com/jobs/67890',
    postedAt: '2024-01-14T15:30:00Z',
    isActive: true,
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
  },
  {
    id: '3',
    title: 'Marketing Intern',
    companyName: 'BrandHub India',
    location: 'Delhi, NCR',
    salaryMin: 150000,
    salaryMax: 300000,
    currency: 'INR',
    experienceMin: 0,
    experienceMax: 1,
    description: 'Great opportunity for fresh graduates...',
    requirements: 'Marketing basics, communication skills',
    skills: ['Marketing', 'Communication', 'Social Media', 'Content Writing'],
    jobType: 'internship',
    source: 'LinkedIn',
    sourceJobId: 'linkedin_11111',
    sourceApplyUrl: 'https://www.linkedin.com/jobs/view/11111',
    postedAt: '2024-01-13T09:15:00Z',
    isActive: true,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    title: 'Backend Developer',
    companyName: 'StartupHub',
    location: 'Pune, Maharashtra',
    salaryMin: 1000000,
    salaryMax: 1800000,
    currency: 'INR',
    experienceMin: 1,
    experienceMax: 3,
    description: 'Backend Developer role with growth opportunity...',
    requirements: 'Node.js, MongoDB, Express',
    skills: ['Node.js', 'MongoDB', 'Express', 'JavaScript', 'REST APIs'],
    jobType: 'full-time',
    source: 'Company Career Page',
    sourceJobId: 'startup_22222',
    sourceApplyUrl: 'https://careers.startuphub.com/jobs/22222',
    postedAt: '2024-01-12T14:20:00Z',
    isActive: true,
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
  },
  {
    id: '5',
    title: 'UI/UX Designer',
    companyName: 'Design Studio Pro',
    location: 'Remote (India)',
    salaryMin: 800000,
    salaryMax: 1400000,
    currency: 'INR',
    experienceMin: 0,
    experienceMax: 2,
    description: 'Remote UI/UX Designer position...',
    requirements: 'Figma, Adobe Creative Suite, Design Principles',
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'UI Design', 'UX Design'],
    jobType: 'remote',
    source: 'AngelList',
    sourceJobId: 'angellist_33333',
    sourceApplyUrl: 'https://angel.co/company/designstudio/jobs/33333',
    postedAt: '2024-01-11T11:45:00Z',
    isActive: true,
    createdAt: '2024-01-11T11:45:00Z',
    updatedAt: '2024-01-11T11:45:00Z',
  },
];

function JobsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<JobSearchCriteria>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: false,
  });
  const [savedJobs, setSavedJobs] = useState<string[]>(['1', '3']); // Mock saved jobs

  // Parse URL search params on component mount
  useEffect(() => {
    const parsedFilters: JobSearchCriteria = {};

    const query = searchParams.get('q');
    if (query) parsedFilters.query = query;

    const location = searchParams.get('location');
    if (location) parsedFilters.location = location.split(',').map(loc => loc.trim());

    const type = searchParams.get('type');
    if (type) parsedFilters.jobTypes = type.split(',').map(t => t.trim() as any);

    const expMin = searchParams.get('exp_min');
    if (expMin) parsedFilters.experienceMin = parseInt(expMin);

    const expMax = searchParams.get('exp_max');
    if (expMax) parsedFilters.experienceMax = parseInt(expMax);

    const salaryMin = searchParams.get('salary_min');
    if (salaryMin) parsedFilters.salaryMin = parseInt(salaryMin);

    const salaryMax = searchParams.get('salary_max');
    if (salaryMax) parsedFilters.salaryMax = parseInt(salaryMax);

    const sort = searchParams.get('sort');
    if (sort) parsedFilters.sortBy = sort as any;

    const page = searchParams.get('page');
    if (page) parsedFilters.page = parseInt(page);

    setFilters(parsedFilters);
  }, [searchParams]);

  // Simulate API call to fetch jobs
  const fetchJobs = async (searchCriteria: JobSearchCriteria) => {
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Filter mock jobs based on criteria
      let filteredJobs = [...mockJobs];

      // Apply search query filter
      if (searchCriteria.query) {
        const query = searchCriteria.query.toLowerCase();
        filteredJobs = filteredJobs.filter(job =>
          job.title.toLowerCase().includes(query) ||
          job.companyName.toLowerCase().includes(query) ||
          job.description?.toLowerCase().includes(query) ||
          job.skills.some(skill => skill.toLowerCase().includes(query))
        );
      }

      // Apply location filter
      if (searchCriteria.location && searchCriteria.location.length > 0) {
        filteredJobs = filteredJobs.filter(job =>
          searchCriteria.location!.some(loc =>
            job.location.toLowerCase().includes(loc.toLowerCase())
          )
        );
      }

      // Apply job type filter
      if (searchCriteria.jobTypes && searchCriteria.jobTypes.length > 0) {
        filteredJobs = filteredJobs.filter(job =>
          searchCriteria.jobTypes!.includes(job.jobType)
        );
      }

      // Apply experience filter
      if (searchCriteria.experienceMin !== undefined) {
        filteredJobs = filteredJobs.filter(job =>
          job.experienceMax === undefined || job.experienceMax >= searchCriteria.experienceMin!
        );
      }

      if (searchCriteria.experienceMax !== undefined) {
        filteredJobs = filteredJobs.filter(job =>
          job.experienceMin === undefined || job.experienceMin <= searchCriteria.experienceMax!
        );
      }

      // Apply salary filter
      if (searchCriteria.salaryMin !== undefined) {
        filteredJobs = filteredJobs.filter(job =>
          job.salaryMax === undefined || job.salaryMax >= searchCriteria.salaryMin!
        );
      }

      if (searchCriteria.salaryMax !== undefined) {
        filteredJobs = filteredJobs.filter(job =>
          job.salaryMin === undefined || job.salaryMin <= searchCriteria.salaryMax!
        );
      }

      // Apply sorting
      switch (searchCriteria.sortBy) {
        case 'latest':
          filteredJobs.sort((a, b) => new Date(b.postedAt || '').getTime() - new Date(a.postedAt || '').getTime());
          break;
        case 'salary_high':
          filteredJobs.sort((a, b) => (b.salaryMin || 0) - (a.salaryMin || 0));
          break;
        case 'salary_low':
          filteredJobs.sort((a, b) => (a.salaryMin || Infinity) - (b.salaryMin || Infinity));
          break;
        case 'relevant':
        default:
          // For demo, just sort by latest
          filteredJobs.sort((a, b) => new Date(b.postedAt || '').getTime() - new Date(a.postedAt || '').getTime());
          break;
      }

      // Apply pagination
      const page = searchCriteria.page || 1;
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const paginatedJobs = filteredJobs.slice(startIndex, startIndex + limit);

      setJobs(paginatedJobs);
      setPagination({
        currentPage: page,
        totalPages: Math.ceil(filteredJobs.length / limit),
        totalCount: filteredJobs.length,
        hasMore: startIndex + limit < filteredJobs.length,
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Set empty state on error
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when filters change
  useEffect(() => {
    fetchJobs(filters);
  }, [filters]);

  // Update URL when filters change
  const updateFilters = (newFilters: JobSearchCriteria) => {
    const params = new URLSearchParams();

    if (newFilters.query) params.set('q', newFilters.query);
    if (newFilters.location?.length) params.set('location', newFilters.location.join(','));
    if (newFilters.jobTypes?.length) params.set('type', newFilters.jobTypes.join(','));
    if (newFilters.experienceMin !== undefined) params.set('exp_min', newFilters.experienceMin.toString());
    if (newFilters.experienceMax !== undefined) params.set('exp_max', newFilters.experienceMax.toString());
    if (newFilters.salaryMin !== undefined) params.set('salary_min', newFilters.salaryMin.toString());
    if (newFilters.salaryMax !== undefined) params.set('salary_max', newFilters.salaryMax.toString());
    if (newFilters.sortBy) params.set('sort', newFilters.sortBy);

    const queryString = params.toString();
    const newUrl = `/jobs${queryString ? '?' + queryString : ''}`;
    router.push(newUrl, { scroll: false });
  };

  const handleSearch = (searchCriteria: JobSearchCriteria) => {
    const updatedFilters = { ...searchCriteria, page: 1 };
    setFilters(updatedFilters);
    updateFilters(updatedFilters);
  };

  const handleFiltersChange = (newFilters: JobSearchCriteria) => {
    const updatedFilters = { ...newFilters, page: 1 };
    setFilters(updatedFilters);
    updateFilters(updatedFilters);
  };

  const handleSaveJob = async (jobId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    setSavedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApplyJob = async (job: Job) => {
    // Simulate API call to track application
    await new Promise(resolve => setTimeout(resolve, 500));

    // Open the original job posting in a new tab
    window.open(job.sourceApplyUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Search Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <SearchBox
              onSearch={handleSearch}
              loading={loading}
              initialValue={filters}
              placeholder="Search jobs, skills, companies..."
              showFilters={false}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <JobFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                loading={loading}
              />
            </div>

            {/* Job Listings */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {loading ? 'Searching...' : `${pagination.totalCount} Jobs Found`}
                    </h1>
                    {filters.query && (
                      <p className="text-sm text-gray-600 mt-1">
                        for "{filters.query}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job List */}
              <JobList
                jobs={jobs}
                loading={loading}
                onSaveJob={handleSaveJob}
                onApplyJob={handleApplyJob}
                savedJobs={savedJobs}
              />

              {/* Pagination */}
              {!loading && jobs.length > 0 && pagination.totalPages > 1 && (
                <div className="bg-white rounded-lg p-4 mt-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage <= 1}
                    >
                      Previous
                    </Button>

                    <div className="flex space-x-2">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              pagination.currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage >= pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </Layout>
    }>
      <JobsPageContent />
    </Suspense>
  );
}