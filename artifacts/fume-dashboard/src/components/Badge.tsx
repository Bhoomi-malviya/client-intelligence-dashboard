import React from 'react';

type BadgeType = 'fact' | 'reported' | 'inference' | 'missing';

interface FumeBadgeProps {
  type: BadgeType;
  children: React.ReactNode;
  className?: string;
}

export function FumeBadge({ type, children, className = '' }: FumeBadgeProps) {
  let styles = '';
  switch (type) {
    case 'fact':
      // Confirmed Fact: solid blue background, white text
      styles = 'bg-primary text-primary-foreground font-medium';
      break;
    case 'reported':
      // Client Reported: green/teal outline badge
      styles = 'border border-teal-600 text-teal-700 bg-teal-50 dark:bg-teal-950 dark:text-teal-400 dark:border-teal-800';
      break;
    case 'inference':
      // AI Inference: purple/violet outline or subtle background
      styles = 'border border-purple-300 text-purple-700 bg-purple-50 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
      break;
    case 'missing':
      // Missing Information: gray outline
      styles = 'border border-gray-300 text-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${styles} ${className}`}>
      {children}
    </span>
  );
}
