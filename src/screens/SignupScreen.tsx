import React, { useState } from 'react';
import { Sparkles, ArrowRight, Mail, Lock, User } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const SignupScreen: React.FC = () => {
  const { navigateTo } = useLearning();
  const [name, setName] = useState('Gopika S');
  const [email, setEmail] = useState('gopika.s@university.edu');
  const [password, setPassword] = useState('••••••••••••');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('onboarding');
  };

  return (
    <div
      id="screen-signup"
      className="min-h-screen flex flex-col justify-between px-6 py-8 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <div className="pt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-[#EAE6DF] flex items-center justify-center text-[#7C6EE6]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-display tracking-tight text-[#1E1F24]">
              RECALL
            </span>
            <span className="block text-[10px] uppercase font-semibold text-[#8A8F9E] tracking-widest">
              Create Account
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold font-display text-[#1E1F24] tracking-tight">
            Start remembering
          </h1>
          <p className="text-sm text-[#717582] mt-1">
            Build your personal connected learning memory.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#4A4E69] mb-1.5 ml-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8F9E]">
                <User className="w-4 h-4" />
              </div>
              <input
                id="signup-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-[#EAE6DF] text-sm text-[#1E1F24] placeholder-[#A0A4B0] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/30 focus:border-[#7C6EE6] transition-all shadow-sm"
                placeholder="Gopika S"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#4A4E69] mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8F9E]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="signup-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-[#EAE6DF] text-sm text-[#1E1F24] placeholder-[#A0A4B0] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/30 focus:border-[#7C6EE6] transition-all shadow-sm"
                placeholder="gopika@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#4A4E69] mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8F9E]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="signup-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-[#EAE6DF] text-sm text-[#1E1F24] placeholder-[#A0A4B0] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/30 focus:border-[#7C6EE6] transition-all shadow-sm"
                placeholder="Create a strong password"
              />
            </div>
          </div>

          <button
            id="signup-submit-btn"
            type="submit"
            className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] active:scale-[0.99] text-white font-medium text-sm shadow-[0_4px_16px_rgba(124,110,230,0.25)] flex items-center justify-center gap-2 transition-all"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="pt-6 pb-2 text-center">
        <p className="text-xs text-[#717582]">
          Already have an account?{' '}
          <button
            onClick={() => navigateTo('login')}
            className="text-[#7C6EE6] font-semibold hover:underline ml-1"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
