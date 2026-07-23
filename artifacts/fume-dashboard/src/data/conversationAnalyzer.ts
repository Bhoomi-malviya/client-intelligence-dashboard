import { type ConversationDay } from './conversationData';
import { type AnalysisReport, type Evidence, type ClassificationType } from './analysisData';

// ─── Extraction helpers ───────────────────────────────────────────────────────

function extractSleepHours(text: string): number | null {
  const patterns = [
    /slept\s+(?:only\s+)?(?:around\s+)?(\d+(?:\.\d+)?)\s*hours?/i,
    /(\d+(?:\.\d+)?)\s*hours?\s+(?:of\s+)?sleep/i,
    /sleep\s+(?:was\s+)?(\d+(?:\.\d+)?)\s*hours?/i,
    /(\d+(?:\.\d+)?)\s*hrs?\s+(?:of\s+)?sleep/i,
    /got\s+(?:only\s+)?(\d+(?:\.\d+)?)\s*hours?/i,
    /(?:around|about|only|just)\s+(\d+(?:\.\d+)?)\s*hours?\s+last\s+night/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return parseFloat(m[1]);
  }
  return null;
}

function extractSteps(text: string): number | null {
  const m = text.match(/(\d[\d,]*)\s*steps?/i) || text.match(/walked\s+(\d[\d,]*)/i);
  if (m) return parseInt(m[1].replace(/,/g, ''), 10);
  return null;
}

function extractWaterMention(text: string): string | null {
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(?:glasses?|cups?)\s+(?:of\s+)?water/i,
    /(\d+(?:\.\d+)?)\s*(?:liters?|litres?|L)\s+(?:of\s+)?water/i,
    /water[:\s]+(\d+(?:\.\d+)?)/i,
    /drank\s+(\d+(?:\.\d+)?)\s*(?:glasses?|liters?|cups?)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0].trim();
  }
  if (/water/i.test(text)) return text.trim();
  return null;
}

function hasSleepIssue(text: string): boolean {
  return /couldn['']t\s+sleep|insomnia|poor\s+sleep|bad\s+sleep|didn['']t\s+sleep|no\s+sleep|awake\s+late|late\s+night|up\s+late/i.test(text);
}

function hasPositiveSleep(text: string): boolean {
  return /good\s+sleep|slept\s+well|great\s+sleep|rested|refreshed/i.test(text);
}

function extractExercise(text: string): string[] {
  const types: string[] = [];
  const checks: [RegExp, string][] = [
    [/surya\s*namaskar/i, 'Surya Namaskar'],
    [/yoga/i, 'Yoga'],
    [/walk(?:ing|ed)?/i, 'Walking'],
    [/run(?:ning|ned)?|jog(?:ging|ged)?/i, 'Running/Jogging'],
    [/gym|workout|exercise/i, 'Workout'],
    [/swim(?:ming|med)?/i, 'Swimming'],
    [/cycling|bike|bicycl/i, 'Cycling'],
    [/stretch(?:ing|ed)?/i, 'Stretching'],
    [/meditation|meditat/i, 'Meditation'],
    [/danc(?:ing|ed)?/i, 'Dancing'],
    [/mopping|sweeping|cleaning|housework/i, 'Household Activity'],
    [/zumba/i, 'Zumba'],
    [/cardio/i, 'Cardio'],
    [/squat|push.?up|plank|lunge/i, 'Strength Exercises'],
  ];
  for (const [re, label] of checks) {
    if (re.test(text)) types.push(label);
  }
  return types;
}

function extractSymptoms(text: string): string[] {
  const symptoms: string[] = [];
  const checks: [RegExp, string][] = [
    [/acidity|acid\s+reflux|heartburn/i, 'Acidity'],
    [/headache|migraine/i, 'Headache'],
    [/stress(?:ed|ful)?|anxious|anxiety/i, 'Stress/Anxiety'],
    [/tired|fatigue|exhausted|weak/i, 'Fatigue'],
    [/bloating|bloated/i, 'Bloating'],
    [/pain|ache|sore/i, 'Pain/Soreness'],
    [/cold|cough|fever|sick|ill/i, 'Illness'],
    [/mood\s+swing|irritable|angry|upset/i, 'Mood Issues'],
    [/not\s+feeling\s+well|unwell/i, 'Unwell'],
    [/dizzy|nausea/i, 'Dizziness/Nausea'],
  ];
  for (const [re, label] of checks) {
    if (re.test(text)) symptoms.push(label);
  }
  return symptoms;
}

function extractFoodMentions(text: string): string[] {
  const foods: string[] = [];
  // Look for food-related lines
  const foodWords = /(?:ate|had|eaten|breakfast|lunch|dinner|meal|snack|food|salad|vegetable|fruit|rice|roti|dal|sabzi|chicken|egg|protein|oats|milk|nuts|tea|coffee|juice)/i;
  if (foodWords.test(text)) foods.push(text.trim());
  return foods;
}

function classifyConfidence(dataPoints: number, totalDays: number): number {
  const ratio = dataPoints / Math.max(totalDays, 1);
  if (ratio >= 0.7) return Math.round(75 + ratio * 20);
  if (ratio >= 0.4) return Math.round(55 + ratio * 30);
  if (ratio > 0) return Math.round(30 + ratio * 50);
  return 15;
}

function truncateQuote(text: string, maxLen = 90): string {
  const t = text.trim();
  return t.length > maxLen ? t.slice(0, maxLen - 1) + '…' : t;
}

// ─── Main analyzer ────────────────────────────────────────────────────────────

export function analyzeConversation(days: ConversationDay[]): AnalysisReport {
  const totalDays = days.length;

  // Per-day data buckets
  const sleepHoursPerDay: { day: number; hours: number; quote: string }[] = [];
  const sleepIssuesDays: { day: number; quote: string }[] = [];
  const stepsPerDay: { day: number; steps: number; quote: string }[] = [];
  const exercisePerDay: { day: number; types: string[]; quote: string }[] = [];
  const waterPerDay: { day: number; mention: string; quote: string }[] = [];
  const symptomsPerDay: { day: number; symptoms: string[]; quote: string }[] = [];
  const nutritionPerDay: { day: number; quote: string }[] = [];
  const clientCheckInDays: number[] = [];

  for (const { day, messages } of days) {
    const clientMsgs = messages.filter(m => m.sender === 'client');
    if (clientMsgs.length === 0) continue;
    clientCheckInDays.push(day);

    const fullClientText = clientMsgs.map(m => m.text).join(' ');

    // Sleep
    let sleepFound = false;
    for (const msg of clientMsgs) {
      const hrs = extractSleepHours(msg.text);
      if (hrs !== null) {
        sleepHoursPerDay.push({ day, hours: hrs, quote: truncateQuote(msg.text) });
        sleepFound = true;
        break;
      }
    }
    if (!sleepFound) {
      for (const msg of clientMsgs) {
        if (hasSleepIssue(msg.text)) {
          sleepIssuesDays.push({ day, quote: truncateQuote(msg.text) });
          break;
        }
        if (hasPositiveSleep(msg.text)) {
          sleepHoursPerDay.push({ day, hours: 7, quote: truncateQuote(msg.text) });
          break;
        }
      }
    }

    // Steps
    for (const msg of clientMsgs) {
      const steps = extractSteps(msg.text);
      if (steps !== null) {
        stepsPerDay.push({ day, steps, quote: truncateQuote(msg.text) });
        break;
      }
    }

    // Exercise
    const allExercise: string[] = [];
    let exerciseQuote = '';
    for (const msg of clientMsgs) {
      const ex = extractExercise(msg.text);
      if (ex.length > 0) {
        allExercise.push(...ex);
        exerciseQuote = exerciseQuote || truncateQuote(msg.text);
      }
    }
    if (allExercise.length > 0) {
      exercisePerDay.push({ day, types: [...new Set(allExercise)], quote: exerciseQuote });
    }

    // Water
    for (const msg of clientMsgs) {
      const w = extractWaterMention(msg.text);
      if (w) {
        waterPerDay.push({ day, mention: w, quote: truncateQuote(msg.text) });
        break;
      }
    }

    // Symptoms
    const allSymptoms: string[] = [];
    let symptomQuote = '';
    for (const msg of clientMsgs) {
      const s = extractSymptoms(msg.text);
      if (s.length > 0) {
        allSymptoms.push(...s);
        symptomQuote = symptomQuote || truncateQuote(msg.text);
      }
    }
    if (allSymptoms.length > 0) {
      symptomsPerDay.push({ day, symptoms: [...new Set(allSymptoms)], quote: symptomQuote });
    }

    // Nutrition
    let nutritionMentioned = false;
    for (const msg of clientMsgs) {
      const foods = extractFoodMentions(msg.text);
      if (foods.length > 0 && !nutritionMentioned) {
        nutritionPerDay.push({ day, quote: truncateQuote(msg.text) });
        nutritionMentioned = true;
      }
    }
  }

  // ── Sleep ──
  const avgSleep = sleepHoursPerDay.length > 0
    ? (sleepHoursPerDay.reduce((s, d) => s + d.hours, 0) / sleepHoursPerDay.length).toFixed(1)
    : null;
  const sleepReportedDays = sleepHoursPerDay.length + sleepIssuesDays.length;
  const sleepConf = classifyConfidence(sleepReportedDays, totalDays);
  const missingSleeepDays = days.filter(d => !sleepHoursPerDay.find(s => s.day === d.day) && !sleepIssuesDays.find(s => s.day === d.day)).map(d => d.day);
  const lowSleepDays = sleepHoursPerDay.filter(d => d.hours < 6);
  const sleepEvidence: Evidence[] = [
    ...sleepHoursPerDay.map(d => ({ quote: d.quote, day: d.day, classification: 'client_reported' as ClassificationType })),
    ...sleepIssuesDays.map(d => ({ quote: d.quote, day: d.day, classification: 'client_reported' as ClassificationType })),
  ].slice(0, 6);

  const sleepValue = avgSleep
    ? `${avgSleep} hrs avg (${sleepHoursPerDay.length}/${totalDays} days reported)`
    : sleepIssuesDays.length > 0
    ? `Disrupted sleep reported on ${sleepIssuesDays.length} day(s)`
    : 'Not reported';

  const sleepClassification: ClassificationType = sleepReportedDays > 0
    ? (lowSleepDays.length > 0 ? 'client_reported' : 'client_reported')
    : 'missing_information';

  const sleepSummary = avgSleep
    ? `Client averaged ${avgSleep} hours of sleep. ${lowSleepDays.length > 0 ? `Poor sleep (< 6 hrs) reported on ${lowSleepDays.length} day(s).` : 'Sleep duration appears adequate.'} ${missingSleeepDays.length > 0 ? `No sleep data on Days ${missingSleeepDays.join(', ')}.` : ''}`
    : sleepIssuesDays.length > 0
    ? `Sleep difficulties mentioned on Days ${sleepIssuesDays.map(d => d.day).join(', ')}. No specific duration reported.`
    : 'Sleep not mentioned in this conversation. Cannot assess sleep quality or duration.';

  // ── Exercise ──
  const exerciseDayCount = exercisePerDay.length;
  const stepsValues = stepsPerDay.map(d => d.steps);
  const avgSteps = stepsValues.length > 0 ? Math.round(stepsValues.reduce((a, b) => a + b, 0) / stepsValues.length) : null;
  const allExerciseTypes = [...new Set(exercisePerDay.flatMap(d => d.types))];
  const exerciseConf = classifyConfidence(exerciseDayCount, totalDays);
  const missingExerciseDays = days.filter(d => !exercisePerDay.find(e => e.day === d.day)).map(d => d.day);

  const exerciseEvidence: Evidence[] = [
    ...exercisePerDay.map(d => ({ quote: d.quote, day: d.day, classification: 'client_reported' as ClassificationType })),
    ...stepsPerDay.map(d => ({ quote: d.quote, day: d.day, classification: 'confirmed_fact' as ClassificationType })),
  ].slice(0, 6);

  const exerciseValue = exerciseDayCount > 0
    ? `Active on ${exerciseDayCount}/${totalDays} days${avgSteps ? ` · ~${avgSteps.toLocaleString()} avg steps` : ''}`
    : 'No exercise reported';

  const exerciseSummary = exerciseDayCount > 0
    ? `Client was physically active on ${exerciseDayCount} of ${totalDays} days. Activities: ${allExerciseTypes.join(', ') || 'general movement'}. ${avgSteps ? `Average step count: ${avgSteps.toLocaleString()}.` : ''} ${missingExerciseDays.length > 0 ? `No activity reported on Days ${missingExerciseDays.join(', ')}.` : ''}`
    : 'No exercise or physical activity mentioned in this conversation.';

  // ── Nutrition ──
  const nutritionDayCount = nutritionPerDay.length;
  const nutritionConf = classifyConfidence(nutritionDayCount, totalDays);
  const missingNutritionDays = days.filter(d => !nutritionPerDay.find(n => n.day === d.day)).map(d => d.day);

  const nutritionEvidence: Evidence[] = nutritionPerDay.map(d => ({
    quote: d.quote, day: d.day, classification: 'client_reported' as ClassificationType,
  })).slice(0, 6);

  const nutritionValue = nutritionDayCount > 0
    ? `Meals reported on ${nutritionDayCount}/${totalDays} days`
    : 'No meal data reported';

  const nutritionSummary = nutritionDayCount > 0
    ? `Client shared meal information on ${nutritionDayCount} of ${totalDays} days. ${missingNutritionDays.length > 0 ? `No meal data on Days ${missingNutritionDays.join(', ')}.` : ''} Calorie counts and macro breakdown not reported.`
    : 'No meal or food information mentioned in this conversation.';

  // ── Water ──
  const waterDayCount = waterPerDay.length;
  const waterConf = classifyConfidence(waterDayCount, totalDays);
  const missingWaterDays = days.filter(d => !waterPerDay.find(w => w.day === d.day)).map(d => d.day);

  const waterEvidence: Evidence[] = waterPerDay.map(d => ({
    quote: d.quote, day: d.day, classification: 'client_reported' as ClassificationType,
  })).slice(0, 6);

  const waterValue = waterDayCount > 0
    ? `Reported on ${waterDayCount}/${totalDays} days`
    : 'Not reported';

  const waterSummary = waterDayCount > 0
    ? `Water intake mentioned on ${waterDayCount} of ${totalDays} days. ${missingWaterDays.length > 0 ? `No data on Days ${missingWaterDays.join(', ')}.` : 'Full week coverage.'}`
    : 'Water intake not mentioned in this conversation.';

  // ── Symptoms ──
  const symptomDayCount = symptomsPerDay.length;
  const allSymptomTypes = [...new Set(symptomsPerDay.flatMap(d => d.symptoms))];
  const symptomConf = symptomDayCount > 0 ? 80 : 40;

  const symptomEvidence: Evidence[] = symptomsPerDay.map(d => ({
    quote: d.quote, day: d.day, classification: 'client_reported' as ClassificationType,
  })).slice(0, 6);

  const symptomValue = symptomDayCount > 0
    ? allSymptomTypes.join(', ')
    : 'No symptoms reported';

  const symptomSummary = symptomDayCount > 0
    ? `Symptoms reported on ${symptomDayCount} day(s): ${allSymptomTypes.join(', ')}. Coach should assess severity and triggers.`
    : 'No symptoms, stress, or health complaints mentioned in this conversation.';

  // ── Engagement ──
  const engagementRatio = clientCheckInDays.length / totalDays;
  const engagementConf = 95;
  const engagementValue = `${Math.round(engagementRatio * 100)}% (${clientCheckInDays.length}/${totalDays} days)`;
  const engagementSummary = `Client responded on ${clientCheckInDays.length} of ${totalDays} days.${engagementRatio === 1 ? ' Full engagement — consistent daily check-ins.' : engagementRatio >= 0.7 ? ' Good engagement.' : ' Inconsistent engagement — missed several days.'}`;

  // ── Key Barriers ──
  const keyBarriers: AnalysisReport['keyBarriers'] = [];
  if (lowSleepDays.length > 0) keyBarriers.push({ barrier: `Poor sleep on ${lowSleepDays.length} day(s) — may affect energy and adherence`, classification: 'client_reported' });
  if (symptomsPerDay.some(d => d.symptoms.includes('Acidity'))) keyBarriers.push({ barrier: 'Acidity/digestive issues reported — may be diet or stress related', classification: 'client_reported' });
  if (symptomsPerDay.some(d => d.symptoms.includes('Stress/Anxiety'))) keyBarriers.push({ barrier: 'Stress mentioned — could be impacting sleep and habits', classification: 'client_reported' });
  if (nutritionDayCount < totalDays * 0.5) keyBarriers.push({ barrier: 'Incomplete meal tracking — difficult to assess dietary adherence', classification: 'missing_information' });
  if (waterDayCount < totalDays * 0.5) keyBarriers.push({ barrier: 'Water intake rarely reported — hydration status unknown', classification: 'missing_information' });
  if (exerciseDayCount < totalDays * 0.4) keyBarriers.push({ barrier: 'Low reported physical activity', classification: 'ai_inference' });
  if (keyBarriers.length === 0) keyBarriers.push({ barrier: 'No major barriers identified from available data', classification: 'ai_inference' });

  // ── Pending Actions ──
  const pendingActions: AnalysisReport['pendingActions'] = [];
  if (waterDayCount < totalDays) pendingActions.push({ action: 'Track daily water intake — report glasses/liters each day', priority: 'high' });
  if (nutritionDayCount < totalDays) pendingActions.push({ action: 'Log all meals with portion sizes or food types', priority: 'high' });
  if (sleepReportedDays < totalDays) pendingActions.push({ action: 'Report exact sleep hours each morning', priority: 'medium' });
  if (exerciseDayCount < totalDays) pendingActions.push({ action: 'Log any physical activity including steps or household work', priority: 'medium' });
  if (symptomsPerDay.length > 0) pendingActions.push({ action: 'Track symptom severity (1–10 scale) when they occur', priority: 'high' });
  pendingActions.push({ action: 'Coach to follow up on missing days next check-in', priority: 'low' });

  // ── Risk Flags ──
  const riskFlags: AnalysisReport['riskFlags'] = [];
  if (lowSleepDays.length >= 2) {
    riskFlags.push({
      severity: 'high',
      description: `Client reported < 6 hours sleep on ${lowSleepDays.length} days. Chronic sleep deprivation affects metabolism, mood, and adherence.`,
      evidence: sleepHoursPerDay.filter(d => d.hours < 6).map(d => ({ quote: d.quote, day: d.day, classification: 'client_reported' as ClassificationType })),
      classification: 'client_reported',
    });
  }
  const highStressDays = symptomsPerDay.filter(d => d.symptoms.includes('Stress/Anxiety'));
  if (highStressDays.length > 0) {
    riskFlags.push({
      severity: 'medium',
      description: `Stress or anxiety mentioned on ${highStressDays.length} day(s). May be impacting sleep, eating habits, and motivation.`,
      evidence: highStressDays.map(d => ({ quote: d.quote, day: d.day, classification: 'client_reported' as ClassificationType })),
      classification: 'client_reported',
    });
  }
  if (engagementRatio < 0.6) {
    riskFlags.push({
      severity: 'medium',
      description: `Low engagement — client only checked in on ${clientCheckInDays.length} of ${totalDays} days. Risk of dropping off.`,
      evidence: [],
      classification: 'ai_inference',
    });
  }

  // ── Weekly Summary ──
  const summaryParts: string[] = [];
  summaryParts.push(`Over ${totalDays} days, the client checked in on ${clientCheckInDays.length} days (${Math.round(engagementRatio * 100)}% engagement).`);
  if (avgSleep) summaryParts.push(`Average sleep: ${avgSleep} hours.`);
  if (exerciseDayCount > 0) summaryParts.push(`Physical activity reported on ${exerciseDayCount} days.`);
  if (symptomDayCount > 0) summaryParts.push(`Symptoms noted: ${allSymptomTypes.slice(0, 3).join(', ')}.`);
  const missingCount = [waterDayCount, nutritionDayCount, sleepReportedDays].filter(c => c < totalDays * 0.5).length;
  if (missingCount > 0) summaryParts.push(`Key data gaps: ${missingCount} metric(s) reported on fewer than half the days.`);

  // ── Coach Recommendation ──
  const recParts: string[] = [];
  if (lowSleepDays.length > 0) recParts.push('address the recurring sleep deficit');
  if (symptomsPerDay.length > 0) recParts.push(`investigate symptoms (${allSymptomTypes.slice(0, 2).join(', ')})`);
  if (waterDayCount < totalDays * 0.5) recParts.push('encourage daily water tracking');
  if (nutritionDayCount < totalDays * 0.5) recParts.push('reinforce meal logging');
  if (recParts.length === 0) recParts.push('continue current routine and encourage consistent tracking');

  const coachRec = `In the next session, coach should ${recParts.join(', and ')}. ${missingWaterDays.length > 0 || missingNutritionDays.length > 0 ? 'Emphasise the importance of daily logging to enable accurate analysis.' : ''}`.trim();

  // ── All Evidence (top quotes) ──
  const allEvidence: Evidence[] = [
    ...sleepEvidence,
    ...exerciseEvidence.slice(0, 3),
    ...nutritionEvidence.slice(0, 3),
    ...waterEvidence.slice(0, 2),
    ...symptomEvidence.slice(0, 3),
  ].slice(0, 16);

  // ── Period string ──
  const firstDay = days[0]?.day ?? 1;
  const lastDay = days[days.length - 1]?.day ?? totalDays;
  const period = `Day ${firstDay} – Day ${lastDay} (${totalDays} days)`;

  return {
    client: 'Custom Client',
    period,
    weeklySummary: { text: summaryParts.join(' '), confidence: Math.round(60 + engagementRatio * 30) },
    sleep: { value: sleepValue, summary: sleepSummary, confidence: sleepConf, classification: sleepClassification, evidence: sleepEvidence },
    nutrition: { value: nutritionValue, summary: nutritionSummary, confidence: nutritionConf, classification: nutritionDayCount > 0 ? 'client_reported' : 'missing_information', evidence: nutritionEvidence },
    exercise: { value: exerciseValue, summary: exerciseSummary, confidence: exerciseConf, classification: exerciseDayCount > 0 ? 'client_reported' : 'missing_information', evidence: exerciseEvidence },
    waterIntake: { value: waterValue, summary: waterSummary, confidence: waterConf, classification: waterDayCount > 0 ? 'client_reported' : 'missing_information', evidence: waterEvidence },
    symptoms: { value: symptomValue, summary: symptomSummary, confidence: symptomConf, classification: symptomDayCount > 0 ? 'client_reported' : 'ai_inference', evidence: symptomEvidence },
    engagement: { value: engagementValue, summary: engagementSummary, confidence: engagementConf, classification: 'confirmed_fact' },
    keyBarriers,
    pendingActions,
    riskFlags,
    coachRecommendation: { text: coachRec, confidence: 72 },
    allEvidence,
  };
}
