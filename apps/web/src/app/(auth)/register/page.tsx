'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useUser';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isRegistering, registerError } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
      });

      // Redirect to onboarding after successful registration
      router.push('/onboarding');
    } catch (err: any) {
      setError(err?.detail || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mb-4">
            <span className="text-3xl">🏃</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">HealthLife AI</h1>
          <p className="text-gray-600 mt-2">Start your health transformation journey today.</p>
        </div>

        {/* Register Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {(error || registerError) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    {error || (registerError as any)?.detail || 'An error occurred'}
                  </p>
                </div>
              )}

              {/* Full Name Input */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={isRegistering}
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isRegistering}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isRegistering}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use at least 8 characters with a mix of letters and numbers
                </p>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={isRegistering}
                  required
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="terms" className="text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            {/* Social Sign Up Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isRegistering}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isRegistering}
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </button>
            </div>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <div className="text-2xl mb-1">🎯</div>
            <p className="text-xs text-gray-600">Personalized Plans</p>
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <div className="text-2xl mb-1">🤖</div>
            <p className="text-xs text-gray-600">AI Coach</p>
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs text-gray-600">Track Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
