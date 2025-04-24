import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Slider, 
  Chip, 
  TextField, 
  Button, 
  Stack,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { MoodEntry, MoodLevel } from '../../types';
import { useAppContext } from '../../context/AppContext';

// Emoji mapping for mood levels
const moodEmojis = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄'
};

// Colors for mood levels
const moodColors = {
  1: '#7b1fa2', // Dark purple (sad)
  2: '#9c27b0', // Purple (low)
  3: '#ba68c8', // Light purple (neutral)
  4: '#d81b60', // Dark pink (good)
  5: '#e91e63'  // Pink (great)
};

interface MoodInputProps {
  existingMood?: MoodEntry;
}

const MoodInput: React.FC<MoodInputProps> = ({ existingMood }) => {
  const { settings, addMoodEntry, updateMoodEntry } = useAppContext();
  const theme = useTheme();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [moodLevel, setMoodLevel] = useState<MoodLevel>(
    existingMood?.moodLevel as MoodLevel || 3
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    existingMood?.moodTags || []
  );
  const [journalNote, setJournalNote] = useState(
    existingMood?.journalNote || ''
  );
  const [reflectionResponse, setReflectionResponse] = useState(
    existingMood?.reflectionResponse || ''
  );

  // Sample reflection prompt - in a real app, this would rotate daily
  const reflectionPrompt = existingMood?.reflectionPrompt || 
    "What's one thing that made you feel the way you do today?";

  const handleMoodChange = (_event: Event, newValue: number | number[]) => {
    setMoodLevel(newValue as MoodLevel);
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    const moodData = {
      date: today,
      moodLevel,
      moodTags: selectedTags,
      journalNote,
      reflectionPrompt,
      reflectionResponse,
      activities: existingMood?.activities || []
    };

    if (existingMood) {
      updateMoodEntry({ ...moodData, id: existingMood.id });
    } else {
      addMoodEntry(moodData);
    }
    
    // Clear fields after submission
    if (!existingMood) {
      setMoodLevel(3);
      setSelectedTags([]);
      setJournalNote('');
      setReflectionResponse('');
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 16,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(145deg, #2d2d3a 0%, #1e1e2f 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
        boxShadow: theme.palette.mode === 'dark' 
          ? '8px 8px 16px #252532, -8px -8px 16px #353546'
          : '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff',
        color: theme.palette.text.primary
      }}
    >
      <Typography variant="h5" gutterBottom align="center" sx={{ 
        fontWeight: 'medium', 
        color: theme.palette.mode === 'dark' ? '#e91e63' : '#9c27b0'
      }}>
        How are you feeling today?
      </Typography>
      
      {/* Mood Level Slider */}
      <Box sx={{ my: 4, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: '10%', textAlign: 'center' }}>
            <Typography variant="h4" align="center" sx={{ 
              color: theme.palette.text.primary
            }}>
              {moodEmojis[moodLevel]}
            </Typography>
          </Box>
          <Box sx={{ width: '90%' }}>
            <Slider
              value={moodLevel}
              onChange={handleMoodChange}
              step={1}
              marks
              min={1}
              max={5}
              sx={{
                '& .MuiSlider-thumb': {
                  height: 24,
                  width: 24,
                },
                '& .MuiSlider-track': {
                  height: 8,
                  backgroundColor: moodColors[moodLevel],
                },
                '& .MuiSlider-rail': {
                  height: 8,
                  opacity: 0.5,
                  backgroundColor: '#bfbfbf',
                },
                '& .MuiSlider-mark': {
                  backgroundColor: '#bfbfbf',
                  height: 8,
                  width: 8,
                  borderRadius: '50%',
                },
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography sx={{ color: theme.palette.text.primary }}>Not Great</Typography>
          <Typography sx={{ color: theme.palette.text.primary }}>Awesome</Typography>
        </Box>
      </Box>
      
      {/* Mood Tags */}
      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ 
          color: theme.palette.text.primary,
          fontWeight: 'bold',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          What emotions are you experiencing?
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {settings.customMoodTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleTagToggle(tag)}
              color={selectedTags.includes(tag) ? "primary" : "default"}
              sx={{ m: 0.5 }}
            />
          ))}
        </Stack>
      </Box>
      
      {/* Journal Note */}
      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ 
          color: theme.palette.text.primary,
          fontWeight: 'bold',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          Journal Entry (Optional)
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Write about your day..."
          value={journalNote}
          onChange={(e) => setJournalNote(e.target.value)}
          variant="outlined"
          sx={{ color: theme.palette.text.primary }}
        />
      </Box>
      
      {/* Reflection Prompt */}
      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ 
          color: theme.palette.text.primary,
          fontWeight: 'bold',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          Daily Reflection
        </Typography>
        <Paper elevation={0} sx={{ 
          p: 2, 
          bgcolor: theme => theme.palette.mode === 'dark' ? '#353546' : '#f8f9ff', 
          mb: 2,
          borderRadius: 12,
          boxShadow: theme => theme.palette.mode === 'dark' 
            ? 'inset 3px 3px 6px #252532, inset -3px -3px 6px #353546'
            : 'inset 3px 3px 6px #e6e6e6, inset -3px -3px 6px #ffffff'
        }}>
          <Typography variant="body1" sx={{ 
            color: theme.palette.text.primary,
            my: 2, 
            fontStyle: 'italic'
          }}>
            {reflectionPrompt}
          </Typography>
        </Paper>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Your reflection..."
          value={reflectionResponse}
          onChange={(e) => setReflectionResponse(e.target.value)}
          variant="outlined"
          sx={{ color: theme.palette.text.primary }}
        />
      </Box>
      
      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSave}
          sx={{ 
            mt: 3, 
            py: 1.5,
            background: 'linear-gradient(45deg, #e91e63 30%, #9c27b0 90%)',
            borderRadius: 8,
            boxShadow: '0 3px 5px 2px rgba(156, 39, 176, .3)',
            color: '#ffffff'
          }}
        >
          {existingMood ? 'Update Mood' : 'Save Mood'}
        </Button>
      </Box>
    </Paper>
  );
};

export default MoodInput;
