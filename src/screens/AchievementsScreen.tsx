import React from 'react';
import { Award, CheckCircle2, Lock, Sparkles, Flame, Brain, Shield } from 'lucide-react';
import { TopBar } from '../components/Navigation/TopBar';

export const AchievementsScreen: React.FC = () => {
  const achievements = [
    {
      id: '1',
      title: 'Memory Champion',
      desc: 'Retained over 30 concepts with >75% mastery',
      icon: Award,
      unlocked: true,
      progress: '32 / 30',
      date: 'Earned 2 days ago',
    },
    {
      id: '2',
      title: 'Streak Master',
      desc: 'Maintained a 10-day active daily revision streak',
      icon: Flame,
      unlocked: true,
      progress: '12 / 10 days',
      date: 'Earned yesterday',
    },
    {
      id: '3',
      title: 'Concurrency Guru',
      desc: 'Mastered all 6 Deadlock and Synchronization core cards',
      icon: Shield,
      unlocked: false,
      progress: '4 / 6 cards',
      date: 'In Progress',
    },
    {
      id: '4',
      title: 'Quiz Ace',
      desc: 'Achieved a perfect score in 5 consecutive smart quizzes',
      icon: Sparkles,
      unlocked: true,
      progress: '5 / 5 quizzes',
      date: 'Earned last week',
    },
    {
      id: '5',
      title: 'Deep Synthesizer',
      desc: 'Connected 15 cross-topic concept relationships',
      icon: Brain,
      unlocked: false,
      progress: '9 / 15 connections',
      date: 'In Progress',
    },
  ];

  return (
    <div
      id="screen-achievements"
      className="min-h-screen pb-24 bg-[#FAF8F5] max-w-md mx-auto"
    >
      <TopBar title="Achievements" subtitle="3 of 5 Milestones Unlocked" showBack />

      <div className="px-5 pt-4 space-y-3">
        {achievements.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-4 rounded-3xl border transition-all flex items-center justify-between ${
                item.unlocked
                  ? 'bg-white border-[#EAE6DF] shadow-xs'
                  : 'bg-[#FAF8F5]/60 border-[#EAE6DF] opacity-75'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    item.unlocked
                      ? 'bg-[#ECE7F9] text-[#6C5CE7]'
                      : 'bg-[#EAE6DF] text-[#A0A4B0]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E1F24] flex items-center gap-1.5">
                    <span>{item.title}</span>
                    {item.unlocked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2ECC71]" />
                    )}
                  </h4>
                  <p className="text-[10px] text-[#717582] mt-0.5 max-w-[200px]">
                    {item.desc}
                  </p>
                  <span className="text-[9px] text-[#8A8F9E] block mt-1">
                    {item.date} • {item.progress}
                  </span>
                </div>
              </div>

              {!item.unlocked && <Lock className="w-4 h-4 text-[#A0A4B0] shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
