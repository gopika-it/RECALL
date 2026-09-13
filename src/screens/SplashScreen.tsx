import React, { useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const SplashScreen: React.FC = () => {
  const { navigateTo } = useLearning();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('login');
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div
      id="screen-splash"
      className="min-h-screen flex flex-col items-center justify-between p-8 bg-[#FAF8F5] text-center select-none"
    >
      <div className="w-full pt-8 flex justify-end">
        <button
          onClick={() => navigateTo('login')}
          className="text-xs text-[#8A8F9E] hover:text-[#1E1F24] font-medium px-3 py-1.5 rounded-full hover:bg-white/80 transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="flex flex-col items-center gap-6 my-auto">
        {/* Minimal Animated Logo */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-[#ECE7F9] rotate-6 animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-white shadow-[0_8px_30px_rgba(108,92,231,0.12)] border border-[#E8E2F9] flex items-center justify-center">
            <div className="w-9 h-9 rounded-2xl bg-[#7C6EE6] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold font-display tracking-tight text-[#1E1F24]">
            RECALL
          </h1>
          <p className="text-sm text-[#717582] font-medium tracking-wide">
            Everything You Learn, Connected
          </p>
        </div>

        {/* Minimal loading dot indicator */}
        <div className="flex items-center gap-1.5 mt-4">
          <span className="w-2 h-2 rounded-full bg-[#7C6EE6] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-[#9F86C0] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-[#D4CEEB] animate-bounce" />
        </div>
      </div>

      <div className="w-full pb-6 text-center">
        <p className="text-[11px] text-[#A0A4B0] uppercase tracking-widest font-medium">
          Personal Learning Memory System
        </p>
      </div>
    </div>
  );
};
