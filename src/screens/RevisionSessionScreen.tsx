import React, { useState } from 'react';
import {
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  BookOpen,
  HelpCircle,
  ThumbsUp,
  HelpCircle as QuestionIcon,
  CheckCircle2,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const RevisionSessionScreen: React.FC = () => {
  const {
    concepts,
    markConceptRemember,
    markConceptUnsure,
    navigateTo,
    goBack,
  } = useLearning();

  // Pick revision concepts: Banker's Algorithm, Page Replacement, Circular Wait, Deadlock, Synchronization
  const revisionConceptIds = ['c-bankers', 'c-page-replace', 'c-circularwait', 'c-deadlock', 'c-sync'];
  const revisionList = concepts.filter((c) => revisionConceptIds.includes(c.id));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionResults, setSessionResults] = useState<
    Array<{ id: string; title: string; remembered: boolean }>
  >([]);

  const currentConcept = revisionList[currentIndex] || revisionList[0];
  const progressPercent = ((currentIndex + 1) / revisionList.length) * 100;

  const handleRating = (remembered: boolean) => {
    if (remembered) {
      markConceptRemember(currentConcept.id);
    } else {
      markConceptUnsure(currentConcept.id);
    }

    setSessionResults((prev) => [
      ...prev,
      { id: currentConcept.id, title: currentConcept.title, remembered },
    ]);

    if (currentIndex < revisionList.length - 1) {
      setCurrentIndex((c) => c + 1);
      setShowDetails(false);
    } else {
      setSessionCompleted(true);
    }
  };

  if (sessionCompleted) {
    const rememberedCount = sessionResults.filter((r) => r.remembered).length;
    return (
      <div
        id="screen-revision-complete"
        className="min-h-screen pb-12 bg-[#FAF8F5] max-w-md mx-auto px-5 pt-8 flex flex-col justify-between"
      >
        <div>
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-3xl bg-[#ECE7F9] text-[#7C6EE6] flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[#1E1F24] tracking-tight">
              Revision Complete
            </h1>
            <p className="text-xs text-[#717582] mt-1">
              You reviewed {revisionList.length} scheduled concepts.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8F9E]">
                Session Results
              </span>
              <span className="text-xs font-bold text-[#7C6EE6]">
                {rememberedCount} / {revisionList.length} Remembered
              </span>
            </div>

            <div className="space-y-2">
              {sessionResults.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5]"
                >
                  <span className="text-xs font-medium text-[#1E1F24]">{res.title}</span>
                  <span
                    className={`text-[10px] font-bold py-0.5 px-2 rounded-full ${
                      res.remembered
                        ? 'bg-[#EDFBF2] text-[#2ECC71]'
                        : 'bg-[#FDF2F2] text-[#E74C3C]'
                    }`}
                  >
                    {res.remembered ? 'Remembered' : 'Still Unsure'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => navigateTo('smart-quiz')}
            className="w-full py-4 px-6 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <span>Practice with Smart Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="w-full py-3 px-6 rounded-2xl bg-white border border-[#EAE6DF] text-[#1E1F24] font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="screen-revision-session"
      className="min-h-screen pb-10 bg-[#FAF8F5] max-w-md mx-auto px-5 pt-6 flex flex-col justify-between"
    >
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-[#8A8F9E]">
          <button
            onClick={goBack}
            className="text-xs font-semibold text-[#717582] hover:text-[#1E1F24]"
          >
            Exit
          </button>
          <span className="font-semibold text-[#1E1F24]">
            Concept {currentIndex + 1} of {revisionList.length}
          </span>
          <span className="text-[11px] text-[#7C6EE6] font-medium">Focused Revision</span>
        </div>

        {/* Thin progress bar */}
        <div className="w-full bg-[#EAE6DF] h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-[#7C6EE6] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* INTERACTIVE KNOWLEDGE REVISION CARD */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold text-[#7C6EE6] uppercase tracking-wider">
                {currentConcept.topic} • {currentConcept.category}
              </span>
              <h2 className="text-xl font-bold font-display text-[#1E1F24] tracking-tight mt-1">
                {currentConcept.title}
              </h2>
            </div>
            <span className="text-xs font-bold text-[#8A8F9E] bg-[#FAF8F5] px-2 py-1 rounded-xl border border-[#EAE6DF]">
              {currentConcept.mastery}%
            </span>
          </div>

          <p className="text-xs text-[#4A4E69] leading-relaxed mt-3">
            {currentConcept.summary}
          </p>

          {/* Expand/Reveal Details */}
          {!showDetails ? (
            <button
              onClick={() => setShowDetails(true)}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#ECE7F9] text-[#6C5CE7] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#EAE6DF] transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Reveal Core Notes & Example</span>
            </button>
          ) : (
            <div className="mt-4 pt-3 border-t border-[#F2EFE9] space-y-3 animate-in fade-in duration-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C6EE6] block mb-1">
                  Key Points
                </span>
                <ul className="space-y-1">
                  {currentConcept.keyPoints.slice(0, 2).map((kp, idx) => (
                    <li key={idx} className="text-[11px] text-[#4A4E69] flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#7C6EE6] mt-1 shrink-0" />
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF6FF] border border-[#E4DCF9]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C5CE7] block mb-0.5">
                  Analogy
                </span>
                <p className="text-[11px] text-[#393C4A] italic">
                  "{currentConcept.simpleExample}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MANDATORY ACTION BUTTONS: "I Remember" & "Still Unsure" */}
      <div className="space-y-3 pt-2">
        <div className="text-center">
          <span className="text-[11px] text-[#8A8F9E] font-medium">
            How well do you remember this concept?
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Still Unsure */}
          <button
            id="revision-still-unsure-btn"
            onClick={() => handleRating(false)}
            className="py-3.5 px-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#EAE6DF] active:scale-[0.99] text-[#E74C3C] font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <QuestionIcon className="w-4 h-4" />
            <span>Still Unsure</span>
          </button>

          {/* I Remember */}
          <button
            id="revision-i-remember-btn"
            onClick={() => handleRating(true)}
            className="py-3.5 px-4 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] active:scale-[0.99] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>I Remember</span>
          </button>
        </div>
      </div>
    </div>
  );
};
