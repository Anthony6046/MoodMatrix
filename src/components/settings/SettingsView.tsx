import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudDownload as ExportIcon,
  CloudUpload as ImportIcon,
  DeleteForever as DeleteForeverIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';

const SettingsView: React.FC = () => {
  const { settings, updateSettings, showNotification, clearAllData } = useAppContext();
  
  const [openTagDialog, setOpenTagDialog] = useState(false);
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [openClearDataDialog, setOpenClearDataDialog] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newActivity, setNewActivity] = useState('');
  
  const handleThemeToggle = () => {
    updateSettings({
      theme: settings.theme === 'light' ? 'dark' : 'light'
    });
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !settings.customMoodTags.includes(newTag.trim())) {
      updateSettings({
        ...settings,
        customMoodTags: [...settings.customMoodTags, newTag.trim()]
      });
      setNewTag('');
      setOpenTagDialog(false);
      showNotification('Mood tag added successfully', 'success');
    }
  };
  
  const handleDeleteTag = (tag: string) => {
    updateSettings({
      ...settings,
      customMoodTags: settings.customMoodTags.filter(t => t !== tag)
    });
    showNotification('Mood tag removed', 'info');
  };
  
  const handleAddActivity = () => {
    if (newActivity.trim() && !settings.customActivities.includes(newActivity.trim())) {
      updateSettings({
        ...settings,
        customActivities: [...settings.customActivities, newActivity.trim()]
      });
      setNewActivity('');
      setOpenActivityDialog(false);
      showNotification('Activity added successfully', 'success');
    }
  };
  
  const handleDeleteActivity = (activity: string) => {
    updateSettings({
      ...settings,
      customActivities: settings.customActivities.filter(a => a !== activity)
    });
    showNotification('Activity removed', 'info');
  };
  
  const handleExportData = () => {
    // In a real app, this would export all user data
    const dataStr = JSON.stringify(settings);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'mood-matrix-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Settings exported successfully', 'success');
  };
  
  const handleImportData = () => {
    // In a real app, this would import user data
    // For now, just show a notification message
    showNotification('Import functionality will be available soon', 'info');
  };
  
  const handleClearAllData = async () => {
    await clearAllData();
    setOpenClearDataDialog(false);
    // Force reload the app to reflect the cleared data
    window.location.reload();
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Customize your Mood Matrix experience
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          {/* Appearance Settings */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: theme => theme.palette.mode === 'dark' 
                ? 'linear-gradient(145deg, #353546 0%, #2d2d3a 100%)' 
                : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: theme => theme.palette.mode === 'dark'
                ? '0 4px 20px rgba(0,0,0,0.3)'
                : '0 4px 20px rgba(0,0,0,0.1)',
              mb: 3
            }}
          >
            <Typography variant="h6" gutterBottom>
              Appearance
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <DarkModeIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Dark Mode" 
                  secondary="Switch between light and dark theme"
                />
                <Switch
                  edge="end"
                  checked={settings.theme === 'dark'}
                  onChange={handleThemeToggle}
                />
              </ListItem>
            </List>
          </Paper>
          
          {/* Notifications Settings */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: theme => theme.palette.mode === 'dark' 
                ? 'linear-gradient(145deg, #353546 0%, #2d2d3a 100%)' 
                : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: theme => theme.palette.mode === 'dark'
                ? '0 4px 20px rgba(0,0,0,0.3)'
                : '0 4px 20px rgba(0,0,0,0.1)',
              mb: 3
            }}
          >
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Mood Reminders" 
                  secondary="Get reminders to log your mood"
                />
                <Switch
                  edge="end"
                  checked={settings.reminderTime !== undefined}
                  onChange={() => updateSettings({
                    ...settings,
                    reminderTime: settings.reminderTime ? undefined : '09:00'
                  })}
                />
              </ListItem>
            </List>
          </Paper>
          
          {/* Data Management */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: theme => theme.palette.mode === 'dark' 
                ? 'linear-gradient(145deg, #353546 0%, #2d2d3a 100%)' 
                : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: theme => theme.palette.mode === 'dark'
                ? '0 4px 20px rgba(0,0,0,0.3)'
                : '0 4px 20px rgba(0,0,0,0.1)',
              mb: 3
            }}
          >
            <Typography variant="h6" gutterBottom>
              Data Management
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                startIcon={<ExportIcon />}
                onClick={handleExportData}
              >
                Export Data
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<ImportIcon />}
                onClick={handleImportData}
              >
                Import Data
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<DeleteForeverIcon />}
                onClick={() => setOpenClearDataDialog(true)}
              >
                Clear All Data
              </Button>
            </Box>
          </Paper>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          {/* Custom Tags Settings */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: theme => theme.palette.mode === 'dark' 
                ? 'linear-gradient(145deg, #353546 0%, #2d2d3a 100%)' 
                : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: theme => theme.palette.mode === 'dark'
                ? '0 4px 20px rgba(0,0,0,0.3)'
                : '0 4px 20px rgba(0,0,0,0.1)',
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Mood Tags
              </Typography>
              <Button 
                variant="contained" 
                size="small" 
                startIcon={<AddIcon />}
                onClick={() => setOpenTagDialog(true)}
              >
                Add Tag
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Customize the mood tags available for tracking
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {settings.customMoodTags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  deleteIcon={<DeleteIcon />}
                  sx={{ m: 0.5 }}
                />
              ))}
              
              {settings.customMoodTags.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No custom mood tags yet. Add some to get started.
                </Typography>
              )}
            </Box>
          </Paper>
          
          {/* Activities Settings */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: theme => theme.palette.mode === 'dark' 
                ? 'linear-gradient(145deg, #353546 0%, #2d2d3a 100%)' 
                : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              boxShadow: theme => theme.palette.mode === 'dark'
                ? '0 4px 20px rgba(0,0,0,0.3)'
                : '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Activities
              </Typography>
              <Button 
                variant="contained" 
                size="small" 
                startIcon={<AddIcon />}
                onClick={() => setOpenActivityDialog(true)}
              >
                Add Activity
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Customize the activities available for tracking
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {settings.customActivities.map(activity => (
                <Chip
                  key={activity}
                  label={activity}
                  onDelete={() => handleDeleteActivity(activity)}
                  deleteIcon={<DeleteIcon />}
                  sx={{ m: 0.5 }}
                />
              ))}
              
              {settings.customActivities.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No custom activities yet. Add some to get started.
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Add Tag Dialog */}
      <Dialog 
        open={openTagDialog} 
        onClose={() => setOpenTagDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: theme => theme.palette.mode === 'dark' ? '#2d2d3a' : undefined
          }
        }}
      >
        <DialogTitle sx={{ 
          color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : undefined 
        }}>
          Add New Mood Tag
        </DialogTitle>
        <DialogContent sx={{ 
          bgcolor: theme => theme.palette.mode === 'dark' ? '#2d2d3a' : undefined 
        }}>
          <TextField
            autoFocus
            margin="dense"
            label="Tag Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newTag}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
            sx={{
              '& .MuiInputBase-input': {
                color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : undefined
              },
              '& .MuiOutlinedInput-root': {
                color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : undefined,
                '& fieldset': {
                  borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : undefined
                },
                '&:hover fieldset': {
                  borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : undefined
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme => theme.palette.mode === 'dark' ? '#e91e63' : undefined
                }
              },
              '& .MuiInputLabel-root': {
                color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ 
          bgcolor: theme => theme.palette.mode === 'dark' ? '#2d2d3a' : undefined 
        }}>
          <Button 
            onClick={() => setOpenTagDialog(false)}
            sx={{ 
              color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined 
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddTag} 
            variant="contained"
            sx={{ 
              bgcolor: theme => theme.palette.mode === 'dark' ? '#e91e63' : undefined,
              '&:hover': {
                bgcolor: theme => theme.palette.mode === 'dark' ? '#d81b60' : undefined
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog 
        open={openActivityDialog} 
        onClose={() => setOpenActivityDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: theme => theme.palette.mode === 'dark' ? '#2d2d3a' : undefined
          }
        }}
      >
        <DialogTitle sx={{ 
          color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : undefined 
        }}>
          Add New Activity
        </DialogTitle>
        <DialogContent sx={{ 
          bgcolor: theme => theme.palette.mode === 'dark' ? '#2d2d3a' : undefined 
        }}>
          <TextField
            autoFocus
            margin="dense"
            label="Activity Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newActivity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewActivity(e.target.value)}
            sx={{
              '& .MuiInputBase-input': {
                color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : undefined
              },
              '& .MuiOutlinedInput-root': {
                color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : undefined,
                '& fieldset': {
                  borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : undefined
                },
                '&:hover fieldset': {
                  borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : undefined
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme => theme.palette.mode === 'dark' ? '#e91e63' : undefined
                }
              },
              '& .MuiInputLabel-root': {
                color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ 
          bgcolor: theme => theme.palette.mode === 'dark' ? '#2d2d3a' : undefined 
        }}>
          <Button 
            onClick={() => setOpenActivityDialog(false)}
            sx={{ 
              color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined 
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddActivity} 
            variant="contained"
            sx={{ 
              bgcolor: theme => theme.palette.mode === 'dark' ? '#e91e63' : undefined,
              '&:hover': {
                bgcolor: theme => theme.palette.mode === 'dark' ? '#d81b60' : undefined
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear All Data Confirmation Dialog */}
      <Dialog
        open={openClearDataDialog}
        onClose={() => setOpenClearDataDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: theme => theme.palette.mode === 'dark' ? '#2d2d3a' : undefined
          }
        }}
      >
        <DialogTitle sx={{ 
          color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : undefined 
        }}>
          Clear All Data
        </DialogTitle>
        <DialogContent sx={{ 
          bgcolor: theme => theme.palette.mode === 'dark' ? '#2d2d3a' : undefined 
        }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All your mood entries and activity data will be permanently deleted.
          </Alert>
          <Typography variant="body1">
            Are you sure you want to clear all your data?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          bgcolor: theme => theme.palette.mode === 'dark' ? '#2d2d3a' : undefined 
        }}>
          <Button 
            onClick={() => setOpenClearDataDialog(false)}
            sx={{ 
              color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined 
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClearAllData} 
            variant="contained"
            color="error"
          >
            Clear All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsView;
