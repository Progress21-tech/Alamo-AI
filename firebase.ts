
/**
 * Firebase has been decommissioned in favor of a Local-First architecture.
 * This ensures the app is resilient, offline-ready, and avoids API key mismatch errors
 * during development and deployment in restricted environments.
 * 
 * All data is now persisted using Browser LocalStorage.
 */
export const isOfflineOnly = true;
