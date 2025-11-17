'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  UserCircleIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Button, Input, Select, Card, Skeleton } from '@/components/ui';
import ResumeUpload from '@/components/profile/ResumeUpload';
import { User, UserPreferences } from '@/types';

// Mock user data - in real app this would come from API
const mockUser: User = {
  id: '1',
  email: 'priya.sharma@example.com',
  firstName: 'Priya',
  lastName: 'Sharma',
  phone: '+91 98765 43210',
  avatarUrl: '',
  resumeUrl: '',
  resumeParsedData: {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Node.js'],
    experience: 2,
    education: [
      { degree: 'B.Tech Computer Science', institution: 'IIT Delhi', year: '2022' }
    ]
  },
  preferences: {
    experienceMin: 0,
    experienceMax: 3,
    salaryMin: 600000,
    salaryMax: 1500000,
    locations: ['Bangalore', 'Mumbai', 'Pune', 'Hyderabad'],
    jobTypes: ['full-time', 'remote'],
    educationLevel: 'Bachelor\'s Degree',
    industry: 'Software Development',
    remotePreferred: true
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

function ProfilePageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'personal' | 'preferences' | 'resume'>('personal');
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    // Redirect to login if not authenticated
    if (!session) {
      router.push('/auth/login?callbackUrl=' + encodeURIComponent('/profile'));
      return;
    }

    // In real app, fetch user data from API
    setUser(mockUser);
  }, [session, router]);

  const handleResumeUpload = async (file: File) => {
    if (!user) return;

    setSaveLoading(true);
    try {
      // Simulate API call to upload resume
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('userId', user.id);

      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUser(prev => prev ? {
          ...prev,
          resumeUrl: result.resumeUrl,
          resumeParsedData: result.parsedData
        } : null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      // Show error notification
    } finally {
      setSaveLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData: Partial<User>) => {
    if (!user) return;

    setSaveLoading(true);
    try {
      // Simulate API call to update profile
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setUser(prev => prev ? { ...prev, ...updatedData } : null);
        setEditMode(false);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePreferencesUpdate = async (updatedPreferences: Partial<UserPreferences>) => {
    if (!user) return;

    setSaveLoading(true);
    try {
      // Simulate API call to update preferences
      const response = await fetch('/api/users/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPreferences),
      });

      if (response.ok) {
        setUser(prev => prev ? {
          ...prev,
          preferences: { ...prev.preferences, ...updatedPreferences }
        } : null);
      } else {
        throw new Error('Preferences update failed');
      }
    } catch (error) {
      console.error('Preferences update error:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
            <Button onClick={() => router.push('/auth/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const experienceOptions = [
    { value: '0', label: 'Fresher (0 years)' },
    { value: '1', label: '1 year' },
    { value: '2', label: '2 years' },
    { value: '3', label: '3 years' },
    { value: '5', label: '5 years' },
    { value: '10', label: '10+ years' },
  ];

  const salaryOptions = [
    { value: '', label: 'Any salary' },
    { value: '300000', label: '₹3 LPA+' },
    { value: '600000', label: '₹6 LPA+' },
    { value: '1000000', label: '₹10 LPA+' },
    { value: '1500000', label: '₹15 LPA+' },
    { value: '2000000', label: '₹20 LPA+' },
  ];

  const locationOptions = [
    'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai',
    'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Indore', 'Chandigarh'
  ];

  const jobTypeOptions = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">
              Manage your personal information, job preferences, and resume to help us find the perfect opportunities for you.
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {(['personal', 'preferences', 'resume'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - User Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.firstName} className="w-20 h-20 rounded-full" />
                    ) : (
                      <UserCircleIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Profile Completion</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <UserCircleIcon className="h-4 w-4 mr-2" />
                        Personal Info
                      </span>
                      <span className="text-green-600 font-medium">✓ Complete</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        Resume
                      </span>
                      <span className={`${user.resumeUrl ? 'text-green-600' : 'text-yellow-600'} font-medium`}>
                        {user.resumeUrl ? '✓ Complete' : '⚠ Missing'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <BriefcaseIcon className="h-4 w-4 mr-2" />
                        Preferences
                      </span>
                      <span className="text-green-600 font-medium">✓ Complete</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content - Tab Panels */}
            <div className="lg:col-span-2">
              {activeTab === 'personal' && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(!editMode)}
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      {editMode ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>

                  {editMode ? (
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="First Name"
                          value={user.firstName || ''}
                          onChange={(e) => setUser(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                          disabled={saveLoading}
                        />
                        <Input
                          label="Last Name"
                          value={user.lastName || ''}
                          onChange={(e) => setUser(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                          disabled={saveLoading}
                        />
                      </div>

                      <Input
                        label="Email Address"
                        type="email"
                        value={user.email || ''}
                        onChange={(e) => setUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                        disabled={saveLoading}
                      />

                      <Input
                        label="Phone Number"
                        type="tel"
                        value={user.phone || ''}
                        onChange={(e) => setUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                        disabled={saveLoading}
                      />

                      <div className="flex space-x-4 pt-4">
                        <Button
                          type="button"
                          onClick={() => handleProfileUpdate({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            phone: user.phone,
                          })}
                          loading={saveLoading}
                        >
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{user.phone || 'Not provided'}</span>
                      </div>
                      {user.resumeParsedData?.skills && (
                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Resume Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {user.resumeParsedData.skills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )}

              {activeTab === 'preferences' && (
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Job Preferences</h3>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Minimum Experience"
                        value={user.preferences?.experienceMin?.toString() || ''}
                        onChange={(e) => handlePreferencesUpdate({
                          experienceMin: e.target.value ? parseInt(e.target.value) : undefined
                        })}
                        options={experienceOptions}
                      />
                      <Select
                        label="Maximum Experience"
                        value={user.preferences?.experienceMax?.toString() || ''}
                        onChange={(e) => handlePreferencesUpdate({
                          experienceMax: e.target.value ? parseInt(e.target.value) : undefined
                        })}
                        options={experienceOptions}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Minimum Salary (per year)"
                        value={user.preferences?.salaryMin?.toString() || ''}
                        onChange={(e) => handlePreferencesUpdate({
                          salaryMin: e.target.value ? parseInt(e.target.value) : undefined
                        })}
                        options={salaryOptions}
                      />
                      <Select
                        label="Maximum Salary (per year)"
                        value={user.preferences?.salaryMax?.toString() || ''}
                        onChange={(e) => handlePreferencesUpdate({
                          salaryMax: e.target.value ? parseInt(e.target.value) : undefined
                        })}
                        options={salaryOptions}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Locations
                      </label>
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                        {locationOptions.map((location) => (
                          <label key={location} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={user.preferences?.locations?.includes(location) || false}
                              onChange={(e) => {
                                const currentLocations = user.preferences?.locations || [];
                                const newLocations = e.target.checked
                                  ? [...currentLocations, location]
                                  : currentLocations.filter(loc => loc !== location);
                                handlePreferencesUpdate({ locations: newLocations });
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                            />
                            <span className="text-sm text-gray-700">{location}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Types
                      </label>
                      <div className="space-y-2">
                        {jobTypeOptions.map((type) => (
                          <label key={type.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={user.preferences?.jobTypes?.includes(type.value) || false}
                              onChange={(e) => {
                                const currentTypes = user.preferences?.jobTypes || [];
                                const newTypes = e.target.checked
                                  ? [...currentTypes, type.value]
                                  : currentTypes.filter(t => t !== type.value);
                                handlePreferencesUpdate({ jobTypes: newTypes });
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                            />
                            <span className="text-sm text-gray-700">{type.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-6">
                      <Button
                        type="button"
                        onClick={() => {
                          handlePreferencesUpdate(user.preferences || {});
                        }}
                        loading={saveLoading}
                      >
                        Save Preferences
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {activeTab === 'resume' && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Resume Upload</h3>
                    <ResumeUpload
                      onFileSelect={handleResumeUpload}
                      currentResume={user.resumeUrl}
                      maxSize={5 * 1024 * 1024} // 5MB
                      acceptedTypes={['.pdf', '.doc', '.docx']}
                    />
                  </Card>

                  {user.resumeParsedData && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Parsed Resume Data</h3>
                      <div className="space-y-4">
                        {user.resumeParsedData.name && (
                          <div className="flex items-center space-x-3 text-sm">
                            <span className="text-gray-600">Parsed Name:</span>
                            <span className="font-medium">{user.resumeParsedData.name}</span>
                          </div>
                        )}
                        {user.resumeParsedData.email && (
                          <div className="flex items-center space-x-3 text-sm">
                            <span className="text-gray-600">Parsed Email:</span>
                            <span className="font-medium">{user.resumeParsedData.email}</span>
                          </div>
                        )}
                        {user.resumeParsedData.phone && (
                          <div className="flex items-center space-x-3 text-sm">
                            <span className="text-gray-600">Parsed Phone:</span>
                            <span className="font-medium">{user.resumeParsedData.phone}</span>
                          </div>
                        )}
                        {user.resumeParsedData.experience !== undefined && (
                          <div className="flex items-center space-x-3 text-sm">
                            <span className="text-gray-600">Parsed Experience:</span>
                            <span className="font-medium">{user.resumeParsedData.experience} years</span>
                          </div>
                        )}
                        {user.resumeParsedData.education && user.resumeParsedData.education.length > 0 && (
                          <div>
                            <span className="text-gray-600 text-sm">Parsed Education:</span>
                            <div className="mt-2 space-y-1">
                              {user.resumeParsedData.education.map((edu, index) => (
                                <div key={index} className="text-sm text-gray-700">
                                  • {edu.degree} from {edu.institution}
                                  {edu.year && ` (${edu.year})`}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </Layout>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}