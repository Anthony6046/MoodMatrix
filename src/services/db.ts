import { openDB, DBSchema } from 'idb';
import { MoodEntry, ActivityLog, UserSettings } from '../types';

interface MoodMatrixDB extends DBSchema {
  moodEntries: {
    key: string;
    value: MoodEntry;
    indexes: { 'by-date': string };
  };
  activities: {
    key: string;
    value: ActivityLog;
    indexes: { 'by-date': string; 'by-name': string };
  };
  settings: {
    key: string;
    value: UserSettings;
  };
}

const DB_NAME = 'mood-matrix-db';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB<MoodMatrixDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains('moodEntries')) {
        const moodStore = db.createObjectStore('moodEntries', { keyPath: 'id' });
        moodStore.createIndex('by-date', 'date');
      }

      if (!db.objectStoreNames.contains('activities')) {
        const activityStore = db.createObjectStore('activities', { keyPath: 'id' });
        activityStore.createIndex('by-date', 'date');
        activityStore.createIndex('by-name', 'name');
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    },
  });
};

// Mood Entries CRUD operations
export const saveMoodEntry = async (entry: MoodEntry) => {
  const db = await initDB();
  return db.put('moodEntries', entry);
};

export const getMoodEntry = async (id: string) => {
  const db = await initDB();
  return db.get('moodEntries', id);
};

export const getMoodEntryByDate = async (date: string) => {
  const db = await initDB();
  const index = db.transaction('moodEntries').store.index('by-date');
  return index.get(date);
};

export const getAllMoodEntries = async () => {
  const db = await initDB();
  return db.getAll('moodEntries');
};

export const deleteMoodEntry = async (id: string) => {
  const db = await initDB();
  return db.delete('moodEntries', id);
};

// Activity Logs CRUD operations
export const saveActivity = async (activity: ActivityLog) => {
  const db = await initDB();
  return db.put('activities', activity);
};

export const getActivity = async (id: string) => {
  const db = await initDB();
  return db.get('activities', id);
};

export const getActivitiesByDate = async (date: string) => {
  const db = await initDB();
  const index = db.transaction('activities').store.index('by-date');
  return index.getAll(date);
};

export const getAllActivities = async () => {
  const db = await initDB();
  return db.getAll('activities');
};

export const deleteActivity = async (id: string) => {
  const db = await initDB();
  return db.delete('activities', id);
};

// Settings operations
export const saveSettings = async (settings: UserSettings) => {
  const db = await initDB();
  return db.put('settings', { ...settings, id: 'user-settings' });
};

export const getSettings = async () => {
  const db = await initDB();
  return db.get('settings', 'user-settings') || {
    customMoodTags: ['Happy', 'Sad', 'Anxious', 'Calm', 'Energetic', 'Tired'],
    customActivities: ['Exercise', 'Meditation', 'Reading', 'Social', 'Work'],
    theme: 'light',
  } as UserSettings;
};

// Clear all mood data from the database
export const clearAllMoodData = async () => {
  const db = await initDB();
  const tx = db.transaction(['moodEntries', 'activities'], 'readwrite');
  await Promise.all([
    tx.objectStore('moodEntries').clear(),
    tx.objectStore('activities').clear(),
    tx.done
  ]);
  return true;
};
