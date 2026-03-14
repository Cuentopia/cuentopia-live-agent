# Cuentopia — Multimodal Empathy for Therapeutic Storytelling

An AI-powered storytelling agent that sees, hears and emotionally responds to children in real time. Built for the **Gemini Live Agent Challenge**.

---

## What it does

Cuentopia uses the **Gemini Live API** to establish a persistent multimodal connection with the child's device. While narrating a story, the agent simultaneously:

- **Listens** to the child's voice via microphone (PCM 16kHz)
- **Sees** the child's facial expressions via camera (JPEG frames at 1fps)
- **Adapts** the narrative in real time based on detected emotional cues

If the child looks bored → the plot takes a dramatic turn.
If the child looks scared → a comforting character appears immediately.
If the child smiles → the story accelerates and amplifies that joy.

---

## Agent Architecture

Cuentopia uses a **multi-agent system** where each agent is a specialized narrator stored in Firestore. Agents are loaded dynamically at session start — no redeployment needed to add or modify a narrator.

| Agent ID | Persona | Specialization |
|---|---|---|
| `narrator-default` | Cuentopia | General adaptive storytelling |
| `narrator-fears` | Valentín | Helping children overcome fears |
| `narrator-sleep` | Luna | Calm bedtime stories |
| `narrator-adventure` | Aventura | High-energy action stories |

Each agent in Firestore defines:
- `systemPrompt` — the agent's personality, visual reaction rules and narrative style
- `initialPromptTemplate` — how the session starts (`{childName}`, `{topic}` placeholders)
- `visionNudgeText` — periodic instruction to force visual re-analysis
- `visionNudgeIntervalSeconds` — how often the nudge fires

---

## Technical Architecture

```
Browser (Ionic/Angular)
  │
  ├── IonicMediaAdapter        captures camera frames (JPEG 640x480) + mic audio (PCM 16kHz)
  │
  ├── LiveStoryFacade          orchestrates session state via Angular Signals
  │
  └── FirebaseStorytellingAdapter
        │
        ├── getLiveConfig()    Firebase Function → reads agent config from Firestore
        │
        └── WebSocket ──────► Gemini Live API (gemini-2.5-flash-native-audio-latest)
                                  │
                                  └── audio/pcm 24kHz response ──► Web Audio API playback
```

**Hexagonal Architecture** — `core/` contains only pure TypeScript interfaces (ports). Angular, Firebase and Gemini details live exclusively in `infrastructure/`.

**Privacy by Design** — video frames and audio are processed in-flight. Nothing is persisted.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 20 (Signals, Standalone) + Ionic 8 |
| Mobile | Capacitor 8 (Android/iOS) |
| AI | Gemini Live API via WebSocket |
| Agent Config | Firestore (`agents/` collection) |
| Secrets | Firebase Functions v2 (`getLiveConfig`) |
| Hosting | Firebase Hosting |

---

## Getting started

### Prerequisites
- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project with Firestore and Functions enabled
- A Google AI API key with access to `gemini-2.5-flash-native-audio-latest`

### Setup

```bash
# 1. Clone and install
git clone <repo>
npm install

# 2. Configure environment
cp .env.example .env
# Fill in .env with your Firebase and Google AI credentials

# 3. Add the Firebase Function secret
firebase functions:secrets:set GOOGLE_GENAI_API_KEY

# 4. Seed Firestore agents (skips existing documents)
npm run seed

# 5. Run locally
npm start
```

### Deploy

```bash
# Full deploy (frontend + functions + firestore rules)
npm run build && firebase deploy

# Android
npm run build:android   # generates android/, applies permissions via Trapeze
npx cap open android    # opens Android Studio
```

### Add a new agent

Create a document in Firestore under `agents/<your-agent-id>` with the following fields:

```json
{
  "displayName": "Your Agent Name",
  "systemPrompt": "...",
  "initialPromptTemplate": "... {childName} ... {topic} ...",
  "visionNudgeText": "...",
  "visionNudgeIntervalSeconds": 12,
  "version": "1.0"
}
```

No redeployment needed. The agent is available immediately.

---

*Submitted to the [Gemini Live Agent Challenge](https://geminiliveagentchallenge.devpost.com/).*
