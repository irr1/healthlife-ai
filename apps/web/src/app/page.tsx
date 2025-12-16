'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { hasValidToken } from '@/lib/cookies';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (hasValidToken()) {
      router.push('/focus');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
      <div className="max-w-4xl mx-auto px-4 text-center text-white">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 animate-bounce">
          <span className="text-6xl">🏃</span>
        </div>

        {/* Title */}
        <h1 className="text-7xl font-bold mb-6 animate-fadeIn">HealthLife AI</h1>

        {/* Subtitle */}
        <p className="text-2xl mb-4 opacity-90">Your Personal AI Health Coach</p>
        <p className="text-lg mb-12 opacity-75 max-w-2xl mx-auto">
          Transform your health journey with personalized plans, AI coaching, and real-time progress tracking.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-16">
          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="inline-block bg-white/20 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all border-2 border-white/40"
          >
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Personalized Plans</h3>
            <p className="text-sm opacity-80">
              AI-generated health plans tailored to your unique goals and lifestyle
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">24/7 AI Coach</h3>
            <p className="text-sm opacity-80">
              Get instant advice, motivation, and guidance whenever you need it
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-sm opacity-80">
              Visualize your journey with detailed analytics and insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
