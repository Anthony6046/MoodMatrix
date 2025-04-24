import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  IconButton
} from '@mui/material';
import {
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon
} from '@mui/icons-material';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';
import { MoodEntry } from '../../../types';
import CalendarDay from './CalendarDay';

interface CalendarViewProps {
  moodEntries: MoodEntry[];
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onDayClick: (date: string) => void;
}

// Emoji mapping for mood levels
const moodEmojis = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄'
};

const CalendarView: React.FC<CalendarViewProps> = ({ 
  moodEntries, 
  currentMonth, 
  setCurrentMonth,
  onDayClick
}) => {
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Get all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get mood entry for a specific day
  const getMoodForDay = (day: Date) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    return moodEntries.find(entry => entry.date === formattedDay);
  };
  
  return (
    <Box>
      {/* Month Navigation */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2
      }}>
        <IconButton onClick={handlePrevMonth} color="primary">
          <PrevIcon />
        </IconButton>
        <Typography variant="h6" color="text.primary">
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth} color="primary">
          <NextIcon />
        </IconButton>
      </Box>
      
      {/* Calendar Grid */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 1, sm: 2 }, 
          borderRadius: 2,
          bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
          boxShadow: theme => theme.palette.mode === 'dark' 
            ? '8px 8px 16px #252532, -8px -8px 16px #353546'
            : '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff'
        }}
      >
        {/* Weekday Headers */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1, mx: -0.5 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Box key={day} sx={{ width: 'calc(100% / 7)', px: 0.5 }}>
              <Typography 
                align="center" 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 'medium',
                  color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                }}
              >
                {day}
              </Typography>
            </Box>
          ))}
        </Box>
        
        {/* Calendar Days */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -0.5 }}>
          {monthDays.map(day => {
            const moodEntry = getMoodForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);
            
            return (
              <CalendarDay 
                key={day.toString()}
                day={day}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                moodEntry={moodEntry}
                moodEmojis={moodEmojis}
                onDayClick={() => onDayClick(format(day, 'yyyy-MM-dd'))}
              />
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};

export default CalendarView;
