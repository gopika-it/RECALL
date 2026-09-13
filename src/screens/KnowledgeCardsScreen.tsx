import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TopBar } from '../components/Navigation/TopBar';
import { KnowledgeCardsView } from './components/KnowledgeCardsView';

export const KnowledgeCardsScreen: React.FC = () => {
  const { concepts } = useLearning();
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const topics = ['All', 'Operating Systems', 'DBMS', 'Computer Networks'];

  return (
    <div
      id="screen-knowledge-cards"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title="Knowledge Cards" subtitle={`${concepts.length} concepts indexed`} showBack />

      <div className="px-5 pt-3">
        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter concepts..."
            className="w-full pl-4 pr-4 py-2 bg-white rounded-2xl border border-[#EAE6DF] text-xs text-[#1E1F24] placeholder-[#A0A4B0] focus:outline-none focus:ring-1 focus:ring-[#7C6EE6]"
          />
        </div>

        {/* Topic Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`py-1 px-3 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedTopic === t
                  ? 'bg-[#7C6EE6] text-white'
                  : 'bg-white text-[#717582] border border-[#EAE6DF] hover:border-[#7C6EE6]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <KnowledgeCardsView
          searchQuery={search}
          filterTopic={selectedTopic === 'All' ? undefined : selectedTopic}
        />
      </div>
    </div>
  );
};
