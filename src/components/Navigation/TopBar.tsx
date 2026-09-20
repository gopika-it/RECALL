import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  showBack = false,
  rightAction,
}) => {
  const { goBack, notifications, navigateTo, currentScreen } = useLearning();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const isMainTab = ['home', 'knowledge-hub', 'capture', 'smart-quiz', 'profile'].includes(
    currentScreen
  );

  return (
    <header
      id="app-top-bar"
      className="sticky top-0 z-30 w-full bg-[#FAF8F5]/95 backdrop-blur-md px-5 py-3 border-b border-[#F0EDE6] transition-all"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Back or Brand */}
        <div className="flex items-center gap-2.5">
          {showBack || !isMainTab ? (
            <button
              id="top-bar-back-btn"
              onClick={goBack}
              className="w-8 h-8 rounded-full bg-white border border-[#EAE6DF] shadow-2xs flex items-center justify-center text-[#1E1F24] hover:border-[#5342D6]/40 active:scale-95 transition-all"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <span className="font-display font-black text-lg text-[#3730A3] tracking-tight">
                RECALL
              </span>
              <span className="text-[#5342D6] text-xs -mt-1.5">✦</span>
            </div>
          )}

          {title && (
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-[#1E1F24] leading-tight font-display tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[10px] text-[#717582] font-normal leading-tight mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-2">
          {rightAction ? (
            rightAction
          ) : (
            <button
              id="top-bar-notifications-btn"
              onClick={() => navigateTo('notifications')}
              className="relative w-8 h-8 rounded-full bg-white/80 border border-[#EAE6DF] shadow-2xs flex items-center justify-center text-[#4A4E69] hover:bg-white transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-white" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
