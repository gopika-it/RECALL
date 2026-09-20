import React from 'react';
import {
  Bell,
  Target,
  BookOpen,
  CheckSquare,
  Flame,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  Zap,
  PlusCircle,
  MessageCircle,
  ClipboardCheck,
  Clock,
  FileText,
  Bookmark,
  Network,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const HomeDashboardScreen: React.FC = () => {
  const {
    profile,
    concepts,
    resources,
    navigateTo,
  } = useLearning();

  // Find Deadlock concept for live mastery representation
  const deadlockConcept = concepts.find((c) => c.id === 'c-deadlock') || concepts[0];
  const syncConcept = concepts.find((c) => c.id === 'c-sync') || concepts[6];
  const cpuConcept = concepts.find((c) => c.id === 'c-cpu-sched') || concepts[7];

  return (
    <div
      id="screen-home-dashboard"
      className="min-h-screen pb-28 bg-[#FAF8F5] max-w-md mx-auto px-5 pt-3 transition-all relative overflow-hidden"
    >
      {/* Soft lavender decorative background glow top-right matching reference image */}
      <div className="w-56 h-56 rounded-full bg-[#ECE7F9]/70 blur-3xl absolute -top-12 -right-12 pointer-events-none" />

      {/* Top Status Bar Mockup */}
      <div className="flex items-center justify-between text-[11px] font-semibold text-[#1E1F24] pt-1 pb-3 px-1">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          {/* Signal bars */}
          <div className="flex items-end gap-[1.5px] h-2.5">
            <span className="w-[2.5px] h-1 bg-[#1E1F24] rounded-xs" />
            <span className="w-[2.5px] h-1.5 bg-[#1E1F24] rounded-xs" />
            <span className="w-[2.5px] h-2 bg-[#1E1F24] rounded-xs" />
            <span className="w-[2.5px] h-2.5 bg-[#1E1F24] rounded-xs" />
          </div>
          {/* Wifi icon */}
          <svg className="w-3 h-3 text-[#1E1F24]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 2.5c3.96 0 7.55 1.57 10.19 4.12L12 18.39 1.81 10.62C4.45 8.07 8.04 6.5 12 6.5z" />
          </svg>
          {/* Battery */}
          <div className="w-5 h-2.5 border border-[#1E1F24] rounded-xs p-[1px] flex items-center">
            <div className="h-full w-3 bg-[#1E1F24] rounded-xs" />
          </div>
        </div>
      </div>

      {/* Brand Header & Profile Avatar Row */}
      <div className="flex items-center justify-between pt-1 mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-1">
            <span className="font-display font-black text-xl text-[#3730A3] tracking-tight">
              RECALL
            </span>
            <span className="text-[#5342D6] text-sm -mt-2">✦</span>
          </div>
          <p className="text-[11px] text-[#717582] font-normal tracking-tight">
            Everything You Learn, Connected
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Notification Bell */}
          <button
            id="home-bell-btn"
            onClick={() => navigateTo('notifications')}
            className="relative w-9 h-9 rounded-full bg-white/80 border border-[#EAE6DF] shadow-2xs flex items-center justify-center text-[#4A4E69] hover:bg-white transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="w-2 h-2 rounded-full bg-[#EF4444] border-2 border-white absolute top-1.5 right-1.5" />
          </button>

          {/* User Avatar */}
          <button
            id="home-avatar-btn"
            onClick={() => navigateTo('profile')}
            className="w-9 h-9 rounded-full overflow-hidden border border-[#EAE6DF] shadow-2xs hover:ring-2 hover:ring-[#5342D6]/40 transition-all bg-[#F3EFFE] flex items-center justify-center"
            aria-label="Profile"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Gopika"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>

      {/* Greeting Row & Handwritten Note */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div>
          <h1 className="text-[22px] font-bold font-display text-[#1E1F24] tracking-tight flex items-center gap-1.5">
            <span>Good morning, Gopika</span>
            <span className="text-xl">☀️</span>
          </h1>
          <p className="text-xs text-[#717582] mt-0.5">
            Ready to remember something today?
          </p>
        </div>

        {/* Floating Handwritten Inspiration Note matching reference image */}
        <div className="text-right -rotate-6 transform select-none pointer-events-none pt-1">
          <span className="text-[10px] font-semibold font-display text-[#5342D6] block leading-tight">
            Small steps
          </span>
          <span className="text-[10px] font-semibold font-display text-[#5342D6] block leading-tight">
            build big memory
          </span>
          <span className="text-[10px] text-[#5342D6] block text-center mt-0.5">💜</span>
        </div>
      </div>

      {/* CARD 1: TODAY'S FOCUS */}
      <div
        id="home-todays-focus-card"
        onClick={() => navigateTo('focused-revision')}
        className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)] cursor-pointer hover:border-[#5342D6]/40 transition-all mb-4 group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F0EBFC] text-[#5342D6] flex items-center justify-center shrink-0">
              <Target className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-sm font-bold font-display text-[#1E1F24] tracking-tight">
              Today's Focus
            </h2>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8A8F9E] group-hover:text-[#5342D6] transition-colors" />
        </div>

        {/* 3 Columns with Vertical Dividers */}
        <div className="grid grid-cols-3 divide-x divide-[#F0EDE6] pt-1">
          {/* Column 1: Concepts to revise */}
          <div className="pr-3 text-left">
            <div className="flex items-center gap-1.5 text-[#5342D6] mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-xl font-extrabold font-display text-[#1E1F24]">2</span>
            </div>
            <span className="text-[10px] text-[#717582] block leading-tight">
              concepts to revise
            </span>
          </div>

          {/* Column 2: Questions to practice */}
          <div className="px-3 text-left">
            <div className="flex items-center gap-1.5 text-[#5342D6] mb-1">
              <CheckSquare className="w-4 h-4" />
              <span className="text-xl font-extrabold font-display text-[#1E1F24]">10</span>
            </div>
            <span className="text-[10px] text-[#717582] block leading-tight">
              questions to practice
            </span>
          </div>

          {/* Column 3: Day streak */}
          <div className="pl-3 text-left">
            <div className="flex items-center gap-1.5 text-[#F97316] mb-1">
              <Flame className="w-4 h-4 fill-[#F97316]" />
              <span className="text-xl font-extrabold font-display text-[#1E1F24]">5</span>
            </div>
            <span className="text-[10px] text-[#717582] block leading-tight">
              day streak
            </span>
          </div>
        </div>
      </div>

      {/* CARD 2: CONTINUE LEARNING */}
      <div
        id="home-continue-learning-card"
        className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)] mb-4 transition-all"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F0EBFC] text-[#5342D6] flex items-center justify-center shrink-0">
              <Bookmark className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-[#5342D6]">
              Continue Learning
            </span>
          </div>
          <button
            onClick={() => navigateTo('knowledge-cards')}
            className="text-[#8A8F9E] hover:text-[#5342D6]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-base font-bold font-display text-[#1E1F24] tracking-tight mt-1">
          Operating Systems
        </h3>
        <p className="text-xs text-[#717582] mt-0.5">Deadlock</p>

        {/* Progress bar + Continue pill button */}
        <div className="flex items-center justify-between gap-4 mt-3 pt-1">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-1 bg-[#EAE6F8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#5342D6] h-full rounded-full transition-all duration-700"
                style={{ width: `${deadlockConcept.mastery}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-[#1E1F24] shrink-0">
              {deadlockConcept.mastery}%
            </span>
          </div>

          <button
            id="home-continue-btn"
            onClick={() => navigateTo('knowledge-card-detail', { conceptId: 'c-deadlock' })}
            className="py-2 px-5 rounded-full bg-[#4E3EC8] hover:bg-[#4335B3] active:scale-[0.98] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CARD 3: WEAK CONCEPTS (With subtle warm pink tint) */}
      <div
        id="home-weak-concepts-card"
        className="p-5 rounded-3xl bg-[#FFF9F8] border border-[#FCEEEB] shadow-[0_4px_24px_rgba(0,0,0,0.02)] mb-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            <span className="text-sm font-bold font-display text-[#1E1F24]">
              Weak Concepts
            </span>
          </div>
          <button
            onClick={() => navigateTo('memory-analysis')}
            className="text-xs text-[#717582] hover:text-[#5342D6] font-medium flex items-center gap-0.5"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 mini cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Deadlock */}
          <div
            onClick={() => navigateTo('knowledge-card-detail', { conceptId: 'c-deadlock' })}
            className="bg-white rounded-2xl p-3 border border-[#F3EDE8] shadow-2xs cursor-pointer hover:border-[#EF4444]/40 transition-colors"
          >
            <span className="text-xs font-semibold text-[#1E1F24] block mb-2 truncate">
              Deadlock
            </span>
            <div className="w-full bg-[#F5ECE8] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#EF4444] h-full rounded-full"
                style={{ width: `${deadlockConcept.mastery}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-[#EF4444] block mt-1.5 text-right">
              {deadlockConcept.mastery}%
            </span>
          </div>

          {/* Synchronization */}
          <div
            onClick={() => navigateTo('knowledge-card-detail', { conceptId: 'c-sync' })}
            className="bg-white rounded-2xl p-3 border border-[#F3EDE8] shadow-2xs cursor-pointer hover:border-[#F59E0B]/40 transition-colors"
          >
            <span className="text-xs font-semibold text-[#1E1F24] block mb-2 truncate">
              Synchronization
            </span>
            <div className="w-full bg-[#F5ECE8] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#F59E0B] h-full rounded-full"
                style={{ width: `${syncConcept.mastery}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-[#F59E0B] block mt-1.5 text-right">
              {syncConcept.mastery}%
            </span>
          </div>

          {/* CPU Scheduling */}
          <div
            onClick={() => navigateTo('knowledge-card-detail', { conceptId: 'c-cpu-sched' })}
            className="bg-white rounded-2xl p-3 border border-[#F3EDE8] shadow-2xs cursor-pointer hover:border-[#10B981]/40 transition-colors"
          >
            <span className="text-xs font-semibold text-[#1E1F24] block mb-2 truncate">
              CPU Scheduling
            </span>
            <div className="w-full bg-[#F5ECE8] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#10B981] h-full rounded-full"
                style={{ width: `${cpuConcept.mastery}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-[#10B981] block mt-1.5 text-right">
              {cpuConcept.mastery}%
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: QUICK ACTIONS */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-3 px-1">
          <Zap className="w-4 h-4 text-[#5342D6] fill-[#5342D6]" />
          <h3 className="text-sm font-bold font-display text-[#1E1F24]">
            Quick Actions
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Action 1: Capture */}
          <div
            id="quick-action-capture"
            onClick={() => navigateTo('capture')}
            className="bg-[#F4F0FF] border border-[#E8E0FA] rounded-3xl p-3.5 flex flex-col justify-between text-left hover:border-[#5342D6]/50 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="text-[#5342D6] mb-2">
              <PlusCircle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E1F24] group-hover:text-[#5342D6] transition-colors">
                Capture
              </h4>
              <p className="text-[10px] text-[#717582] mt-0.5 leading-tight">
                Add your study material
              </p>
            </div>
          </div>

          {/* Action 2: Ask AI */}
          <div
            id="quick-action-ask-ai"
            onClick={() => navigateTo('ai-tutor')}
            className="bg-[#F0FBF5] border border-[#DCF5E8] rounded-3xl p-3.5 flex flex-col justify-between text-left hover:border-[#10B981]/50 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="text-[#10B981] mb-2">
              <MessageCircle className="w-5 h-5 stroke-[2.2] fill-[#10B981]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E1F24] group-hover:text-[#10B981] transition-colors">
                Ask AI
              </h4>
              <p className="text-[10px] text-[#717582] mt-0.5 leading-tight">
                Get instant help
              </p>
            </div>
          </div>

          {/* Action 3: Take Quiz */}
          <div
            id="quick-action-take-quiz"
            onClick={() => navigateTo('smart-quiz')}
            className="bg-[#F5F1FF] border border-[#EBE3FA] rounded-3xl p-3.5 flex flex-col justify-between text-left hover:border-[#5342D6]/50 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="text-[#5342D6] mb-2">
              <ClipboardCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E1F24] group-hover:text-[#5342D6] transition-colors">
                Take Quiz
              </h4>
              <p className="text-[10px] text-[#717582] mt-0.5 leading-tight">
                Test your knowledge
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: RECENT LEARNING */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#1E1F24]" />
            <h3 className="text-sm font-bold font-display text-[#1E1F24]">
              Recent Learning
            </h3>
          </div>
          <button
            onClick={() => navigateTo('resources')}
            className="text-xs text-[#717582] hover:text-[#5342D6] font-medium flex items-center gap-0.5"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Combined single white rounded card */}
        <div className="bg-white rounded-3xl border border-[#EAE6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)] divide-y divide-[#F6F3EE] overflow-hidden">
          {/* Item 1: Operating Systems.pdf */}
          <div
            onClick={() => navigateTo('resource-detail', { resourceId: 'res-os-unit3' })}
            className="p-3.5 flex items-center justify-between hover:bg-[#FAF8F5] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center shrink-0">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E1F24]">
                  Operating Systems.pdf
                </h4>
                <p className="text-[11px] text-[#717582] mt-0.5">
                  12 concepts • 8 cards
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#8A8F9E]">
              <span>2h ago</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Item 2: DBMS Notes */}
          <div
            onClick={() => navigateTo('resource-detail', { resourceId: 'res-dbms-norm' })}
            className="p-3.5 flex items-center justify-between hover:bg-[#FAF8F5] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#DBEAFE] text-[#3B82F6] flex items-center justify-center shrink-0">
                <Bookmark className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E1F24]">
                  DBMS Notes
                </h4>
                <p className="text-[11px] text-[#717582] mt-0.5">
                  8 concepts • 5 cards
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#8A8F9E]">
              <span>1d ago</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Item 3: Computer Networks — TCP/IP */}
          <div
            onClick={() => navigateTo('resource-detail', { resourceId: 'res-cn-tcp' })}
            className="p-3.5 flex items-center justify-between hover:bg-[#FAF8F5] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#EDE9FE] text-[#8B5CF6] flex items-center justify-center shrink-0">
                <Network className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E1F24]">
                  Computer Networks — TCP/IP
                </h4>
                <p className="text-[11px] text-[#717582] mt-0.5">
                  10 concepts • 7 cards
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#8A8F9E]">
              <span>2d ago</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
