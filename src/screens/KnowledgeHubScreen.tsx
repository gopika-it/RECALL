import React, { useState } from 'react';
import { Search, Grid, Network, FolderGit2, Sparkles, Filter } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TopBar } from '../components/Navigation/TopBar';
import { KnowledgeCardsView } from './components/KnowledgeCardsView';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { ResourcesView } from './components/ResourcesView';

export const KnowledgeHubScreen: React.FC = () => {
  const { concepts } = useLearning();
  const [activeTab, setActiveTab] = useState<'cards' | 'graph' | 'resources'>('cards');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div
      id="screen-knowledge-hub"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title="Your Knowledge" subtitle={`${concepts.length} connected concepts`} />

      <div className="px-5 pt-3">
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8F9E]">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="knowledge-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts, topics or resources..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-[#EAE6DF] text-xs text-[#1E1F24] placeholder-[#A0A4B0] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/30 focus:border-[#7C6EE6] transition-all shadow-xs"
          />
        </div>

        {/* Tabs: Cards | Graph | Resources */}
        <div className="flex bg-white p-1 rounded-2xl border border-[#EAE6DF] mb-5 shadow-xs">
          <button
            id="tab-cards"
            onClick={() => setActiveTab('cards')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'cards'
                ? 'bg-[#F0EBFC] text-[#5342D6]'
                : 'text-[#717582] hover:text-[#1E1F24]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>

          <button
            id="tab-graph"
            onClick={() => setActiveTab('graph')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'graph'
                ? 'bg-[#F0EBFC] text-[#5342D6]'
                : 'text-[#717582] hover:text-[#1E1F24]'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Graph</span>
          </button>

          <button
            id="tab-resources"
            onClick={() => setActiveTab('resources')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'resources'
                ? 'bg-[#F0EBFC] text-[#5342D6]'
                : 'text-[#717582] hover:text-[#1E1F24]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Resources</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'cards' && <KnowledgeCardsView searchQuery={searchQuery} />}
        {activeTab === 'graph' && <KnowledgeGraphView />}
        {activeTab === 'resources' && <ResourcesView searchQuery={searchQuery} />}
      </div>
    </div>
  );
};
