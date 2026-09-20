import React from 'react';
import { Clock, ArrowRight, Sparkles, Layers, AlertTriangle, ChevronRight } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TopBar } from '../components/Navigation/TopBar';

export const FocusedRevisionScreen: React.FC = () => {
  const { concepts, navigateTo } = useLearning();

  const dueConcepts = [
    { title: "Banker's Algorithm", topic: 'OS Concurrency', id: 'c-bankers', reason: 'Decay below 30%' },
    { title: 'Page Replacement', topic: 'Memory Systems', id: 'c-page-replace', reason: 'Review due today' },
    { title: 'Circular Wait', topic: 'OS Deadlock', id: 'c-circularwait', reason: 'Stalled recall rate' },
  ];

  return (
    <div
      id="screen-focused-revision"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title="Focused Revision" subtitle="Review only what needs your attention." showBack />

      <div className="px-5 pt-4 space-y-5">
        {/* QUICK REVIEW SUMMARY CARD */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="py-1 px-3 rounded-full bg-[#ECE7F9] text-[#6C5CE7] text-[11px] font-semibold tracking-wide">
              Targeted Session
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#717582]">
              <Clock className="w-3.5 h-3.5 text-[#7C6EE6]" />
              <span>8 min</span>
            </div>
          </div>

          <h2 className="text-lg font-bold font-display text-[#1E1F24] tracking-tight">
            Consolidate At-Risk Concepts
          </h2>
          <p className="text-xs text-[#717582] mt-1 leading-relaxed">
            Short, focused active recall cards. Flip each card, review core mechanics, and self-rate your memory state.
          </p>

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#F2EFE9] text-xs text-[#4A4E69]">
            <span className="font-semibold text-[#1E1F24]">5 concepts</span>
            <span>•</span>
            <span>8 min</span>
            <span>•</span>
            <span className="text-[#6C5CE7] font-medium">Auto-calibrated</span>
          </div>

          <button
            id="revision-start-session-btn"
            onClick={() => navigateTo('revision-session')}
            className="mt-4 w-full py-3.5 px-4 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] active:scale-[0.99] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <span>Start Revision</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* DUE TODAY SECTION */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5 px-1">
            <AlertTriangle className="w-3.5 h-3.5 text-[#E74C3C]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8F9E]">
              Due Today
            </span>
          </div>

          <div className="space-y-2.5">
            {dueConcepts.map((item) => (
              <div
                key={item.id}
                onClick={() => navigateTo('knowledge-card-detail', { conceptId: item.id })}
                className="p-4 rounded-3xl bg-white border border-[#EAE6DF] hover:border-[#7C6EE6]/60 cursor-pointer flex items-center justify-between transition-colors shadow-xs group"
              >
                <div>
                  <span className="text-[10px] font-medium text-[#7C6EE6]">
                    {item.topic}
                  </span>
                  <h3 className="text-xs font-bold text-[#1E1F24] group-hover:text-[#6C5CE7] transition-colors mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-[#E74C3C] mt-0.5 font-medium">
                    {item.reason}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A0A4B0] group-hover:text-[#7C6EE6] transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
