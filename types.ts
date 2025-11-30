export enum AppLanguage {
  ENGLISH = 'English',
  RUSSIAN = 'Russian'
}

export interface Citation {
  book: string;
  chapter: number;
  verse_start: number;
  verse_end?: number;
  text: string;
  relevance: string;
}

export interface Theme {
  name: string;
  score: number; // 0-100
  description: string;
}

export interface Relationship {
  source: string;
  target: string;
  type: string;
  strength: number;
}

export interface AnalysisData {
  summary: string;
  theological_insight: string;
  citations: Citation[];
  themes: Theme[];
  relationships: Relationship[];
  historical_context: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ImageSize = '1K' | '2K' | '4K';

export interface ImageConfig {
  size: ImageSize;
  prompt: string;
}
