import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { MoodEntry } from '../../../types';
import TimelineItem from '../../../components/mood/timeline/TimelineItem';
import { parseISO, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

interface TimelineViewProps {
  moodEntries: MoodEntry[];
  onEntryClick: (entryId: string) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ moodEntries, onEntryClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Sort entries by date (newest first)
  const sortedEntries = [...moodEntries].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Group entries by time period
  const groupedEntries = sortedEntries.reduce<Record<string, MoodEntry[]>>(
    (groups, entry) => {
      const entryDate = parseISO(entry.date);
      let groupKey = '';
      
      if (isToday(entryDate)) {
        groupKey = 'Today';
      } else if (isYesterday(entryDate)) {
        groupKey = 'Yesterday';
      } else if (isThisWeek(entryDate)) {
        groupKey = 'This Week';
      } else if (isThisMonth(entryDate)) {
        groupKey = 'This Month';
      } else {
        groupKey = 'Earlier';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(entry);
      return groups;
    },
    {}
  );
  
  // Get all group keys in order
  const groupOrder = ['Today', 'Yesterday', 'This Week', 'This Month', 'Earlier'];
  const displayGroups = groupOrder.filter(group => groupedEntries[group]?.length > 0);
  
  return (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'
        }}
      >
        Mood Timeline
      </Typography>
      
      {displayGroups.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
            boxShadow: theme => theme.palette.mode === 'dark' 
              ? '8px 8px 16px #252532, -8px -8px 16px #353546'
              : '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff',
            textAlign: 'center'
          }}
        >
          <Typography color="text.secondary">
            No mood entries yet. Start tracking your mood to see your timeline.
          </Typography>
        </Paper>
      ) : (
        displayGroups.map(groupKey => (
          <Box key={groupKey} sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 1, 
                fontWeight: 'medium',
                color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
              }}
            >
              {groupKey}
            </Typography>
            
            <Box sx={{ pl: isMobile ? 0 : 2 }}>
              {groupedEntries[groupKey].map((entry, index) => (
                <TimelineItem 
                  key={entry.id}
                  entry={entry}
                  isLast={index === groupedEntries[groupKey].length - 1}
                  onClick={() => onEntryClick(entry.id)}
                />
              ))}
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default TimelineView;
