import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FumeBadge } from './Badge';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  progressValue?: number; // 0 to 100
  badgeType: 'fact' | 'reported' | 'inference' | 'missing';
  badgeLabel: string;
}

export function MetricCard({ icon, title, value, progressValue, badgeType, badgeLabel }: MetricCardProps) {
  return (
    <Card className="shadow-sm border border-border/60 hover-elevate overflow-hidden">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-primary">{icon}</span>
            <span className="text-sm font-medium">{title}</span>
          </div>
          <FumeBadge type={badgeType}>{badgeLabel}</FumeBadge>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
          {typeof progressValue === 'number' && (
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${Math.min(Math.max(progressValue, 0), 100)}%` }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
