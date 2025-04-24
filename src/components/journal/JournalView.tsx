import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  TextField, 
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useAppContext } from '../../context/AppContext';
import { MoodEntry } from '../../types';

const JournalView: React.FC = () => {
  const { moodEntries, updateMoodEntry, deleteMoodEntry, isLoading } = useAppContext();
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedNote, setEditedNote] = useState('');
  const [journalEntries, setJournalEntries] = useState<MoodEntry[]>([]);

  // Filter entries that have journal notes
  useEffect(() => {
    const entriesWithNotes = moodEntries.filter(entry => 
      entry.journalNote && entry.journalNote.trim() !== ''
    );
    
    // Sort by date (newest first)
    const sortedEntries = entriesWithNotes.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setJournalEntries(sortedEntries);
  }, [moodEntries]);

  const handleEditClick = (entry: MoodEntry) => {
    setSelectedEntry(entry);
    setEditedNote(entry.journalNote || '');
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (selectedEntry) {
      const updatedEntry = {
        ...selectedEntry,
        journalNote: editedNote
      };
      
      await updateMoodEntry(updatedEntry);
      setEditDialogOpen(false);
      setSelectedEntry(null);
    }
  };

  const handleDeleteEntry = async (entry: MoodEntry) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      await deleteMoodEntry(entry.id);
    }
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
          Journal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Your personal reflections and thoughts
        </Typography>
      </Box>

      {journalEntries.length > 0 ? (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 0, 
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {journalEntries.map((entry, index) => (
              <React.Fragment key={entry.id}>
                <ListItem 
                  alignItems="flex-start"
                  secondaryAction={
                    <Box>
                      <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(entry)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteEntry(entry)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                  sx={{ 
                    py: 2,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                        <Typography variant="subtitle1" fontWeight="medium">
                          {format(parseISO(entry.date), 'EEEE, MMMM d, yyyy')}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        component="div"
                        variant="body1"
                        color="text.primary"
                        sx={{ 
                          mt: 1,
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.6
                        }}
                      >
                        {entry.journalNote}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < journalEntries.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Journal Entries Yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start tracking your mood and add journal notes to see them here.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            href="/"
          >
            Add Mood Entry
          </Button>
        </Paper>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Journal Entry</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {selectedEntry && format(parseISO(selectedEntry.date), 'EEEE, MMMM d, yyyy')}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Journal Entry"
            fullWidth
            multiline
            rows={8}
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JournalView;
