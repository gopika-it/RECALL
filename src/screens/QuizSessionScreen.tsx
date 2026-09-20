import React, { useState } from 'react';
import { Check, X, ArrowRight, HelpCircle, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const QuizSessionScreen: React.FC = () => {
  const { quizQuestions, recordQuizFinish, navigateTo, goBack } = useLearning();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<Array<{ qId: string; selected: number; isCorrect: boolean }>>([]);

  const currentQ = quizQuestions[currentIndex];
  const totalQuestions = quizQuestions.length;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setHistory((prev) => [
      ...prev,
      { qId: currentQ.id, selected: idx, isCorrect },
    ]);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((c) => c + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      // Finished all 5 questions
      const finalScore = score + (selectedOption === currentQ.correctIndex ? 0 : 0);
      recordQuizFinish(finalScore, totalQuestions);
      navigateTo('quiz-result');
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];
  const isCorrect = selectedOption === currentQ.correctIndex;

  return (
    <div
      id="screen-quiz-session"
      className="min-h-screen pb-12 bg-[#FAF8F5] max-w-md mx-auto px-5 pt-6 flex flex-col justify-between"
    >
      {/* Top Progress & Exit */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-[#8A8F9E]">
          <button
            onClick={goBack}
            className="text-xs font-semibold text-[#717582] hover:text-[#1E1F24]"
          >
            Exit Quiz
          </button>
          <span className="font-semibold text-[#1E1F24]">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-[11px] text-[#7C6EE6] font-medium">OS Concurrency</span>
        </div>

        {/* Thin Progress Bar */}
        <div className="w-full bg-[#EAE6DF] h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-[#7C6EE6] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* QUESTION CARD */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C6EE6] block mb-2">
            Target Concept: {currentQ.conceptTitle}
          </span>
          <h2 className="text-base font-bold font-display text-[#1E1F24] leading-snug">
            {currentQ.question}
          </h2>
        </div>

        {/* OPTIONS LIST */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const isThisSelected = selectedOption === idx;
            const isThisCorrect = idx === currentQ.correctIndex;

            let optionStyle = 'bg-white border-[#EAE6DF] text-[#2D3142] hover:border-[#7C6EE6]/60';

            if (hasAnswered) {
              if (isThisCorrect) {
                optionStyle = 'bg-[#EDFBF2] border-[#2ECC71] text-[#1E1F24] font-medium';
              } else if (isThisSelected && !isThisCorrect) {
                optionStyle = 'bg-[#FDF2F2] border-[#E74C3C] text-[#1E1F24]';
              } else {
                optionStyle = 'bg-white/60 border-[#EAE6DF] text-[#A0A4B0] opacity-60';
              }
            }

            return (
              <button
                key={idx}
                id={`quiz-option-${idx}`}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${optionStyle} shadow-xs`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      hasAnswered && isThisCorrect
                        ? 'bg-[#2ECC71] text-white'
                        : hasAnswered && isThisSelected && !isThisCorrect
                        ? 'bg-[#E74C3C] text-white'
                        : 'bg-[#FAF8F5] text-[#717582] border border-[#EAE6DF]'
                    }`}
                  >
                    {optionLabels[idx]}
                  </span>
                  <span className="text-xs">{option}</span>
                </div>

                {hasAnswered && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-[#2ECC71] shrink-0 ml-2" />
                )}
                {hasAnswered && isThisSelected && !isThisCorrect && (
                  <X className="w-5 h-5 text-[#E74C3C] shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* FEEDBACK & EXPLANATION PANEL */}
        {hasAnswered && (
          <div
            id="quiz-feedback-panel"
            className={`mt-4 p-4 rounded-3xl border animate-in fade-in duration-200 ${
              isCorrect
                ? 'bg-[#EDFBF2]/80 border-[#A3E9BE]'
                : 'bg-[#FAF6FF] border-[#D5CFE8]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {isCorrect ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-[#2ECC71] text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-bold text-[#1E7E34]">
                    Great! You remembered it.
                  </span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-full bg-[#7C6EE6] text-white flex items-center justify-center text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#5B4EAA]">
                    Let's understand this concept.
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-[#393C4A] leading-relaxed mt-1">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      {/* BOTTOM BUTTON */}
      <div className="pt-6">
        {hasAnswered && (
          <button
            id="quiz-next-question-btn"
            onClick={handleNext}
            className="w-full py-4 px-6 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] active:scale-[0.99] text-white font-medium text-sm shadow-[0_4px_20px_rgba(124,110,230,0.25)] flex items-center justify-center gap-2 transition-all"
          >
            <span>{currentIndex < totalQuestions - 1 ? 'Next Question' : 'View Results'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
