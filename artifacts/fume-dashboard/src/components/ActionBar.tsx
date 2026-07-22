import React from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Check, X, Edit2, Loader2, Cpu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ActionBarProps {
  onAnalyze: () => void;
  isAnalyzing: boolean;
  isAnalyzed: boolean;
  onApprove: () => void;
  onReject: () => void;
  onEdit: () => void;
}

export function ActionBar({ onAnalyze, isAnalyzing, isAnalyzed, onApprove, onReject, onEdit }: ActionBarProps) {
  return (
    <div className="w-full h-auto lg:w-[100px] lg:h-full bg-slate-50 dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-border flex flex-row lg:flex-col items-center justify-between lg:justify-start px-4 py-3 lg:py-6 lg:px-0 shrink-0 z-10 shadow-sm lg:shadow-[4px_0_12px_-6px_rgba(0,0,0,0.1)]">
      
      {/* Brand Label */}
      <div className="flex flex-row lg:flex-col items-center gap-2 lg:mb-12">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Cpu className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold tracking-widest text-primary uppercase hidden lg:block" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          Fume AI
        </span>
      </div>

      <div className="flex-1 flex flex-row lg:flex-col items-center justify-center mx-4 lg:mx-0 lg:w-full lg:px-2">
        {/* Analyze Button */}
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing || isAnalyzed}
          className={`
            h-12 w-48 lg:w-full lg:h-32 rounded-xl flex flex-row lg:flex-col items-center justify-center gap-2 lg:gap-3 transition-all duration-300
            ${isAnalyzed ? 'bg-secondary text-muted-foreground opacity-50' : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg'}
          `}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 lg:w-6 lg:h-6 animate-spin" />
              <span className="text-xs font-semibold lg:[writing-mode:vertical-rl] lg:rotate-180 tracking-widest uppercase">Analyzing</span>
            </>
          ) : isAnalyzed ? (
            <>
              <Check className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="text-xs font-semibold lg:[writing-mode:vertical-rl] lg:rotate-180 tracking-widest uppercase">Complete</span>
            </>
          ) : (
            <>
              <BrainCircuit className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="text-xs font-semibold lg:[writing-mode:vertical-rl] lg:rotate-180 tracking-widest uppercase">Analyze</span>
            </>
          )}
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row lg:flex-col gap-2 lg:gap-3 lg:w-full lg:px-3 lg:mt-12 transition-opacity duration-300" style={{ opacity: isAnalyzed ? 1 : 0.4, pointerEvents: isAnalyzed ? 'auto' : 'none' }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline" className="h-10 w-10 lg:w-full lg:h-12 rounded-xl bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800 dark:bg-green-950 dark:border-green-900 dark:text-green-400" onClick={onApprove}>
              <Check className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Approve Analysis</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline" className="h-10 w-10 lg:w-full lg:h-12 rounded-xl bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-400" onClick={onEdit}>
              <Edit2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Edit Insights</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline" className="h-10 w-10 lg:w-full lg:h-12 rounded-xl bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-400" onClick={onReject}>
              <X className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Reject & Recalculate</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
