import React, { useState } from 'react';
import { Target, Zap, Brain, AlertTriangle, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TopBar } from '../components/Navigation/TopBar';

export const QuizTypeSelectionScreen: React.FC = () => {
  const { navigateTo } = useLearning();
  const [selectedType, setSelectedType] = useState('concept');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Adaptive');

  const quizModes = [
    { id: 'concept', title: 'Concept Quiz', desc: 'Focuses on 1 topic with key condition questions', icon: Target },
    { id: 'quick', title: 'Quick Recall', desc: 'Fast-paced, rapid memory verification', icon: Zap },
    { id: 'deep', title: 'Deep Practice', desc: 'Multi-step problems & algorithm tracing', icon: Brain },
    { id: 'weak', title: 'Weak Area', desc: 'Concentrates only on concepts below 60% mastery', icon: AlertTriangle },
    { id: 'mixed', title: 'Mixed Quiz', desc: 'Full-spectrum review from all connected resources', icon: Sparkles },
  ];

  return (
    <div
      id="screen-quiz-type-selection"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title="Quiz Setup" subtitle="Customize session parameters" showBack />

      <div className="px-5 pt-4 space-y-5">
        {/* Mode Selector */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8F9E] block mb-2.5">
            Select Practice Style
          </span>
          <div className="space-y-2.5">
            {quizModes.map((mode) => {
              const isSelected = selectedType === mode.id;
              const Icon = mode.icon;
              return (
                <div
                  key={mode.id}
                  onClick={() => setSelectedType(mode.id)}
                  className={`p-3.5 rounded-3xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#ECE7F9]/40 border-[#7C6EE6] shadow-xs'
                      : 'bg-white border-[#EAE6DF] hover:border-[#D5CFE8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#7C6EE6] text-white' : 'bg-[#FAF8F5] text-[#7C6EE6]'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E1F24]">{mode.title}</h4>
                      <p className="text-[10px] text-[#717582] mt-0.5">{mode.desc}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#7C6EE6] shrink-0 ml-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Count */}
        <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
          <label className="text-xs font-semibold text-[#1E1F24] block mb-2">
            Number of Questions
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[3, 5, 8, 10].map((num) => (
              <button
                key={num}
                onClick={() => setQuestionCount(num)}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  questionCount === num
                    ? 'bg-[#7C6EE6] text-white'
                    : 'bg-[#FAF8F5] text-[#4A4E69] border border-[#EAE6DF]'
                }`}
              >
                {num} Qs
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
          <label className="text-xs font-semibold text-[#1E1F24] block mb-2">
            Recall Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Standard', 'Adaptive', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  difficulty === diff
                    ? 'bg-[#7C6EE6] text-white'
                    : 'bg-[#FAF8F5] text-[#4A4E69] border border-[#EAE6DF]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => navigateTo('quiz-session')}
          className="w-full py-4 px-6 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] text-white font-medium text-sm shadow-[0_4px_20px_rgba(124,110,230,0.25)] flex items-center justify-center gap-2 transition-all"
        >
          <span>Begin {questionCount}-Question Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
