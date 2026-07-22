import { Button } from '@/components/ui/button';
import { BrainCircuit, Check, X, Edit2, Loader2, Cpu, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ActionBarProps {
  onAnalyze: () => void;
  isAnalyzing: boolean;
  isAnalyzed: boolean;
  onApprove: () => void;
  onReject: () => void;
  onEdit: () => void;
  onExportJson: () => void;
}

export function ActionBar({
  onAnalyze,
  isAnalyzing,
  isAnalyzed,
  onApprove,
  onReject,
  onEdit,
  onExportJson,
}: ActionBarProps) {
  return (
    <div className="w-full h-auto lg:w-[90px] lg:h-full bg-slate-50 border-b lg:border-b-0 lg:border-r border-border flex flex-row lg:flex-col items-center justify-between lg:justify-start px-3 py-3 lg:py-6 lg:px-0 shrink-0">

      {/* Brand icon */}
      <div className="flex flex-row lg:flex-col items-center gap-2 lg:mb-10">
        <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Cpu className="w-5 h-5" />
        </div>
        <span
          className="text-[10px] font-bold tracking-widest text-primary uppercase hidden lg:block"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          FUME AI
        </span>
      </div>

      {/* Analyze button */}
      <div className="flex-1 flex flex-row lg:flex-col items-center justify-center mx-3 lg:mx-0 lg:w-full lg:px-2">
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing || isAnalyzed}
          data-testid="button-analyze"
          className={`h-10 w-36 lg:w-full lg:h-28 rounded-lg flex flex-row lg:flex-col items-center justify-center gap-2 transition-all
            ${isAnalyzed
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 text-white shadow-sm'
            }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-[11px] font-semibold lg:[writing-mode:vertical-rl] lg:rotate-180 tracking-widest uppercase">Analyzing</span>
            </>
          ) : isAnalyzed ? (
            <>
              <Check className="w-5 h-5" />
              <span className="text-[11px] font-semibold lg:[writing-mode:vertical-rl] lg:rotate-180 tracking-widest uppercase">Done</span>
            </>
          ) : (
            <>
              <BrainCircuit className="w-5 h-5" />
              <span className="text-[11px] font-semibold lg:[writing-mode:vertical-rl] lg:rotate-180 tracking-widest uppercase">Analyze</span>
            </>
          )}
        </Button>
      </div>

      {/* Action buttons — shown after analysis */}
      <div
        className="flex flex-row lg:flex-col gap-2 lg:w-full lg:px-2 lg:mt-10 transition-opacity duration-200"
        style={{ opacity: isAnalyzed ? 1 : 0.35, pointerEvents: isAnalyzed ? 'auto' : 'none' }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              data-testid="button-approve"
              className="h-9 w-9 lg:w-full lg:h-10 rounded-lg bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
              onClick={onApprove}
            >
              <Check className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Approve</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              data-testid="button-edit"
              className="h-9 w-9 lg:w-full lg:h-10 rounded-lg bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700"
              onClick={onEdit}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Edit</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              data-testid="button-reject"
              className="h-9 w-9 lg:w-full lg:h-10 rounded-lg bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
              onClick={onReject}
            >
              <X className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Reject</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              data-testid="button-export-json"
              className="h-9 w-9 lg:w-full lg:h-10 rounded-lg bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
              onClick={onExportJson}
            >
              <Download className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Export JSON</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
