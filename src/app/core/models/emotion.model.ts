export type EmotionType = 'neutral' | 'happy' | 'scared' | 'excited' | 'confused' | 'calm';

export interface EmotionState {
  type: EmotionType;
  confidence: number; // 0 to 1
  timestamp: number;
}
