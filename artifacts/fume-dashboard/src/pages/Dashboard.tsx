import { useState } from 'react';
import { ConversationPanel } from '@/components/ConversationPanel';
import { ActionBar } from '@/components/ActionBar';
import { AnalysisPanel } from '@/components/AnalysisPanel';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, AlertTriangle } from 'lucide-react';
import { sampleAnalysis, type AnalysisReport } from '@/data/analysisData';
import { sampleConversation } from '@/data/conversationData';
import { analyzeConversation, isHealthConversation } from '@/data/conversationAnalyzer';

// ── Custom conversation parser (mirrors ConversationPanel's parser) ────────────
function parseCustomConversation(text: string) {
  const dayBlocks = text.split(/\n(?=Day\s+\d+)/i).filter(b => b.trim());
  return dayBlocks.map((block, idx) => {
    const lines = block.split('\n').filter(l => l.trim());
    const dayLine = lines[0];
    const dayNum = parseInt(dayLine.replace(/[^0-9]/g, ''), 10) || idx + 1;
    const messages = lines.slice(1).map(line => {
      const lower = line.toLowerCase();
      if (lower.startsWith('coach:')) {
        return { sender: 'coach' as const, text: line.replace(/^coach:\s*/i, '').trim() };
      } else if (lower.startsWith('accountability coach:') || lower.startsWith('system:')) {
        return { sender: 'system' as const, text: line.replace(/^(accountability coach|system):\s*/i, '').trim() };
      } else {
        return { sender: 'client' as const, text: line.replace(/^client:\s*/i, '').trim() };
      }
    }).filter(m => m.text.length > 0);
    return { day: dayNum, messages };
  });
}

function buildExportJson(report: AnalysisReport, customMode: boolean, customText: string) {
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      client: report.client,
      period: report.period,
      conversationSource: customMode && customText.trim() ? 'custom' : 'sample',
      analysisMethod: customMode && customText.trim() ? 'rule_based_extraction' : 'pre_structured_sample',
      note: 'Confidence scores reflect evidence density. Missing data is reported as absent — never estimated.',
    },
    weeklySummary: report.weeklySummary,
    sleep: report.sleep,
    nutrition: report.nutrition,
    exercise: report.exercise,
    waterIntake: report.waterIntake,
    symptoms: report.symptoms,
    engagement: report.engagement,
    keyBarriers: report.keyBarriers,
    pendingActions: report.pendingActions,
    riskFlags: report.riskFlags,
    coachRecommendation: report.coachRecommendation,
    supportingEvidence: report.allEvidence,
  };
}

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeReport, setActiveReport] = useState<AnalysisReport | null>(null);
  const [customText, setCustomText] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [wrongConversationType, setWrongConversationType] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setWrongConversationType(false);

    // Small delay so the spinner renders before the (synchronous) parsing work
    setTimeout(() => {
      try {
        let report: AnalysisReport;
        if (isCustomMode && customText.trim()) {
          const parsed = parseCustomConversation(customText);
          if (parsed.length === 0) {
            toast({
              title: 'Could not parse conversation',
              description: 'Make sure each day starts with "Day N" followed by "Client:" and "Coach:" lines.',
              variant: 'destructive',
            });
            setIsAnalyzing(false);
            return;
          }
          // Check if this is actually a health coaching conversation
          if (!isHealthConversation(parsed)) {
            setWrongConversationType(true);
            setActiveReport(null);
            setIsAnalyzing(false);
            return;
          }
          report = analyzeConversation(parsed);
        } else {
          // Sample data — use the pre-built structured analysis
          report = sampleAnalysis;
        }
        setActiveReport(report);
        toast({ title: 'Analysis Complete', description: `Report generated for ${report.period}.` });
      } catch {
        toast({ title: 'Analysis failed', description: 'Something went wrong parsing the conversation.', variant: 'destructive' });
      } finally {
        setIsAnalyzing(false);
      }
    }, 600);
  };

  const handleApprove = () => toast({ title: 'Approved', description: 'Insights saved to client record.' });
  const handleReject = () => { toast({ title: 'Rejected', description: 'Flagged for manual review.', variant: 'destructive' }); setActiveReport(null); setWrongConversationType(false); };
  const handleEdit = () => toast({ title: 'Edit Mode', description: 'You can now edit the generated insights.' });

  const handleExportJson = () => {
    const report = activeReport ?? sampleAnalysis;
    const data = buildExportJson(report, isCustomMode, customText);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fume-intelligence-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'JSON Exported', description: 'Report downloaded successfully.' });
  };

  return (
    <div className="h-[100dvh] w-full bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel */}
      <div className="w-full lg:w-[420px] shrink-0 h-[45vh] lg:h-full z-20 overflow-hidden">
        <ConversationPanel
          customText={customText}
          onCustomTextChange={setCustomText}
          isCustomMode={isCustomMode}
          onToggleMode={(val) => { setIsCustomMode(val); setActiveReport(null); }}
        />
      </div>

      {/* Center Action Bar */}
      <div className="h-auto lg:h-full shrink-0 z-30">
        <ActionBar
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          isAnalyzed={activeReport !== null}
          onApprove={handleApprove}
          onReject={handleReject}
          onEdit={handleEdit}
          onExportJson={handleExportJson}
        />
      </div>

      {/* Right Panel */}
      <div className="flex-1 overflow-hidden bg-slate-50">
        {isAnalyzing ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">
              {isCustomMode ? 'Analyzing your conversation…' : 'Loading sample analysis…'}
            </p>
          </div>
        ) : wrongConversationType ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 border border-amber-200">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Not a Health Coaching Conversation</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              This tool is designed specifically for <strong>health coach–client conversations</strong> — it extracts health metrics like sleep, exercise, nutrition, water intake, and symptoms.
            </p>
            <div className="bg-white border border-amber-200 rounded-lg p-4 max-w-sm text-left mb-5">
              <p className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wide">What was pasted doesn't contain health data such as:</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Sleep hours or rest quality</li>
                <li>Exercise, steps, or physical activity</li>
                <li>Meals, food, or nutrition</li>
                <li>Water intake or hydration</li>
                <li>Symptoms, stress, or health complaints</li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs">
              Please paste a real health coach–client conversation, or click{' '}
              <button
                className="text-primary underline font-medium"
                onClick={() => { setWrongConversationType(false); setIsCustomMode(false); setActiveReport(null); }}
              >
                Sample Data
              </button>{' '}
              to see an example of the expected format.
            </p>
          </div>
        ) : activeReport !== null ? (
          <AnalysisPanel report={activeReport} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-primary/40" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Ready for Analysis</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {isCustomMode && customText.trim()
                ? 'Click Analyze to process your custom conversation.'
                : 'Click Analyze to generate a client intelligence report.'}
            </p>
            {isCustomMode && !customText.trim() && (
              <p className="text-xs text-amber-600 mt-3 max-w-xs">
                Paste your conversation in the left panel first.
              </p>
            )}
            {isCustomMode && customText.trim() && (
              <p className="text-xs text-muted-foreground mt-3 max-w-sm">
                Format: each day starts with "Day N", followed by lines prefixed with "Client:" or "Coach:".
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
