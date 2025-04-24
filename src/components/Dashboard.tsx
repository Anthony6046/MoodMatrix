import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import MoodInput from './mood/MoodInput';
import ActivityTracker from './habits/ActivityTracker';
import { useAppContext } from '../context/AppContext';

const Dashboard: React.FC = React.memo(() => {
  const { todaysMood, isLoading } = useAppContext();
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

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
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          color: theme => theme.palette.mode === 'dark' ? '#e91e63' : '#9c27b0'
        }}>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ 
          color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
        }}>
          {today}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, sm: 3 } }}>
        {/* Mood Input Section */}
        <Box sx={{ flex: { md: 2 } }}>
          <MoodInput existingMood={todaysMood || undefined} />
        </Box>

        {/* Activity Tracker Section */}
        <Box sx={{ flex: { md: 1 } }}>
          <ActivityTracker />
        </Box>
      </Box>

      {/* Quick Stats Section */}
      <Box sx={{ mt: 3 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 16,
              mt: 2,
              background: theme => theme.palette.mode === 'dark' 
                ? 'linear-gradient(145deg, #353546 0%, #2d2d3a 100%)' 
                : 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
              boxShadow: theme => theme.palette.mode === 'dark' 
                ? '8px 8px 16px #252532, -8px -8px 16px #353546'
                : '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ 
              color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)'
            }}>
              Your Mood Insights
            </Typography>
            <Typography variant="body1" sx={{ 
              mb: 2,
              color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
            }}>
              Track your mood patterns and see how your activities affect your wellbeing.
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Box sx={{ 
                flex: 1, 
                textAlign: 'center', 
                p: 2, 
                borderRadius: 12,
                bgcolor: theme => theme.palette.mode === 'dark' ? '#353546' : '#ffffff',
                boxShadow: theme => theme.palette.mode === 'dark' 
                  ? '5px 5px 10px #252532, -5px -5px 10px #353546'
                  : '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff'
              }}>
                <Typography variant="h5" sx={{ color: '#e91e63' }}>
                  {todaysMood ? '✓' : '–'}
                </Typography>
                <Typography variant="body2">
                  Today's Mood Logged
                </Typography>
              </Box>
              
              <Box sx={{ 
                flex: 1, 
                textAlign: 'center', 
                p: 2, 
                borderRadius: 12,
                bgcolor: theme => theme.palette.mode === 'dark' ? '#353546' : '#ffffff',
                boxShadow: theme => theme.palette.mode === 'dark' 
                  ? '5px 5px 10px #252532, -5px -5px 10px #353546'
                  : '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff'
              }}>
                <Typography variant="h5" sx={{ color: '#e91e63' }}>
                  0
                </Typography>
                <Typography variant="body2">
                  Week Streak
                </Typography>
              </Box>
              
              <Box sx={{ 
                flex: 1, 
                textAlign: 'center', 
                p: 2, 
                borderRadius: 12,
                bgcolor: theme => theme.palette.mode === 'dark' ? '#353546' : '#ffffff',
                boxShadow: theme => theme.palette.mode === 'dark' 
                  ? '5px 5px 10px #252532, -5px -5px 10px #353546'
                  : '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff'
              }}>
                <Typography variant="h5" sx={{ color: '#e91e63' }}>
                  –
                </Typography>
                <Typography variant="body2">
                  Most Common Mood
                </Typography>
              </Box>
            </Box>
          </Paper>
      </Box>
    </Box>
  );
});

export default Dashboard;
