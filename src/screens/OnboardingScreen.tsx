import React, { useState } from 'react';
import { Sparkles, ArrowRight, Layers, Network, BrainCircuit, Check } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

const steps = [
  {
    step: 1,
    badge: 'Step 1 of 3',
    title: 'Capture what you learn.',
    subtitle:
      'Import PDFs, lecture slides, links, or quick voice notes. RECALL reads between the lines and extracts foundational concepts.',
    icon: Layers,
    illustration: (
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-[#ECE7F9]/70 rounded-full blur-xl" />
        <div className="relative bg-white rounded-3xl p-5 border border-[#EAE6DF] shadow-md w-40 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7C6EE6]" />
            <span className="text-[11px] font-semibold text-[#1E1F24]">OS Unit 3.pdf</span>
          </div>
          <div className="h-1.5 bg-[#F0ECE1] rounded-full w-full" />
          <div className="h-1.5 bg-[#F0ECE1] rounded-full w-4/5" />
          <div className="mt-2 py-1 px-2 rounded-lg bg-[#ECE7F9] text-[10px] text-[#6C5CE7] font-medium flex items-center justify-between">
            <span>Extracting 12 concepts</span>
            <Check className="w-3 h-3" />
          </div>
        </div>
      </div>
    ),
  },
  {
    step: 2,
    badge: 'Step 2 of 3',
    title: 'Connect your knowledge.',
    subtitle:
      'No isolated flashcards. Concepts are automatically linked into an interactive knowledge web showing causes, conditions, and algorithms.',
    icon: Network,
    illustration: (
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-[#E8E2F9]/50 rounded-full blur-lg" />
        <div className="relative flex flex-col items-center gap-3">
          <div className="py-1.5 px-3 rounded-2xl bg-white border border-[#7C6EE6] text-[#6C5CE7] text-xs font-semibold shadow-sm">
            Deadlock
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-px bg-[#7C6EE6]/40 rotate-12" />
            <div className="h-6 w-px bg-[#7C6EE6]/40 -rotate-12" />
          </div>
          <div className="flex gap-2">
            <span className="py-1 px-2.5 rounded-xl bg-white border border-[#EAE6DF] text-[10px] font-medium text-[#4A4E69]">
              Hold & Wait
            </span>
            <span className="py-1 px-2.5 rounded-xl bg-white border border-[#EAE6DF] text-[10px] font-medium text-[#4A4E69]">
              Circular Wait
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    step: 3,
    badge: 'Step 3 of 3',
    title: 'Remember what matters.',
    subtitle:
      'Intelligent spaced recall, adaptive mini-quizzes, and memory decay analysis ensure critical knowledge sticks long after exam day.',
    icon: BrainCircuit,
    illustration: (
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-[#ECE7F9]/70 rounded-full blur-xl" />
        <div className="relative bg-white rounded-3xl p-5 border border-[#EAE6DF] shadow-md w-44 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full border-4 border-[#7C6EE6] border-t-[#ECE7F9] flex items-center justify-center mb-2">
            <span className="text-sm font-bold text-[#1E1F24]">72%</span>
          </div>
          <span className="text-[11px] font-semibold text-[#1E1F24]">Retention Forecast</span>
          <span className="text-[9px] text-[#717582] mt-0.5">3 concepts scheduled today</span>
        </div>
      </div>
    ),
  },
];

export const OnboardingScreen: React.FC = () => {
  const { navigateTo } = useLearning();
  const [currentStep, setCurrentStep] = useState(0);

  const active = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigateTo('home');
    }
  };

  return (
    <div
      id="screen-onboarding"
      className="min-h-screen flex flex-col justify-between px-6 py-8 bg-[#FAF8F5] max-w-md mx-auto select-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7C6EE6]" />
          <span className="text-xs font-semibold tracking-wider font-display uppercase text-[#7C6EE6]">
            RECALL
          </span>
        </div>
        <button
          id="onboarding-skip-btn"
          onClick={() => navigateTo('home')}
          className="text-xs text-[#8A8F9E] hover:text-[#1E1F24] font-medium px-2 py-1"
        >
          Skip
        </button>
      </div>

      {/* Middle Illustration & Text */}
      <div className="my-auto py-6 flex flex-col items-center text-center">
        {/* Step Visual */}
        <div className="mb-6">{active.illustration}</div>

        <span className="inline-block py-1 px-3 rounded-full bg-[#ECE7F9] text-[#6C5CE7] text-[11px] font-semibold tracking-wide mb-3">
          {active.badge}
        </span>

        <h2 className="text-2xl font-bold font-display text-[#1E1F24] tracking-tight max-w-[280px]">
          {active.title}
        </h2>

        <p className="text-xs text-[#717582] mt-3 leading-relaxed max-w-[320px]">
          {active.subtitle}
        </p>

        {/* Step Dots */}
        <div className="flex items-center gap-2 mt-8">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-6 bg-[#7C6EE6]' : 'w-1.5 bg-[#D5CFE8]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pb-4">
        <button
          id="onboarding-action-btn"
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] active:scale-[0.99] text-white font-medium text-sm shadow-[0_4px_20px_rgba(124,110,230,0.25)] flex items-center justify-center gap-2 transition-all"
        >
          <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
