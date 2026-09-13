import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  Share2,
  Bookmark,
  TrendingUp,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TopBar } from '../components/Navigation/TopBar';

export const KnowledgeCardDetailScreen: React.FC = () => {
  const {
    getSelectedConcept,
    concepts,
    navigateTo,
    showToast,
  } = useLearning();

  const concept = getSelectedConcept();
  const [showAnswer, setShowAnswer] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Find related concepts objects
  const relatedConcepts = concepts.filter((c) =>
    concept.relatedConceptIds.includes(c.id)
  );

  return (
    <div
      id="screen-knowledge-card-detail"
      className="min-h-screen pb-28 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar
        title="Concept Detail"
        subtitle={concept.topic}
        showBack
        rightAction={
          <button
            onClick={() => {
              setIsBookmarked(!isBookmarked);
              showToast(isBookmarked ? 'Removed from bookmarks' : 'Bookmarked concept');
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#555968] hover:bg-[#EAE6DF]/60 transition-colors"
          >
            <Bookmark
              className={`w-4.5 h-4.5 ${isBookmarked ? 'fill-[#7C6EE6] text-[#7C6EE6]' : ''}`}
            />
          </button>
        }
      />

      <div className="px-5 pt-4 space-y-4">
        {/* CARD HEADER & MASTERY HERO */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="py-0.5 px-2.5 rounded-full bg-[#ECE7F9] text-[#6C5CE7] text-[10px] font-semibold tracking-wide">
                {concept.topic} • {concept.resourceTitle}
              </span>
              <h1 className="text-2xl font-bold font-display text-[#1E1F24] tracking-tight mt-2">
                {concept.title}
              </h1>
            </div>

            {/* Circular Mastery Ring */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  className="stroke-[#EAE6DF]"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  className={
                    concept.mastery >= 75
                      ? 'stroke-[#2ECC71]'
                      : concept.mastery < 40
                      ? 'stroke-[#E74C3C]'
                      : 'stroke-[#7C6EE6]'
                  }
                  strokeWidth="4"
                  strokeDasharray={144.5}
                  strokeDashoffset={144.5 - (144.5 * concept.mastery) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-bold text-[#1E1F24] block leading-none">
                  {concept.mastery}%
                </span>
                <span className="text-[8px] text-[#8A8F9E] uppercase font-semibold">
                  Mastery
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-[11px] text-[#8A8F9E]">
            <span>Category: {concept.category}</span>
            <span>Last reviewed: {concept.lastReviewed}</span>
          </div>
        </div>

        {/* WHAT IS IT? */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C6EE6] mb-2 font-display">
            What is it?
          </h2>
          <p className="text-sm text-[#2D3142] leading-relaxed">
            {concept.summary}
          </p>
        </div>

        {/* KEY POINTS */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C6EE6] mb-3 font-display">
            Key Points
          </h2>
          <ul className="space-y-2.5">
            {concept.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-[#4A4E69] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C6EE6] shrink-0 mt-1.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SIMPLE EXAMPLE */}
        <div className="p-5 rounded-3xl bg-[#FAF6FF] border border-[#E4DCF9] shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#7C6EE6]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6C5CE7] font-display">
              Simple Example
            </h2>
          </div>
          <p className="text-xs text-[#393C4A] leading-relaxed italic">
            "{concept.simpleExample}"
          </p>
        </div>

        {/* RELATED CONCEPTS (CLICKABLE!) */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C6EE6] mb-3 font-display">
            Related Concepts
          </h2>
          <div className="space-y-2">
            {relatedConcepts.length > 0 ? (
              relatedConcepts.map((rc) => (
                <div
                  key={rc.id}
                  onClick={() => navigateTo('knowledge-card-detail', { conceptId: rc.id })}
                  className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF] hover:border-[#7C6EE6]/60 cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#7C6EE6]" />
                    <span className="text-xs font-medium text-[#1E1F24] group-hover:text-[#6C5CE7] transition-colors">
                      {rc.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#8A8F9E]">
                      {rc.mastery}%
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A0A4B0] group-hover:text-[#7C6EE6] transition-colors" />
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-[#8A8F9E]">
                No direct connections recorded yet.
              </span>
            )}
          </div>
        </div>

        {/* QUICK RECALL */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C6EE6] font-display">
              Quick Recall
            </h2>
            <span className="text-[10px] text-[#8A8F9E]">Self-test your memory</span>
          </div>

          <p className="text-xs font-semibold text-[#1E1F24] mt-1 mb-3">
            {concept.quickRecallQuestion}
          </p>

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="py-2 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#ECE7F9] border border-[#EAE6DF] text-xs font-medium text-[#6C5CE7] flex items-center gap-2 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Tap to Reveal Answer</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#ECE7F9]/40 border border-[#D5CFE8] animate-in fade-in duration-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C5CE7] block mb-1">
                Answer:
              </span>
              <p className="text-xs text-[#2D3142] leading-relaxed">
                {concept.quickRecallAnswer}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 p-4 bg-white/95 backdrop-blur-md border-t border-[#F0EDE6] flex items-center gap-3">
        <button
          id="detail-ask-ai-btn"
          onClick={() => navigateTo('ai-tutor', { conceptId: concept.id })}
          className="flex-1 py-3 px-4 rounded-full bg-[#F0EBFC] hover:bg-[#E8E0FA] text-[#5342D6] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <MessageSquare className="w-4 h-4 fill-[#5342D6]/20" />
          <span>Ask AI about this</span>
        </button>

        <button
          id="detail-practice-btn"
          onClick={() => navigateTo('quiz-session', { conceptId: concept.id })}
          className="flex-1 py-3 px-4 rounded-full bg-[#5342D6] hover:bg-[#4E3EC8] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Practice</span>
        </button>
      </div>
    </div>
  );
};
