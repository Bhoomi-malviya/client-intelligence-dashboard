import { type ClassificationType } from '@/data/analysisData';

const CONFIG: Record<ClassificationType, { label: string; className: string }> = {
  confirmed_fact: {
    label: 'Confirmed Fact',
    className: 'bg-blue-600 text-white border-blue-700',
  },
  client_reported: {
    label: 'Client Reported',
    className: 'bg-green-50 text-green-700 border-green-300',
  },
  ai_inference: {
    label: 'AI Inference',
    className: 'bg-violet-50 text-violet-700 border-violet-300',
  },
  missing_information: {
    label: 'Missing Information',
    className: 'bg-slate-50 text-slate-500 border-slate-300',
  },
};

interface FumeBadgeProps {
  type: ClassificationType;
  children?: string;
}

export function FumeBadge({ type, children }: FumeBadgeProps) {
  const { label, className } = CONFIG[type];
  return (
    <span
      className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded border whitespace-nowrap ${className}`}
    >
      {children ?? label}
    </span>
  );
}
