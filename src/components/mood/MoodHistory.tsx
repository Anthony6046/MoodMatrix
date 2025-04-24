import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs,
  Tab,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { MoodEntry } from '../../types';
import { format } from 'date-fns';

// Import our new modular components
import CalendarView from './calendar/CalendarView';
import TimelineView from './timeline/TimelineView';
import MoodEntryDetail from './detail/MoodEntryDetail';



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mood-history-tabpanel-${index}`}
      aria-labelledby={`mood-history-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const MoodHistory: React.FC = React.memo(() => {
  const { moodEntries, isLoading, deleteMoodEntry } = useAppContext();
  const theme = useTheme();
  // Will be used for responsive adjustments in future updates
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tabValue, setTabValue] = useState(0);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  
  // Get the selected entry object based on ID
  const selectedEntry = selectedEntryId 
    ? moodEntries.find(entry => entry.id === selectedEntryId) || null 
    : null;

  // Group entries by month using useMemo for performance
  const entriesByMonth = useMemo(() => {
    const grouped: Record<string, MoodEntry[]> = {};
    
    moodEntries.forEach(entry => {
      const date = new Date(entry.date);
      const monthYear = format(date, 'MMMM yyyy');
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      
      grouped[monthYear].push(entry);
    });
    
    return grouped;
  }, [moodEntries]);

  // Sort months in reverse chronological order using useMemo
  // Will be used for month navigation in future updates
  // const sortedMonths = useMemo(() => {
  //   return Object.keys(entriesByMonth).sort((a, b) => {
  //     const dateA = new Date(a);
  //     const dateB = new Date(b);
  //     return dateB.getTime() - dateA.getTime();
  //   });
  // }, [entriesByMonth]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDayClick = (dateString: string) => {
    // Find mood entry for selected day
    const entry = moodEntries.find(entry => entry.date === dateString);
    if (entry) {
      setSelectedEntryId(entry.id);
    }
  };
  
  const handleEntryClick = (entryId: string) => {
    setSelectedEntryId(entryId);
  };
  
  const handleCloseDetail = () => {
    setSelectedEntryId(null);
  };
  
  const handleDeleteEntry = (id: string) => {
    deleteMoodEntry(id);
    setSelectedEntryId(null);
  };
  
  const handleEditEntry = (id: string) => {
    // For now just close the detail view
    // In the future this could navigate to the edit page
    setSelectedEntryId(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mood History
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track your mood patterns over time
        </Typography>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
          boxShadow: theme => theme.palette.mode === 'dark' 
            ? '8px 8px 16px #252532, -8px -8px 16px #353546'
            : '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="mood history tabs"
            centered
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: theme => theme.palette.mode === 'dark' ? '#e91e63' : '#9c27b0',
              },
              '& .Mui-selected': {
                color: theme => theme.palette.mode === 'dark' ? '#e91e63' : '#9c27b0',
              }
            }}
          >
            <Tab 
              icon={<CalendarIcon />} 
              label="Calendar" 
              id="mood-history-tab-0" 
              aria-controls="mood-history-tabpanel-0" 
            />
            <Tab 
              icon={<TimelineIcon />} 
              label="Timeline" 
              id="mood-history-tab-1" 
              aria-controls="mood-history-tabpanel-1" 
            />
          </Tabs>
        </Box>

        {/* Calendar View */}
        <TabPanel value={tabValue} index={0}>
          <CalendarView 
            moodEntries={moodEntries}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            onDayClick={handleDayClick}
          />
        </TabPanel>

        {/* Timeline View */}
        <TabPanel value={tabValue} index={1}>
          <TimelineView 
            moodEntries={moodEntries}
            onEntryClick={handleEntryClick}
          />
        </TabPanel>
      </Paper>
      
      {/* Mood Entry Detail Dialog */}
      <MoodEntryDetail 
        entry={selectedEntry}
        onClose={handleCloseDetail}
        onDelete={handleDeleteEntry}
        onEdit={handleEditEntry}
      />
    </Box>
  );
});

export default MoodHistory;
