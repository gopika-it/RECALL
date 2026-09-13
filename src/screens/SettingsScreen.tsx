import React from 'react';
import {
  Download,
  Trash2,
  Shield,
  FileCode,
  HardDrive,
  Info,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { TopBar } from '../components/Navigation/TopBar';
import { useLearning } from '../context/LearningContext';

export const SettingsScreen: React.FC = () => {
  const { showToast } = useLearning();

  const handleExport = (format: string) => {
    showToast(`Knowledge graph exported as ${format}`);
  };

  const handleClearCache = () => {
    showToast('Offline cache cleared (24.2 MB freed)');
  };

  return (
    <div
      id="screen-settings"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title="Settings" subtitle="System & data configuration" showBack />

      <div className="px-5 pt-4 space-y-4">
        {/* Data & Export */}
        <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E] block">
            Export & Portability
          </span>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[#1E1F24]">
                Export Knowledge Cards
              </h4>
              <p className="text-[10px] text-[#8A8F9E]">
                Download all synthesized cards as Markdown
              </p>
            </div>
            <button
              onClick={() => handleExport('Markdown (.md)')}
              className="py-1.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#ECE7F9] border border-[#EAE6DF] text-xs font-semibold text-[#6C5CE7] flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>.MD</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#F2EFE9]">
            <div>
              <h4 className="text-xs font-semibold text-[#1E1F24]">
                Export Graph Relationship JSON
              </h4>
              <p className="text-[10px] text-[#8A8F9E]">
                Raw nodes, directed links, and retention weights
              </p>
            </div>
            <button
              onClick={() => handleExport('JSON')}
              className="py-1.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#ECE7F9] border border-[#EAE6DF] text-xs font-semibold text-[#6C5CE7] flex items-center gap-1.5 transition-colors"
            >
              <FileCode className="w-3 h-3" />
              <span>.JSON</span>
            </button>
          </div>
        </div>

        {/* Local Storage & Cache */}
        <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E] block">
            Storage & Performance
          </span>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-[#7C6EE6]" />
              <div>
                <h4 className="text-xs font-semibold text-[#1E1F24]">Offline Cache</h4>
                <p className="text-[10px] text-[#8A8F9E]">24.2 MB used for offline recall</p>
              </div>
            </div>
            <button
              onClick={handleClearCache}
              className="text-xs text-[#E74C3C] hover:underline font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {/* About & Privacy */}
        <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E] block">
            About RECALL
          </span>

          <div className="flex items-center justify-between text-xs text-[#4A4E69]">
            <span>Version</span>
            <span className="font-mono text-[11px] text-[#8A8F9E]">1.0.0-PROD</span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#4A4E69] pt-1">
            <span>Memory Engine</span>
            <span className="text-[#6C5CE7] font-medium">RECALL AI Core v2.4</span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#4A4E69] pt-1">
            <span>Privacy & Local Data</span>
            <span className="text-[#2ECC71] font-medium">Private & Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
