export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  REVIEW = 'REVIEW',
  GENERATING_DOC = 'GENERATING_DOC',
  ERROR = 'ERROR'
}

export interface ExtractedContent {
  rawText: string;
  markdown: string;
}

export interface DocxGenerationOptions {
  title?: string;
  content: string;
}