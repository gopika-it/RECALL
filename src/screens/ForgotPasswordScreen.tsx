import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const ForgotPasswordScreen: React.FC = () => {
  const { navigateTo } = useLearning();
  const [email, setEmail] = useState('gopika.s@university.edu');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div
      id="screen-forgot-password"
      className="min-h-screen flex flex-col justify-between px-6 py-8 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <div className="pt-4">
        <button
          onClick={() => navigateTo('login')}
          className="flex items-center gap-2 text-xs font-medium text-[#717582] hover:text-[#1E1F24] mb-6 px-3 py-1.5 rounded-full bg-white border border-[#EAE6DF] w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </button>

        <h1 className="text-2xl font-bold font-display text-[#1E1F24] tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-[#717582] mt-1 mb-6">
          Enter your registered email and we’ll send a link to restore access to your memory vault.
        </p>

        {sent ? (
          <div className="bg-white p-6 rounded-3xl border border-[#EAE6DF] shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-[#ECE7F9] text-[#7C6EE6] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-base font-semibold text-[#1E1F24]">Recovery Link Sent</h2>
            <p className="text-xs text-[#717582] mt-1.5 leading-relaxed">
              We dispatched a secure reset link to <strong className="text-[#1E1F24]">{email}</strong>.
            </p>
            <button
              onClick={() => navigateTo('login')}
              className="mt-5 w-full py-3 rounded-2xl bg-[#7C6EE6] text-white text-xs font-medium"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#4A4E69] mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8F9E]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-[#EAE6DF] text-sm text-[#1E1F24] placeholder-[#A0A4B0] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/30 focus:border-[#7C6EE6] transition-all shadow-sm"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] text-white font-medium text-sm shadow-sm transition-all"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>

      <div className="text-center pb-4">
        <p className="text-xs text-[#8A8F9E]">
          Remember your password?{' '}
          <button onClick={() => navigateTo('login')} className="text-[#7C6EE6] font-semibold hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
