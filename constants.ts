import { Lesson, Language } from "./types";

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Formal Introductions',
    description: 'Learn how to introduce yourself and colleagues in a business setting.',
    topic: 'Business Introductions',
    difficulty: 'Beginner',
    isCompleted: false,
  },
  {
    id: 'l2',
    title: 'Email Etiquette',
    description: 'Master the art of writing professional emails and memos.',
    topic: 'Professional Writing',
    difficulty: 'Intermediate',
    isCompleted: false,
  },
  {
    id: 'l3',
    title: 'Client Meetings',
    description: 'Vocabulary and phrases for successful client negotiations.',
    topic: 'Meetings & Negotiations',
    difficulty: 'Business',
    isCompleted: false,
  },
  {
    id: 'l4',
    title: 'Technical Support',
    description: 'Discussing technical issues and solutions clearly.',
    topic: 'IT & Support',
    difficulty: 'Advanced',
    isCompleted: false,
  },
];