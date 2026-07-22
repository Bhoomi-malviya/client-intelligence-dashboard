export type ClassificationType = 'confirmed_fact' | 'client_reported' | 'ai_inference' | 'missing_information';

export interface Evidence {
  quote: string;
  day: number;
  classification: ClassificationType;
}

export interface InsightSection {
  title: string;
  value: string;
  summary: string;
  confidence: number; // 0–100
  classification: ClassificationType;
  evidence: Evidence[];
}

export interface RiskFlag {
  severity: 'high' | 'medium' | 'low';
  description: string;
  classification: ClassificationType;
  evidence: Evidence[];
}

export interface AnalysisReport {
  client: string;
  period: string;
  weeklySummary: { text: string; confidence: number };
  nutrition: InsightSection;
  exercise: InsightSection;
  sleep: InsightSection;
  waterIntake: InsightSection;
  symptoms: InsightSection;
  engagement: InsightSection;
  keyBarriers: { barrier: string; classification: ClassificationType }[];
  pendingActions: { action: string; priority: 'high' | 'medium' | 'low' }[];
  riskFlags: RiskFlag[];
  coachRecommendation: { text: string; confidence: number };
  allEvidence: Evidence[];
}

export const sampleAnalysis: AnalysisReport = {
  client: 'Anonymous Client',
  period: 'Day 1 – Day 8',

  weeklySummary: {
    text: 'Client had a challenging 8-day period marked by chronic sleep deprivation (avg 5–5.5 hrs/night for Days 1–7), persistent acidity and bloating, inconsistent nutrition with low protein intake, and significant work-related stress peaking on Day 7. Day 8 showed clear improvement: 8 hours of sleep, higher energy, 8,000 steps, and 30 minutes of exercise. Engagement was consistent throughout, with daily check-ins and open disclosure of barriers.',
    confidence: 91,
  },

  nutrition: {
    title: 'Nutrition Adherence',
    value: 'Inconsistent — Low Protein',
    summary:
      'Meals were irregular and protein intake was frequently low, especially on school days. The client skipped or minimised evening meals on Days 2 and 6. ACV compliance was missed on Day 3. Salad before lunch was not followed.',
    confidence: 72,
    classification: 'client_reported',
    evidence: [
      { quote: "Lunch was kadhi with soya and green vegetables.", day: 1, classification: 'client_reported' },
      { quote: "Didn't eat much in the evening. Just a small piece of paneer.", day: 2, classification: 'client_reported' },
      { quote: "No. I didn't get time.", day: 3, classification: 'client_reported' },
      { quote: "Protein seems low in breakfast on some days.", day: 5, classification: 'ai_inference' },
      { quote: "Food intake was low today. Protein was also missing.", day: 6, classification: 'confirmed_fact' },
      { quote: "I am not getting enough time to plan meals.", day: 6, classification: 'client_reported' },
    ],
  },

  exercise: {
    title: 'Exercise / Steps',
    value: '4,500–8,000 steps (most days)',
    summary:
      'Light-to-moderate physical activity was maintained throughout the 8 days. Household activity (mopping, sweeping) was counted on multiple days. Structured exercise improved progressively — 20 min on Days 4 and 5, 30 min on Day 8. Steps ranged from 4,500 to 8,000.',
    confidence: 82,
    classification: 'confirmed_fact',
    evidence: [
      { quote: "Did some mopping, sweeping, Surya Namaskar and walking inside the house.", day: 1, classification: 'client_reported' },
      { quote: "Steps around 8,000, Exercise only walking.", day: 3, classification: 'confirmed_fact' },
      { quote: "4,500 steps so far.", day: 4, classification: 'client_reported' },
      { quote: "Did around 20 minutes walking, stretching and breathing today. Feeling really good.", day: 4, classification: 'client_reported' },
      { quote: "Did 20 minutes stretching and running.", day: 5, classification: 'client_reported' },
      { quote: "Steps 6,000 today.", day: 7, classification: 'client_reported' },
      { quote: "Did 30 minutes exercise.", day: 8, classification: 'client_reported' },
      { quote: "Steps around 8,000.", day: 8, classification: 'client_reported' },
    ],
  },

  sleep: {
    title: 'Sleep Analysis',
    value: 'Avg 5.2 hrs/night (Days 1–7), 8 hrs Day 8',
    summary:
      'Sleep was severely inadequate across most of the period. Days 1, 3, and 7 showed 5–5.5 hours of sleep with explicit mentions of exhaustion. Day 7 saw the client momentarily fall asleep during a meeting — a critical red flag for cumulative sleep debt. Day 8 marked a significant recovery with 8 hours of sleep and improved energy.',
    confidence: 93,
    classification: 'confirmed_fact',
    evidence: [
      { quote: "Slept only around 5 hours last night. Daughter had exams, so I was awake late.", day: 1, classification: 'client_reported' },
      { quote: "Sleep 5 hours", day: 3, classification: 'confirmed_fact' },
      { quote: "Sleep around 5.5 hours.", day: 7, classification: 'client_reported' },
      { quote: "During a meeting today I was so tired that my head went down on the table and I actually slept for a few seconds.", day: 7, classification: 'confirmed_fact' },
      { quote: "I feel I can sleep for days.", day: 7, classification: 'client_reported' },
      { quote: "Slept better last night, around 8 hours.", day: 8, classification: 'client_reported' },
      { quote: "Energy feels much better today.", day: 8, classification: 'client_reported' },
    ],
  },

  waterIntake: {
    title: 'Water Intake',
    value: '3.5–4 litres/day (Days reported)',
    summary:
      'Water intake was explicitly reported on Days 2, 3, and 8 only. Day 3 showed 4 litres and Day 8 showed 3.5 litres — within healthy range. Data is missing for 5 out of 8 days. Coach-prompted tracking may improve consistency.',
    confidence: 60,
    classification: 'client_reported',
    evidence: [
      { quote: "Walk and water done.", day: 2, classification: 'client_reported' },
      { quote: "Water 4 litres", day: 3, classification: 'confirmed_fact' },
      { quote: "Water around 3.5 litres.", day: 8, classification: 'client_reported' },
      { quote: "Water intake not reported", day: 4, classification: 'missing_information' },
      { quote: "Water intake not reported", day: 5, classification: 'missing_information' },
      { quote: "Water intake not reported", day: 6, classification: 'missing_information' },
    ],
  },

  symptoms: {
    title: 'Symptoms / Stress',
    value: 'Acidity, bloating, extreme fatigue; high work stress',
    summary:
      'Acidity appeared on Day 1 and persisted through Day 8 (on and off). Bloating was reported on Days 2 and 6. Day 7 was the most critical: client reported extreme fatigue, emotional exhaustion, and described falling asleep mid-meeting. Work politics and office pressure were cited as major stress contributors. Day 8 showed improved energy.',
    confidence: 88,
    classification: 'client_reported',
    evidence: [
      { quote: "Feeling some acidity since morning.", day: 1, classification: 'client_reported' },
      { quote: "Still having acidity and bloating.", day: 2, classification: 'client_reported' },
      { quote: "Bloating is back and I feel like I have gained weight.", day: 6, classification: 'client_reported' },
      { quote: "There is a lot of office pressure and politics going on.", day: 7, classification: 'client_reported' },
      { quote: "Feeling very low.", day: 7, classification: 'client_reported' },
      { quote: "Still having bloating on and off.", day: 8, classification: 'client_reported' },
    ],
  },

  engagement: {
    title: 'Engagement Level',
    value: 'High — Daily Check-ins All 8 Days',
    summary:
      'Client provided daily updates without prompting on most days, disclosed personal stressors (daughter exams, work politics), and responded to coach questions. Active follow-through shown by ordering sprouts (Day 5) and carrying lunch to school (Day 4). One missed call on Day 7 due to a stressful work situation.',
    confidence: 95,
    classification: 'confirmed_fact',
    evidence: [
      { quote: "Generally feeling happy today.", day: 1, classification: 'client_reported' },
      { quote: "ACV done today.", day: 4, classification: 'client_reported' },
      { quote: "I didn't have sprouts today. Have ordered them.", day: 5, classification: 'client_reported' },
      { quote: "Sorry I missed your call. There was a stressful situation at work.", day: 7, classification: 'client_reported' },
      { quote: "But overall energy is much better than before.", day: 8, classification: 'client_reported' },
    ],
  },

  keyBarriers: [
    { barrier: 'Chronic sleep deprivation driven by late working hours', classification: 'confirmed_fact' },
    { barrier: 'High work stress and office politics (peak on Day 7)', classification: 'client_reported' },
    { barrier: 'School schedule making meal planning difficult', classification: 'client_reported' },
    { barrier: 'Persistent acidity and bloating affecting comfort', classification: 'client_reported' },
    { barrier: 'Low protein intake on multiple days', classification: 'ai_inference' },
    { barrier: 'ACV and salad habits not yet consistently formed', classification: 'confirmed_fact' },
  ],

  pendingActions: [
    { action: 'Address cumulative sleep debt — recommend a sleep hygiene protocol', priority: 'high' },
    { action: 'Investigate root cause of ongoing bloating and acidity', priority: 'high' },
    { action: 'Provide a practical high-protein meal guide for school days', priority: 'high' },
    { action: 'Share stress management resources given Day 7 severity', priority: 'medium' },
    { action: 'Set daily water-tracking reminder to improve data completeness', priority: 'medium' },
    { action: 'Reinforce ACV and pre-lunch salad habit via phone reminder', priority: 'low' },
  ],

  riskFlags: [
    {
      severity: 'high',
      description: 'Client fell asleep mid-meeting on Day 7 — indicative of critical sleep deprivation and possible burnout',
      classification: 'confirmed_fact',
      evidence: [
        { quote: "During a meeting today I was so tired that my head went down on the table and I actually slept for a few seconds.", day: 7, classification: 'confirmed_fact' },
        { quote: "I feel I can sleep for days.", day: 7, classification: 'client_reported' },
      ],
    },
    {
      severity: 'high',
      description: 'Chronic sleep deprivation — 5 or fewer hours for at least 6 consecutive days',
      classification: 'confirmed_fact',
      evidence: [
        { quote: "Slept only around 5 hours last night.", day: 1, classification: 'client_reported' },
        { quote: "Sleep 5 hours", day: 3, classification: 'confirmed_fact' },
        { quote: "Sleep around 5.5 hours.", day: 7, classification: 'client_reported' },
      ],
    },
    {
      severity: 'medium',
      description: 'Persistent GI symptoms (acidity, bloating) across 7 of 8 days — may need medical review',
      classification: 'client_reported',
      evidence: [
        { quote: "Feeling some acidity since morning.", day: 1, classification: 'client_reported' },
        { quote: "Still having acidity and bloating.", day: 2, classification: 'client_reported' },
        { quote: "Still having bloating on and off.", day: 8, classification: 'client_reported' },
      ],
    },
    {
      severity: 'medium',
      description: 'Nutritional protein deficit on multiple days despite coach guidance',
      classification: 'ai_inference',
      evidence: [
        { quote: "Protein seems low in breakfast on some days.", day: 5, classification: 'ai_inference' },
        { quote: "Food intake was low today. Protein was also missing.", day: 6, classification: 'confirmed_fact' },
      ],
    },
  ],

  coachRecommendation: {
    text: 'Priority 1: Address the sleep crisis immediately — the Day 7 in-meeting sleep incident signals burnout risk. Recommend a hard sleep cutoff and share a sleep hygiene protocol. Priority 2: Refer or flag the persistent bloating and acidity for medical review as it has lasted throughout the 8-day period. Priority 3: Provide a practical 3-option high-protein breakfast guide tailored to school mornings. Acknowledge the strong engagement and the Day 8 recovery — use this positive momentum as a motivational anchor in the next session.',
    confidence: 89,
  },

  allEvidence: [],
};

// Flatten all evidence for the Evidence Grounding section
sampleAnalysis.allEvidence = [
  ...sampleAnalysis.sleep.evidence,
  ...sampleAnalysis.symptoms.evidence,
  ...sampleAnalysis.nutrition.evidence,
  ...sampleAnalysis.exercise.evidence,
  ...sampleAnalysis.waterIntake.evidence.filter(e => e.classification !== 'missing_information'),
  ...sampleAnalysis.engagement.evidence,
].filter(
  (e, i, arr) =>
    arr.findIndex(x => x.quote === e.quote && x.day === e.day) === i,
);
