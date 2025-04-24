import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  Tooltip,
  Zoom,
  Fade,
  InputAdornment,
  Divider,
  Avatar,
  ListItemAvatar,
  ListItemButton,
  Collapse,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import BookIcon from '@mui/icons-material/Book';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SpaIcon from '@mui/icons-material/Spa';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { format } from 'date-fns';
import { useAppContext } from '../../context/AppContext';

interface ActivityTrackerProps {
  date?: Date;
}

// Activity icons mapping
const activityIcons: Record<string, React.ReactElement> = {
  'Exercise': <DirectionsRunIcon />,
  'Meditation': <SelfImprovementIcon />,
  'Reading': <BookIcon />,
  'Drink Water': <LocalDrinkIcon />,
  'Wellness': <SpaIcon />,
  'Fitness': <FitnessCenterIcon />
};

const getActivityIcon = (activityName: string) => {
  const lowerCaseName = activityName.toLowerCase();
  
  if (lowerCaseName.includes('exercise') || lowerCaseName.includes('workout') || lowerCaseName.includes('gym')) {
    return <DirectionsRunIcon />;
  } else if (lowerCaseName.includes('meditat') || lowerCaseName.includes('mindful')) {
    return <SelfImprovementIcon />;
  } else if (lowerCaseName.includes('read') || lowerCaseName.includes('book')) {
    return <BookIcon />;
  } else if (lowerCaseName.includes('water') || lowerCaseName.includes('drink')) {
    return <LocalDrinkIcon />;
  } else if (lowerCaseName.includes('wellness') || lowerCaseName.includes('self-care') || lowerCaseName.includes('spa')) {
    return <SpaIcon />;
  } else if (lowerCaseName.includes('fitness') || lowerCaseName.includes('health')) {
    return <FitnessCenterIcon />;
  }
  
  // Default icon
  return <FitnessCenterIcon />;
};

const ActivityTracker: React.FC<ActivityTrackerProps> = ({ date = new Date() }) => {
  const { 
    todaysActivities, 
    toggleActivity, 
    addActivity, 
    deleteActivity,
    settings 
  } = useAppContext();
  const theme = useTheme();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newActivityName, setNewActivityName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  const handleToggle = (activityId: string) => {
    toggleActivity(activityId);
  };
  
  const handleAddActivity = () => {
    if (newActivityName.trim()) {
      addActivity({
        name: newActivityName.trim(),
        date: formattedDate,
        completed: false
      });
      setNewActivityName('');
      setOpenDialog(false);
      setShowSnackbar(true);
      setSnackbarMessage(`Added "${newActivityName.trim()}" to your activities`);
    }
  };
  
  const handleQuickAdd = (activityName: string) => {
    // Check if activity already exists for today
    const exists = todaysActivities.some(
      activity => activity.name.toLowerCase() === activityName.toLowerCase() && 
                  activity.date === formattedDate
    );
    
    if (!exists) {
      addActivity({
        name: activityName,
        date: formattedDate,
        completed: false
      });
      setShowSnackbar(true);
      setSnackbarMessage(`Added "${activityName}" to your activities`);
    } else {
      setShowSnackbar(true);
      setSnackbarMessage(`"${activityName}" is already in your activities`);
    }
  };
  
  const handleDeleteActivity = (activityId: string, activityName: string) => {
    deleteActivity(activityId);
    setShowSnackbar(true);
    setSnackbarMessage(`Removed "${activityName}" from your activities`);
  };
  
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddActivity();
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, #2d2d3a 0%, #1e1e2f 100%)' 
          : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 20px rgba(0,0,0,0.3)'
          : '0 4px 20px rgba(0,0,0,0.1)',
        color: theme.palette.text.primary,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ 
          color: theme.palette.text.primary,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <FitnessCenterIcon sx={{ color: theme.palette.primary.main }} /> 
          Daily Activities
        </Typography>
        <Box>
          <Tooltip title="Toggle Edit Mode">
            <IconButton 
              onClick={() => setEditMode(!editMode)} 
              color={editMode ? "primary" : "default"}
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenDialog(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            color="primary"
            sx={{
              borderRadius: '20px',
              boxShadow: 2,
              px: 2
            }}
          >
            Add
          </Button>
        </Box>
      </Box>
      
      {/* Quick Add Chips */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ 
          color: theme.palette.text.primary,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}>
          Quick Add:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {settings.customActivities.map((activity, index) => (
            <Chip 
              key={index}
              label={activity}
              icon={getActivityIcon(activity)}
              onClick={() => handleQuickAdd(activity)}
              sx={{ 
                m: 0.5,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                color: theme.palette.text.primary,
                borderRadius: '16px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(-2px)',
                  boxShadow: 1
                }
              }}
            />
          ))}
        </Box>
      </Box>
      
      <Divider sx={{ my: 2, opacity: 0.6 }} />
      
      {/* Activities List */}
      <List sx={{ 
        width: '100%', 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 58, 0.5)' : 'rgba(255, 255, 255, 0.7)', 
        borderRadius: 2,
        color: theme.palette.text.primary,
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        {todaysActivities.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <SpaIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1, opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              No activities for today. Add some to track your habits!
            </Typography>
          </Box>
        ) : (
          todaysActivities.map((activity) => {
            return (
              <Fade in={true} key={activity.id} timeout={500}>
                <ListItem
                  secondaryAction={
                    editMode && (
                      <Tooltip title="Delete Activity">
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDeleteActivity(activity.id, activity.name)}
                          sx={{
                            color: theme.palette.error.main,
                            '&:hover': {
                              bgcolor: `${theme.palette.error.main}15`
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                  disablePadding
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    bgcolor: activity.completed 
                      ? (theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.08)') 
                      : 'transparent',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  <ListItemButton onClick={() => handleToggle(activity.id)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={activity.completed}
                        disableRipple
                        icon={<Avatar sx={{ 
                          width: 24, 
                          height: 24, 
                          bgcolor: 'transparent',
                          border: `1px solid ${theme.palette.divider}`
                        }}>
                          {getActivityIcon(activity.name)}
                        </Avatar>}
                        checkedIcon={<Avatar sx={{ 
                          width: 24, 
                          height: 24, 
                          bgcolor: 'success.main'
                        }}>
                          <CheckCircleOutlineIcon fontSize="small" />
                        </Avatar>}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.name}
                      sx={{
                        '& .MuiTypography-root': {
                          textDecoration: activity.completed ? 'line-through' : 'none',
                          color: activity.completed ? 'text.secondary' : 'text.primary',
                          fontWeight: activity.completed ? 'normal' : 500,
                          transition: 'all 0.2s ease'
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Fade>
            );
          })
        )}
      </List>
      
      {/* Add Activity Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 24
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          fontWeight: 600,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
        }}>
          Add New Activity
        </DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: '300px' }}>
          <TextField
            inputRef={inputRef}
            autoFocus
            margin="dense"
            label="Activity Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newActivityName}
            onChange={(e) => setNewActivityName(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FitnessCenterIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ borderRadius: '20px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddActivity} 
            variant="contained"
            disabled={!newActivityName.trim()}
            sx={{ borderRadius: '20px', px: 3 }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ActivityTracker;
