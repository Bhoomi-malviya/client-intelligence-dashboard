import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { sampleConversation, type ConversationDay } from '@/data/conversationData';
import { MessageSquare, Edit3, X } from 'lucide-react';

interface ConversationPanelProps {
  customText: string;
  onCustomTextChange: (text: string) => void;
  isCustomMode: boolean;
  onToggleMode: (custom: boolean) => void;
}

function parseCustomConversation(text: string): ConversationDay[] {
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

export function ConversationPanel({
  customText,
  onCustomTextChange,
  isCustomMode,
  onToggleMode,
}: ConversationPanelProps) {
  const [isEditing, setIsEditing] = useState(false);

  const days: ConversationDay[] = isCustomMode && customText.trim()
    ? parseCustomConversation(customText)
    : sampleConversation;

  return (
    <div className="flex flex-col h-full bg-white border-r border-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border shrink-0 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Client Conversation</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isCustomMode && customText.trim() ? 'Custom conversation' : '8-Day Sample Conversation'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isCustomMode ? (
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 gap-1"
                onClick={() => { onToggleMode(false); setIsEditing(false); }}
              >
                <X className="w-3 h-3" /> Sample
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 gap-1"
                onClick={() => { onToggleMode(true); setIsEditing(true); }}
              >
                <Edit3 className="w-3 h-3" /> Custom
              </Button>
            )}
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => { onToggleMode(false); setIsEditing(false); }}
            className={`text-xs px-2 py-1 rounded border transition-colors ${!isCustomMode ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:bg-slate-50'}`}
          >
            Sample Data
          </button>
          <button
            onClick={() => { onToggleMode(true); setIsEditing(true); }}
            className={`text-xs px-2 py-1 rounded border transition-colors ${isCustomMode ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:bg-slate-50'}`}
          >
            Paste Custom
          </button>
        </div>
      </div>

      {/* Custom text input */}
      {isCustomMode && isEditing && (
        <div className="px-4 py-3 border-b border-border bg-slate-50 shrink-0">
          <p className="text-xs text-muted-foreground mb-2">
            Paste a <strong>health coach–client conversation</strong> below. Format each day as "Day N" followed by lines starting with "Client:" or "Coach:". The analyzer extracts sleep, exercise, nutrition, water, and symptoms.
          </p>
          <textarea
            className="w-full h-32 text-xs p-2 border border-border rounded resize-none focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            placeholder={'Day 1\nClient: Good morning...\nCoach: How are you feeling?\n\nDay 2\nClient: ...'}
            value={customText}
            onChange={e => onCustomTextChange(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <Button size="sm" className="text-xs h-7" onClick={() => setIsEditing(false)}>
              Preview
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => { onCustomTextChange(''); setIsEditing(false); onToggleMode(false); }}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-3">
        <div className="flex flex-col gap-5 pb-8">
          {days.map(({ day, messages }) => (
            <div key={day}>
              {/* Day separator */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-semibold text-primary bg-primary/5 border border-primary/20 px-2 py-0.5 rounded-full">
                  Day {day}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex flex-col gap-2.5">
                {messages.map((msg, idx) => {
                  if (msg.sender === 'system') {
                    return (
                      <div key={idx} className="flex items-start gap-2 self-center w-full">
                        <div className="w-full text-center">
                          <span className="inline-block text-[11px] text-muted-foreground bg-slate-100 border border-border/50 px-3 py-1 rounded-full">
                            <MessageSquare className="inline w-3 h-3 mr-1 -mt-0.5" />
                            {msg.text}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  const isCoach = msg.sender === 'coach';
                  return (
                    <div
                      key={idx}
                      className={`flex max-w-[88%] ${isCoach ? 'self-start' : 'self-end flex-row-reverse'}`}
                    >
                      <div className={`flex flex-col gap-1 ${isCoach ? 'items-start' : 'items-end'}`}>
                        {idx === 0 || messages[idx - 1]?.sender !== msg.sender ? (
                          <span className="text-[10px] font-medium text-muted-foreground px-1">
                            {isCoach ? 'Coach' : 'Client'}
                          </span>
                        ) : null}
                        <div
                          className={`px-3 py-2 rounded-xl text-[13px] leading-snug shadow-sm ${
                            isCoach
                              ? 'bg-slate-100 text-foreground rounded-tl-sm border border-border/40'
                              : 'bg-primary text-primary-foreground rounded-tr-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
