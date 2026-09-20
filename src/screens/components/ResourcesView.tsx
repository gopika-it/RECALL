import React from 'react';
import { FileText, MessageSquare, BookOpen, HelpCircle, ChevronRight, ExternalLink } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

interface ResourcesViewProps {
  searchQuery?: string;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ searchQuery = '' }) => {
  const { resources, navigateTo } = useLearning();

  const filtered = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3.5">
      {filtered.map((res) => (
        <div
          key={res.id}
          id={`resource-card-${res.id}`}
          className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ECE7F9] text-[#7C6EE6] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-[#1E1F24] tracking-tight">
                  {res.title}
                </h3>
                <p className="text-[11px] text-[#717582] mt-0.5">
                  {res.conceptCount} concepts • {res.quizCount} quizzes
                </p>
              </div>
            </div>
            <span className="text-[10px] font-medium text-[#8A8F9E] bg-[#FAF8F5] px-2 py-1 rounded-lg border border-[#EAE6DF]">
              {res.fileSize || '3.0 MB'}
            </span>
          </div>

          <p className="text-xs text-[#717582] mt-3 line-clamp-2 leading-relaxed">
            {res.summary}
          </p>

          {/* Action Buttons: Open | Ask AI | View Knowledge | Take Quiz */}
          <div className="grid grid-cols-4 gap-1.5 mt-4 pt-3 border-t border-[#F2EFE9]">
            {/* Open */}
            <button
              id={`res-open-${res.id}`}
              onClick={() => navigateTo('resource-detail', { resourceId: res.id })}
              className="py-2 px-1 text-center rounded-xl bg-[#FAF8F5] hover:bg-[#ECE7F9] text-[#1E1F24] hover:text-[#6C5CE7] text-[11px] font-semibold border border-[#EAE6DF] transition-colors"
            >
              Open
            </button>

            {/* Ask AI */}
            <button
              id={`res-ask-ai-${res.id}`}
              onClick={() => navigateTo('ai-tutor', { resourceId: res.id })}
              className="py-2 px-1 text-center rounded-xl bg-[#FAF8F5] hover:bg-[#ECE7F9] text-[#6C5CE7] text-[11px] font-semibold border border-[#EAE6DF] transition-colors flex items-center justify-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Ask AI</span>
            </button>

            {/* View Knowledge */}
            <button
              id={`res-view-know-${res.id}`}
              onClick={() => navigateTo('knowledge-cards', { resourceId: res.id })}
              className="py-2 px-1 text-center rounded-xl bg-[#FAF8F5] hover:bg-[#ECE7F9] text-[#1E1F24] hover:text-[#6C5CE7] text-[11px] font-semibold border border-[#EAE6DF] transition-colors"
            >
              Cards
            </button>

            {/* Take Quiz */}
            <button
              id={`res-take-quiz-${res.id}`}
              onClick={() => navigateTo('quiz-session', { resourceId: res.id })}
              className="py-2 px-1 text-center rounded-xl bg-[#7C6EE6] hover:bg-[#6C5CE7] text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Quiz</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
