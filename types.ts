
export type AspectRatio = '16:9' | '9:16';

export interface VideoGenerationState {
  status: 'idle' | 'checking_key' | 'generating' | 'polling' | 'completed' | 'error';
  progress?: number;
  videoUri?: string;
  errorMessage?: string;
}

export interface SectionContent {
  id: string;
  title: string;
  type: 'frontmatter' | 'chapter';
  subtitle?: string;
  content: string[]; // Array of paragraphs or bullet points
}

export interface Book {
  title: string;
  author: string;
  volume: string;
  sections: SectionContent[];
}
