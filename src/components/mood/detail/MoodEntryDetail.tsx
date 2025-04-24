import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { MoodEntry, MoodLevel } from '../../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

interface MoodEntryDetailProps {
  entry: MoodEntry | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const MoodEntryDetail: React.FC<MoodEntryDetailProps> = ({ 
  entry, 
  onClose, 
  onDelete,
  onEdit
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
  
  if (!entry) return null;
  
  const entryDate = parseISO(entry.date);
  const formattedDate = format(entryDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = entry.time ? format(parseISO(entry.time), 'h:mm a') : '';
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this mood entry?')) {
      onDelete(entry.id);
    }
  };
  
  return (
    <Dialog 
      open={!!entry} 
      onClose={onClose}
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          bgcolor: theme => theme.palette.mode === 'dark' ? '#2d2d3d' : '#f8f8f8',
          backgroundImage: 'none',
          maxWidth: 'sm',
          width: '100%'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        pb: 1
      }}>
        <Typography variant="h6" component="div">
          Mood Entry Details
        </Typography>
        <Button 
          onClick={onClose} 
          color="inherit" 
          sx={{ minWidth: 'auto', p: 1 }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        {/* Mood header with emoji and level */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: `${moodColors[entry.moodLevel as MoodLevel]}${isDarkMode ? '30' : '15'}`,
          }}
        >
          <Typography variant="h2" sx={{ mr: 2 }}>
            {moodEmojis[entry.moodLevel as MoodLevel]}
          </Typography>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
              {moodDescriptions[entry.moodLevel as MoodLevel]} Mood
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formattedDate} {formattedTime && `at ${formattedTime}`}
            </Typography>
          </Box>
        </Box>
        
        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {entry.tags.map(tag => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  sx={{ 
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    color: theme => theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.9)' 
                      : 'rgba(0, 0, 0, 0.7)'
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        
        {/* Journal Note */}
        {entry.note && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
              Journal Note
            </Typography>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: theme => theme.palette.mode === 'dark' 
                  ? '3px 3px 6px #252532, -3px -3px 6px #353546'
                  : '3px 3px 6px #e6e6e6, -3px -3px 6px #ffffff',
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  color: theme => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(0, 0, 0, 0.7)',
                }}
              >
                {entry.note}
              </Typography>
            </Paper>
          </Box>
        )}
        
        {/* Activities */}
        {entry.activities && entry.activities.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
              Activities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {entry.activities.map(activity => (
                <Chip 
                  key={activity} 
                  label={activity} 
                  color="secondary"
                  variant="outlined"
                  sx={{ 
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ 
        borderTop: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        px: 3,
        py: 2,
        justifyContent: 'space-between'
      }}>
        <Button 
          onClick={handleDelete} 
          color="error" 
          startIcon={<DeleteIcon />}
          variant="outlined"
        >
          Delete
        </Button>
        <Button 
          onClick={() => onEdit(entry.id)} 
          color="primary" 
          startIcon={<EditIcon />}
          variant="contained"
          sx={{
            bgcolor: theme => theme.palette.mode === 'dark' ? '#9c27b0' : '#7b1fa2',
            '&:hover': {
              bgcolor: theme => theme.palette.mode === 'dark' ? '#7b1fa2' : '#6a1b9a',
            }
          }}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoodEntryDetail;
