import React from 'react';
import {
  FileText,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TopBar } from '../components/Navigation/TopBar';

export const ResourceDetailScreen: React.FC = () => {
  const { getSelectedResource, concepts, navigateTo } = useLearning();
  const resource = getSelectedResource();

  const relatedConcepts = concepts.filter((c) =>
    resource.conceptIds.includes(c.id)
  );

  return (
    <div
      id="screen-resource-detail"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title={resource.title} subtitle="Learning Material Detail" showBack />

      <div className="px-5 pt-4 space-y-4">
        {/* Resource Meta Card */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ECE7F9] text-[#7C6EE6] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-[#1E1F24]">
                {resource.title}
              </h2>
              <p className="text-xs text-[#717582] mt-0.5">
                Uploaded {resource.uploadDate} • {resource.fileSize}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#4A4E69] leading-relaxed">
            {resource.summary}
          </p>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#F2EFE9]">
            <div className="p-2.5 rounded-2xl bg-[#FAF8F5] text-center border border-[#EAE6DF]">
              <span className="block text-xs font-bold text-[#1E1F24]">
                {resource.conceptCount}
              </span>
              <span className="text-[10px] text-[#8A8F9E]">Concepts Linked</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#FAF8F5] text-center border border-[#EAE6DF]">
              <span className="block text-xs font-bold text-[#1E1F24]">
                {resource.quizCount}
              </span>
              <span className="text-[10px] text-[#8A8F9E]">Quizzes Ready</span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigateTo('ai-tutor', { resourceId: resource.id })}
            className="p-3.5 rounded-2xl bg-white border border-[#EAE6DF] hover:border-[#7C6EE6] shadow-xs flex items-center justify-center gap-2 text-xs font-semibold text-[#6C5CE7] transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask AI Tutor</span>
          </button>

          <button
            onClick={() => navigateTo('quiz-session', { resourceId: resource.id })}
            className="p-3.5 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] text-white shadow-xs flex items-center justify-center gap-2 text-xs font-semibold transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Practice Quiz</span>
          </button>
        </div>

        {/* Extracted Concepts List */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C6EE6] font-display">
              Concepts in this Resource
            </h3>
            <span className="text-[10px] text-[#8A8F9E]">{relatedConcepts.length} indexed</span>
          </div>

          <div className="space-y-2">
            {relatedConcepts.map((c) => (
              <div
                key={c.id}
                onClick={() => navigateTo('knowledge-card-detail', { conceptId: c.id })}
                className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF] hover:border-[#7C6EE6]/60 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div>
                  <h4 className="text-xs font-semibold text-[#1E1F24]">{c.title}</h4>
                  <p className="text-[10px] text-[#717582] line-clamp-1">{c.summary}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[11px] font-bold text-[#1E1F24]">{c.mastery}%</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#A0A4B0]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
