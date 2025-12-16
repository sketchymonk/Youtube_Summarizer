export enum AppState {
  INPUT = 'INPUT',
  CONFIRM = 'CONFIRM',
  OPTIONS = 'OPTIONS',
  TOPIC_INPUT = 'TOPIC_INPUT',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface SummaryOption {
  id: number;
  label: string;
  description: string;
  requiresInput?: boolean;
  category: 'Core' | 'Content' | 'Visual' | 'Audio';
}

export interface GeneratedResponse {
  title: string;
  content: string;
}

export interface VideoMetadata {
  url: string;
  title: string;
}