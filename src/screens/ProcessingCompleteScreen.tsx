import React from 'react';
import { Check, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const ProcessingCompleteScreen: React.FC = () => {
  const { navigateTo } = useLearning();

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
      id="screen-processing-complete"
      className="min-h-screen px-6 py-10 bg-[#FAF8F5] max-w-md mx-auto flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7C6EE6]" />
          <span className="text-xs font-semibold tracking-wider font-display uppercase text-[#7C6EE6]">
            RECALL
          </span>
        </div>
        <span className="text-[11px] text-[#8A8F9E]">OS Unit 3.pdf</span>
      </div>

      <div className="my-auto py-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#ECE7F9] text-[#7C6EE6] flex items-center justify-center mb-4 shadow-sm border border-[#E8E2F9]">
          <Check className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h2 className="text-2xl font-bold font-display text-[#1E1F24] tracking-tight">
          Your learning material is ready.
        </h2>
        <p className="text-xs text-[#717582] mt-1 mb-6">
          6 core concepts extracted and connected from <strong>Operating Systems — Unit 3</strong>.
        </p>

        <div className="w-full bg-white rounded-3xl p-5 border border-[#EAE6DF] shadow-xs text-left mb-6">
          <span className="text-[10px] font-bold text-[#8A8F9E] uppercase tracking-wider block mb-2.5">
            Knowledge Cards Created
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

      <div>
        <button
          id="processing-complete-explore-btn"
          onClick={() => navigateTo('knowledge-cards', { resourceId: 'res-os-unit3' })}
          className="w-full py-4 px-6 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] active:scale-[0.99] text-white font-medium text-sm shadow-[0_4px_20px_rgba(124,110,230,0.25)] flex items-center justify-center gap-2 transition-all"
        >
          <span>Explore Knowledge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
