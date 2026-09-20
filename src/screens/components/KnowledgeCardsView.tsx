import React from 'react';
import { Sparkles, MessageSquare, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { Concept } from '../../types';

interface KnowledgeCardsViewProps {
  searchQuery?: string;
  filterTopic?: string;
}

export const KnowledgeCardsView: React.FC<KnowledgeCardsViewProps> = ({
  searchQuery = '',
  filterTopic,
}) => {
  const { concepts, navigateTo } = useLearning();

  const filtered = concepts.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = !filterTopic || c.topic === filterTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="space-y-4">
      {filtered.length === 0 ? (
        <div className="p-8 bg-white rounded-3xl border border-[#EAE6DF] text-center">
          <BookOpen className="w-8 h-8 text-[#A0A4B0] mx-auto mb-2" />
          <p className="text-xs text-[#717582]">No matching concepts found.</p>
        </div>
      ) : (
        filtered.map((concept) => (
          <div
            key={concept.id}
            id={`knowledge-card-${concept.id}`}
            onClick={() => navigateTo('knowledge-card-detail', { conceptId: concept.id })}
            className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#7C6EE6]/60 cursor-pointer transition-all active:scale-[0.995] group"
          >
            {/* Top row: Topic & Circular Mastery */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#7C6EE6]">
                  {concept.topic} • {concept.resourceTitle}
                </span>
                <h3 className="text-lg font-bold font-display text-[#1E1F24] tracking-tight mt-0.5 group-hover:text-[#6C5CE7] transition-colors">
                  {concept.title}
                </h3>
              </div>

              {/* Progress Ring */}
              <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                <svg className="w-11 h-11 transform -rotate-90">
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    className="stroke-[#EAE6DF]"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    className={
                      concept.mastery >= 75
                        ? 'stroke-[#2ECC71]'
                        : concept.mastery < 40
                        ? 'stroke-[#E74C3C]'
                        : 'stroke-[#7C6EE6]'
                    }
                    strokeWidth="3"
                    strokeDasharray={113.1}
                    strokeDashoffset={113.1 - (113.1 * concept.mastery) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-[#1E1F24]">
                  {concept.mastery}%
                </span>
              </div>
            </div>

            {/* Summary */}
            <p className="text-xs text-[#717582] mt-2 leading-relaxed">
              {concept.summary}
            </p>

            {/* Key Concepts Tags (if Deadlock or has related concepts) */}
            {concept.id === 'c-deadlock' && (
              <div className="mt-3 pt-3 border-t border-[#F2EFE9]">
                <span className="text-[10px] font-bold text-[#8A8F9E] uppercase tracking-wider block mb-1.5">
                  Key Concepts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Mutual Exclusion', 'Hold and Wait', 'No Preemption', 'Circular Wait'].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="py-0.5 px-2.5 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] text-[10px] font-medium text-[#4A4E69]"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons: Ask AI | Practice */}
            <div
              className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between"
              onClick={(e) => e.stopPropagation()} // don't trigger parent card click
            >
              <div className="flex items-center gap-2">
                <button
                  id={`card-ask-ai-${concept.id}`}
                  onClick={() => navigateTo('ai-tutor', { conceptId: concept.id })}
                  className="py-1.5 px-3 rounded-full bg-[#F0EBFC] hover:bg-[#EAE6F8] text-[#5342D6] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-[#5342D6]/20" />
                  <span>Ask AI</span>
                </button>

                <button
                  id={`card-practice-${concept.id}`}
                  onClick={() => navigateTo('quiz-session', { conceptId: concept.id })}
                  className="py-1.5 px-3 rounded-full bg-white hover:bg-[#FAF8F5] text-[#1E1F24] text-xs font-semibold flex items-center gap-1.5 border border-[#EAE6DF] transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#5342D6]" />
                  <span>Practice</span>
                </button>
              </div>

              <button
                onClick={() => navigateTo('knowledge-card-detail', { conceptId: concept.id })}
                className="text-xs text-[#5342D6] font-semibold flex items-center gap-1 hover:underline"
              >
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
