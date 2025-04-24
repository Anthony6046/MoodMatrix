import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useAppContext } from '../../context/AppContext';
import { ActivityLog } from '../../types';

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
      id={`habits-tabpanel-${index}`}
      aria-labelledby={`habits-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const HabitsView: React.FC = () => {
  const { activities, addActivity, updateActivity, toggleActivity, deleteActivity, settings, moodEntries, isLoading } = useAppContext();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newActivityName, setNewActivityName] = useState('');
  const [editingActivity, setEditingActivity] = useState<ActivityLog | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [weekStartDate] = useState(startOfWeek(new Date()));
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleAddActivity = () => {
    if (newActivityName.trim()) {
      addActivity({
        name: newActivityName.trim(),
        date: format(new Date(), 'yyyy-MM-dd'),
        completed: false
      });
      setNewActivityName('');
      setOpenDialog(false);
    }
  };
  
  const handleEditActivity = () => {
    if (editingActivity && newActivityName.trim()) {
      updateActivity({
        ...editingActivity,
        name: newActivityName.trim()
      });
      setNewActivityName('');
      setEditingActivity(null);
      setOpenDialog(false);
    }
  };
  
  const handleOpenEditDialog = (activity: ActivityLog) => {
    setEditingActivity(activity);
    setNewActivityName(activity.name);
    setOpenDialog(true);
  };
  
  const handleDeleteActivity = (activityId: string, activityName: string) => {
    deleteActivity(activityId);
    // Show feedback (in a real app, you might want to add a snackbar here)
    console.log(`Deleted activity: ${activityName}`);
  };
  
  // Group activities by name
  const getUniqueActivities = () => {
    const uniqueNames = new Set(activities.map(a => a.name));
    return Array.from(uniqueNames).map(name => {
      const activityInstances = activities.filter(a => a.name === name);
      const completedCount = activityInstances.filter(a => a.completed).length;
      const totalCount = activityInstances.length;
      const lastActivity = activityInstances.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
      
      return {
        name,
        completedCount,
        totalCount,
        completionRate: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
        lastActivity
      };
    });
  };
  
  // Generate days for weekly view
  const generateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStartDate, i));
    }
    return days;
  };
  
  // Get activities for a specific day
  const getActivitiesForDay = (day: Date) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    return activities.filter(activity => activity.date === formattedDay);
  };
  
  // Calculate correlation between activity and mood
  const calculateMoodCorrelation = (activityName: string) => {
    // Get all dates when this activity was completed
    const completedDates = activities
      .filter(a => a.name === activityName && a.completed)
      .map(a => a.date);
    
    if (completedDates.length === 0) return { correlation: 0, averageMood: 0 };
    
    // Get mood entries for these dates
    const relevantMoods = moodEntries.filter(mood => 
      completedDates.includes(mood.date)
    );
    
    if (relevantMoods.length === 0) return { correlation: 0, averageMood: 0 };
    
    // Calculate average mood when activity was completed
    const totalMood = relevantMoods.reduce((sum, mood) => sum + mood.moodLevel, 0);
    const averageMood = totalMood / relevantMoods.length;
    
    // Simple correlation metric (can be enhanced with more sophisticated analysis)
    const correlation = averageMood > 3 ? 'positive' : averageMood < 3 ? 'negative' : 'neutral';
    
    return { correlation, averageMood };
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
          Habits Tracker
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track your daily activities and see how they affect your mood
        </Typography>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="habits tabs"
            sx={{ mb: 2 }}
            centered
          >
            <Tab 
              icon={<CalendarIcon />} 
              label="Weekly View" 
              id="habits-tab-0" 
              aria-controls="habits-tabpanel-0" 
            />
            <Tab 
              icon={<TrendingUpIcon />} 
              label="Insights" 
              id="habits-tab-1" 
              aria-controls="habits-tabpanel-1" 
            />
          </Tabs>
        </Box>

        {/* Weekly View */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Week of {format(weekStartDate, 'MMM d, yyyy')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                onClick={() => setEditMode(!editMode)} 
                color={editMode ? "primary" : "default"}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingActivity(null);
                  setNewActivityName('');
                  setOpenDialog(true);
                }}
              >
                Add Activity
              </Button>
            </Box>
          </Box>

          {/* Week days header */}
          <Box sx={{ display: 'flex', mb: 2, maxWidth: '100%', overflow: 'hidden' }}>
            {generateWeekDays().map(day => (
              <Box 
                key={day.toString()} 
                sx={{ 
                  flex: 1, 
                  textAlign: 'center',
                  p: { xs: 0.5, sm: 1 },
                  fontWeight: isSameDay(day, new Date()) ? 'bold' : 'normal',
                  bgcolor: isSameDay(day, new Date()) ? 'action.selected' : 'transparent',
                  borderRadius: 1
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {isMobile 
                    ? format(day, 'EEE').charAt(0)
                    : format(day, 'EEE')}
                </Typography>
                <Typography variant="body1">
                  {format(day, 'd')}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Activities grid */}
          {getUniqueActivities().length > 0 ? (
            <List sx={{ width: '100%' }}>
              {getUniqueActivities().map((uniqueActivity, index) => (
                <React.Fragment key={uniqueActivity.name}>
                  <ListItem
                    secondaryAction={
                      editMode && (
                        <Box>
                          <IconButton 
                            edge="end" 
                            aria-label="edit" 
                            onClick={() => handleOpenEditDialog(uniqueActivity.lastActivity)}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            onClick={() => handleDeleteActivity(uniqueActivity.lastActivity.id, uniqueActivity.name)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )
                    }
                  >
                    <ListItemText
                      primary={uniqueActivity.name}
                      secondary={`${isMobile ? 'Completion' : 'Completion rate'}: ${uniqueActivity.completionRate.toFixed(0)}%`}
                      primaryTypographyProps={{
                        noWrap: isMobile,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    />
                  </ListItem>
                  
                  <Box sx={{ display: 'flex', mb: 2, pl: { xs: 1, sm: 2 }, pr: { xs: 1, sm: 2 } }}>
                    {generateWeekDays().map(day => {
                      const dayActivities = getActivitiesForDay(day);
                      const activityForDay = dayActivities.find(a => a.name === uniqueActivity.name);
                      
                      return (
                        <Box 
                          key={day.toString()} 
                          sx={{ 
                            flex: 1, 
                            textAlign: 'center',
                            p: { xs: 0, sm: 1 }
                          }}
                        >
                          {activityForDay ? (
                            <Checkbox
                              checked={activityForDay.completed}
                              onChange={() => toggleActivity(activityForDay.id)}
                              color="primary"
                              size={isMobile ? "small" : "medium"}
                            />
                          ) : (
                            <Checkbox
                              disabled
                              checked={false}
                              color="default"
                              size={isMobile ? "small" : "medium"}
                            />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                  
                  {index < getUniqueActivities().length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Activities Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Start tracking your daily habits to see how they affect your mood.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingActivity(null);
                  setNewActivityName('');
                  setOpenDialog(true);
                }}
              >
                Add First Activity
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* Insights View */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Activity-Mood Correlation
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            See how your activities correlate with your mood levels
          </Typography>
          
          {getUniqueActivities().length > 0 ? (
            <List>
              {getUniqueActivities().map((uniqueActivity) => {
                const { correlation, averageMood } = calculateMoodCorrelation(uniqueActivity.name);
                let correlationColor = 'default';
                let correlationText = 'No correlation yet';
                
                if (correlation === 'positive') {
                  correlationColor = 'success';
                  correlationText = 'Positive impact on mood';
                } else if (correlation === 'negative') {
                  correlationColor = 'error';
                  correlationText = 'Negative impact on mood';
                } else if (correlation === 'neutral') {
                  correlationColor = 'info';
                  correlationText = 'Neutral impact on mood';
                }
                
                return (
                  <Paper key={uniqueActivity.name} sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {uniqueActivity.name}
                      </Typography>
                      <Chip 
                        label={correlationText} 
                        color={correlationColor as any}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Box sx={{ width: '50%' }}>
                        <Typography variant="body2" color="text.secondary">
                          Completion rate:
                        </Typography>
                        <Typography variant="body1">
                          {uniqueActivity.completionRate.toFixed(0)}% ({uniqueActivity.completedCount} of {uniqueActivity.totalCount})
                        </Typography>
                      </Box>
                      
                      <Box sx={{ width: '50%' }}>
                        <Typography variant="body2" color="text.secondary">
                          Average mood when completed:
                        </Typography>
                        <Typography variant="body1">
                          {averageMood ? averageMood.toFixed(1) + '/5' : 'No data'}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Data Available
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Start tracking your activities and mood to see correlations.
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Add/Edit Activity Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Activity Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newActivityName}
            onChange={(e) => setNewActivityName(e.target.value)}
            sx={{ mt: 1 }}
          />
          
          {!editingActivity && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Quick Add:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {settings.customActivities.map((activity) => (
                  <Chip
                    key={activity}
                    label={activity}
                    onClick={() => setNewActivityName(activity)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={editingActivity ? handleEditActivity : handleAddActivity} 
            variant="contained"
          >
            {editingActivity ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HabitsView;
