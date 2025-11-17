'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  BookmarkIcon,
  ShareIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import Layout from '@/components/layout/Layout';
import { Button, Card, Skeleton } from '@/components/ui';
import { Job } from '@/types';

// Mock job data - in real app this would come from API
const mockJobs: Record<string, Job> = {
  '1': {
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
    description: `We are looking for a talented Frontend Developer to join our growing team. As a Frontend Developer at TechCorp Solutions, you will be responsible for building responsive, user-friendly web applications using modern JavaScript frameworks.

**Key Responsibilities:**
• Develop and maintain web applications using React, TypeScript, and modern CSS frameworks
• Collaborate with UX/UI designers to implement pixel-perfect designs
• Optimize applications for maximum speed and scalability
• Work with backend developers to integrate APIs and ensure seamless data flow
• Participate in code reviews and contribute to best practices
• Stay updated with the latest frontend technologies and trends

**What We're Looking For:**
• Strong proficiency in HTML, CSS, and JavaScript
• Experience with React.js and modern frontend frameworks
• Knowledge of TypeScript and modern development tools
• Understanding of responsive design principles
• Excellent problem-solving skills and attention to detail
• Ability to work in an agile environment`,
    requirements: `**Required Skills:**
• 2+ years of experience in frontend development
• Strong knowledge of HTML5, CSS3, and JavaScript ES6+
• Experience with React.js and its ecosystem
• Familiarity with TypeScript
• Understanding of responsive web design
• Good communication and teamwork skills

**Preferred Skills:**
• Experience with Next.js
• Knowledge of testing frameworks (Jest, React Testing Library)
• Familiarity with Git and version control
• Understanding of web accessibility standards
• Experience with RESTful APIs`,
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Next.js'],
    jobType: 'full-time',
    source: 'Naukri',
    sourceJobId: 'naukri_12345',
    sourceApplyUrl: 'https://www.naukri.com/job-listings/12345',
    postedAt: '2024-01-15T10:00:00Z',
    expiresAt: '2024-02-15T10:00:00Z',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  '2': {
    id: '2',
    title: 'Junior Data Analyst',
    companyName: 'DataPro Analytics',
    location: 'Mumbai, Maharashtra',
    salaryMin: 600000,
    salaryMax: 1000000,
    currency: 'INR',
    experienceMin: 0,
    experienceMax: 1,
    description: 'Looking for a Data Analyst to join our team and help drive data-driven decisions...',
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
};

function JobDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  const jobId = params.id as string;

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const jobData = mockJobs[jobId];
        if (jobData) {
          setJob(jobData);
        } else {
          // Job not found
          router.push('/jobs');
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        router.push('/jobs');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, router]);

  const handleSave = async () => {
    if (!job || saveLoading) return;

    setSaveLoading(true);
    try {
      // Simulate API call to save/unsave job
      await new Promise(resolve => setTimeout(resolve, 300));
      setSaved(!saved);
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job || applyLoading) return;

    setApplyLoading(true);
    try {
      // Simulate API call to track application
      await new Promise(resolve => setTimeout(resolve, 500));

      // Log the application (in real app, this would track analytics)
      console.log(`User applied for job: ${job.title} at ${job.companyName}`);

      // Open the original job posting in a new tab
      window.open(job.sourceApplyUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error applying to job:', error);
    } finally {
      setApplyLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && job) {
      try {
        await navigator.share({
          title: `${job.title} at ${job.companyName}`,
          text: `Check out this opportunity: ${job.title}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Job link copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      await navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  const formatSalary = (min?: number, max?: number, currency: string = 'INR') => {
    if (!min && !max) return 'Not disclosed';
    if (min && max) return `${currency === 'INR' ? '₹' : '$'}${min.toLocaleString()} - ${currency === 'INR' ? '₹' : '$'}${max.toLocaleString()}`;
    if (min) return `${currency === 'INR' ? '₹' : '$'}${min.toLocaleString()}+`;
    return `Up to ${currency === 'INR' ? '₹' : '$'}${max!.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Skeleton lines={3} className="mb-6" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Skeleton height={200} />
                  <Skeleton height={150} />
                  <Skeleton height={150} />
                </div>
                <div className="space-y-6">
                  <Skeleton height={200} />
                  <Skeleton height={100} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/jobs')}>
              Browse Jobs
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const similarJobs = Object.values(mockJobs).filter(
    j => j.id !== job.id && (
      j.location.includes(job.location.split(',')[0]) ||
      j.jobType === job.jobType ||
      j.skills.some(skill => job.skills.includes(skill))
    )
  ).slice(0, 3);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/jobs" className="text-gray-600 hover:text-blue-600">
                Jobs
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium truncate">{job.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {job.companyLogoUrl ? (
                        <img src={job.companyLogoUrl} alt={job.companyName} className="w-12 h-12 rounded" />
                      ) : (
                        <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className="font-medium">{job.companyName}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {job.source}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      loading={saveLoading}
                      title={saved ? 'Remove from saved' : 'Save job'}
                    >
                      {saved ? (
                        <BookmarkIconSolid className="h-5 w-5 text-blue-600" />
                      ) : (
                        <BookmarkIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      title="Share job"
                    >
                      <ShareIcon className="h-5 w-5 text-gray-400" />
                    </Button>
                  </div>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Posted {formatDate(job.postedAt)}</span>
                  </div>
                </div>

                {/* Experience Requirements */}
                {(job.experienceMin !== undefined || job.experienceMax !== undefined) && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience Required</h3>
                    <div className="text-gray-700">
                      {job.experienceMin === 0 && job.experienceMax === 1
                        ? 'Fresher (0-1 year)'
                        : job.experienceMin === 0 && job.experienceMax
                        ? `0-${job.experienceMax} years`
                        : job.experienceMin && job.experienceMax
                        ? `${job.experienceMin}-${job.experienceMax} years`
                        : job.experienceMin
                        ? `${job.experienceMin}+ years`
                        : 'Not specified'
                      }
                    </div>
                  </div>
                )}
              </Card>

              {/* Job Description */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {job.description || 'No description available.'}
                </div>
              </Card>

              {/* Requirements */}
              {job.requirements && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {job.requirements}
                  </div>
                </Card>
              )}

              {/* Skills */}
              {job.skills.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-block bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Now Card */}
              <Card className="p-6 sticky top-6">
                <Button
                  onClick={handleApply}
                  loading={applyLoading}
                  className="w-full text-base font-semibold mb-4"
                  size="lg"
                >
                  <ExternalLinkIcon className="h-5 w-5 mr-2" />
                  Apply Now
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  You will be redirected to the original job posting
                </p>
              </Card>

              {/* Job Details Card */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Posted Date</span>
                    <span className="font-medium">{formatDate(job.postedAt)}</span>
                  </div>
                  {job.expiresAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Expires On</span>
                      <span className="font-medium">{formatDate(job.expiresAt)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Source</span>
                    <span className="font-medium">{job.source}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium capitalize">{job.jobType.replace('-', ' ')}</span>
                  </div>
                </div>
              </Card>

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
                  <div className="space-y-4">
                    {similarJobs.map((similarJob) => (
                      <Link
                        key={similarJob.id}
                        href={`/jobs/${similarJob.id}`}
                        className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                          {similarJob.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">{similarJob.companyName}</p>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{similarJob.location.split(',')[0]}</span>
                          <span>{formatSalary(similarJob.salaryMin, similarJob.salaryMax, similarJob.currency)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function JobDetailsPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading job details...</div>
        </div>
      </Layout>
    }>
      <JobDetailsContent />
    </Suspense>
  );
}