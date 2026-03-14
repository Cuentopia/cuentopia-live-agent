import { EmotionState } from './emotion.model';

export interface StoryContext {
  childName: string;
  topic: string;
  currentEmotion: EmotionState;
  narrativeHistory: string[];
  lastInteraction: string;
  isSessionActive: boolean;
  lastFrame?: string; // Nuevo: El último frame capturado en Base64
}

export interface MediaFrame {
  base64Data: string;
  format: 'jpeg' | 'pcm';
  timestamp: number;
}
