export interface MoodEntry {
  id: string;
  date: string;
  time?: string; // ISO time string
  moodLevel: number; // 1-5 scale
  moodTags: string[];
  tags?: string[]; // Alternative name for moodTags for UI consistency
  journalNote?: string;
  note?: string; // Alternative name for journalNote for UI consistency
  reflectionPrompt?: string;
  reflectionResponse?: string;
  activities: string[];
}

export interface ActivityLog {
  id: string;
  name: string;
  date: string;
  completed: boolean;
}

export type AppTheme = 'default' | 'calmPastels' | 'deepForest' | 'sunsetGlow' | 'minimalMono' | 'oceanBlue';

export interface ThemeOption {
  id: AppTheme;
  name: string;
  description: string;
  isPremium: boolean;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardColor: string;
  accentColor: string;
}

export interface UserSettings {
  id?: string;
  customMoodTags: string[];
  customActivities: string[];
  theme: 'light' | 'dark';
  appTheme: AppTheme;
  reminderTime?: string;
  isPremium: boolean;
}

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface ReflectionPrompt {
  id: string;
  text: string;
  category: 'gratitude' | 'growth' | 'awareness' | 'goals';
}

export interface Notification {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  open: boolean;
}

export interface MoodCardTemplate {
  id: string;
  name: string;
  colorScheme: string;
  layout: 'minimal' | 'detailed' | 'creative';
}
