
export interface Task {
  id: string;
  label: string;
  completed: boolean;
}

export interface Session {
  id: string;
  title: string;
  duration: string;
  tasks: Task[];
  completed: boolean;
}

export interface DayProgress {
  dayNumber: number;
  sessions: Session[];
  dateString: string;
  mistakes: string;
}

export interface VitalityStats {
  energy: number; // 1-100
  focus: number;  // 1-100
  hydration: number; // glasses
  sleep: number; // hours
}

export interface UserProgress {
  startDate: string;
  days: DayProgress[];
  points: number;
  streak: number;
  rank: string;
  lastVisitDate: string;
  vitals: VitalityStats;
}

export enum UserRank {
  BEGINNER = 'Beginner',
  FOCUSED = 'Focused',
  CONSISTENT = 'Consistent',
  EXAM_READY = 'Exam Ready'
}
