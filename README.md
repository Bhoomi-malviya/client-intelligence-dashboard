# FUME AI — Client Intelligence Dashboard

> **GenAI Product Intern Assignment — FUME**
> Built by Bhoomi Malviya

A web application that analyzes health coach–client conversations and generates structured, evidence-grounded client intelligence reports with responsible AI design at its core.

🔗 **Live Demo:** https://fume-ai-insight--bhoomimalviya24.replit.app

---

## 📌 What It Does

Coaches paste a multi-day health coaching conversation. The app extracts structured insights across 6 health dimensions, classifies every finding by data type, flags risks, and generates actionable coach recommendations — all with full evidence traceability back to the original messages.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📋 Conversation Parser | Parses multi-day Coach–Client conversations into structured day-by-day messages |
| 🔍 Rule-Based Extraction | Extracts sleep hours, steps, exercise types, water intake, meals, and symptoms via regex patterns |
| 🏷️ 4-Type Classification | Every insight labeled: **Confirmed Fact / Client Reported / AI Inference / Missing Information** |
| 📊 Confidence Scores | 0–100% score per section based on data density across reported days |
| 💬 Evidence Grounding | Every finding backed by verbatim quotes + day number from the conversation |
| ⚠️ Risk Flags | Auto-detects high/medium severity risks (e.g. sleep deprivation, burnout) |
| ✅ Human Review | Approve / Edit / Reject workflow before any insight is acted upon |
| 📁 JSON Export | Full structured report exported as JSON for downstream integration |
| 🚫 Wrong Conversation Guard | Detects non-health conversations and blocks misleading analysis |
| 📱 Sample Data | Pre-built 8-day real conversation with hand-crafted analysis for demonstration |

---

## 🧠 AI Safety Measures

- **No hallucinated facts** — if data is missing, it is explicitly shown as `Missing Information`, never estimated
- **Evidence-first** — every finding includes the exact quote that produced it
- **Confidence transparency** — scores degrade automatically with sparse data
- **Human review mandatory** — Approve / Edit / Reject before insights are used
- **Conversation type validation** — non-health conversations are detected and rejected with a clear warning

---

## 🗂️ Classification System

| Badge | Meaning |
|---|---|
| 🟢 **Confirmed Fact** | Objective, verifiable data stated with a specific number (e.g. "8,000 steps") |
| 🔵 **Client Reported** | Client's own statement — accurate but unverified (e.g. "slept 5 hours") |
| 🟡 **AI Inference** | Pattern-derived conclusion not directly stated (e.g. low protein from meal description) |
| 🔴 **Missing Information** | Data the coach expected but was never mentioned |

---

## 🔄 Workflow

```
Client Conversation
      ↓
Conversation Parsing (Day blocks → messages)
      ↓
Information Extraction (regex-based health signal detection)
      ↓
Evidence Grounding (verbatim quote + day tagging)
      ↓
Insight Classification (Confirmed Fact / Client Reported / AI Inference / Missing)
      ↓
Risk Assessment (sleep debt, burnout, GI issues, protein deficit)
      ↓
Coach Recommendation (priority-ranked next actions)
      ↓
Structured JSON Generation
      ↓
Human Review — Approve / Edit / Reject
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | Wouter |
| Icons | Lucide React |
| Monorepo | pnpm workspaces |
| Hosting | Replit (static + API) |

---

## 📁 Project Structure

```
artifacts/
├── fume-dashboard/          # Main React web app
│   └── src/
│       ├── components/
│       │   ├── AnalysisPanel.tsx    # Full report render (all sections)
│       │   ├── ConversationPanel.tsx # Chat view + custom paste mode
│       │   ├── ActionBar.tsx        # Analyze / Approve / Edit / Reject / Export
│       │   └── Badge.tsx            # Classification badge component
│       ├── data/
│       │   ├── analysisData.ts      # Types + pre-built sample analysis report
│       │   ├── conversationData.ts  # Real 8-day conversation dataset
│       │   └── conversationAnalyzer.ts  # Rule-based extraction engine
│       └── pages/
│           └── Dashboard.tsx        # Main orchestration + state management
└── api-server/              # Lightweight Express API (health check + future endpoints)
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/fume-ai-dashboard.git
cd fume-ai-dashboard

# Install dependencies
pnpm install

# Start the dashboard (dev mode)
pnpm --filter @workspace/fume-dashboard run dev

# Start the API server (separate terminal)
pnpm --filter @workspace/api-server run dev
```

The dashboard runs at `http://localhost:PORT` (port assigned automatically by Vite).

---

## 📋 Custom Conversation Format

To analyze your own conversation, use the **Paste Custom** tab and format it like this:

```
Day 1
Client: Good morning! Slept around 6 hours last night.
Coach: Good. How was your energy today?
Client: Had oats for breakfast and walked 4,000 steps.

Day 2
Client: Slept only 5 hours. Had acidity since morning.
Coach: Please track your water intake today.
Client: Drank 3 glasses of water so far.
```

The app extracts:
- Sleep: any mention of hours slept or sleep quality
- Exercise: walking, running, yoga, gym, steps, household activity
- Water: glasses/litres mentioned
- Nutrition: meal descriptions (breakfast, lunch, dinner, food names)
- Symptoms: acidity, headache, stress, fatigue, bloating, etc.

---

## 📤 JSON Export Schema

```json
{
  "meta": { "generatedAt": "", "client": "", "period": "", "analysisMethod": "" },
  "weeklySummary": { "text": "", "confidence": 0 },
  "sleep": { "value": "", "summary": "", "confidence": 0, "classification": "", "evidence": [] },
  "nutrition": { "value": "", "summary": "", "confidence": 0, "classification": "", "evidence": [] },
  "exercise": { "value": "", "summary": "", "confidence": 0, "classification": "", "evidence": [] },
  "waterIntake": { "value": "", "summary": "", "confidence": 0, "classification": "", "evidence": [] },
  "symptoms": { "value": "", "summary": "", "confidence": 0, "classification": "", "evidence": [] },
  "engagement": { "value": "", "summary": "", "confidence": 0, "classification": "" },
  "keyBarriers": [],
  "pendingActions": [],
  "riskFlags": [],
  "coachRecommendation": { "text": "", "confidence": 0 }
}
```

---

## 🙏 Acknowledgements

Built as part of the **FUME GenAI Product Intern Assignment**.
The 8-day sample conversation is based on a real health coaching interaction and was used to design and validate the extraction engine.

---

## 👩‍💻 Author

**Bhoomi Malviya**

