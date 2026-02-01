
export enum Subject {
  Physics = 'Physics',
  Math = 'Mathematics',
  Chemistry = 'Chemistry',
  Biology = 'Biology'
}

export interface UserStats {
  uid?: string;
  displayName?: string;
  coins: number;
  credits: number;
  streak: number;
  lastVisit: string;
  progress: Record<Subject, number>;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Quest {
  id: string;
  title: string;
  subject: Subject;
  description: string;
  reward: number;
}
