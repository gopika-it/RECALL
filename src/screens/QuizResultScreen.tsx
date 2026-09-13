import React from 'react';
import {
  Sparkles,
  TrendingUp,
  RotateCcw,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const QuizResultScreen: React.FC = () => {
  const { profile, lastQuizResult, navigateTo } = useLearning();

  // Fallback if accessed directly
  const score = lastQuizResult ? lastQuizResult.score : 4;
  const total = lastQuizResult ? lastQuizResult.total : 5;
  const percentage = lastQuizResult ? lastQuizResult.percentage : 80;
  const masteryBefore = lastQuizResult ? lastQuizResult.masteryBefore : 38;
  const masteryAfter = lastQuizResult ? lastQuizResult.masteryAfter : 52;
  const whatYouKnow = lastQuizResult
    ? lastQuizResult.whatYouKnow
    : ['Deadlock basics', 'Mutual Exclusion'];
  const needsReview = lastQuizResult
    ? lastQuizResult.needsReview
    : ['Circular Wait'];

  return (
    <div
      id="screen-quiz-result"
      className="min-h-screen pb-16 bg-[#FAF8F5] max-w-md mx-auto px-5 pt-8 flex flex-col justify-between"
    >
      <div>
        {/* Top Celebration Header */}
        <div className="text-center mb-6">
          <span className="py-1 px-3.5 rounded-full bg-[#ECE7F9] text-[#6C5CE7] text-xs font-semibold tracking-wide">
            Quiz Completed
          </span>
          <h1 className="text-2xl font-bold font-display text-[#1E1F24] tracking-tight mt-2.5">
            Great work, {profile.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-[#717582] mt-0.5">
            Your memory retention model has been recalibrated.
          </p>
        </div>

        {/* SCORE & PERCENTAGE CARD */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-center mb-4">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl font-extrabold font-display text-[#1E1F24]">
              {score} / {total}
            </span>
            <span className="py-1 px-3 rounded-full bg-[#ECE7F9] text-[#6C5CE7] text-sm font-bold">
              {percentage}%
            </span>
          </div>
          <p className="text-xs text-[#8A8F9E] mt-2">
            +60 XP earned • 18 total quizzes completed
          </p>
        </div>

        {/* MEMORY UPDATE CARD (Deadlock 38% -> 52%) */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#7C6EE6]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#7C6EE6] font-display">
                Memory Update
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#2ECC71] bg-[#EDFBF2] px-2 py-0.5 rounded-full">
              +14% Growth
            </span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-bold text-[#1E1F24]">Deadlock</span>
            <div className="flex items-center gap-2 font-display font-bold">
              <span className="text-xs text-[#8A8F9E] line-through">{masteryBefore}%</span>
              <span className="text-xs text-[#A0A4B0]">→</span>
              <span className="text-base text-[#7C6EE6]">{masteryAfter}%</span>
            </div>
          </div>

          {/* Animated Growth Bar */}
          <div className="w-full bg-[#EAE6DF] h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-[#7C6EE6] h-full rounded-full transition-all duration-1000"
              style={{ width: `${masteryAfter}%` }}
            />
          </div>
        </div>

        {/* WHAT YOU KNOW & NEEDS REVIEW */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* What You Know */}
          <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
            <div className="flex items-center gap-1.5 mb-2.5 text-[#2ECC71]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E1F24]">
                What You Know
              </span>
            </div>
            <ul className="space-y-1.5">
              {whatYouKnow.map((item) => (
                <li key={item} className="text-xs text-[#4A4E69] flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#2ECC71]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Needs Review */}
          <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
            <div className="flex items-center gap-1.5 mb-2.5 text-[#E67E22]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E1F24]">
                Needs Review
              </span>
            </div>
            <ul className="space-y-1.5">
              {needsReview.map((item) => (
                <li key={item} className="text-xs text-[#4A4E69] flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#E67E22]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3 ACTION BUTTONS (MANDATORY SPEC) */}
      <div className="space-y-2.5 pt-2">
        {/* Review Weak Concept */}
        <button
          id="result-review-weak-btn"
          onClick={() => navigateTo('focused-revision')}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] active:scale-[0.99] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
        >
          <span>Review Weak Concept</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Try Another Quiz */}
        <button
          id="result-try-another-btn"
          onClick={() => navigateTo('quiz-session')}
          className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#FAF8F5] text-[#1E1F24] border border-[#EAE6DF] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#7C6EE6]" />
          <span>Try Another Quiz</span>
        </button>

        {/* Back to Knowledge */}
        <button
          id="result-back-knowledge-btn"
          onClick={() => navigateTo('knowledge-hub')}
          className="w-full py-2.5 px-4 text-center text-xs text-[#717582] hover:text-[#1E1F24] font-medium"
        >
          Back to Knowledge
        </button>
      </div>
    </div>
  );
};
