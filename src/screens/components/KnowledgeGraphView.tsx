import React, { useState } from 'react';
import { Sparkles, ArrowRight, Info, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { initialGraphNodes, initialGraphLinks } from '../../data/mockData';
import { GraphNode } from '../../types';

export const KnowledgeGraphView: React.FC = () => {
  const { navigateTo, concepts } = useLearning();
  const [selectedNode, setSelectedNode] = useState<GraphNode>(initialGraphNodes[3]); // Default Deadlock

  // Map updated masteries from global concepts
  const nodes = initialGraphNodes.map((node) => {
    if (node.conceptId) {
      const match = concepts.find((c) => c.id === node.conceptId);
      if (match) {
        return { ...node, mastery: match.mastery };
      }
    }
    return node;
  });

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const handleOpenCard = () => {
    if (selectedNode.conceptId) {
      navigateTo('knowledge-card-detail', { conceptId: selectedNode.conceptId });
    } else {
      navigateTo('knowledge-card-detail', { conceptId: 'c-deadlock' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Visual Canvas Container */}
      <div className="relative bg-white rounded-3xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-4 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#E8E2F9_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Graph Header */}
        <div className="relative z-10 flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7C6EE6]" />
            <span className="text-[11px] font-semibold text-[#1E1F24] uppercase tracking-wider">
              Interactive Relationship Map
            </span>
          </div>
          <span className="text-[10px] text-[#8A8F9E]">Tap any node</span>
        </div>

        {/* SVG Graph Visualization */}
        <div className="relative w-full h-[360px] flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 400 400">
            {/* Draw Links */}
            <g className="links">
              {initialGraphLinks.map((link, idx) => {
                const source = nodes.find((n) => n.id === link.source);
                const target = nodes.find((n) => n.id === link.target);
                if (!source || !target) return null;

                const isConnectedToSelected =
                  selectedNode.id === source.id || selectedNode.id === target.id;

                return (
                  <g key={idx}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isConnectedToSelected ? '#7C6EE6' : '#E0DBEC'}
                      strokeWidth={isConnectedToSelected ? 2 : 1.2}
                      strokeDasharray={isConnectedToSelected ? 'none' : '3 3'}
                      className="transition-all duration-300"
                    />
                    {/* Relationship label */}
                    {link.label && (
                      <text
                        x={(source.x + target.x) / 2}
                        y={(source.y + target.y) / 2 - 4}
                        textAnchor="middle"
                        className="text-[8px] fill-[#8A8F9E] font-medium select-none pointer-events-none"
                      >
                        {link.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Draw Nodes */}
            <g className="nodes">
              {nodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const isDeadlock = node.id === 'Deadlock';

                // Calculate color by mastery
                const ringColor =
                  node.mastery >= 75
                    ? '#2ECC71'
                    : node.mastery < 40
                    ? '#E74C3C'
                    : '#7C6EE6';

                return (
                  <g
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring for Deadlock or Selected */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isDeadlock ? 30 : 24}
                        fill="#ECE7F9"
                        opacity={0.6}
                        className="animate-pulse"
                      />
                    )}

                    {/* Node Background */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isDeadlock ? 24 : 18}
                      fill={isSelected ? '#7C6EE6' : '#FFFFFF'}
                      stroke={isSelected ? '#5844D1' : ringColor}
                      strokeWidth={isSelected ? 2.5 : 2}
                      className="transition-transform duration-200 group-hover:scale-110 shadow-sm"
                    />

                    {/* Mastery text in center */}
                    <text
                      x={node.x}
                      y={node.y + 3}
                      textAnchor="middle"
                      className={`text-[9px] font-bold select-none pointer-events-none ${
                        isSelected ? 'fill-white' : 'fill-[#1E1F24]'
                      }`}
                    >
                      {node.mastery}%
                    </text>

                    {/* Node Label Below */}
                    <text
                      x={node.x}
                      y={node.y + (isDeadlock ? 36 : 28)}
                      textAnchor="middle"
                      className={`text-[9px] font-medium select-none pointer-events-none ${
                        isSelected
                          ? 'fill-[#6C5CE7] font-bold'
                          : 'fill-[#333745]'
                      }`}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Selected Node Details Card */}
      <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="py-0.5 px-2 rounded-full bg-[#ECE7F9] text-[#6C5CE7] text-[10px] font-semibold">
                {selectedNode.category}
              </span>
              <span className="text-[10px] text-[#8A8F9E]">
                Mastery: {selectedNode.mastery}%
              </span>
            </div>
            <h3 className="text-base font-bold font-display text-[#1E1F24] tracking-tight mt-1">
              {selectedNode.label}
            </h3>
          </div>

          <button
            id="graph-open-card-btn"
            onClick={handleOpenCard}
            className="py-2 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#ECE7F9] text-[#6C5CE7] text-xs font-semibold flex items-center gap-1.5 border border-[#EAE6DF] transition-colors"
          >
            <span>Open Card</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-[#717582] mt-2 leading-relaxed">
          {selectedNode.id === 'Deadlock'
            ? 'Central concurrency failure caused by the simultaneous convergence of Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.'
            : selectedNode.id === 'Circular Wait'
            ? 'Cyclic dependency where each thread awaits a resource held by another. Prevented via ordered resource allocation.'
            : selectedNode.id === "Banker's Algorithm"
            ? 'Safety-testing avoidance algorithm ensuring the OS never leaves safe state.'
            : 'Key building block in concurrent systems and memory scheduling.'}
        </p>
      </div>
    </div>
  );
};
