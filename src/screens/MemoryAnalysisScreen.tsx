import React from 'react';
import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TopBar } from '../components/Navigation/TopBar';

export const MemoryAnalysisScreen: React.FC = () => {
  const { concepts, navigateTo } = useLearning();

  const strongConcepts = concepts.filter((c) => c.mastery >= 75);
  const needsPractice = concepts.filter((c) => c.mastery >= 45 && c.mastery < 75);
  const forgettingSoon = concepts.filter((c) => c.mastery < 45);

  return (
    <div
      id="screen-memory-analysis"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title="Your Memory" subtitle="Ebbinghaus retention analysis" showBack />

      <div className="px-5 pt-3 space-y-4">
        {/* OVERALL MASTERY HERO */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C6EE6] font-display">
              Overall Retention
            </span>
            <h2 className="text-3xl font-extrabold font-display text-[#1E1F24] tracking-tight mt-1">
              72% <span className="text-sm font-semibold text-[#8A8F9E]">Mastery</span>
            </h2>
            <p className="text-xs text-[#717582] mt-1">
              42 concepts tracked across 3 subjects
            </p>
          </div>

          {/* Large Visual Gauge */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-[#EAE6DF]"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-[#7C6EE6]"
                strokeWidth="5"
                strokeDasharray={163.3}
                strokeDashoffset={163.3 - (163.3 * 72) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <BrainCircuit className="w-6 h-6 text-[#7C6EE6] absolute" />
          </div>
        </div>

        {/* RECALL RECOMMENDATION CARD */}
        <div className="p-5 rounded-3xl bg-[#FAF6FF] border border-[#E0D8F4] shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-[#7C6EE6]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6C5CE7]">
              RECALL recommends
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#1E1F24] font-display">
            Review Banker's Algorithm today.
          </h3>
          <p className="text-xs text-[#4A4E69] mt-1 leading-relaxed">
            Memory decay algorithms predict your retention will decline significantly without a quick 3-minute consolidation.
          </p>
          <button
            id="memory-start-revision-btn"
            onClick={() => navigateTo('focused-revision')}
            className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-[#7C6EE6] hover:bg-[#6C5CE7] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <span>Start Revision</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* STRONG SECTION */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2ECC71]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E1F24]">
                Strong
              </span>
            </div>
            <span className="text-[11px] text-[#8A8F9E]">Safe from decay</span>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'CPU Scheduling', mastery: 86, id: 'c-cpu-sched' },
              { name: 'TCP/IP Handshake', mastery: 81, id: 'c-tcp-handshake' },
              { name: 'DBMS Normalization', mastery: 78, id: 'c-dbms-norm' },
            ].map((c) => (
              <div
                key={c.id}
                onClick={() => navigateTo('knowledge-card-detail', { conceptId: c.id })}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] cursor-pointer transition-colors"
              >
                <span className="text-xs font-medium text-[#1E1F24]">{c.name}</span>
                <span className="text-xs font-bold text-[#2ECC71]">{c.mastery}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* NEEDS PRACTICE */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#E67E22]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E1F24]">
                Needs Practice
              </span>
            </div>
            <span className="text-[11px] text-[#8A8F9E]">Active reinforcement</span>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'Synchronization', mastery: 64, id: 'c-sync' },
              { name: 'Deadlock', mastery: 52, id: 'c-deadlock' },
            ].map((c) => (
              <div
                key={c.id}
                onClick={() => navigateTo('knowledge-card-detail', { conceptId: c.id })}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] cursor-pointer transition-colors"
              >
                <span className="text-xs font-medium text-[#1E1F24]">{c.name}</span>
                <span className="text-xs font-bold text-[#E67E22]">{c.mastery}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* FORGETTING SOON */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#E74C3C]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E1F24]">
                Forgetting Soon
              </span>
            </div>
            <span className="text-[11px] text-[#E74C3C] font-semibold">Priority Today</span>
          </div>

          <div className="space-y-2.5">
            {[
              { name: "Banker's Algorithm", mastery: 28, id: 'c-bankers' },
              { name: 'Page Replacement', mastery: 42, id: 'c-page-replace' },
            ].map((c) => (
              <div
                key={c.id}
                onClick={() => navigateTo('knowledge-card-detail', { conceptId: c.id })}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] cursor-pointer transition-colors"
              >
                <span className="text-xs font-medium text-[#1E1F24]">{c.name}</span>
                <span className="text-xs font-bold text-[#E74C3C]">{c.mastery}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
