export enum ExerciseType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRANSLATE = 'TRANSLATE',
  FILL_BLANK = 'FILL_BLANK',
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  explanation?: string; // Pre-generated short explanation
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Business';
  isCompleted: boolean;
  exercises?: Exercise[]; // Loaded dynamically or pre-filled
}

export interface UserState {
  xp: number;
  streak: number;
  completedLessonIds: string[];
}

export interface Language {
  code: string;
  name: string;
  flag: string; // Emoji
}