'use client';

import React from 'react';

interface ShinyBadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'indigo' | 'emerald' | 'amber';
  className?: string;
}

/**
 * React Bits inspired Shiny Badge with subtle light sweep animation
 */
export const ShinyBadge: React.FC<ShinyBadgeProps> = ({
  children,
  variant = 'blue',
  className = ''
}) => {
  const variantStyles = {
    blue: 'bg-blue-500/10 text-blue-600 border-blue-400/25',
    indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-400/25',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-400/25',
    amber: 'bg-amber-500/10 text-amber-700 border-amber-400/25'
  };

  return (
    <span
      className={`relative inline-flex items-center overflow-hidden rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variantStyles[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
      {/* Light sweep animation */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </span>
  );
};
