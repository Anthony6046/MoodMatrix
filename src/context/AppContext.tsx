import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { 
  MoodEntry, 
  ActivityLog, 
  UserSettings,
  AppTheme,
  Notification
} from '../types';
import { 
  getAllMoodEntries, 
  saveMoodEntry, 
  getMoodEntryByDate,
  deleteMoodEntry as dbDeleteMoodEntry,
  getAllActivities,
  saveActivity,
  getActivitiesByDate,
  getSettings,
  saveSettings,
  deleteActivity as dbDeleteActivity,
  clearAllMoodData
} from '../services/db';

interface AppContextType {
  // Mood entries
  moodEntries: MoodEntry[];
  todaysMood: MoodEntry | null;
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => Promise<void>;
  updateMoodEntry: (entry: MoodEntry) => Promise<void>;
  deleteMoodEntry: (id: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  
  // Activities
  activities: ActivityLog[];
  todaysActivities: ActivityLog[];
  addActivity: (activity: Omit<ActivityLog, 'id'>) => Promise<void>;
  updateActivity: (activity: ActivityLog) => Promise<void>;
  toggleActivity: (activityId: string) => Promise<void>;
  deleteActivity: (activityId: string) => Promise<void>;
  
  // Settings
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  updateAppTheme: (themeId: AppTheme) => Promise<void>;
  togglePremium: () => Promise<void>;
  
  // Notifications
  notification: Notification | null;
  showNotification: (message: string, severity: 'success' | 'info' | 'warning' | 'error') => void;
  hideNotification: () => void;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [todaysMood, setTodaysMood] = useState<MoodEntry | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [todaysActivities, setTodaysActivities] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    customMoodTags: [],
    customActivities: [],
    theme: 'light',
    appTheme: 'default',
    isPremium: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Initialize data from IndexedDB
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // Load settings
        const userSettings = await getSettings();
        if (userSettings) {
          setSettings(userSettings);
        }
        
        // Load mood entries
        const allMoodEntries = await getAllMoodEntries();
        setMoodEntries(allMoodEntries);
        
        // Check for today's mood entry
        const today = format(new Date(), 'yyyy-MM-dd');
        const todayEntry = await getMoodEntryByDate(today);
        setTodaysMood(todayEntry || null);
        
        // Load activities
        const allActivities = await getAllActivities();
        setActivities(allActivities);
        
        // Check for today's activities
        const todayActs = await getActivitiesByDate(today);
        setTodaysActivities(todayActs);
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to initialize app data');
        setIsLoading(false);
        console.error('Error initializing data:', err);
      }
    };
    
    initializeData();
  }, []);

  // Notification handlers
  const showNotification = useCallback((message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
    setNotification({ message, severity, open: true });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Add a new mood entry
  const addMoodEntry = useCallback(async (entry: Omit<MoodEntry, 'id'>) => {
    try {
      const newEntry: MoodEntry = {
        ...entry,
        id: uuidv4(),
      };

      await saveMoodEntry(newEntry);
      
      setMoodEntries(prev => [...prev, newEntry]);
      
      // If this is today's entry, update todaysMood
      if (format(new Date(newEntry.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
        setTodaysMood(newEntry);
      }
      
      // Show success notification
      showNotification('Mood entry saved successfully', 'success');
    } catch (err) {
      setError('Failed to add mood entry');
      showNotification('Failed to add mood entry', 'error');
      console.error('Error adding mood entry:', err);
    }
  }, [showNotification]);

  // Update an existing mood entry
  const updateMoodEntry = useCallback(async (entry: MoodEntry) => {
    try {
      await saveMoodEntry(entry);
      
      setMoodEntries(prevEntries => 
        prevEntries.map(e => e.id === entry.id ? entry : e)
      );
      
      // If this is today's entry, update todaysMood
      const today = format(new Date(), 'yyyy-MM-dd');
      if (entry.date === today) {
        setTodaysMood(entry);
      }
      
      // Show success notification
      showNotification('Mood entry updated successfully', 'success');
    } catch (err) {
      setError('Failed to update mood entry');
      showNotification('Failed to update mood entry', 'error');
      console.error('Error updating mood entry:', err);
    }
  }, [showNotification]);

  // Add a new activity
  const addActivity = useCallback(async (activity: Omit<ActivityLog, 'id'>) => {
    try {
      const newActivity: ActivityLog = {
        ...activity,
        id: uuidv4(),
      };
      
      await saveActivity(newActivity);
      
      setActivities(prev => [...prev, newActivity]);
      
      // If this is today's activity, update todaysActivities
      const today = format(new Date(), 'yyyy-MM-dd');
      if (activity.date === today) {
        setTodaysActivities(prev => [...prev, newActivity]);
      }
      
      // Show success notification
      showNotification('Activity added successfully', 'success');
    } catch (err) {
      setError('Failed to add activity');
      showNotification('Failed to add activity', 'error');
      console.error('Error adding activity:', err);
    }
  }, [showNotification]);

  // Update an existing activity
  const updateActivity = useCallback(async (activity: ActivityLog) => {
    try {
      await saveActivity(activity);
      
      setActivities(prevActivities => 
        prevActivities.map(a => a.id === activity.id ? activity : a)
      );
      
      // If this is today's activity, update todaysActivities
      const today = format(new Date(), 'yyyy-MM-dd');
      if (activity.date === today) {
        setTodaysActivities(prev => 
          prev.map(item => item.id === activity.id ? activity : item)
        );
      }
      
      // Show success notification
      showNotification('Activity updated successfully', 'success');
    } catch (err) {
      setError('Failed to update activity');
      showNotification('Failed to update activity', 'error');
      console.error('Error updating activity:', err);
    }
  }, [showNotification]);

  // Toggle activity completion status
  const toggleActivity = useCallback(async (activityId: string) => {
    try {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;
      
      const updatedActivity = {
        ...activity,
        completed: !activity.completed
      };
      
      await saveActivity(updatedActivity);
      
      setActivities(prev => 
        prev.map(item => item.id === activityId ? updatedActivity : item)
      );
      
      // If this is today's activity, update todaysActivities
      const today = format(new Date(), 'yyyy-MM-dd');
      if (updatedActivity.date === today) {
        setTodaysActivities(prev => 
          prev.map(item => item.id === activityId ? updatedActivity : item)
        );
      }
    } catch (err) {
      setError('Failed to toggle activity');
      console.error('Error toggling activity:', err);
    }
  }, [activities]);

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
      
      // Show success notification
      showNotification('Settings updated successfully', 'success');
    } catch (err) {
      setError('Failed to update settings');
      showNotification('Failed to update settings', 'error');
      console.error('Error updating settings:', err);
    }
  }, [settings, showNotification]);

  const updateAppTheme = useCallback(async (themeId: AppTheme) => {
    try {
      const updatedSettings = { ...settings, appTheme: themeId };
      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
      
      // Show success notification
      showNotification('App theme updated successfully', 'success');
    } catch (error) {
      console.error('Error updating app theme:', error);
      setError('Failed to update app theme');
      showNotification('Failed to update app theme', 'error');
    }
  }, [settings, showNotification]);

  // Delete an activity
  const deleteActivity = useCallback(async (activityId: string) => {
    try {
      // Find the activity to delete first (before we remove it from state)
      const activityToDelete = activities.find(a => a.id === activityId);
      if (!activityToDelete) {
        console.error('Activity not found:', activityId);
        return;
      }
      
      // Delete from the database first
      await dbDeleteActivity(activityId);
      
      // Then update the state after successful DB operation
      setActivities(prev => prev.filter(item => item.id !== activityId));
      
      // If this is today's activity, update todaysActivities
      const today = format(new Date(), 'yyyy-MM-dd');
      if (activityToDelete.date === today) {
        setTodaysActivities(prev => prev.filter(item => item.id !== activityId));
      }
      
      // Show success notification
      showNotification('Activity deleted successfully', 'success');
    } catch (err) {
      setError('Failed to delete activity');
      showNotification('Failed to delete activity', 'error');
      console.error('Error deleting activity:', err);
    }
  }, [activities, showNotification]);

  const togglePremium = useCallback(async () => {
    try {
      const updatedSettings = { ...settings, isPremium: !settings.isPremium };
      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
      
      // Show success notification
      showNotification('Premium status updated successfully', 'success');
    } catch (error) {
      console.error('Error toggling premium status:', error);
      setError('Failed to update premium status');
      showNotification('Failed to update premium status', 'error');
    }
  }, [settings, showNotification]);

  // Delete a mood entry
  const deleteMoodEntry = useCallback(async (id: string) => {
    try {
      await dbDeleteMoodEntry(id);
      
      setMoodEntries(prev => prev.filter(entry => entry.id !== id));
      
      // If this was today's entry, set todaysMood to null
      if (todaysMood && todaysMood.id === id) {
        setTodaysMood(null);
      }
      
      showNotification('Mood entry deleted', 'success');
    } catch (err) {
      setError('Failed to delete mood entry');
      showNotification('Failed to delete mood entry', 'error');
      console.error('Error deleting mood entry:', err);
    }
  }, [todaysMood, showNotification]);

  // Clear all mood data
  const clearAllData = useCallback(async () => {
    try {
      await clearAllMoodData();
      
      // Reset all state
      setMoodEntries([]);
      setTodaysMood(null);
      setActivities([]);
      setTodaysActivities([]);
      
      showNotification('All mood data has been cleared', 'success');
    } catch (err) {
      setError('Failed to clear mood data');
      showNotification('Failed to clear mood data', 'error');
      console.error('Error clearing mood data:', err);
    }
  }, [showNotification]);

  // Create the context value with all our state and functions
  const contextValue = useMemo<AppContextType>(() => ({
    moodEntries,
    todaysMood,
    addMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
    clearAllData,
    
    activities,
    todaysActivities,
    addActivity,
    updateActivity,
    toggleActivity,
    deleteActivity,
    settings,
    updateSettings,
    updateAppTheme,
    togglePremium,
    notification,
    showNotification,
    hideNotification,
    isLoading,
    error
  }), [
    moodEntries,
    todaysMood,
    addMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
    clearAllData,
    activities,
    todaysActivities,
    addActivity,
    updateActivity,
    toggleActivity,
    deleteActivity,
    settings,
    updateSettings,
    updateAppTheme,
    togglePremium,
    notification,
    showNotification,
    hideNotification,
    isLoading,
    error
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
