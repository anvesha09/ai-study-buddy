// ==================================================
// src/types.ts
// ==================================================
import { ChatSession } from "@google/generative-ai";

export enum ActiveTab {
  STUDY = 'study',
  CHAT = 'chat',
  QUIZ = 'quiz',
  FLASHCARDS = 'flashcards',
}

export type TextContext = { type: 'text'; content: string };
export type FileContext = { type: 'file'; file: File; fileName: string };
export type AppContext = TextContext | FileContext | null;

export enum SummaryLength {
  SHORT = 'a brief, one-paragraph summary',
  MEDIUM = 'a medium-length, multi-paragraph summary',
  LONG = 'a detailed, comprehensive summary',
}

export enum QuizType {
  MCQ = 'Multiple-Choice',
  TRUE_FALSE = 'True/False',
  SHORT_ANSWER = 'Short-Answer',
}

export interface QuizQuestion {
  question: string;
  options?: string[];
  answer: string;
  type: QuizType;
  userAnswer?: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface Message {
    role: 'user' | 'model';
    parts: { text: string }[];
    timestamp: string;
}

// ==================================================
// src/components/Icon.tsx
// ==================================================
import React from 'react';

// This is a placeholder for icons. A real app would use an icon library.
const Icon: React.FC<{ icon: string; className?: string }> = ({ icon, className }) => {
  const getIcon = () => {
    switch (icon) {
      case 'book': return '📚';
      case 'chat': return '💬';
      case 'quiz': return '❓';
      case 'flashcard': return '🗂️';
      case 'upload': return '📤';
      default: return '❓';
    }
  };
  return <span className={className}>{getIcon()}</span>;
};
export default Icon;


// ==================================================
// src/components/StudyView.tsx
// ==================================================
import React from 'react';
import { AppContext } from '../types';

const StudyView: React.FC<{ context: AppContext }> = ({ context }) => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">Summarize & Study</h3>
      <p className="mt-4 text-slate-600">This feature is under construction. Select another tool to begin.</p>
    </div>
  );
};
export default StudyView;


// ==================================================
// src/components/ChatView.tsx
// ==================================================
import React from 'react';
import { AppContext } from '../types';

const ChatView: React.FC<{ context: AppContext }> = ({ context }) => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">Contextual Chat</h3>
      <p className="mt-4 text-slate-600">This feature is under construction. Select another tool to begin.</p>
    </div>
  );
};
export default ChatView;


// ==================================================
// src/components/QuizView.tsx
// ==================================================
import React from 'react';
import { AppContext } from '../types';

const QuizView: React.FC<{ context: AppContext }> = ({ context }) => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">Generate Quiz</h3>
      <p className="mt-4 text-slate-600">This feature is under construction. Select another tool to begin.</p>
    </div>
  );
};
export default QuizView;


// ==================================================
// src/components/FlashcardView.tsx
// ==================================================
import React from 'react';
import { AppContext } from '../types';

const FlashcardView: React.FC<{ context: AppContext }> = ({ context }) => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">Generate Flashcards</h3>
      <p className="mt-4 text-slate-600">This feature is under construction. Select another tool to begin.</p>
    </div>
  );
};
export default FlashcardView;
