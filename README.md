# Cuentopia: Emotion-Adaptive Storytelling

**Multimodal Empathy for Therapeutic Storytelling**

Cuentopia is an AI-driven prototype that transforms the traditional bedtime story into a responsive, two-way empathetic interaction. By leveraging the Gemini 2.0 Multimodal Live API, Cuentopia "sees" and "hears" a child's emotional state in real-time, adapting its narrative to provide comfort, guidance, and engagement.

## 🌟 Inspiration
Traditional books are static; they cannot perceive a child's hesitation or fear. Cuentopia explores the frontier of **Responsive Storytelling**, where the narrator acts as an emotional anchor, adjusting the plot dynamically to help children process complex emotions like anxiety or frustration.

## ✨ Key Features
- **Real-time Multimodal Interaction:** Natural dialogue between the child and the AI narrator.
- **Visual Emotion Detection:** Uses the device camera to stream facial frames, detecting engagement or distress.
- **Dynamic Narrative Pivots:** Gemini 2.0 Flash processes live signals to steer the story toward supportive or calming directions when needed.
- **Privacy by Design:** Implemented as a "pass-through" analysis where video frames are processed in-flight and never persisted.

## 🛠️ Technical Architecture
Cuentopia is built with a high-performance, low-latency loop designed for real-time streaming:

- **Engine:** **Gemini 2.0 Flash (Multimodal Live API)** handles persistent WebSocket connections and interleaved audio/video processing.
- **Orchestration:** **Google GenKit** manages agent workflows and ensures child-safe pedagogical boundaries.
- **Frontend:** **Ionic + Angular** mobile interface utilizing Web Media APIs for synchronized streaming.
- **Backend:** **Firebase & Firestore** for secure authentication and session metadata storage.

## 🚀 The Role of Gemini 2.0 Flash
Gemini 2.0 Flash is the "brain" of Cuentopia. Its ability to process multimodal inputs (voice tone and facial expressions) simultaneously allows the agent to:
1.  **Maintain a "live" feel** with minimal latency.
2.  **Reason across different data types** to determine the child's emotional state ($E_{state}$).
3.  **Execute near-instant shifts** in character persona and plot direction based on perceived cues.

## 🏗️ Built With
- Gemini 2.0 Live API
- Google GenKit
- Firebase & Firestore
- Ionic & Angular
- TypeScript & WebSockets

---
*Submitted to the Gemini Live Agent Challenge.*
