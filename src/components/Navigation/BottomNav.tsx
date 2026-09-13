import React from 'react';
import { Home, BookOpen, Plus, ClipboardCheck, User } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { ScreenType } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo } = useLearning();

  // Hide bottom nav on splash, login, signup, onboarding, processing, tutor, and active sessions
  const hiddenScreens: ScreenType[] = [
    'splash',
    'login',
    'signup',
    'forgot-password',
    'onboarding',
    'processing',
    'ai-tutor',
    'knowledge-card-detail',
    'quiz-session',
    'revision-session',
  ];

  if (hiddenScreens.includes(currentScreen)) {
    return null;
  }

  const isHomeActive = currentScreen === 'home';
  const isKnowledgeActive = [
    'knowledge-hub',
    'knowledge-cards',
    'knowledge-graph',
    'resources',
    'resource-detail',
  ].includes(currentScreen);
  const isCaptureActive = ['capture', 'upload-input'].includes(currentScreen);
  const isQuizActive = [
    'smart-quiz',
    'quiz-type-selection',
    'quiz-result',
  ].includes(currentScreen);
  const isProfileActive = [
    'profile',
    'achievements',
    'learning-preferences',
    'notifications',
    'settings',
  ].includes(currentScreen);

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md bg-white border-t border-[#F0EDE6] px-5 pt-2 pb-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center justify-between relative px-2">
        {/* HOME */}
        <button
          id="nav-btn-home"
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${
            isHomeActive ? 'text-[#5342D6]' : 'text-[#8A8F9E] hover:text-[#1E1F24]'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${isHomeActive ? 'stroke-[2.4] fill-[#5342D6]' : 'stroke-[1.8]'}`} />
          <span className={`text-[10px] tracking-tight ${isHomeActive ? 'font-bold' : 'font-medium'}`}>
            Home
          </span>
        </button>

        {/* KNOWLEDGE */}
        <button
          id="nav-btn-knowledge"
          onClick={() => navigateTo('knowledge-hub')}
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${
            isKnowledgeActive ? 'text-[#5342D6]' : 'text-[#8A8F9E] hover:text-[#1E1F24]'
          }`}
        >
          <BookOpen className={`w-5 h-5 transition-transform ${isKnowledgeActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className={`text-[10px] tracking-tight ${isKnowledgeActive ? 'font-bold' : 'font-medium'}`}>
            Knowledge
          </span>
        </button>

        {/* CAPTURE (+) - Center Elevated Circle */}
        <div className="relative -top-3">
          <button
            id="nav-btn-capture"
            onClick={() => navigateTo('capture')}
            aria-label="Capture Learning Material"
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(83,66,214,0.35)] transition-transform active:scale-95 bg-[#5342D6] text-white hover:bg-[#4E3EC8] ring-4 ring-white ${
              isCaptureActive ? 'scale-105 ring-[#EAE6F8]' : ''
            }`}
          >
            <Plus className="w-6 h-6 stroke-[2.8]" />
          </button>
        </div>

        {/* QUIZ */}
        <button
          id="nav-btn-quiz"
          onClick={() => navigateTo('smart-quiz')}
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${
            isQuizActive ? 'text-[#5342D6]' : 'text-[#8A8F9E] hover:text-[#1E1F24]'
          }`}
        >
          <ClipboardCheck className={`w-5 h-5 transition-transform ${isQuizActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className={`text-[10px] tracking-tight ${isQuizActive ? 'font-bold' : 'font-medium'}`}>
            Quiz
          </span>
        </button>

        {/* PROFILE */}
        <button
          id="nav-btn-profile"
          onClick={() => navigateTo('profile')}
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${
            isProfileActive ? 'text-[#5342D6]' : 'text-[#8A8F9E] hover:text-[#1E1F24]'
          }`}
        >
          <User className={`w-5 h-5 transition-transform ${isProfileActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className={`text-[10px] tracking-tight ${isProfileActive ? 'font-bold' : 'font-medium'}`}>
            Profile
          </span>
        </button>
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="w-32 h-1 bg-[#1E1F24] rounded-full mx-auto mt-2" />
    </nav>
  );
};
