
import { UserRank } from './types.ts';

// Setting dates to 2026 as requested
export const START_DATE = new Date(2026, 1, 1); // February 1, 2026
export const END_DATE = new Date(2026, 1, 15);
export const EXAM_DATE = new Date(2026, 1, 16); // February 16, 2026

export const MOTIVATIONAL_QUOTES = [
  "Precision is the hallmark of a Master Accountant.",
  "Your fiscal discipline today defines your market value tomorrow.",
  "Eliminate variances. Master the ledger.",
  "The 70+ barrier is merely a psychological limit. Break it.",
  "Focus music enabled. Sensory isolation active.",
  "Analyze mistakes with clinical coldness. Correct them with absolute heat.",
  "Every journal entry is a contract with your future self.",
  "Consistency is the compound interest of learning."
];

export const generateDefaultSessions = (day: number, date: Date) => [
  {
    id: `d${day}-s1`,
    title: 'Full Paper Solve',
    duration: '3 Hours',
    completed: false,
    tasks: [
      { id: `d${day}-s1-t1`, label: 'Solve full sample paper', completed: false },
      { id: `d${day}-s1-t2`, label: 'Strict timing - No breaks', completed: false },
    ]
  },
  {
    id: `d${day}-s2`,
    title: 'Paper Checking',
    duration: '2 Hours',
    completed: false,
    tasks: [
      { id: `d${day}-s2-t1`, label: 'Identify mistakes', completed: false },
      { id: `d${day}-s2-t2`, label: 'Correct entries', completed: false },
      { id: `d${day}-s2-t3`, label: 'Mark weak areas', completed: false },
    ]
  },
  {
    id: `d${day}-s3`,
    title: 'Weak Area Practice',
    duration: '2 Hours',
    completed: false,
    tasks: [
      { id: `d${day}-s3-t1`, label: 'Practice weak concepts', completed: false },
      { id: `d${day}-s3-t2`, label: 'Rewrite incorrect answers', completed: false },
      { id: `d${day}-s3-t3`, label: 'Journal entry drills', completed: false },
    ]
  },
  {
    id: `d${day}-s4`,
    title: 'Speed Drills',
    duration: '1 Hour',
    completed: false,
    tasks: [
      { id: `d${day}-s4-t1`, label: '10 Journal entries', completed: false },
      { id: `d${day}-s4-t2`, label: '5 MCQ questions', completed: false },
      { id: `d${day}-s4-t3`, label: 'Ratio questions', completed: false },
    ]
  }
];

export const RANKS = [
  { threshold: 0, name: UserRank.BEGINNER, icon: '🌱' },
  { threshold: 1200, name: UserRank.FOCUSED, icon: '🎯' },
  { threshold: 3500, name: UserRank.CONSISTENT, icon: '🔥' },
  { threshold: 6500, name: UserRank.EXAM_READY, icon: '🏅' },
];
