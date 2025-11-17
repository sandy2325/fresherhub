'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, UserCircleIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '../ui';
import { User } from '@/types';

interface HeaderProps {
  user?: User | null;
  onSearch?: (query: string) => void;
}

const Header = ({ user, onSearch }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
      router.push(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAuthAction = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  const navigation = [
    { name: 'Find Jobs', href: '/jobs' },
    { name: 'Companies', href: '#' },
    { name: 'Resources', href: '#' },
    { name: 'About', href: '#' },
  ];

  const userNavigation = user ? [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' },
    { name: 'Saved Jobs', href: '/dashboard?tab=saved' },
    { name: 'Applied Jobs', href: '/dashboard?tab=applied' },
    { name: 'Settings', href: '/profile?tab=settings' },
    { name: 'Sign Out', href: '/auth/logout' },
  ] : [
    { name: 'Sign In', href: '/auth/login' },
    { name: 'Sign Up', href: '/auth/signup' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">FresherHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs..."
                  className="pl-10 pr-4 py-2"
                />
              </div>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <Link href="/dashboard?tab=saved" className="relative p-2 text-gray-600 hover:text-blue-600">
                <BookmarkIcon className="h-6 w-6" />
              </Link>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleAuthAction}
              className="flex items-center space-x-2"
            >
              {user ? (
                <>
                  <UserCircleIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">{user.firstName || user.email}</span>
                </>
              ) : (
                <>
                  <UserCircleIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </>
              )}
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search jobs..."
                      className="pl-10 w-full"
                    />
                  </div>
                </form>
              </div>

              {/* Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* User Links */}
              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;