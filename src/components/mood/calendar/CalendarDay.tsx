import React from 'react';
import { 
  Box, 
  Typography,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { MoodEntry, MoodLevel } from '../../../types';

interface CalendarDayProps {
  day: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  moodEntry?: MoodEntry;
  moodEmojis: Record<number, string>;
  onDayClick: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ 
  day, 
  isCurrentMonth, 
  isToday, 
  moodEntry, 
  moodEmojis,
  onDayClick
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Colors for mood levels
  const moodColors = {
    1: '#7b1fa2', // Dark purple (sad)
    2: '#9c27b0', // Purple (low)
    3: '#ba68c8', // Light purple (neutral)
    4: '#d81b60', // Dark pink (good)
    5: '#e91e63'  // Pink (great)
  };
  
  const dayNumber = format(day, 'd');
  
  return (
    <Box 
      onClick={onDayClick}
      sx={{ 
        width: 'calc(100% / 7)',
          height: { xs: 40, sm: 60 },
          p: 0.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          cursor: 'pointer',
          opacity: isCurrentMonth ? 1 : 0.3,
          border: isToday ? `2px solid ${isDarkMode ? '#e91e63' : '#9c27b0'}` : 'none',
          bgcolor: moodEntry 
            ? `${moodColors[moodEntry.moodLevel as MoodLevel]}${isDarkMode ? '40' : '20'}`
            : 'transparent',
          '&:hover': {
            bgcolor: moodEntry 
              ? `${moodColors[moodEntry.moodLevel as MoodLevel]}${isDarkMode ? '60' : '30'}`
              : isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            transform: 'scale(1.05)',
            transition: 'transform 0.2s, background-color 0.2s'
          },
          transition: 'transform 0.2s, background-color 0.2s, opacity 0.2s'
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: isToday ? 'bold' : 'normal',
            color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)'
          }}
        >
          {dayNumber}
        </Typography>
        
        {moodEntry && (
          <Typography variant="h6" sx={{ lineHeight: 1, mt: 0.5 }}>
            {moodEmojis[moodEntry.moodLevel as MoodLevel]}
          </Typography>
        )}
      </Box>
  );
};

export default CalendarDay;
