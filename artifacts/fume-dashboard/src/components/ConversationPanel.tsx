import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  sender: 'coach' | 'client';
  text: string;
  time: string;
}

const mockMessages: Message[] = [
  { id: '1', sender: 'coach', text: "How are you feeling this week?", time: '10:00 AM' },
  { id: '2', sender: 'client', text: "Honestly, pretty tired. I've been skipping my morning walks.", time: '10:02 AM' },
  { id: '3', sender: 'coach', text: "What's been getting in the way?", time: '10:03 AM' },
  { id: '4', sender: 'client', text: "Work stress mostly. I'm staying up too late and then I can't get up.", time: '10:06 AM' },
  { id: '5', sender: 'coach', text: "How has your nutrition been?", time: '10:08 AM' },
  { id: '6', sender: 'client', text: "Not great. I grabbed fast food three times this week. I know I shouldn't.", time: '10:12 AM' },
  { id: '7', sender: 'coach', text: "Are you tracking your water intake?", time: '10:14 AM' },
  { id: '8', sender: 'client', text: "Sometimes. Maybe 4 glasses a day, not the 8 you recommended.", time: '10:15 AM' },
  { id: '9', sender: 'coach', text: "How are your stress levels on a scale of 1-10?", time: '10:20 AM' },
  { id: '10', sender: 'client', text: "Like a 7 or 8 honestly. Work is really intense right now.", time: '10:21 AM' },
  { id: '11', sender: 'coach', text: "Have you been experiencing any physical symptoms?", time: '10:23 AM' },
  { id: '12', sender: 'client', text: "Some headaches. And my sleep tracker shows I'm only getting 5-6 hours.", time: '10:25 AM' },
  { id: '13', sender: 'coach', text: "What about your steps goal?", time: '10:27 AM' },
  { id: '14', sender: 'client', text: "I hit it twice this week. The other days were under 3,000.", time: '10:29 AM' },
  { id: '15', sender: 'coach', text: "How are you feeling emotionally about your progress?", time: '10:31 AM' },
  { id: '16', sender: 'client', text: "Discouraged, honestly. I feel like I'm backsliding.", time: '10:32 AM' },
  { id: '17', sender: 'coach', text: "I hear you. Let's look at what's working and build from there.", time: '10:35 AM' },
];

export function ConversationPanel() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-card border-r border-border">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border flex items-center justify-between shrink-0 bg-background/50">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Client Conversation</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Sarah M. &bull; Session Date: July 14, 2026</p>
        </div>
        <Avatar className="h-10 w-10 border shadow-sm">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">SM</AvatarFallback>
        </Avatar>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="flex flex-col gap-4 pb-8">
          {mockMessages.map((msg) => {
            const isCoach = msg.sender === 'coach';
            return (
              <div 
                key={msg.id} 
                className={`flex max-w-[85%] ${isCoach ? 'self-start' : 'self-end flex-row-reverse'}`}
              >
                <div className={`flex flex-col gap-1 ${isCoach ? 'items-start' : 'items-end'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {isCoach ? 'Coach' : 'Sarah'}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">{msg.time}</span>
                  </div>
                  <div 
                    className={`
                      px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
                      ${isCoach 
                        ? 'bg-secondary text-secondary-foreground rounded-tl-sm border border-border/40' 
                        : 'bg-primary text-primary-foreground rounded-tr-sm'}
                    `}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
