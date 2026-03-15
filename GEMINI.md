# GEMINI.md - Instructional Context for Cuentopia Live Agent

## Project Overview
**Cuentopia Live Agent** (referred to as **CuentopIA**) is a multimodal therapeutic storytelling application for children, developed for the **Gemini Live Agent Challenge** (deadline: March 16, 2026). It uses a real-time feedback loop via WebSockets to Gemini Live API, adjusting the story's tone based on the child's audio and visual emotional cues.

### Core Technologies
- **Frontend UI:** Ionic 8 + Angular 20 Standalone (Ionic native components ONLY).
- **State Management:** Angular Signals (Primary state choice).
- **Mobile:** Capacitor 8.
- **AI Implementation:** Gemini Live API via `@google/genai` SDK using model `gemini-2.5-flash-native-audio-latest`.
- **Backend:** Firebase Functions v2 (Config/secrets only), Firestore (Agent config), Firebase Hosting.
- **Architecture:** STRICT Hexagonal Architecture.

---

## Architectural Blueprint (Hexagonal Architecture)
**NEVER VIOLATE THIS STRUCTURE.** Decouple business logic from technical implementations:

- **`src/app/core/` (Domain Layer):** Pure entities and port interfaces. **ZERO dependencies** (No Angular, Ionic, Firebase, or external libs).
- **`src/app/application/` (Application Layer):** Use cases and orchestration (Facades). Only depends on `core/`.
- **`src/app/infrastructure/` (Infrastructure Layer):** Concrete adapters implementing ports from `core/`.
- **`src/app/presentation/` (Presentation Layer):** Ionic/Angular standalone components. Only consumes `application/`.

### Rules of Engagement
- Adapters implement Ports. Never the other way around.
- Presentation components NEVER inject an adapter directly.
- Dependency injection associations (`{ provide: Port, useClass: Adapter }`) occur strictly in `main.ts`.

---

## Building and Running
- **Development Server:** `npm start` or `ionic serve`
- **Build Production:** `npm run build` or `ionic build`
- **Run Tests:** `npm test` or `ionic test`
- **Linting:** `npm run lint` or `ionic lint`
- **Firebase Deployment:** `firebase deploy --only hosting`

---

## Development Conventions

### UI & Styling
- **STRICTLY USE NATIVE IONIC COMPONENTS.** No TailwindCSS, Angular Material, or external UI libraries.
- Use Ionic CSS variables for theming (`--ion-color-primary`, etc.).

### Angular & Signals
- **Standalone Components Only:** Explicitly import used Ionic components in `@Component({ imports: [IonHeader, ...] })`.
- **Angular Control Flow (Mandatory):** Use `@if`, `@else`, `@for`, `@switch`. Directives like `*ngIf` and `*ngFor` are **FORBIDDEN**.
- **Signals vs Observables:** 
    - Use Signals for any state representation. 
    - Use Observables ONLY for continuous event streams (audio PCM, video frames, WebSocket messages).
    - Convert Observables to Signals with `toSignal()` at consumption points.
- **Lifecycle:** Use `inject()` over constructor injection. Use `takeUntilDestroyed()` for all persistent Observable subscriptions.

### Firebase
- Initialize `httpsCallable` or observers at the class field level or in the constructor to maintain Angular's **Injection Context**.
- Secrets (API Keys) MUST NOT exist in the frontend. Use `functions/.env`.

### Strict Typing
- **`any` is PROHIBITED.** No exceptions. Use explicit interfaces or `unknown` with type narrowing.

---

## Privacy & Privacy by Design
- **NON-NEGOTIABLE:** Video frames and audio chunks are processed **IN TRANSIT ONLY**.
- **NEVER** persist or store video frames or audio in Firestore, Storage, or any database.
- Process modalities strictly for narrative adjustment, not clinical diagnosis.

---

## Lo que NUNCA debes hacer (What NEVER to do)
- ❌ Importar Firebase/Ionic/Angular en `core/`.
- ❌ Inyectar un adapter directamente en un componente de presentación.
- ❌ Usar `any` o `as any`.
- ❌ Usar un Observable donde un Signal sea suficiente para representar estado.
- ❌ Exponer `Subject` o `BehaviorSubject` como API pública de un facade.
- ❌ Persistir vídeo o audio.
- ❌ Hardcodear system prompts, API keys o configuración del agente.
- ❌ Usar directivas estructurales legadas (`*ngIf`, `*ngFor`).
- ❌ Dejar suscripciones sin `takeUntilDestroyed()`.
- ❌ Conectar el WebSocket desde una Cloud Function (usar Cloud Run si fuera necesario).

---

## Current Status & Roadmap
The project is initialized with a basic hexagonal structure.
1. Implement `GeminiLiveWebSocketAdapter` in infrastructure.
2. Refine `LiveStoryFacade` with full Signal-based state.
3. Configure Firestore `agents` collection for narrator prompts.
