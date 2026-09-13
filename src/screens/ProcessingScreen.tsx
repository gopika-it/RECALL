import React, { useState, useEffect } from 'react';
import { Check, Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const ProcessingScreen: React.FC = () => {
  const { navigateTo } = useLearning();
  const [stepIndex, setStepIndex] = useState(2); // 0 to 4, then complete
  const [isDone, setIsDone] = useState(false);

  const steps = [
    'Extracting content',
    'Identifying concepts',
    'Creating knowledge cards',
    'Finding relationships',
    'Preparing quiz',
  ];

  useEffect(() => {
    // Automatically advance through steps
    const timers = [
      setTimeout(() => setStepIndex(1), 700),
      setTimeout(() => setStepIndex(2), 1500),
      setTimeout(() => setStepIndex(3), 2300),
      setTimeout(() => setStepIndex(4), 3100),
      setTimeout(() => setIsDone(true), 3900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const generatedConcepts = [
    'Deadlock',
    'Mutual Exclusion',
    'Hold and Wait',
    'No Preemption',
    'Circular Wait',
    "Banker's Algorithm",
  ];

  return (
    <div
      id="screen-processing"
      className="min-h-screen px-6 py-10 bg-[#FAF8F5] max-w-md mx-auto flex flex-col justify-between"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7C6EE6]" />
          <span className="text-xs font-semibold tracking-wider font-display uppercase text-[#7C6EE6]">
            RECALL AI Engine
          </span>
        </div>
        <span className="text-[11px] text-[#8A8F9E] font-medium">OS Unit 3.pdf</span>
      </div>

      {/* Center Body */}
      <div className="my-auto py-6">
        {!isDone ? (
          <div className="flex flex-col items-center text-center">
            {/* Pulsing AI Circle */}
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#ECE7F9] animate-ping opacity-60" />
              <div className="relative w-20 h-20 rounded-3xl bg-white border border-[#EAE6DF] shadow-md flex items-center justify-center text-[#7C6EE6]">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <h2 className="text-xl font-bold font-display text-[#1E1F24] tracking-tight">
              Analyzing Knowledge Structure
            </h2>
            <p className="text-xs text-[#717582] mt-1 mb-8 max-w-[260px]">
              Distilling core principles, finding dependencies, and synthesizing recall questions.
            </p>

            {/* Sequence Steps */}
            <div className="w-full max-w-[280px] space-y-3 text-left">
              {steps.map((label, idx) => {
                const isCompleted = isDone || idx < stepIndex;
                const isCurrent = !isDone && idx === stepIndex;
                return (
                  <div
                    key={label}
                    className={`flex items-center gap-3 py-1.5 px-3 rounded-2xl transition-all ${
                      isCurrent
                        ? 'bg-[#ECE7F9] text-[#6C5CE7] font-semibold'
                        : isCompleted
                        ? 'text-[#2ECC71] font-medium'
                        : 'text-[#A0A4B0]'
                    }`}
                  >
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-[#2ECC71]/15 text-[#2ECC71] flex items-center justify-center text-xs shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[2.6]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full bg-[#7C6EE6] text-white flex items-center justify-center text-xs shrink-0">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-[#D5CFE8] flex items-center justify-center text-xs shrink-0" />
                    )}
                    <span className="text-xs">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
            {/* Completion Badge */}
            <div className="w-16 h-16 rounded-3xl bg-[#ECE7F9] text-[#7C6EE6] flex items-center justify-center mb-4 shadow-sm border border-[#E8E2F9]">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h2 className="text-2xl font-bold font-display text-[#1E1F24] tracking-tight">
              Your learning material is ready.
            </h2>
            <p className="text-xs text-[#717582] mt-1 mb-6">
              6 core concepts extracted and connected from <strong>Operating Systems — Unit 3</strong>.
            </p>

            {/* Concept Pills Container */}
            <div className="w-full bg-white rounded-3xl p-4 border border-[#EAE6DF] shadow-xs text-left mb-6">
              <span className="text-[10px] font-bold text-[#8A8F9E] uppercase tracking-wider block mb-2.5">
                Generated Knowledge Concepts
              </span>
              <div className="flex flex-wrap gap-2">
                {generatedConcepts.map((c) => (
                  <span
                    key={c}
                    className="py-1 px-3 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] text-xs font-medium text-[#2D3142]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div>
        {isDone ? (
          <button
            id="processing-explore-knowledge-btn"
            onClick={() => navigateTo('knowledge-cards', { resourceId: 'res-os-unit3' })}
            className="w-full py-4 px-6 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] active:scale-[0.99] text-white font-medium text-sm shadow-[0_4px_20px_rgba(124,110,230,0.25)] flex items-center justify-center gap-2 transition-all"
          >
            <span>Explore Knowledge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsDone(true)}
            className="w-full py-2.5 text-center text-xs text-[#8A8F9E] hover:text-[#7C6EE6]"
          >
            Skip Animation
          </button>
        )}
      </div>
    </div>
  );
};
