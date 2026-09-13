import React from 'react';
import { CheckCircle, Info } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const Toast: React.FC = () => {
  const { toast } = useLearning();

  if (!toast) return null;

  return (
    <div
      id="app-toast-alert"
      role="status"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[#1E1F24] text-white text-xs font-medium rounded-full shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-white/10"
    >
      <CheckCircle className="w-4 h-4 text-[#A78BFA] shrink-0" />
      <span>{toast}</span>
    </div>
  );
};
