# Resumen de Estrategia - Cuentopia Live Agent

Este documento resume las decisiones arquitectónicas y estrategias discutidas para el proyecto Cuentopia Live Agent, desarrollado para el Gemini Live Agent Challenge.

## 1. Almacenamiento de System Prompts en Firestore

Para guardar los `systemPrompt` de los agentes de IA, la estrategia más óptima y escalable es usar una **colección de primer nivel** en Firestore.

- **Nombre de la Colección:** `agents`
- **Estructura del Documento:** Cada documento representa un agente.

```json
// Colección: agents
// Documento ID: narrator-default
{
  "displayName": "Cuentopia Narrator",
  "systemPrompt": "Eres un narrador de cuentos para niños, empático y pedagógico. Tu misión es mantener al niño enganchado en la historia. Analiza sus expresiones faciales y su voz en cada turno. Si detectas aburrimiento, desinterés o miedo, debes pivotar la narrativa sutilmente para recapturar su atención. Mantén tus respuestas cortas y fluidas.",
  "version": "1.0",
  "createdAt": "2026-03-13T10:00:00Z",
  "updatedAt": "2026-03-13T10:05:00Z"
}
```

### Ventajas
- **Escalabilidad:** Soporta un número ilimitado de agentes sin topar con el límite de 1MB por documento.
- **Flexibilidad:** Permite añadir fácilmente nuevos campos a cada agente.
- **Consultas Eficientes:** La lectura de un prompt es una operación rápida y económica de un solo documento.
- **Seguridad:** Facilita la implementación de reglas de seguridad granulares.

---

## 2. Estrategia de Orquestación General

Se definió una arquitectura full-stack para el flujo interactivo del cuento.

### Modelo de Datos Adicional (Firestore)

Se propuso una colección `storyThemes` para poblar dinámicamente la `ExplorePage`.

- **Nombre de la Colección:** `storyThemes`
- **Estructura del Documento:**

```json
// Colección: storyThemes
// Documento ID: miedo-a-la-oscuridad
{
  "title": "Miedo a la Oscuridad",
  "subtitle": "Para niños que temen apagar la luz.",
  "icon": "moon",
  "initialPrompt": "Inicia un cuento sobre un valiente explorador de sombras llamado Leo que no le teme a su cuarto oscuro. El objetivo es mostrar que la oscuridad puede ser amigable y llena de aventuras imaginarias."
}
```

### Orquestación Frontend (Angular/Ionic)

El `LiveStoryFacade` actúa como el orquestador del lado del cliente.

1.  **`ExplorePage`**: Lee la colección `storyThemes` de Firestore para mostrar las opciones.
2.  **Navegación**: Al seleccionar un tema, se navega a `LivePage`, pasando el `topicId` como query param.
3.  **`LivePage`**: Al pulsar "Play", se llama a `facade.startStorytelling(agentId, topicId)`.
4.  **`LiveStoryFacade`**:
    - Inicia la captura de medios (cámara/micrófono).
    - Abre una conexión WebSocket con el backend.
    - Envía un mensaje de inicialización: `{ "type": "start", "payload": { "agentId": "...", "topicId": "..." } }`.
    - Comienza a enviar los frames de video/audio a través del WebSocket.

### Orquestación Backend (Cloud Functions 2ª Gen + GenKit)

El cerebro del sistema reside en una Cloud Function que gestiona WebSockets.

1.  **Conexión**: El cliente establece la conexión WebSocket.
2.  **Inicio**: El backend recibe el mensaje `start`, y un flujo de GenKit se inicializa:
    - Lee el `systemPrompt` del agente y el `initialPrompt` del tema desde Firestore.
3.  **Bucle Interactivo**:
    - GenKit combina los prompts y realiza la primera llamada a Gemini para iniciar la historia.
    - La respuesta se streamea al cliente.
    - El flujo entra en un bucle, esperando los datos multimodales (video/audio) del cliente.
    - En cada turno, GenKit construye una nueva petición a Gemini que incluye el historial, los nuevos frames y la instrucción implícita en el `systemPrompt` de reaccionar a las emociones del niño.
    - Gemini genera el siguiente fragmento de la historia, **pivotando la trama si detecta desinterés**, y la respuesta se envía de vuelta al cliente.
4.  **Finalización**: La conexión se cierra cuando el usuario detiene la sesión.

---

## 3. Uso de WebSockets en Firebase Functions

Se clarificó la viabilidad del uso de WebSockets en Cloud Functions.

-   **Cloud Functions 1ª Gen**: **NO SON ADECUADAS**. Son stateless y de corta duración, lo que choca con la naturaleza persistente de los WebSockets.
-   **Cloud Functions 2ª Gen**: **SÍ SON ADECUADAS**. Están construidas sobre Cloud Run, que tiene soporte nativo para WebSockets y conexiones de larga duración.

### Implementación de Ejemplo (2ª Gen)

```typescript
import { onRequest } from "firebase-functions/v2/https";
import * as http from "http";
import { WebSocketServer } from "ws";

// 1. Crear servidor HTTP y adjuntar servidor de WebSockets
const server = http.createServer();
const wss = new WebSocketServer({ server });

// 2. Lógica de la conexión
wss.on("connection", (ws) => {
  console.log("Cliente conectado!");
  ws.on("message", (message) => {
    // Aquí se procesa el mensaje y se interactúa con GenKit/Gemini
  });
  ws.on("close", () => {
    console.log("Cliente desconectado.");
  });
});

// 3. Exportar la función de 2ª Gen
export const cuentopiaLive = onRequest(
  {
    timeoutSeconds: 3600, // Permitir conexiones largas
  },
  server
);
```

---

## 4. Estimación de Costos para el Hackathon

La conclusión principal es que el costo del proyecto durante el hackathon será **cero o muy cercano a cero**, gracias a la generosa capa gratuita de Firebase y Google Cloud.

| Servicio | Límite de la Capa Gratuita (Aprox.) | Costo Estimado para el Hackathon |
| :--- | :--- | :--- |
| **Cloud Functions (2ª Gen)** | 2M de invocaciones, 100+ horas de vCPU | **$0** |
| **Firestore** | 50k lecturas/día, 1 GiB almacenado | **$0** |
| **API de Gemini** | Varía, pero es muy económico | **$0 - $5 (siendo pesimistas)** |
| **Salida de Red** | 1 GiB | **$0** |
| **TOTAL** | | **Probablemente $0** |

### Recomendación Clave

Para total tranquilidad, **crear un presupuesto de $10 con alertas de facturación** en la Google Cloud Console. Esto notificará por email si los costos se acercan a ese umbral, permitiendo un desarrollo sin preocupaciones.
