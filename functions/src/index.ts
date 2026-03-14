import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

interface AgentFirestoreData {
  model: string;
  systemPrompt: string;
  initialPromptTemplate: string;
  visionNudgeIntervalSeconds: number;
  visionNudgeText: string;
  voiceName: string;
}

const GEMINI_WS_URL =
  "wss://generativelanguage.googleapis.com/ws/" +
  "google.ai.generativelanguage.v1beta" +
  ".GenerativeService.BidiGenerateContent";

/**
 * Provee la configuración para la Gemini Multimodal Live API.
 * La configuración del agente vive exclusivamente en Firestore.
 */
export const getLiveConfig = onCall({cors: true}, async (request) => {
  const apiKey = process.env["GOOGLE_GENAI_API_KEY"];

  if (!apiKey) {
    throw new HttpsError(
      "internal",
      "Configuración del servidor incompleta."
    );
  }

  const agentId =
    (request.data?.agentId as string | undefined) ?? "narrator-default";

  const doc = await admin.firestore()
    .collection("agents")
    .doc(agentId)
    .get()
    .catch((err: unknown) => {
      console.error("Error leyendo Firestore:", err);
      throw new HttpsError(
        "unavailable",
        "No se pudo acceder a la configuración del agente."
      );
    });

  if (!doc.exists) {
    throw new HttpsError(
      "not-found",
      `Agente '${agentId}' no encontrado. Ejecuta el script de seed.`
    );
  }

  const data = doc.data() as AgentFirestoreData;

  return {
    apiKey,
    baseUrl: GEMINI_WS_URL,
    model: data.model,
    systemPrompt: data.systemPrompt,
    initialPromptTemplate: data.initialPromptTemplate,
    visionNudgeIntervalSeconds: data.visionNudgeIntervalSeconds,
    visionNudgeText: data.visionNudgeText,
    voiceName: data.voiceName,
  };
});
