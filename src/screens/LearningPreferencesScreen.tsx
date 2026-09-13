import React, { useState } from 'react';
import { Sliders, Check, Clock, Brain, BellRing } from 'lucide-react';
import { TopBar } from '../components/Navigation/TopBar';
import { useLearning } from '../context/LearningContext';

export const LearningPreferencesScreen: React.FC = () => {
  const { showToast } = useLearning();
  const [studyTarget, setStudyTarget] = useState('15 min');
  const [spacedModel, setSpacedModel] = useState('SuperMemo SM-2 (Optimized)');
  const [decayNotification, setDecayNotification] = useState(true);
  const [instantFeedback, setInstantFeedback] = useState(true);

  const handleSave = () => {
    showToast('Learning preferences saved');
  };

  return (
    <div
      id="screen-learning-preferences"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title="Learning Preferences" subtitle="Calibrate memory model" showBack />

      <div className="px-5 pt-4 space-y-4">
        {/* Daily Study Target */}
        <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
          <label className="text-xs font-semibold text-[#1E1F24] block mb-1">
            Daily Study Target
          </label>
          <p className="text-[11px] text-[#717582] mb-3">
            How much time do you want to dedicate to active recall each day?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {['10 min', '15 min', '30 min'].map((time) => (
              <button
                key={time}
                onClick={() => setStudyTarget(time)}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  studyTarget === time
                    ? 'bg-[#7C6EE6] text-white'
                    : 'bg-[#FAF8F5] text-[#4A4E69] border border-[#EAE6DF]'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Retention Algorithm */}
        <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
          <label className="text-xs font-semibold text-[#1E1F24] block mb-1">
            Spaced Repetition Algorithm
          </label>
          <p className="text-[11px] text-[#717582] mb-3">
            Choose the forgetting curve model for scheduling smart quizzes.
          </p>
          <div className="space-y-2">
            {[
              'SuperMemo SM-2 (Optimized)',
              'Ebbinghaus Exponential Decay',
              'Leitner Box System',
            ].map((alg) => (
              <div
                key={alg}
                onClick={() => setSpacedModel(alg)}
                className={`p-3 rounded-2xl border cursor-pointer text-xs flex items-center justify-between transition-all ${
                  spacedModel === alg
                    ? 'bg-[#ECE7F9]/40 border-[#7C6EE6] font-semibold text-[#1E1F24]'
                    : 'bg-[#FAF8F5] border-[#EAE6DF] text-[#4A4E69]'
                }`}
              >
                <span>{alg}</span>
                {spacedModel === alg && (
                  <Check className="w-4 h-4 text-[#7C6EE6]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[#1E1F24]">
                Memory Decay Alerts
              </h4>
              <p className="text-[10px] text-[#8A8F9E]">
                Notify when high-yield concepts fall below 40%
              </p>
            </div>
            <button
              onClick={() => setDecayNotification(!decayNotification)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                decayNotification ? 'bg-[#7C6EE6]' : 'bg-[#EAE6DF]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  decayNotification ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#F2EFE9]">
            <div>
              <h4 className="text-xs font-semibold text-[#1E1F24]">
                Instant Quiz Explanations
              </h4>
              <p className="text-[10px] text-[#8A8F9E]">
                Reveal concept context immediately after answering
              </p>
            </div>
            <button
              onClick={() => setInstantFeedback(!instantFeedback)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                instantFeedback ? 'bg-[#7C6EE6]' : 'bg-[#EAE6DF]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  instantFeedback ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] text-white text-xs font-semibold shadow-xs transition-all"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
