import React, { useState } from 'react';
import { ConversationPanel } from '@/components/ConversationPanel';
import { ActionBar } from '@/components/ActionBar';
import { AnalysisPanel } from '@/components/AnalysisPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Bot } from 'lucide-react';

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate API delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
      toast({
        title: "Analysis Complete",
        description: "Fume AI has processed the conversation.",
      });
    }, 1500);
  };

  const handleApprove = () => {
    toast({
      title: "Approved",
      description: "Insights saved to client record.",
      variant: "default",
    });
  };

  const handleReject = () => {
    toast({
      title: "Rejected",
      description: "Flagged for manual review.",
      variant: "destructive",
    });
    setIsAnalyzed(false); // Reset to allow re-analysis
  };

  const handleEdit = () => {
    toast({
      title: "Edit Mode",
      description: "You can now edit the generated insights.",
    });
  };

  return (
    <div className="h-[100dvh] w-full bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel: Conversation */}
      <div className="w-full lg:w-[450px] shrink-0 h-[40vh] lg:h-full z-20">
        <ConversationPanel />
      </div>

      {/* Center Column: Action Bar */}
      <div className="h-auto lg:h-full shrink-0 relative z-30">
        <ActionBar 
          onAnalyze={handleAnalyze} 
          isAnalyzing={isAnalyzing} 
          isAnalyzed={isAnalyzed}
          onApprove={handleApprove}
          onReject={handleReject}
          onEdit={handleEdit}
        />
      </div>

      {/* Right Panel: Analysis */}
      <div className="flex-1 h-auto flex-grow relative overflow-hidden bg-slate-50/50">
        <AnimatePresence mode="wait">
          {!isAnalyzed ? (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                <Bot className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Ready for Analysis</h3>
              <p className="text-muted-foreground max-w-sm">
                Click the Analyze button to process this session and generate a comprehensive intelligence report.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="analysis-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full"
            >
              <AnalysisPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
