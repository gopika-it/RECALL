import React, { useState } from 'react';
import { Bell, Sparkles, Clock, Flame, CheckCircle, Trash2 } from 'lucide-react';
import { TopBar } from '../components/Navigation/TopBar';
import { useLearning } from '../context/LearningContext';

export const NotificationsScreen: React.FC = () => {
  const { navigateTo, showToast } = useLearning();

  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: "Time for your 5-min Banker's Algorithm review",
      time: '10 minutes ago',
      type: 'decay',
      read: false,
      screen: 'focused-revision' as const,
    },
    {
      id: 'n2',
      title: 'Streak saved: 12 days active on RECALL!',
      time: '2 hours ago',
      type: 'streak',
      read: false,
      screen: 'profile' as const,
    },
    {
      id: 'n3',
      title: '3 new concepts synthesized from DBMS Normalization',
      time: 'Yesterday',
      type: 'material',
      read: true,
      screen: 'knowledge-hub' as const,
    },
  ]);

  const handleClearAll = () => {
    setNotifications([]);
    showToast('All notifications cleared');
  };

  return (
    <div
      id="screen-notifications"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar
        title="Notifications"
        subtitle="Retention alerts & system updates"
        showBack
        rightAction={
          notifications.length > 0 ? (
            <button
              onClick={handleClearAll}
              className="text-xs text-[#8A8F9E] hover:text-[#E74C3C] transition-colors"
            >
              Clear
            </button>
          ) : undefined
        }
      />

      <div className="px-5 pt-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#EAE6DF]">
            <Bell className="w-8 h-8 text-[#A0A4B0] mx-auto mb-2" />
            <p className="text-xs text-[#717582]">No active notifications.</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => navigateTo(item.screen)}
              className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-start gap-3 ${
                !item.read
                  ? 'bg-white border-[#7C6EE6]/40 shadow-xs'
                  : 'bg-[#FAF8F5] border-[#EAE6DF]'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  item.type === 'decay'
                    ? 'bg-[#FDF2F2] text-[#E74C3C]'
                    : item.type === 'streak'
                    ? 'bg-[#FFF8E6] text-[#E67E22]'
                    : 'bg-[#ECE7F9] text-[#6C5CE7]'
                }`}
              >
                {item.type === 'decay' && <Clock className="w-4 h-4" />}
                {item.type === 'streak' && <Flame className="w-4 h-4" />}
                {item.type === 'material' && <Sparkles className="w-4 h-4" />}
              </div>

              <div className="flex-1">
                <h4 className="text-xs font-semibold text-[#1E1F24] leading-snug">
                  {item.title}
                </h4>
                <span className="text-[10px] text-[#8A8F9E] block mt-1">
                  {item.time}
                </span>
              </div>

              {!item.read && (
                <span className="w-2 h-2 rounded-full bg-[#7C6EE6] shrink-0 mt-1" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
