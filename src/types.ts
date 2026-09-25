export type ScreenType =
  | 'splash'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'onboarding'
  | 'home'
  | 'capture'
  | 'upload-input'
  | 'processing'
  | 'processing-complete'
  | 'knowledge-hub'
  | 'knowledge-cards'
  | 'knowledge-card-detail'
  | 'knowledge-graph'
  | 'resources'
  | 'resource-detail'
  | 'ai-tutor'
  | 'smart-quiz'
  | 'quiz-type-selection'
  | 'quiz-session'
  | 'quiz-result'
  | 'memory-analysis'
  | 'focused-revision'
  | 'revision-session'
  | 'profile'
  | 'achievements'
  | 'learning-preferences'
  | 'notifications'
  | 'settings';

export type MasteryStatus = 'strong' | 'needs_practice' | 'forgetting_soon' | 'unknown';

export interface ChatSource {
  materialId: string;
  materialName?: string;
  page?: number | null;
  chunkId?: string;
}

export interface Concept {
  id: string;
  title: string;
  topic: string;
  resourceId: string;
  resourceTitle: string;
  summary: string;
  keyPoints: string[];
  simpleExample: string;
  relatedConceptIds: string[];
  quickRecallQuestion: string;
  quickRecallAnswer: string;
  mastery: number | null;
  status: MasteryStatus;
  lastReviewed: string | null;
  category: string;
  attempts?: number;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'notes' | 'web' | 'audio';
  conceptCount: number;
  quizCount: number;
  chunkCount?: number;
  status?: string;
  uploadDate: string;
  fileSize?: string;
  summary: string;
  conceptIds: string[];
  originalFilename?: string;
  errorMessage?: string | null;
}

export interface GraphNode {
  id: string;
  label: string;
  category: string;
  mastery: number | null;
  x: number;
  y: number;
  conceptId?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  label?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptId: string;
  conceptTitle: string;
}

export interface QuizResultSummary {
  score: number;
  total: number;
  percentage: number;
  masteryBefore: number | null;
  masteryAfter: number | null;
  conceptId: string;
  conceptTitle: string;
  whatYouKnow: string[];
  needsReview: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  conceptId?: string;
  conceptTitle?: string;
  savedToKnowledge?: boolean;
  sources?: ChatSource[];
  pending?: boolean;
  error?: boolean;
}

export interface UserPreferences {
  dailyRevisionTime: string;
  quizDifficulty: 'Easy' | 'Adaptive' | 'Challenging';
  preferredExplanationStyle: 'Intuitive & Analogy' | 'Concise & Academic' | 'Visual & Step-by-Step';
  reminderFrequency: 'Daily at 7:00 PM' | 'Twice daily' | 'Weekdays only' | 'Gentle notifications';
}

export interface UserProfile {
  name: string;
  email: string;
  conceptsCount: number;
  quizzesCount: number;
  streakDays: number;
  xp: number;
  major?: string;
  conceptsLearned?: number;
  quizzesTaken?: number;
  retentionRate?: number | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  dateUnlocked?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'revision' | 'mastery' | 'quiz' | 'system';
  targetScreen?: ScreenType;
}

export interface SavedNote {
  id: string;
  title: string;
  content: string;
  conceptId?: string;
  resourceTitle: string;
  date: string;
}

export interface ProcessingStatus {
  id: string;
  status: string;
  errorMessage?: string | null;
  chunkCount: number;
  conceptCount: number;
  pageCount: number;
  title: string;
  filename: string;
  conceptTitles: string[];
}

export interface RevisionItem {
  id: string;
  title: string;
  topic: string;
  mastery: number | null;
  status: MasteryStatus;
}
