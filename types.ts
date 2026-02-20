
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Term {
  term: string;
  termEn: string;
  definition: string;
}

export interface Lecture {
  id: number;
  title: string;
  description: string;
  titleExplanation: string;
  goals: string[];
  keyConcepts: string[];
  glossary: Term[];
}

export interface Question {
  id: number;
  scenario: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LectureQuiz {
  lectureId: number;
  questions: Question[];
}

export enum AppView {
  CHAT = 'CHAT',
  LECTURES = 'LECTURES',
  MEASUREMENT = 'MEASUREMENT',
  QUIZ = 'QUIZ',
  GLOSSARY = 'GLOSSARY',
  GAMES = 'GAMES'
}