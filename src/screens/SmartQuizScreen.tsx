import React from 'react';
import {
  HelpCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Brain,
  AlertTriangle,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TopBar } from '../components/Navigation/TopBar';

export const SmartQuizScreen: React.FC = () => {
  const { concepts, navigateTo } = useLearning();

  const deadlock = concepts.find((c) => c.id === 'c-deadlock') || concepts[0];
  const sync = concepts.find((c) => c.id === 'c-sync') || concepts[6];

  const quizTypes = [
    { id: 'concept', label: 'Concept Quiz', desc: 'Targeted on specific principles', icon: Target },
    { id: 'quick', label: 'Quick Recall', desc: 'Rapid 60-second flash questions', icon: Zap },
    { id: 'deep', label: 'Deep Practice', desc: 'Scenario & problem analysis', icon: Brain },
    { id: 'weak', label: 'Weak Area', desc: 'Prioritize cards with decay risk', icon: AlertTriangle },
    { id: 'mixed', label: 'Mixed Quiz', desc: 'Spaced review across all subjects', icon: Sparkles },
  ];

  return (
    <div
      id="screen-smart-quiz"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title="Test Your Knowledge" subtitle="Let's see what you actually remember." />

      <div className="px-5 pt-3 space-y-5">
        {/* QUICK QUIZ HERO CARD */}
        <div
          id="quiz-quick-card"
          className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="py-1 px-3 rounded-full bg-[#ECE7F9] text-[#6C5CE7] text-[11px] font-semibold tracking-wide">
              Daily Smart Quiz
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#717582]">
              <Clock className="w-3.5 h-3.5 text-[#7C6EE6]" />
              <span>5 min</span>
            </div>
          </div>

          <h2 className="text-lg font-bold font-display text-[#1E1F24] tracking-tight">
            OS Concurrency & Deadlock Recall
          </h2>
          <p className="text-xs text-[#717582] mt-1 leading-relaxed">
            5 high-yield questions automatically tailored to your current retention level.
          </p>

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#F2EFE9] text-xs text-[#4A4E69]">
            <span className="font-semibold text-[#1E1F24]">5 Questions</span>
            <span>•</span>
            <span>Adaptive difficulty</span>
            <span>•</span>
            <span className="text-[#6C5CE7] font-medium">+60 XP</span>
          </div>

          <button
            id="quiz-start-quick-btn"
            onClick={() => navigateTo('quiz-session', { conceptId: 'c-deadlock' })}
            className="mt-4 w-full py-3.5 px-4 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] active:scale-[0.99] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <span>Start Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* SECTION: QUIZ FROM YOUR LEARNING */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8F9E]">
              Quiz From Your Learning
            </span>
          </div>

          <div className="space-y-2">
            {[
              { title: 'Operating Systems — Deadlock', conceptId: 'c-deadlock', questions: '5 Qs', time: '5 min' },
              { title: 'DBMS — Normalization', conceptId: 'c-dbms-norm', questions: '4 Qs', time: '4 min' },
              { title: 'Computer Networks — TCP/IP', conceptId: 'c-tcp-handshake', questions: '5 Qs', time: '5 min' },
            ].map((item) => (
              <div
                key={item.title}
                onClick={() => navigateTo('quiz-session', { conceptId: item.conceptId })}
                className="p-3.5 rounded-2xl bg-white border border-[#EAE6DF] hover:border-[#7C6EE6]/50 cursor-pointer flex items-center justify-between transition-colors shadow-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] text-[#7C6EE6] flex items-center justify-center group-hover:bg-[#ECE7F9] transition-colors">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#1E1F24] group-hover:text-[#6C5CE7] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-[#8A8F9E] mt-0.5">
                      {item.questions} • {item.time}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A0A4B0] group-hover:text-[#7C6EE6] transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: QUIZ TYPES */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8F9E]">
              Quiz Types
            </span>
            <button
              onClick={() => navigateTo('quiz-type-selection')}
              className="text-xs text-[#7C6EE6] font-medium hover:underline"
            >
              Custom Setup
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {quizTypes.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.id}
                  onClick={() => navigateTo('quiz-session')}
                  className="p-3.5 rounded-2xl bg-white border border-[#EAE6DF] hover:border-[#7C6EE6]/60 cursor-pointer transition-all shadow-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] group-hover:bg-[#ECE7F9] text-[#7C6EE6] flex items-center justify-center mb-2 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#1E1F24] group-hover:text-[#6C5CE7] transition-colors">
                    {t.label}
                  </h4>
                  <p className="text-[10px] text-[#8A8F9E] mt-0.5 leading-snug line-clamp-1">
                    {t.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION: WEAK TOPICS */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#E74C3C]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8F9E]">
                Weak Topics
              </span>
            </div>
            <button
              onClick={() => navigateTo('memory-analysis')}
              className="text-xs text-[#7C6EE6] font-medium hover:underline"
            >
              Analyze
            </button>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs space-y-3">
            <div
              onClick={() => navigateTo('quiz-session', { conceptId: 'c-deadlock' })}
              className="flex items-center justify-between cursor-pointer hover:bg-[#FAF8F5] p-1.5 rounded-xl transition-colors"
            >
              <div>
                <h4 className="text-xs font-semibold text-[#1E1F24]">Deadlock</h4>
                <p className="text-[10px] text-[#8A8F9E]">Needs immediate review</p>
              </div>
              <span className="text-xs font-bold text-[#E74C3C]">{deadlock.mastery}%</span>
            </div>

            <div
              onClick={() => navigateTo('quiz-session', { conceptId: 'c-sync' })}
              className="flex items-center justify-between cursor-pointer hover:bg-[#FAF8F5] p-1.5 rounded-xl transition-colors"
            >
              <div>
                <h4 className="text-xs font-semibold text-[#1E1F24]">Synchronization</h4>
                <p className="text-[10px] text-[#8A8F9E]">Moderate retention</p>
              </div>
              <span className="text-xs font-bold text-[#E67E22]">{sync.mastery}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
