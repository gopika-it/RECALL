import React from 'react';
import {
  FileUp,
  Image,
  FileEdit,
  Link2,
  Mic,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TopBar } from '../components/Navigation/TopBar';

export const CaptureScreen: React.FC = () => {
  const { navigateTo } = useLearning();

  const options = [
    {
      id: 'pdf',
      title: 'Upload PDF',
      desc: 'Lecture slides, textbook chapters, study guides',
      icon: FileUp,
      action: () => navigateTo('upload-input'),
      badge: 'Recommended',
    },
    {
      id: 'image',
      title: 'Upload Image',
      desc: 'Photos of whiteboards, handwritten notes, diagrams',
      icon: Image,
      action: () => navigateTo('upload-input'),
    },
    {
      id: 'notes',
      title: 'Add Notes',
      desc: 'Type or paste your raw notes, outlines, or bullet points',
      icon: FileEdit,
      action: () => navigateTo('upload-input'),
    },
    {
      id: 'link',
      title: 'Paste Link',
      desc: 'Web articles, documentation, academic papers',
      icon: Link2,
      action: () => navigateTo('upload-input'),
    },
    {
      id: 'voice',
      title: 'Voice Note',
      desc: 'Dictate summaries or record quick audio recaps',
      icon: Mic,
      action: () => navigateTo('upload-input'),
    },
  ];

  return (
    <div
      id="screen-capture"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title="Capture Learning" subtitle="Bring anything you learn into RECALL" />

      <div className="px-5 pt-4">
        {/* Subtitle Banner */}
        <div className="p-4 rounded-3xl bg-[#ECE7F9]/50 border border-[#E8E2F9] mb-5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-2xl bg-white shadow-xs text-[#7C6EE6] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs text-[#4A4E69] leading-relaxed">
            RECALL processes unorganized notes, extracts foundational concepts, and builds your interactive memory graph.
          </p>
        </div>

        {/* Large Input Cards */}
        <div className="space-y-3">
          {options.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`capture-opt-${item.id}`}
                onClick={item.action}
                className="w-full p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs hover:border-[#7C6EE6]/60 active:scale-[0.99] transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] group-hover:bg-[#ECE7F9] text-[#7C6EE6] flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#1E1F24] font-display">
                        {item.title}
                      </h3>
                      {item.badge && (
                        <span className="py-0.5 px-2 rounded-full bg-[#ECE7F9] text-[#6C5CE7] text-[10px] font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#717582] mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#A0A4B0] group-hover:text-[#7C6EE6] group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Sample Action */}
        <div className="mt-6 p-4 rounded-2xl border border-dashed border-[#D5CFE8] bg-white/60 text-center">
          <span className="text-[11px] font-semibold text-[#8A8F9E] uppercase tracking-wider block mb-2">
            Try Demo Material
          </span>
          <button
            id="capture-demo-material-btn"
            onClick={() => navigateTo('processing')}
            className="py-2.5 px-4 rounded-xl bg-[#7C6EE6] text-white text-xs font-semibold hover:bg-[#6C5CE7] transition-all inline-flex items-center gap-2 shadow-xs"
          >
            <span>Process "Operating Systems — Unit 3.pdf"</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
