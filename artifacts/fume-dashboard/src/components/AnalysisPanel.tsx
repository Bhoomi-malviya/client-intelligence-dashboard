import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from './MetricCard';
import { FumeBadge } from './Badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Droplets, 
  Moon, 
  Footprints, 
  Brain, 
  Flag, 
  AlertTriangle, 
  CheckCircle,
  Stethoscope,
  TrendingDown,
  Calendar,
  MessageSquareQuote
} from 'lucide-react';
import { motion } from 'framer-motion';

export function AnalysisPanel() {
  const [actions, setActions] = useState([
    { id: '1', label: 'Follow up on sleep hygiene protocol', checked: false },
    { id: '2', label: 'Share stress management resources', checked: false },
    { id: '3', label: 'Review nutrition plan for high-stress days', checked: false },
    { id: '4', label: 'Set a reduced step goal for this week', checked: false },
  ]);

  const toggleAction = (id: string) => {
    setActions(actions.map(a => a.id === id ? { ...a, checked: !a.checked } : a));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-background">
      {/* Header */}
      <div className="px-8 py-5 border-b border-border shrink-0 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Stethoscope className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold tracking-wider uppercase">Fume Intelligence</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Client Intelligence Report</h2>
        <p className="text-sm text-muted-foreground mt-1">Sarah M. &bull; Week of July 14, 2026 &bull; AI Analysis</p>
      </div>

      <ScrollArea className="flex-1 px-8 py-6">
        <motion.div 
          className="flex flex-col gap-6 max-w-4xl mx-auto pb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* 1. Weekly Summary */}
          <motion.div variants={itemVariants}>
            <Card className="border-primary/20 bg-primary/5 shadow-sm">
              <CardContent className="p-5 text-sm leading-relaxed text-foreground/90 font-medium">
                Sarah had a challenging week with elevated work stress impacting sleep, nutrition, and activity levels. Despite missing most movement goals, she maintained coaching engagement and expressed motivation to improve.
              </CardContent>
            </Card>
          </motion.div>

          {/* 2. Health Metrics Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard 
              icon={<Activity className="w-4 h-4" />}
              title="Nutrition Adherence"
              value="42%"
              progressValue={42}
              badgeType="reported"
              badgeLabel="Client Reported"
            />
            <MetricCard 
              icon={<Footprints className="w-4 h-4" />}
              title="Exercise / Steps"
              value="2 of 5 days"
              progressValue={40}
              badgeType="fact"
              badgeLabel="Confirmed Fact"
            />
            <MetricCard 
              icon={<Moon className="w-4 h-4" />}
              title="Sleep"
              value="5.5 hrs avg"
              progressValue={68}
              badgeType="fact"
              badgeLabel="Confirmed Fact"
            />
            <MetricCard 
              icon={<Droplets className="w-4 h-4" />}
              title="Water Intake"
              value="~4 glasses/day"
              progressValue={50}
              badgeType="reported"
              badgeLabel="Client Reported"
            />
            <MetricCard 
              icon={<Brain className="w-4 h-4" />}
              title="Symptoms / Stress"
              value="Level 7-8/10"
              progressValue={80} // 80% stress is high, maybe reverse color? We'll leave it as blue for consistency
              badgeType="inference"
              badgeLabel="AI Inference"
            />
          </motion.div>

          <Separator className="my-2 opacity-50" />

          {/* 3. Engagement Level */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-primary" /> Engagement Level
                </h3>
                <span className="text-sm font-bold text-primary">Moderate-High</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 w-[75%] rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground">Client actively participated, showed self-awareness about barriers.</p>
            </div>
          </motion.div>

          {/* 4. Risk / Attention Flags & Barriers */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Risk Flags
              </h3>
              <div className="flex flex-col gap-3">
                <div className="p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                  <div className="flex justify-between items-start pl-2">
                    <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-semibold text-sm">
                      <Flag className="w-3.5 h-3.5" /> HIGH RISK
                    </div>
                    <FumeBadge type="fact">Confirmed Fact</FumeBadge>
                  </div>
                  <p className="text-sm text-foreground/80 pl-2">Sleep deprivation (&lt;6 hrs for 5+ days)</p>
                </div>
                
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                  <div className="flex justify-between items-start pl-2">
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold text-sm">
                      <Flag className="w-3.5 h-3.5" /> MEDIUM RISK
                    </div>
                    <FumeBadge type="reported">Client Reported</FumeBadge>
                  </div>
                  <p className="text-sm text-foreground/80 pl-2">Nutritional adherence below 50%</p>
                </div>

                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                  <div className="flex justify-between items-start pl-2">
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold text-sm">
                      <Flag className="w-3.5 h-3.5" /> MEDIUM RISK
                    </div>
                    <FumeBadge type="inference">AI Inference</FumeBadge>
                  </div>
                  <p className="text-sm text-foreground/80 pl-2">Stress at 7-8/10 sustained</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <CheckCircle className="w-4 h-4 text-blue-500" /> Key Barriers
              </h3>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <ul className="space-y-3">
                    <li className="flex gap-2 items-start text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="text-foreground/80 font-medium">Elevated work stress <span className="text-muted-foreground font-normal">(primary driver)</span></span>
                    </li>
                    <li className="flex gap-2 items-start text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="text-foreground/80 font-medium">Late sleep schedule disrupting morning routine</span>
                    </li>
                    <li className="flex gap-2 items-start text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="text-foreground/80 font-medium">Convenience food reliance under pressure</span>
                    </li>
                    <li className="flex gap-2 items-start text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="text-foreground/80 font-medium">Low hydration consistency</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
          </motion.div>

          {/* 7. Recommended Next Action */}
          <motion.div variants={itemVariants}>
            <Card className="bg-primary border-primary shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Brain className="w-32 h-32 text-primary-foreground" />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-2 text-primary-foreground/80 font-semibold text-xs tracking-wider uppercase mb-3">
                  <Calendar className="w-4 h-4" /> Recommended Next Action
                </div>
                <p className="text-primary-foreground text-lg leading-snug font-medium">
                  Schedule a 15-minute mid-week check-in focused on sleep hygiene and stress management. Provide a simplified meal prep guide for busy work weeks.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* 5. Pending Actions (Checklist) */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <CheckCircle className="w-4 h-4 text-foreground/70" /> Pending Coach Actions
            </h3>
            <Card className="shadow-sm">
              <CardContent className="p-2">
                <div className="flex flex-col">
                  {actions.map((action, idx) => (
                    <div 
                      key={action.id} 
                      className={`flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-secondary/50 cursor-pointer ${idx !== actions.length - 1 ? 'border-b border-border/40' : ''}`}
                      onClick={() => toggleAction(action.id)}
                    >
                      <Checkbox 
                        id={`action-${action.id}`} 
                        checked={action.checked}
                        onCheckedChange={() => toggleAction(action.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label 
                        htmlFor={`action-${action.id}`}
                        className={`text-sm font-medium flex-1 cursor-pointer transition-all ${action.checked ? 'text-muted-foreground line-through' : 'text-foreground/90'}`}
                      >
                        {action.label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Separator className="my-2 opacity-50" />

          {/* 8. Evidence — Supporting Quotes */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <MessageSquareQuote className="w-4 h-4 text-foreground/70" /> Evidence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 bg-secondary rounded-lg border border-border/50 flex flex-col justify-between gap-3 relative">
                <MessageSquareQuote className="w-6 h-6 text-primary/10 absolute top-2 right-2" />
                <p className="text-sm text-foreground/80 italic font-medium relative z-10">"I'm staying up too late and then I can't get up."</p>
                <div className="flex justify-start">
                  <FumeBadge type="reported">Client Reported</FumeBadge>
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg border border-border/50 flex flex-col justify-between gap-3 relative">
                <MessageSquareQuote className="w-6 h-6 text-primary/10 absolute top-2 right-2" />
                <p className="text-sm text-foreground/80 italic font-medium relative z-10">"I grabbed fast food three times this week."</p>
                <div className="flex justify-start">
                  <FumeBadge type="reported">Client Reported</FumeBadge>
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg border border-border/50 flex flex-col justify-between gap-3 relative">
                <MessageSquareQuote className="w-6 h-6 text-primary/10 absolute top-2 right-2" />
                <p className="text-sm text-foreground/80 italic font-medium relative z-10">"My sleep tracker shows I'm only getting 5-6 hours."</p>
                <div className="flex justify-start">
                  <FumeBadge type="fact">Confirmed Fact</FumeBadge>
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg border border-border/50 flex flex-col justify-between gap-3 relative">
                <MessageSquareQuote className="w-6 h-6 text-primary/10 absolute top-2 right-2" />
                <p className="text-sm text-foreground/80 italic font-medium relative z-10">"I feel like I'm backsliding."</p>
                <div className="flex justify-start">
                  <FumeBadge type="inference">AI Inference (Emotion)</FumeBadge>
                </div>
              </div>

            </div>
          </motion.div>

        </motion.div>
      </ScrollArea>
    </div>
  );
}
