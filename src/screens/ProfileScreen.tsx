import React from 'react';
import {
  User,
  Award,
  Sliders,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Flame,
  Brain,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TopBar } from '../components/Navigation/TopBar';

export const ProfileScreen: React.FC = () => {
  const { profile, logout, navigateTo } = useLearning();

  const menuItems = [
    {
      id: 'achievements',
      title: 'Achievements',
      desc: 'Milestones & memory badges',
      icon: Award,
      screen: 'achievements' as const,
    },
    {
      id: 'preferences',
      title: 'Learning Preferences',
      desc: 'Daily target, pace & spaced repetition',
      icon: Sliders,
      screen: 'learning-preferences' as const,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      desc: 'Smart reminders & decay alerts',
      icon: Bell,
      screen: 'notifications' as const,
    },
    {
      id: 'settings',
      title: 'Settings',
      desc: 'Account, data export & privacy',
      icon: Settings,
      screen: 'settings' as const,
    },
  ];

  return (
    <div
      id="screen-profile"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title="Profile" subtitle="Personal learning memory overview" />

      <div className="px-5 pt-3 space-y-4">
        {/* USER HERO CARD */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center">
          <div className="relative w-20 h-20 mx-auto mb-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#5342D6]/20 shadow-xs mx-auto"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center border-2 border-white text-[10px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className="text-xl font-bold font-display text-[#1E1F24] tracking-tight">
            {profile.name}
          </h2>
          <p className="text-xs text-[#717582] mt-0.5">
            {profile.major} • Year 3
          </p>
          <span className="inline-block mt-2 py-0.5 px-3 rounded-full bg-[#F0EBFC] text-[10px] font-semibold text-[#5342D6]">
            RECALL Pro Learner
          </span>
        </div>

        {/* 4 CORE STATS (SPEC REQUIREMENT) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Concepts Learned */}
          <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 mb-1 text-[#5342D6]">
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E]">
                Concepts
              </span>
            </div>
            <span className="text-2xl font-extrabold font-display text-[#1E1F24]">
              {profile.conceptsLearned}
            </span>
            <span className="block text-[10px] text-[#717582] mt-0.5">Active memory cards</span>
          </div>

          {/* Quizzes Taken */}
          <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 mb-1 text-[#5342D6]">
              <Brain className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E]">
                Quizzes
              </span>
            </div>
            <span className="text-2xl font-extrabold font-display text-[#1E1F24]">
              {profile.quizzesTaken}
            </span>
            <span className="block text-[10px] text-[#717582] mt-0.5">Completed sessions</span>
          </div>

          {/* Retention */}
          <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 mb-1 text-[#10B981]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E]">
                Retention
              </span>
            </div>
            <span className="text-2xl font-extrabold font-display text-[#1E1F24]">
              {profile.retentionRate}%
            </span>
            <span className="block text-[10px] text-[#717582] mt-0.5">Estimated recall accuracy</span>
          </div>

          {/* Day Streak */}
          <div className="p-4 rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-1.5 mb-1 text-[#F97316]">
              <Flame className="w-4 h-4 fill-[#F97316]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E]">
                Day Streak
              </span>
            </div>
            <span className="text-2xl font-extrabold font-display text-[#1E1F24]">
              {profile.streakDays} Days
            </span>
            <span className="block text-[10px] text-[#717582] mt-0.5">Consistency streak</span>
          </div>
        </div>

        {/* MENU ITEMS */}
        <div className="p-2 rounded-3xl bg-white border border-[#EAE6DF] shadow-xs space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={`profile-menu-${item.id}`}
                onClick={() => navigateTo(item.screen)}
                className="p-3 rounded-2xl hover:bg-[#FAF8F5] cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] group-hover:bg-[#ECE7F9] text-[#7C6EE6] flex items-center justify-center transition-colors">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#1E1F24] group-hover:text-[#6C5CE7] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-[#8A8F9E]">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A0A4B0] group-hover:text-[#7C6EE6] transition-colors" />
              </div>
            );
          })}
        </div>

        {/* LOGOUT BUTTON */}
        <button
          id="profile-logout-btn"
          onClick={logout}
          className="w-full py-3.5 rounded-2xl bg-white border border-[#EAE6DF] hover:bg-[#FDF2F2] hover:border-[#F5C2C2] text-[#E74C3C] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of RECALL</span>
        </button>
      </div>
    </div>
  );
};
