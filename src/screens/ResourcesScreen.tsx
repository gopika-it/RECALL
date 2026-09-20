import React from 'react';
import { Plus } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TopBar } from '../components/Navigation/TopBar';
import { ResourcesView } from './components/ResourcesView';

export const ResourcesScreen: React.FC = () => {
  const { navigateTo } = useLearning();

  return (
    <div
      id="screen-resources"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar
        title="Your Learning"
        subtitle="Saved materials & uploaded documents"
        showBack
        rightAction={
          <button
            onClick={() => navigateTo('capture')}
            className="w-8 h-8 rounded-full bg-[#7C6EE6] text-white flex items-center justify-center hover:bg-[#6C5CE7] transition-all shadow-xs"
            aria-label="Add Material"
          >
            <Plus className="w-4 h-4" />
          </button>
        }
      />
      <div className="px-5 pt-4">
        <ResourcesView />
      </div>
    </div>
  );
};
