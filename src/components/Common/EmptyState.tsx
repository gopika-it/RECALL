import React from 'react';
import { PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, body, actionLabel, onAction }) => {
  return (
    <div className="p-8 rounded-3xl bg-white border border-[#EAE6DF] text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <h3 className="text-base font-bold font-display text-[#1E1F24]">{title}</h3>
      <p className="text-xs text-[#717582] mt-2 leading-relaxed whitespace-pre-line">{body}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-2 py-2.5 px-4 rounded-2xl bg-[#7C6EE6] text-white text-xs font-semibold"
        >
          <PlusCircle className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
