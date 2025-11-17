'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  BookmarkIcon,
  DocumentTextIcon,
  TrendingUpIcon,
  UserGroupIcon,
  EyeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import Layout from '@/components/layout/Layout';
import { Button, Card, Skeleton } from '@/components/ui';
import { Job, JobApplication, SavedJob } from '@/types';

// Mock data - in real app this would come from API
const mockSavedJobs: SavedJob[] = [
  {
    id: '1',
    userId: '1',
    jobId: '1',
    savedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    userId: '1',
    jobId: '3',
    savedAt: '2024-01-14T15:30:00Z',
  },
];

const mockAppliedJobs: JobApplication[] = [
  {
    id: '1',
    userId: '1',
    jobId: '2',
    appliedAt: '2024-01-13T09:15:00Z',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ipAddress: '192.168.1.1',
  },
  {
    id: '2',
    userId: '1',
    jobId: '4',
    appliedAt: '2024-01-12T14:20:00Z',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ipAddress: '192.168.1.1',
  },
];

const mockJobs: Record<string, Job> = {
  '1': {
    id: '1',
    title: 'Frontend Developer',
    companyName: 'TechCorp Solutions',
    location: 'Bangalore, Karnataka',
    salaryMin: 800000,
    salaryMax: 1500000,
    jobType: 'full-time',
    postedAt: '2024-01-15T10:00:00Z',
    isActive: true,
  },
  '2': {
    id: '2',
    title: 'Junior Data Analyst',
    companyName: 'DataPro Analytics',
    location: 'Mumbai, Maharashtra',
    salaryMin: 600000,
    salaryMax: 1000000,
    jobType: 'full-time',
    postedAt: '2024-01-14T15:30:00Z',
    isActive: true,
  },
  '3': {
    id: '3',
    title: 'Marketing Intern',
    companyName: 'BrandHub India',
    location: 'Delhi, NCR',
    salaryMin: 150000,
    salaryMax: 300000,
    jobType: 'internship',
    postedAt: '2024-01-13T09:15:00Z',
    isActive: true,
  },
  '4': {
    id: '4',
    title: 'Backend Developer',
    companyName: 'StartupHub',
    location: 'Pune, Maharashtra',
    salaryMin: 1000000,
    salaryMax: 1800000,
    jobType: 'full-time',
    postedAt: '2024-01-12T14:20:00Z',
    isActive: true,
  },
};

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'applied'>(
    (searchParams.get('tab') as any) || 'overview'
  );
  const [loading, setLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<JobApplication[]>([]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login?callbackUrl=' + encodeURIComponent('/dashboard'));
      return;
    }

    // In real app, fetch data from API
    setSavedJobs(mockSavedJobs);
    setAppliedJobs(mockAppliedJobs);
  }, [session, router]);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams);
    if (tab === 'overview') {
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }
    const newUrl = `/dashboard${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl);
  };

  const handleUnsaveJob = async (savedJobId: string) => {
    try {
      // Simulate API call to unsave job
      await new Promise(resolve => setTimeout(resolve, 300));
      setSavedJobs(prev => prev.filter(job => job.id !== savedJobId));
    } catch (error) {
      console.error('Error unsaving job:', error);
    }
  };

  const handleApplyJob = async (job: Job) => {
    try {
      // Open job in new tab and track application
      window.open(`/jobs/${job.id}`, '_blank', 'noopener,noreferrer');

      // Simulate API call to track application
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not disclosed';
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `₹${min.toLocaleString()}+`;
    return `Up to ₹${max!.toLocaleString()}`;
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

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your dashboard.</p>
            <Button onClick={() => router.push('/auth/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const dashboardStats = {
    totalSaved: savedJobs.length,
    totalApplied: appliedJobs.length,
    thisWeekApplied: appliedJobs.filter(job => {
      const appliedDate = new Date(job.appliedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return appliedDate > weekAgo;
    }).length,
    profileViews: 127, // Mock data
    responseRate: 23, // Mock data
  };

  const recentJobs = [...savedJobs.slice(0, 3), ...appliedJobs.slice(0, 3)]
    .sort((a, b) => new Date(b.appliedAt || b.savedAt).getTime() - new Date(a.appliedAt || a.savedAt).getTime())
    .slice(0, 5);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {session.user?.name || session.user?.email}!</h1>
            <p className="text-gray-600">
              Here's your personalized job search dashboard. Track your applications, saved jobs, and career progress.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <BookmarkIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalSaved}</p>
                  <p className="text-sm text-gray-600">Saved Jobs</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <DocumentTextIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalApplied}</p>
                  <p className="text-sm text-gray-600">Applications</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <TrendingUpIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.thisWeekApplied}</p>
                  <p className="text-sm text-gray-600">This Week</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg mr-4">
                  <UserGroupIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.responseRate}%</p>
                  <p className="text-sm text-gray-600">Response Rate</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Tabs */}
            <div className="lg:col-span-2">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {(['overview', 'saved', 'applied'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab === 'overview' && 'Overview'}
                      {tab === 'saved' && `Saved Jobs (${savedJobs.length})`}
                      {tab === 'applied' && `Applied Jobs (${appliedJobs.length})`}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {recentJobs.length > 0 ? (
                          recentJobs.map((activity, index) => {
                            const job = mockJobs[activity.jobId];
                            if (!job) return null;

                            const isSaved = 'savedAt' in activity;
                            const isApplied = 'appliedAt' in activity;

                            return (
                              <div key={index} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h4 className="font-medium text-gray-900">{job.title}</h4>
                                    <div className="flex space-x-2">
                                      {isSaved && (
                                        <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                          <BookmarkIconSolid className="h-3 w-3 mr-1" />
                                          Saved
                                        </span>
                                      )}
                                      {isApplied && (
                                        <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                                          Applied
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600">{job.companyName}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>{job.location}</span>
                                    <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500">
                                    {timeAgo(isSaved ? activity.savedAt : activity.appliedAt)}
                                  </p>
                                  {isSaved && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUnsaveJob(activity.id)}
                                    >
                                      <XMarkIcon className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {isApplied && (
                                    <div className="inline-flex items-center text-xs text-green-600">
                                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                                      Applied
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8">
                            <EyeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
                            <p className="text-gray-600">
                              Start exploring jobs and save or apply to positions to see your activity here.
                            </p>
                            <div className="mt-6">
                              <Link href="/jobs">
                                <Button>Browse Jobs</Button>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Personal Info</span>
                            <span className="text-green-600 font-medium">✓ Complete</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Resume Upload</span>
                            <span className="text-yellow-600 font-medium">⚠ Incomplete</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Job Preferences</span>
                            <span className="text-green-600 font-medium">✓ Complete</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link href="/profile">
                            <Button variant="outline" className="w-full">
                              Complete Profile
                            </Button>
                          </Link>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                          <Link href="/jobs" className="block">
                            <Button className="w-full justify-start">
                              <TrendingUpIcon className="h-5 w-5 mr-2" />
                              Browse New Jobs
                            </Button>
                          </Link>
                          <Link href="/profile" className="block">
                            <Button variant="outline" className="w-full justify-start">
                              <UserGroupIcon className="h-5 w-5 mr-2" />
                              Update Profile
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    </div>
                  )}
                )}

                {activeTab === 'saved' && (
                  <div className="space-y-4">
                    {savedJobs.length > 0 ? (
                      savedJobs.map((savedJob) => {
                        const job = mockJobs[savedJob.jobId];
                        if (!job) return null;

                        return (
                          <Card key={savedJob.id} className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start space-x-3">
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {job.title.includes('Frontend') ? (
                                      <span className="text-lg">💻</span>
                                    ) : job.title.includes('Data') ? (
                                      <span className="text-lg">📊</span>
                                    ) : (
                                      <span className="text-lg">📝</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                                    <p className="text-sm text-gray-600">{job.companyName}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                      <span>{job.location}</span>
                                      <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-xs text-gray-500 mb-2">
                                    Saved {timeAgo(savedJob.savedAt)}
                                  </p>
                                  <div className="space-y-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleApplyJob(job)}
                                    >
                                      Apply Now
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUnsaveJob(savedJob.id)}
                                    >
                                      <XMarkIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <Card className="p-8 text-center">
                            <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
                            <p className="text-gray-600 mb-6">
                              Start saving jobs you're interested in to track them here.
                            </p>
                            <Link href="/jobs">
                              <Button>Browse Jobs</Button>
                            </Link>
                          </Card>
                        )}
                      </div>
                )}

                {activeTab === 'applied' && (
                  <div className="space-y-4">
                    {appliedJobs.length > 0 ? (
                      appliedJobs.map((application) => {
                        const job = mockJobs[application.jobId];
                        if (!job) return null;

                        return (
                          <Card key={application.id} className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start space-x-3">
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {job.title.includes('Frontend') ? (
                                      <span className="text-lg">💻</span>
                                    ) : job.title.includes('Data') ? (
                                      <span className="text-lg">📊</span>
                                    ) : (
                                      <span className="text-lg">📝</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                                    <p className="text-sm text-gray-600">{job.companyName}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                      <span>{job.location}</span>
                                      <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-xs text-gray-500 mb-2">
                                    Applied {timeAgo(application.appliedAt)}
                                  </p>
                                  <div className="inline-flex items-center text-xs text-green-600">
                                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                                    Applied
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                                  >
                                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                    View
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                      })
                    ) : (
                      <Card className="p-8 text-center">
                        <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-600 mb-6">
                          Start applying to jobs to track your application progress here.
                        </p>
                        <Link href="/jobs">
                          <Button>Browse Jobs</Button>
                        </Link>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Recommendations */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
                <div className="space-y-4">
                  {[
                    { title: 'React Developer Intern', company: 'TechStart', location: 'Remote', type: 'internship' },
                    { title: 'Junior Frontend Engineer', company: 'Digital Agency', location: 'Bangalore', type: 'full-time' },
                    { title: 'UI/UX Designer', company: 'Creative Studio', location: 'Mumbai', type: 'remote' },
                  ].map((rec, index) => (
                    <Link
                      key={index}
                      href="/jobs"
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">
                            {rec.type === 'internship' ? '🎓' : rec.type === 'remote' ? '🏠' : '💼'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">{rec.title}</h4>
                          <p className="text-xs text-gray-600">{rec.company}</p>
                          <p className="text-xs text-gray-500">{rec.location}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/jobs" className="block">
                  <Button variant="outline" className="w-full">
                    View All Recommendations
                  </Button>
                </Link>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Search Tips</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600">1</span>
                      </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Customize Your Profile</p>
                      <p className="text-xs text-gray-600">Complete your profile with skills and preferences for better matches</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">2</span>
                      </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Set Job Alerts</p>
                      <p className="text-xs text-gray-600">Get notified when new jobs match your criteria</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">3</span>
                      </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Apply Promptly</p>
                      <p className="text-xs text-gray-600">Fresh jobs get filled quickly, apply as soon as you find a good match</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </Layout>
    }>
      <DashboardContent />
    </Suspense>
  );
}