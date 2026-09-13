import React, { useState } from 'react';
import { Sparkles, ArrowRight, Mail, Lock } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const LoginScreen: React.FC = () => {
  const { navigateTo } = useLearning();
  const [email, setEmail] = useState('gopika.s@university.edu');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('onboarding');
  };

  return (
    <div
      id="screen-login"
      className="min-h-screen flex flex-col justify-between px-6 py-8 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <div className="pt-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-[#EAE6DF] flex items-center justify-center text-[#7C6EE6]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-display tracking-tight text-[#1E1F24]">
              RECALL
            </span>
            <span className="block text-[10px] uppercase font-semibold text-[#8A8F9E] tracking-widest">
              Memory System
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold font-display text-[#1E1F24] tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-[#717582] mt-1">
            Sign in to reconnect with your knowledge.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-[#4A4E69] mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8F9E]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-[#EAE6DF] text-sm text-[#1E1F24] placeholder-[#A0A4B0] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/30 focus:border-[#7C6EE6] transition-all shadow-sm"
                placeholder="name@university.edu"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1">
              <label className="text-xs font-medium text-[#4A4E69]">Password</label>
              <button
                type="button"
                onClick={() => navigateTo('forgot-password')}
                className="text-xs text-[#7C6EE6] hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8F9E]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-[#EAE6DF] text-sm text-[#1E1F24] placeholder-[#A0A4B0] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/30 focus:border-[#7C6EE6] transition-all shadow-sm"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            id="login-submit-btn"
            type="submit"
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] active:scale-[0.99] text-white font-medium text-sm shadow-[0_4px_16px_rgba(124,110,230,0.25)] flex items-center justify-center gap-2 transition-all"
          >
            <span>Log In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#EAE6DF]" />
          </div>
          <span className="relative px-3 bg-[#FAF8F5] text-[11px] font-medium text-[#8A8F9E] uppercase tracking-wider">
            Or continue with
          </span>
        </div>

        {/* Visual Social Logins */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigateTo('onboarding')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-[#F3F0EA] active:bg-[#EAE6DF] border border-[#EAE6DF] rounded-2xl text-xs font-medium text-[#2D3142] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('onboarding')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-[#F3F0EA] active:bg-[#EAE6DF] border border-[#EAE6DF] rounded-2xl text-xs font-medium text-[#2D3142] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.02-.49 2.63-1.24z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>
      </div>

      {/* Footer Create Account */}
      <div className="pt-6 pb-2 text-center">
        <p className="text-xs text-[#717582]">
          New to RECALL?{' '}
          <button
            onClick={() => navigateTo('signup')}
            className="text-[#7C6EE6] font-semibold hover:underline ml-1"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};
