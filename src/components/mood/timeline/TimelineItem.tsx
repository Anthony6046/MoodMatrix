import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Chip,
  useTheme
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { MoodEntry, MoodLevel } from '../../../types';

interface TimelineItemProps {
  entry: MoodEntry;
  isLast: boolean;
  onClick: () => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ entry, isLast, onClick }) => {
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
  
  // Emoji mapping for mood levels
  const moodEmojis = {
    1: '😢',
    2: '😕',
    3: '😐',
    4: '🙂',
    5: '😄'
  };
  
  // Mood level text descriptions
  const moodDescriptions = {
    1: 'Very Low',
    2: 'Low',
    3: 'Neutral',
    4: 'Good',
    5: 'Great'
  };
  
  const entryDate = parseISO(entry.date);
  const formattedDate = format(entryDate, 'EEEE, MMMM d');
  const formattedTime = entry.time ? format(parseISO(entry.time), 'h:mm a') : '';
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        mb: isLast ? 0 : 3,
        position: 'relative'
      }}
    >
      {/* Timeline connector line */}
      {!isLast && (
        <Box 
          sx={{ 
            position: 'absolute',
            left: { xs: 15, sm: 15 },
            top: 30,
            bottom: -30,
            width: 2,
            bgcolor: theme => theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)',
            zIndex: 0
          }} 
        />
      )}
      
      {/* Timeline dot */}
      <Box 
        sx={{ 
          width: 30, 
          height: 30, 
          borderRadius: '50%', 
          bgcolor: moodColors[entry.moodLevel as MoodLevel],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          zIndex: 1,
          boxShadow: theme => theme.palette.mode === 'dark' 
            ? '3px 3px 6px #252532, -3px -3px 6px #353546'
            : '3px 3px 6px #e6e6e6, -3px -3px 6px #ffffff',
          flexShrink: 0
        }}
      >
        {moodEmojis[entry.moodLevel as MoodLevel]}
      </Box>
      
      {/* Entry content */}
      <Paper 
        elevation={0} 
        onClick={onClick}
        sx={{ 
          ml: 2, 
          p: 2, 
          borderRadius: 2,
          flexGrow: 1,
          bgcolor: theme => theme.palette.mode === 'dark' 
            ? `${moodColors[entry.moodLevel as MoodLevel]}20` 
            : `${moodColors[entry.moodLevel as MoodLevel]}10`,
          boxShadow: theme => theme.palette.mode === 'dark' 
            ? '5px 5px 10px #252532, -5px -5px 10px #353546'
            : '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme => theme.palette.mode === 'dark' 
              ? '8px 8px 16px #252532, -8px -8px 16px #353546'
              : '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff',
          },
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
      >
        {/* Date and time */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: theme => theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.7)' 
                : 'rgba(0, 0, 0, 0.6)'
            }}
          >
            {formattedDate} {formattedTime && `at ${formattedTime}`}
          </Typography>
          
          <Chip 
            label={moodDescriptions[entry.moodLevel as MoodLevel]} 
            size="small"
            sx={{ 
              bgcolor: moodColors[entry.moodLevel as MoodLevel],
              color: '#fff',
              fontWeight: 'medium'
            }}
          />
        </Box>
        
        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {entry.tags.map(tag => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small"
                sx={{ 
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  color: theme => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(0, 0, 0, 0.7)'
                }}
              />
            ))}
          </Box>
        )}
        
        {/* Note */}
        {entry.note && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme => theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.9)' 
                : 'rgba(0, 0, 0, 0.7)',
              // Truncate long notes
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {entry.note}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default TimelineItem;
