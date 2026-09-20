import React, { useState } from 'react';
import { FileUp, CheckCircle, ArrowRight, FileText, Upload, Sparkles } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TopBar } from '../components/Navigation/TopBar';

export const UploadInputScreen: React.FC = () => {
  const { navigateTo, showToast } = useLearning();
  const [selectedFile, setSelectedFile] = useState<string>('Operating Systems — Unit 3.pdf');
  const [notesText, setNotesText] = useState('');
  const [activeTab, setActiveTab] = useState<'pdf' | 'notes'>('pdf');

  const handleStartProcessing = () => {
    showToast('Uploading and parsing document...');
    navigateTo('processing');
  };

  return (
    <div
      id="screen-upload-input"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title="Select Material" subtitle="Choose file or enter notes" showBack />

      <div className="px-5 pt-4">
        {/* Toggle between PDF file upload & raw text notes */}
        <div className="flex bg-white p-1 rounded-2xl border border-[#EAE6DF] mb-5 shadow-xs">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'pdf'
                ? 'bg-[#ECE7F9] text-[#6C5CE7]'
                : 'text-[#717582] hover:text-[#1E1F24]'
            }`}
          >
            Upload Document
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'notes'
                ? 'bg-[#ECE7F9] text-[#6C5CE7]'
                : 'text-[#717582] hover:text-[#1E1F24]'
            }`}
          >
            Write / Paste Notes
          </button>
        </div>

        {activeTab === 'pdf' ? (
          <div>
            {/* Visual Drag & Drop Upload Zone */}
            <div
              onClick={() => setSelectedFile('Operating Systems — Unit 3.pdf')}
              className="border-2 border-dashed border-[#CFC7E8] bg-white rounded-3xl p-6 text-center cursor-pointer hover:border-[#7C6EE6] transition-colors shadow-xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#ECE7F9] text-[#6C5CE7] flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#1E1F24] font-display">
                Drop your PDF here, or tap to browse
              </h3>
              <p className="text-xs text-[#717582] mt-1">
                Supports PDF, PPTX, DOCX up to 50MB
              </p>
              <span className="inline-block mt-3 py-1 px-3 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] text-[11px] font-medium text-[#7C6EE6]">
                Browse Files
              </span>
            </div>

            {/* Quick-select Sample Files */}
            <div className="mt-5">
              <span className="text-[11px] font-semibold text-[#8A8F9E] uppercase tracking-wider block mb-2.5">
                Suggested Materials
              </span>
              <div className="space-y-2">
                {[
                  { name: 'Operating Systems — Unit 3.pdf', size: '2.4 MB', pages: '28 pages' },
                  { name: 'DBMS Normalization.pdf', size: '1.8 MB', pages: '14 pages' },
                  { name: 'Computer Networks — TCP/IP.pdf', size: '3.1 MB', pages: '32 pages' },
                ].map((file) => {
                  const isSelected = selectedFile === file.name;
                  return (
                    <div
                      key={file.name}
                      onClick={() => setSelectedFile(file.name)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#ECE7F9]/40 border-[#7C6EE6] shadow-xs'
                          : 'bg-white border-[#EAE6DF] hover:border-[#CFC7E8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className={`w-4.5 h-4.5 ${isSelected ? 'text-[#7C6EE6]' : 'text-[#8A8F9E]'}`} />
                        <div>
                          <p className="text-xs font-semibold text-[#1E1F24]">{file.name}</p>
                          <p className="text-[10px] text-[#717582]">
                            {file.size} • {file.pages}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#7C6EE6] text-white flex items-center justify-center">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-white rounded-3xl p-4 border border-[#EAE6DF] shadow-xs">
              <label className="block text-xs font-medium text-[#4A4E69] mb-1.5">
                Topic or Lecture Name
              </label>
              <input
                type="text"
                placeholder="e.g. Operating Systems — Concurrency & Deadlock"
                className="w-full p-2.5 bg-[#FAF8F5] rounded-xl border border-[#EAE6DF] text-xs text-[#1E1F24] focus:outline-none focus:ring-1 focus:ring-[#7C6EE6]"
              />
              <label className="block text-xs font-medium text-[#4A4E69] mt-3 mb-1.5">
                Paste Your Notes
              </label>
              <textarea
                rows={6}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Paste raw notes, definitions, formulas, or bullet points here..."
                className="w-full p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE6DF] text-xs text-[#1E1F24] focus:outline-none focus:ring-1 focus:ring-[#7C6EE6] placeholder-[#A0A4B0]"
              />
            </div>
          </div>
        )}

        {/* Start Processing Button */}
        <div className="mt-6">
          <button
            id="upload-process-btn"
            onClick={handleStartProcessing}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#7C6EE6] hover:bg-[#6C5CE7] active:scale-[0.99] text-white font-medium text-sm shadow-[0_4px_16px_rgba(124,110,230,0.25)] flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Process & Connect Knowledge</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
