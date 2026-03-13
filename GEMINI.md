# GEMINI.md - Instructional Context for Cuentopia Live Agent

## Project Overview
**Cuentopia Live Agent** (also referred to as **CuentopIA**) is an experimental MVP developed for the **Gemini Live Agent Challenge**. It is a responsive, multimodal storytelling application designed for children. The core feature is a real-time feedback loop where an AI agent narrates a story and dynamically adjusts its tone based on the child's audio and emotional cues extracted from camera frames.

### Core Technologies
- **Frontend:** Angular 20+ (Standalone Components, Signals) & Ionic Framework 8.
- **Mobile:** Capacitor 8.
- **IA/Orquestación:** Gemini 2.0 Flash (Multimodal Live API via WebSockets).
- **Backend:** Firebase (Hosting, Auth, Firestore).
- **Architecture:** Planned Hexagonal Architecture (to be implemented).

---

## Architectural Blueprint (Hexagonal Architecture)
The project aims to decouple business logic from technical implementations following these layers:

- **`src/app/core/` (Domain Layer):** Pure entities and port interfaces (e.g., `StorytellingAIPort`, `MediaCapturePort`).
- **`src/app/application/` (Application Layer):** Use cases and orchestration (e.g., `LiveStoryFacade`).
- **`src/app/infrastructure/` (Infrastructure Layer):** Concrete adapters (e.g., `GeminiLiveWebSocketAdapter`, `BrowserMediaAdapter`).
- **`src/app/presentation/` (Presentation Layer):** Ionic/Angular standalone components.

---

## Building and Running
The following commands are used for development and production:

- **Development Server:** `npm start` or `ionic serve`
- **Build Production:** `npm run build` or `ionic build`
- **Run Tests:** `npm test` or `ionic test`
- **Linting:** `npm run lint` or `ionic lint`
- **Firebase Deployment:** `firebase deploy` (requires Firebase CLI)

---

## Development Conventions
- **Signals & Standalone:** Use Angular Signals for state management and Standalone Components for all UI elements.
- **Hexagonal Integrity:** Ensure that the `core` layer remains free of framework-specific dependencies. Always define interfaces in `core` and implementations in `infrastructure`.
- **Privacy by Design:** Do not store video frames or audio locally or in the cloud. Process modalities in transit only.
- **Real-time Focus:** Optimize media capture (e.g., resizing video frames to 2000ms intervals) to maintain low latency via WebSockets.

---

## System Instructions for the AI Agent (Narrator)
When implementing or testing the Gemini Live Agent, it should follow this persona:
- **Role:** Empathetic and pedagogical narrator for children.
- **Behavior:**
  - Adjust narrative tone based on visual distress or excitement.
  - Keep responses concise to minimize latency.
  - Use visual cues solely for narrative adjustment, not clinical diagnosis.

---

## Current Status & Roadmap
The project is currently a **blank Ionic Tabs project**. The immediate next steps are:
1. Initialize the Hexagonal folder structure.
2. Implement the `GeminiLiveWebSocketAdapter` in the infrastructure layer.
3. Configure Firebase for hosting and basic session metadata storage.
