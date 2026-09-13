import React from 'react';
import { TopBar } from '../components/Navigation/TopBar';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';

export const KnowledgeGraphScreen: React.FC = () => {
  return (
    <div
      id="screen-knowledge-graph"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title="Knowledge Graph" subtitle="OS Concurrency & Deadlocks" showBack />
      <div className="px-5 pt-3">
        <KnowledgeGraphView />
      </div>
    </div>
  );
};
