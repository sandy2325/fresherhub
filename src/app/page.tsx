'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlayIcon, UserGroupIcon, BuildingOfficeIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import SearchBox from '@/components/job/SearchBox';
import { Button } from '@/components/ui';
import { JobSearchCriteria } from '@/types';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [searchLoading, setSearchLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (criteria: JobSearchCriteria) => {
    setSearchLoading(true);

    // Construct search URL with parameters
    const searchParams = new URLSearchParams();
    if (criteria.query) searchParams.set('q', criteria.query);
    if (criteria.location?.length) searchParams.set('location', criteria.location.join(','));
    if (criteria.jobTypes?.length) searchParams.set('type', criteria.jobTypes.join(','));
    if (criteria.experienceMin) searchParams.set('exp_min', criteria.experienceMin.toString());
    if (criteria.experienceMax) searchParams.set('exp_max', criteria.experienceMax.toString());
    if (criteria.salaryMin) searchParams.set('salary_min', criteria.salaryMin.toString());
    if (criteria.salaryMax) searchParams.set('salary_max', criteria.salaryMax.toString());
    if (criteria.sortBy) searchParams.set('sort', criteria.sortBy);

    const searchUrl = `/jobs${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

    router.push(searchUrl);

    // Simulate loading time for demo
    setTimeout(() => setSearchLoading(false), 500);
  };

  const featuredCategories = [
    {
      name: 'Internships',
      description: 'Gain valuable experience while learning',
      icon: PlayIcon,
      count: '2,000+',
      href: '/jobs?type=internship'
    },
    {
      name: 'Graduate Trainee',
      description: 'Structured programs for recent graduates',
      icon: UserGroupIcon,
      count: '500+',
      href: '/jobs?query=graduate%20trainee'
    },
    {
      name: 'Fresher Jobs',
      description: 'Entry-level positions for fresh graduates',
      icon: BriefcaseIcon,
      count: '10,000+',
      href: '/jobs?exp_max=1'
    },
    {
      name: 'Remote Opportunities',
      description: 'Work from anywhere in India',
      icon: BuildingOfficeIcon,
      count: '3,000+',
      href: '/jobs?type=remote'
    }
  ];

  const statistics = [
    { value: '50,000+', label: 'Active Jobs' },
    { value: '5,000+', label: 'Companies' },
    { value: '100,000+', label: 'Registered Users' },
    { value: '95%', label: 'Success Rate' }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Developer at Tech Corp',
      content: 'FresherHub helped me land my dream job right after graduation. The platform is incredibly user-friendly and has amazing opportunities.',
      avatar: 'PS'
    },
    {
      name: 'Rahul Kumar',
      role: 'Data Analyst at DataPro',
      content: 'I found multiple interview opportunities through FresherHub. The job recommendations were spot-on and helped me kickstart my career.',
      avatar: 'RK'
    },
    {
      name: 'Neha Patel',
      role: 'Marketing Associate at BrandHub',
      content: 'The platform made my job search so much easier. I could filter jobs based on my preferences and apply directly through original postings.',
      avatar: 'NP'
    }
  ];

  const trustIndicators = [
    { name: 'Google', logo: '🔍' },
    { name: 'Microsoft', logo: '🪟' },
    { name: 'Amazon', logo: '📦' },
    { name: 'TCS', logo: '💻' },
    { name: 'Infosys', logo: '🏢' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Dream
            <span className="block text-blue-200">Fresher Job in India</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
            Connect with top companies and discover exciting career opportunities tailored for fresh graduates across India.
          </p>

          <div className="bg-white rounded-lg shadow-xl p-6 text-gray-900">
            <SearchBox
              onSearch={handleSearch}
              loading={searchLoading}
              placeholder="Search for jobs, companies, or skills..."
              showFilters={false}
            />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Explore Job Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{category.count}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Trusted by Job Seekers and Companies
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Top Companies Hiring Through FresherHub
            </h3>
            <p className="text-gray-600">Join thousands of successful career journeys</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {trustIndicators.map((company) => (
              <div key={company.name} className="flex flex-col items-center group cursor-pointer">
                <div className="text-3xl lg:text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {company.logo}
                </div>
                <span className="text-sm font-medium text-gray-700">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Success Stories from Our Users
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Career Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of freshers who found their dream jobs through FresherHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/auth/signup">Create Profile</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}