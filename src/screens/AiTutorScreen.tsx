import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bookmark,
  CheckCircle,
  BookOpen,
  HelpCircle,
  ArrowLeft,
  Share2,
  RefreshCw,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TopBar } from '../components/Navigation/TopBar';

export const AiTutorScreen: React.FC = () => {
  const {
    chatMessages,
    addChatMessage,
    saveChatMessageToKnowledge,
    getSelectedConcept,
    navigateTo,
    showToast,
  } = useLearning();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConcept = getSelectedConcept();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addChatMessage(input.trim());
    setInput('');
  };

  const handleQuickPrompt = (promptText: string) => {
    addChatMessage(promptText);
  };

  return (
    <div
      id="screen-ai-tutor"
      className="min-h-screen pb-32 bg-[#FAF8F5] max-w-md mx-auto flex flex-col justify-between"
    >
      {/* Specific Material-Scoped TopBar */}
      <TopBar
        title="OS Unit 3 • AI Tutor"
        subtitle="12 concepts in scope • Context active"
        showBack
        rightAction={
          <button
            onClick={() => navigateTo('knowledge-card-detail', { conceptId: activeConcept.id })}
            className="text-xs text-[#7C6EE6] font-semibold hover:underline flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Card</span>
          </button>
        }
      />

      {/* Scope banner */}
      <div className="px-5 pt-2 pb-1">
        <div className="py-1.5 px-3 rounded-2xl bg-[#ECE7F9]/70 border border-[#E0D8F4] flex items-center justify-between text-[11px] text-[#5844D1]">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C6EE6] animate-pulse" />
            <span>Active Context: <strong>{activeConcept.title}</strong></span>
          </div>
          <button
            onClick={() => navigateTo('knowledge-cards')}
            className="underline hover:text-[#3826B3] text-[10px]"
          >
            Switch Topic
          </button>
        </div>
      </div>

      {/* Chat Messages Flow */}
      <div className="flex-1 px-5 py-3 space-y-4 overflow-y-auto">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              <div
                className={`max-w-[88%] p-4 rounded-3xl text-xs leading-relaxed transition-all shadow-xs ${
                  isUser
                    ? 'bg-[#7C6EE6] text-white rounded-br-sm'
                    : 'bg-white text-[#2D3142] border border-[#EAE6DF] rounded-bl-sm shadow-[0_2px_12px_rgba(0,0,0,0.02)]'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-[#F2EFE9] text-[#7C6EE6] font-semibold text-[10px]">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Memory Tutor</span>
                  </div>
                )}

                <div className="whitespace-pre-line font-normal">{msg.text}</div>

                {/* Assistant Message Actions: Save to Knowledge, View Card */}
                {!isUser && (
                  <div className="mt-3 pt-2.5 border-t border-[#F2EFE9] flex items-center justify-between gap-2">
                    <button
                      onClick={() => saveChatMessageToKnowledge(msg.id)}
                      disabled={msg.savedToKnowledge}
                      className={`py-1 px-2 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors ${
                        msg.savedToKnowledge
                          ? 'bg-[#EAE6DF] text-[#717582] cursor-default'
                          : 'bg-[#FAF8F5] hover:bg-[#ECE7F9] text-[#6C5CE7] border border-[#EAE6DF]'
                      }`}
                    >
                      {msg.savedToKnowledge ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-[#2ECC71]" />
                          <span>Saved to Knowledge</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3 h-3" />
                          <span>Save to Knowledge</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        navigateTo('knowledge-card-detail', {
                          conceptId: msg.conceptId || activeConcept.id,
                        })
                      }
                      className="text-[10px] text-[#8A8F9E] hover:text-[#7C6EE6] font-medium flex items-center gap-0.5"
                    >
                      <span>View Card</span>
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[9px] text-[#A0A4B0] mt-1 px-2">
                {msg.timestamp}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK ACTIONS PILLS */}
      <div className="px-5 py-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleQuickPrompt(`Explain ${activeConcept.title} simply for a beginner.`)}
            className="py-1 px-2.5 rounded-full bg-white border border-[#EAE6DF] text-[11px] font-medium text-[#4A4E69] hover:border-[#7C6EE6] hover:text-[#6C5CE7] whitespace-nowrap transition-colors shadow-xs"
          >
            Explain simply
          </button>

          <button
            onClick={() => handleQuickPrompt(`Give a real-life analogy for ${activeConcept.title}.`)}
            className="py-1 px-2.5 rounded-full bg-white border border-[#EAE6DF] text-[11px] font-medium text-[#4A4E69] hover:border-[#7C6EE6] hover:text-[#6C5CE7] whitespace-nowrap transition-colors shadow-xs"
          >
            Give example
          </button>

          <button
            onClick={() => handleQuickPrompt(`Compare ${activeConcept.title} with related concepts.`)}
            className="py-1 px-2.5 rounded-full bg-white border border-[#EAE6DF] text-[11px] font-medium text-[#4A4E69] hover:border-[#7C6EE6] hover:text-[#6C5CE7] whitespace-nowrap transition-colors shadow-xs"
          >
            Compare
          </button>

          <button
            onClick={() => handleQuickPrompt(`Why does ${activeConcept.title} matter in operating systems?`)}
            className="py-1 px-2.5 rounded-full bg-white border border-[#EAE6DF] text-[11px] font-medium text-[#4A4E69] hover:border-[#7C6EE6] hover:text-[#6C5CE7] whitespace-nowrap transition-colors shadow-xs"
          >
            Why?
          </button>

          <button
            onClick={() => navigateTo('quiz-session', { conceptId: activeConcept.id })}
            className="py-1 px-2.5 rounded-full bg-[#ECE7F9] text-[#6C5CE7] text-[11px] font-semibold whitespace-nowrap transition-colors shadow-xs flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Generate quiz</span>
          </button>
        </div>
      </div>

      {/* BOTTOM INPUT BAR */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 p-3 bg-white/95 backdrop-blur-md border-t border-[#EAE6DF]">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            id="tutor-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask anything about ${activeConcept.title}...`}
            className="flex-1 px-4 py-2.5 bg-[#FAF8F5] rounded-2xl border border-[#EAE6DF] text-xs text-[#1E1F24] placeholder-[#A0A4B0] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/30 focus:border-[#7C6EE6] transition-all"
          />
          <button
            id="tutor-send-btn"
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 rounded-2xl bg-[#7C6EE6] disabled:bg-[#D5CFE8] text-white flex items-center justify-center transition-all shadow-xs shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
