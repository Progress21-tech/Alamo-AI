
import { Subject, UserStats } from './types';

// File minimized - using local constants in index.tsx for resilience
export const APP_VERSION = "1.0.0-vanilla";

// Initial statistics for a new user, used across the application
export const INITIAL_STATS: UserStats = {
  coins: 50,
  credits: 100,
  streak: 1,
  lastVisit: new Date().toISOString(),
  progress: {
    [Subject.Physics]: 0,
    [Subject.Math]: 0,
    [Subject.Chemistry]: 0,
    // Added missing Biology subject to match Subject enum and Record<Subject, number> requirement
    [Subject.Biology]: 0
  }
};
