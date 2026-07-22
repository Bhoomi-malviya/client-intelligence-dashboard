import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { FumeBadge } from './Badge';
import { sampleAnalysis, type ClassificationType, type Evidence } from '@/data/analysisData';
import {
  Activity,
  Droplets,
  Moon,
  Brain,
  Flag,
  AlertTriangle,
  CheckCircle2,
  MessageSquareQuote,
  TrendingUp,
  Footprints,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 85 ? 'bg-green-500' : value >= 65 ? 'bg-amber-500' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-muted-foreground w-8 text-right">{value}%</span>
    </div>
  );
}

function EvidenceList({ items }: { items: Evidence[] }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? items : items.slice(0, 2);
  return (
    <div className="mt-2 space-y-1.5">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Evidence</p>
      {shown.map((e, i) => (
        <div key={i} className="flex items-start gap-2 bg-slate-50 border border-border/50 rounded px-2 py-1.5">
          <MessageSquareQuote className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-foreground/80 italic leading-snug">"{e.quote}"</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] text-muted-foreground">Day {e.day}</span>
              <FumeBadge type={e.classification} />
            </div>
          </div>
        </div>
      ))}
      {items.length > 2 && (
        <button
          className="text-[10px] text-primary flex items-center gap-1 hover:underline"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Show {items.length - 2} more</>}
        </button>
      )}
    </div>
  );
}

function SectionCard({
  icon,
  title,
  value,
  summary,
  confidence,
  classification,
  evidence,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  summary: string;
  confidence: number;
  classification: ClassificationType;
  evidence: Evidence[];
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary">{icon}</span>
            <span className="text-sm font-semibold text-foreground">{title}</span>
          </div>
          <FumeBadge type={classification} />
        </div>
        <p className="text-base font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">Confidence</p>
          <ConfidenceBar value={confidence} />
        </div>
        <EvidenceList items={evidence} />
      </CardContent>
    </Card>
  );
}

export function AnalysisPanel() {
  const report = sampleAnalysis;

  const [pendingActions, setPendingActions] = useState(
    report.pendingActions.map((a, i) => ({ ...a, id: String(i), checked: false }))
  );

  const toggleAction = (id: string) => {
    setPendingActions(prev => prev.map(a => a.id === id ? { ...a, checked: !a.checked } : a));
  };

  const priorityColor = { high: 'text-red-600', medium: 'text-amber-600', low: 'text-slate-500' };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border shrink-0 bg-white sticky top-0 z-10">
        <h2 className="text-base font-bold text-foreground">Client Intelligence Report</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {report.client} &bull; {report.period} &bull; AI Analysis
        </p>
      </div>

      <ScrollArea className="flex-1 px-6 py-4">
        <div className="flex flex-col gap-5 max-w-3xl mx-auto pb-12">

          {/* 1. Weekly Summary */}
          <Card className="border-primary/20 bg-primary/5 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground">Weekly Client Summary</CardTitle>
                <div className="flex items-center gap-2">
                  <FumeBadge type="ai_inference" />
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">Confidence</span>
                    <span className="text-[10px] font-bold text-green-600">{report.weeklySummary.confidence}%</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-sm text-foreground/90 leading-relaxed">{report.weeklySummary.text}</p>
            </CardContent>
          </Card>

          {/* 2–6. Health Metric Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionCard
              icon={<Moon className="w-4 h-4" />}
              title="Sleep Analysis"
              value={report.sleep.value}
              summary={report.sleep.summary}
              confidence={report.sleep.confidence}
              classification={report.sleep.classification}
              evidence={report.sleep.evidence}
            />
            <SectionCard
              icon={<Activity className="w-4 h-4" />}
              title="Nutrition Adherence"
              value={report.nutrition.value}
              summary={report.nutrition.summary}
              confidence={report.nutrition.confidence}
              classification={report.nutrition.classification}
              evidence={report.nutrition.evidence}
            />
            <SectionCard
              icon={<Footprints className="w-4 h-4" />}
              title="Exercise / Steps"
              value={report.exercise.value}
              summary={report.exercise.summary}
              confidence={report.exercise.confidence}
              classification={report.exercise.classification}
              evidence={report.exercise.evidence}
            />
            <SectionCard
              icon={<Droplets className="w-4 h-4" />}
              title="Water Intake"
              value={report.waterIntake.value}
              summary={report.waterIntake.summary}
              confidence={report.waterIntake.confidence}
              classification={report.waterIntake.classification}
              evidence={report.waterIntake.evidence}
            />
            <div className="md:col-span-2">
              <SectionCard
                icon={<Brain className="w-4 h-4" />}
                title="Symptoms / Stress"
                value={report.symptoms.value}
                summary={report.symptoms.summary}
                confidence={report.symptoms.confidence}
                classification={report.symptoms.classification}
                evidence={report.symptoms.evidence}
              />
            </div>
          </div>

          {/* 7. Engagement Level */}
          <Card className="shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Engagement Level</span>
                </div>
                <FumeBadge type={report.engagement.classification} />
              </div>
              <p className="text-base font-bold text-foreground">{report.engagement.value}</p>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }} />
              </div>
              <p className="text-xs text-muted-foreground">{report.engagement.summary}</p>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Confidence</p>
                <ConfidenceBar value={report.engagement.confidence} />
              </div>
            </CardContent>
          </Card>

          <Separator className="opacity-40" />

          {/* 8. Key Barriers */}
          <Card className="shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-foreground">Key Barriers</span>
              </div>
              <ul className="space-y-2">
                {report.keyBarriers.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div className="flex-1 flex items-start justify-between gap-2">
                      <span className="text-sm text-foreground/80">{b.barrier}</span>
                      <FumeBadge type={b.classification} />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 9. Pending Actions */}
          <Card className="shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-foreground/70" />
                <span className="text-sm font-semibold text-foreground">Pending Actions</span>
              </div>
              {pendingActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0 cursor-pointer"
                  onClick={() => toggleAction(action.id)}
                >
                  <Checkbox
                    id={`action-${action.id}`}
                    checked={action.checked}
                    onCheckedChange={() => toggleAction(action.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    data-testid={`checkbox-action-${action.id}`}
                  />
                  <label
                    className={`text-sm flex-1 cursor-pointer ${action.checked ? 'text-muted-foreground line-through' : 'text-foreground/90'}`}
                  >
                    {action.action}
                  </label>
                  <span className={`text-[10px] font-semibold uppercase ${priorityColor[action.priority]}`}>
                    {action.priority}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 10. Risk / Attention Flags */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-foreground">Risk / Attention Flags</span>
            </div>
            {report.riskFlags.map((flag, i) => {
              const isHigh = flag.severity === 'high';
              return (
                <div
                  key={i}
                  className={`p-3 rounded-lg border relative overflow-hidden ${isHigh ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${isHigh ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <div className="pl-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase ${isHigh ? 'text-red-700' : 'text-amber-700'}`}>
                        {flag.severity} risk
                      </span>
                      <FumeBadge type={flag.classification} />
                    </div>
                    <p className="text-sm text-foreground/80">{flag.description}</p>
                    <EvidenceList items={flag.evidence} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 11. Recommended Next Action */}
          <Card className="bg-primary border-primary shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-primary-foreground/80 font-semibold text-xs tracking-wider uppercase mb-3">
                <Brain className="w-4 h-4" />
                Recommended Next Action for Coach
              </div>
              <p className="text-primary-foreground text-sm leading-relaxed">{report.coachRecommendation.text}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] text-primary-foreground/60">Confidence</span>
                <div className="flex-1 h-1.5 bg-primary-foreground/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-foreground/80 rounded-full"
                    style={{ width: `${report.coachRecommendation.confidence}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-primary-foreground/80">{report.coachRecommendation.confidence}%</span>
              </div>
            </CardContent>
          </Card>

          {/* 12. Evidence Grounding */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 text-foreground/70" />
              <span className="text-sm font-semibold text-foreground">Evidence Grounding</span>
              <span className="text-xs text-muted-foreground">— exact quotes from conversation</span>
            </div>

            {/* Badge legend */}
            <div className="flex flex-wrap gap-2 p-3 bg-white border border-border rounded-lg">
              <span className="text-[10px] text-muted-foreground font-semibold mr-1">Classification:</span>
              <FumeBadge type="confirmed_fact" />
              <FumeBadge type="client_reported" />
              <FumeBadge type="ai_inference" />
              <FumeBadge type="missing_information" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.allEvidence.map((e, i) => (
                <div
                  key={i}
                  className="p-3 bg-white border border-border/60 rounded-lg flex flex-col gap-2"
                  data-testid={`evidence-card-${i}`}
                >
                  <p className="text-[13px] text-foreground/80 italic leading-snug">"{e.quote}"</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-medium">Day {e.day}</span>
                    <FumeBadge type={e.classification} />
                  </div>
                </div>
              ))}
            </div>

            {/* Missing information notice */}
            <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
              <p className="text-[11px] text-muted-foreground font-semibold mb-1">Missing Information</p>
              <ul className="space-y-1">
                <li className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <FumeBadge type="missing_information" />
                  Water intake not explicitly reported on Days 1, 2, 4, 5, 6
                </li>
                <li className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <FumeBadge type="missing_information" />
                  Step count not mentioned on Days 1, 2, 5, 6
                </li>
                <li className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <FumeBadge type="missing_information" />
                  Mood / energy rating not systematically tracked
                </li>
              </ul>
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
