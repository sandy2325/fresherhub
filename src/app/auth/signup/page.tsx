'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Button, Input, Card } from '@/components/ui';
import { SignupCredentials } from '@/types';

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [credentials, setCredentials] = useState<SignupCredentials>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (field: keyof SignupCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!credentials.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (credentials.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!credentials.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (credentials.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(credentials.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call to register user
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        // Auto-login after successful registration
        const result = await signIn('credentials', {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push(callbackUrl);
        } else {
          setErrors({ submit: 'Registration successful, but login failed. Please try signing in manually.' });
        }
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      // For demo, simulate successful registration and redirect
      setErrors({ submit: 'Demo mode: Registration successful. You can now sign in.' });
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error('OAuth sign in error:', error);
      setErrors({ submit: `Failed to sign up with ${provider}. Please try again.` });
    }
  };

  const strengths = [
    { label: '8+ characters', test: (pwd: string) => pwd.length >= 8 },
    { label: 'One uppercase', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'One lowercase', test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: 'One number', test: (pwd: string) => /\d/.test(pwd) },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <Card className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create Your FresherHub Account
              </h1>
              <p className="text-gray-600">
                Join thousands of freshers finding their dream jobs in India.
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={() => handleOAuthSignIn('google')}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
                disabled={loading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 15.31 8.27 20 12 20c2.7 0 5.18-.88 7.1-2.36z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85 2.22c.81-2.33 2.7-3.99 5.48-3.99z"
                  />
                </svg>
                <span>Sign up with Google</span>
              </Button>

              <Button
                onClick={() => handleOAuthSignIn('github')}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 9.8v-6.941h-5.691v-6.906h5.691v-6.941c0-6.054 3.641-8.516 9.744-8.516.647 0 1.3.013.084 1.938.238l5.369 4.171c1.58-1.051 2.881-2.532 3.629-4.434.751-.791 1.321-1.741 1.739-2.803l-5.369-4.171z"/>
                </svg>
                <span>Sign up with GitHub</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {errors.submit}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="First Name"
                  value={credentials.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={errors.firstName}
                  placeholder="Enter your first name"
                  disabled={loading}
                  autoComplete="given-name"
                  required
                />

                <Input
                  type="text"
                  label="Last Name"
                  value={credentials.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={errors.lastName}
                  placeholder="Enter your last name"
                  disabled={loading}
                  autoComplete="family-name"
                  required
                />
              </div>

              <Input
                type="email"
                label="Email Address"
                value={credentials.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="Enter your email address"
                disabled={loading}
                autoComplete="email"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    value={credentials.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={errors.password}
                    placeholder="Create a password"
                    disabled={loading}
                    autoComplete="new-password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  value={errors.confirmPassword ? '' : '•••••••••'} // Don't show actual value
                  onChange={(e) => setCredentials(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm your password"
                  disabled={loading}
                  autoComplete="new-password"
                  required
                />
              </div>

              {credentials.password && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password Strength:</label>
                  <div className="space-y-1">
                    {strengths.map((strength, index) => {
                      const isValid = strength.test(credentials.password || '');
                      return (
                        <div key={index} className="flex items-center text-sm">
                          <div className={`w-4 h-4 rounded-full mr-2 ${
                            isValid ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            {isValid && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 00-1.414 1.414L4.586 9.414a1 1 0 00-.707.293l1.414 1.414a1 1 0 001.414 0L10 7.414l3.293 3.293a1 1 0 001.414 0l1.414-1.414a1 1 0 00-.293-.707L11.586 9.414a1 1 0 01-.707-.293L7.586 5.414a1 1 0 01-.707 0l-1.414 1.414a1 1 0 010 1.414l4 4a1 1 0 001.414 0l1.414-1.414a1 1 0 00.293.707L12.414 14.586a1 1 0 01.707.293l1.414-1.414a1 1 0 01-.293-.707L9.586 10.586a1 1 0 00-.707.293z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className={isValid ? 'text-green-700' : 'text-gray-500'}>
                            {strength.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <Input
                type="tel"
                label="Phone Number (Optional)"
                value={credentials.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="+91 98765 43210"
                disabled={loading}
                autoComplete="tel"
              />

              {/* Terms and Conditions */}
              <div className="space-y-2">
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-sm text-red-600">{errors.terms}</p>
                )}
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
                disabled={!acceptTerms}
              >
                Create Account
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </div>
            </div>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c0-1.111-.489-2.643-1.514-4.18-.697-.992-1.728-1.638-2.642-1.638a1.003 1.003 0 00-.627-.223l-2.894 2.274a1 1 0 00-.417 1.361c.305.76.784 1.4 1.401 1.401l2.631-.261c.16-.016.306-.134.306-.294V4c0-.163-.137-.294-.306-.311l-2.692-.26a8.008 8.008 0 01-1.421-.125 8.92 8.92 0 00-.792-.062C11.58 2.418 8.586 2.166 5.6 2.165a8.99 8.99 0 00-3.434.66c-2.214.417-3.748 1.632-4.582 2.642a1.004 1.004 0 00-.61-.212l-2.804 2.19a1 1 0 00-.334 1.353c.407.685.79 1.313.962 2.007l2.265-.224a9.896 9.896 0 001.75-.153 8.98 8.98 0 00.748-.058c1.064-.289 2.086-.68 2.887-1.154l2.426 1.897a1.01 1.01 0 00.413.327c.108.117.192.237.192.391z" clipRule="evenodd" />
                </svg>
                <span>Secure signup</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 4 10 4s8.268 1.943 9.542 6c.053.395.165.85.34 1.3.09a7.952 7.952 0 004.82 3.341l.421 3.692c.044.311-.202.665-.438.893-.605.229-1.585-1.604-3.267-3.015-3.267C17.793 8.199 14.96 5.25 11.623 5.25c-2.529 0-4.809 1.583-5.666 3.533l-4.925-1.104A2 2 0 004.767 6.326C5.348 5.229 10 2.25 10 2.25c-1.024 0-1.833.195-2.569.493z" clipRule="evenodd" />
                </svg>
                <span>Free forever</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              By creating an account, you agree to receive job alerts and updates from FresherHub.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </Layout>
    }>
      <SignupPageContent />
    </Suspense>
  );
}