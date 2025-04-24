import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, useTheme, useMediaQuery, Card, CardContent, CircularProgress } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Favorite as FavoriteIcon,
  LocalActivity as ActivityIcon,
  Cloud as CloudIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { MoodEntry, MoodLevel, ActivityLog } from '../../types';
import { subDays, parseISO, isWithinInterval } from 'date-fns';



const InsightsView: React.FC = () => {
  const { moodEntries, activities, isLoading } = useAppContext();
  const theme = useTheme();
  // Mobile responsiveness will be used in future updates
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [insights, setInsights] = useState<{
    commonMood?: { level: MoodLevel; count: number };
    moodTrend7Days?: 'up' | 'down' | 'stable';
    moodTrend30Days?: 'up' | 'down' | 'stable';
    avgMood7Days?: number;
    avgMood30Days?: number;
    consistentActivity?: { name: string; count: number };
    wordCloudData?: Array<{ text: string; value: number }>;
  }>({});
  
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
  
  useEffect(() => {
    if (moodEntries.length === 0) return;
    
    // Calculate most common mood
    const moodCounts: Record<number, number> = {};
    moodEntries.forEach(entry => {
      moodCounts[entry.moodLevel] = (moodCounts[entry.moodLevel] || 0) + 1;
    });
    
    const commonMoodLevel = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0];
    
    // Calculate mood trends
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);
    const thirtyDaysAgo = subDays(today, 30);
    
    const last7DaysEntries = moodEntries.filter(entry => 
      isWithinInterval(parseISO(entry.date), { start: sevenDaysAgo, end: today })
    );
    
    const last30DaysEntries = moodEntries.filter(entry => 
      isWithinInterval(parseISO(entry.date), { start: thirtyDaysAgo, end: today })
    );
    
    // Calculate average mood for last 7 days
    const avgMood7Days = last7DaysEntries.length > 0 
      ? last7DaysEntries.reduce((sum, entry) => sum + entry.moodLevel, 0) / last7DaysEntries.length 
      : 0;
    
    // Calculate average mood for last 30 days
    const avgMood30Days = last30DaysEntries.length > 0 
      ? last30DaysEntries.reduce((sum, entry) => sum + entry.moodLevel, 0) / last30DaysEntries.length 
      : 0;
    
    // Determine mood trend for last 7 days
    const moodTrend7Days = determineMoodTrend(last7DaysEntries);
    
    // Determine mood trend for last 30 days
    const moodTrend30Days = determineMoodTrend(last30DaysEntries);
    
    // Find most consistent activity
    const activityCounts: Record<string, number> = {};
    activities.forEach((log: ActivityLog) => {
      if (log.completed) {
        activityCounts[log.name] = (activityCounts[log.name] || 0) + 1;
      }
    });
    
    let consistentActivity;
    if (Object.keys(activityCounts).length > 0) {
      const mostConsistentActivity = Object.entries(activityCounts)
        .sort((a, b) => b[1] - a[1])[0];
      consistentActivity = {
        name: mostConsistentActivity[0],
        count: mostConsistentActivity[1]
      };
    }
    
    // Generate word cloud data
    const wordCloudData = generateWordCloudData(moodEntries);
    
    setInsights({
      commonMood: {
        level: parseInt(commonMoodLevel[0]) as MoodLevel,
        count: commonMoodLevel[1]
      },
      moodTrend7Days,
      moodTrend30Days,
      avgMood7Days,
      avgMood30Days,
      consistentActivity,
      wordCloudData
    });
  }, [moodEntries, activities]);
  
  // Helper function to determine mood trend
  const determineMoodTrend = (entries: MoodEntry[]): 'up' | 'down' | 'stable' => {
    if (entries.length < 2) return 'stable';
    
    // Sort entries by date (oldest first)
    const sortedEntries = [...entries].sort((a, b) => 
      parseISO(a.date).getTime() - parseISO(b.date).getTime()
    );
    
    // Split entries into first half and second half
    const midpoint = Math.floor(sortedEntries.length / 2);
    const firstHalf = sortedEntries.slice(0, midpoint);
    const secondHalf = sortedEntries.slice(midpoint);
    
    // Calculate average mood for each half
    const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.moodLevel, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.moodLevel, 0) / secondHalf.length;
    
    // Determine trend
    const difference = secondHalfAvg - firstHalfAvg;
    if (difference > 0.5) return 'up';
    if (difference < -0.5) return 'down';
    return 'stable';
  };
  
  // Helper function to generate word cloud data
  const generateWordCloudData = (entries: MoodEntry[]) => {
    const wordCounts: Record<string, number> = {};
    
    entries.forEach(entry => {
      // Process journal notes
      const journalText = entry.journalNote || entry.note || '';
      if (journalText) {
        const words = journalText
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(word => word.length > 3 && !['this', 'that', 'with', 'from', 'have', 'were', 'they', 'their'].includes(word));
        
        words.forEach(word => {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
      }
      
      // Process mood tags
      const tags = entry.moodTags || entry.tags || [];
      tags.forEach(tag => {
        wordCounts[tag] = (wordCounts[tag] || 0) + 3; // Give tags higher weight
      });
    });
    
    // Convert to format needed for word cloud
    return Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20) // Take top 20 words
      .map(([text, value]) => ({ text, value }));
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
          Mood Matrix Insights
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover patterns in your mood and activities
        </Typography>
      </Box>
      
      {moodEntries.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
            boxShadow: theme => theme.palette.mode === 'dark' 
              ? '8px 8px 16px #252532, -8px -8px 16px #353546'
              : '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff'
          }}
        >
          <Typography variant="h6" gutterBottom>
            No data available yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start tracking your mood and activities to see insights here.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: { xs: 2, sm: 3 } }}>
          {/* Most Common Mood */}
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }, mb: { xs: 0, sm: 0 } }}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                borderRadius: 2,
                bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: theme => theme.palette.mode === 'dark' 
                  ? '8px 8px 16px #252532, -8px -8px 16px #353546'
                  : '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff'
              }}
            >
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <FavoriteIcon sx={{ mr: 1, color: insights.commonMood ? moodColors[insights.commonMood.level] : 'inherit' }} />
                  Most Common Mood
                </Typography>
                
                {insights.commonMood && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h2" sx={{ mb: 1 }}>
                        {moodEmojis[insights.commonMood.level]}
                      </Typography>
                      <Typography variant="h6" sx={{ color: moodColors[insights.commonMood.level] }}>
                        {moodDescriptions[insights.commonMood.level]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {insights.commonMood.count} entries
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
          
          {/* Mood Trends */}
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }, mb: { xs: 0, sm: 0 } }}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                borderRadius: 2,
                bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: theme => theme.palette.mode === 'dark' 
                  ? '8px 8px 16px #252532, -8px -8px 16px #353546'
                  : '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mood Trends
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">Last 7 Days</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {insights.moodTrend7Days === 'up' && (
                        <TrendingUpIcon sx={{ color: '#4caf50', mr: 0.5 }} fontSize="small" />
                      )}
                      {insights.moodTrend7Days === 'down' && (
                        <TrendingDownIcon sx={{ color: '#f44336', mr: 0.5 }} fontSize="small" />
                      )}
                      {insights.moodTrend7Days === 'stable' && (
                        <TrendingFlatIcon sx={{ color: '#ff9800', mr: 0.5 }} fontSize="small" />
                      )}
                      <Typography variant="body2">
                        {insights.moodTrend7Days === 'up' ? 'Improving' : 
                         insights.moodTrend7Days === 'down' ? 'Declining' : 'Stable'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      height: 8, 
                      bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', 
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{ 
                        height: '100%', 
                        width: `${(insights.avgMood7Days || 0) * 20}%`, 
                        bgcolor: insights.moodTrend7Days === 'up' ? '#4caf50' : 
                                insights.moodTrend7Days === 'down' ? '#f44336' : '#ff9800',
                        borderRadius: 4
                      }} 
                    />
                  </Box>
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">Last 30 Days</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {insights.moodTrend30Days === 'up' && (
                        <TrendingUpIcon sx={{ color: '#4caf50', mr: 0.5 }} fontSize="small" />
                      )}
                      {insights.moodTrend30Days === 'down' && (
                        <TrendingDownIcon sx={{ color: '#f44336', mr: 0.5 }} fontSize="small" />
                      )}
                      {insights.moodTrend30Days === 'stable' && (
                        <TrendingFlatIcon sx={{ color: '#ff9800', mr: 0.5 }} fontSize="small" />
                      )}
                      <Typography variant="body2">
                        {insights.moodTrend30Days === 'up' ? 'Improving' : 
                         insights.moodTrend30Days === 'down' ? 'Declining' : 'Stable'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      height: 8, 
                      bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', 
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{ 
                        height: '100%', 
                        width: `${(insights.avgMood30Days || 0) * 20}%`, 
                        bgcolor: insights.moodTrend30Days === 'up' ? '#4caf50' : 
                                insights.moodTrend30Days === 'down' ? '#f44336' : '#ff9800',
                        borderRadius: 4
                      }} 
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          {/* Most Consistent Activity */}
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }, mb: { xs: 0, sm: 0 } }}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                borderRadius: 2,
                bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: theme => theme.palette.mode === 'dark' 
                  ? '8px 8px 16px #252532, -8px -8px 16px #353546'
                  : '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff'
              }}
            >
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <ActivityIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                  Most Consistent Activity
                </Typography>
                
                {insights.consistentActivity ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ mb: 1 }}>
                        {insights.consistentActivity.name}
                      </Typography>
                      <Typography variant="body1">
                        Completed {insights.consistentActivity.count} times
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      No activity data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
          
          {/* Word Cloud */}
          <Box sx={{ width: '100%' }}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 2,
                bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: theme => theme.palette.mode === 'dark' 
                  ? '8px 8px 16px #252532, -8px -8px 16px #353546'
                  : '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CloudIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Word Cloud
                </Typography>
                
                {insights.wordCloudData && insights.wordCloudData.length > 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center',
                    p: 2
                  }}>
                    {insights.wordCloudData.map((word, index) => (
                      <Typography 
                        key={word.text} 
                        variant="body1" 
                        component="span"
                        sx={{ 
                          m: 1,
                          fontSize: `${Math.max(0.8, Math.min(2.5, 0.8 + (word.value / 5)))}rem`,
                          fontWeight: word.value > 3 ? 'bold' : 'normal',
                          color: index % 5 === 0 ? moodColors[1] :
                                 index % 5 === 1 ? moodColors[2] :
                                 index % 5 === 2 ? moodColors[3] :
                                 index % 5 === 3 ? moodColors[4] :
                                 moodColors[5],
                          opacity: 0.7 + (word.value / 10),
                          textShadow: '1px 1px 1px rgba(0,0,0,0.1)',
                          transform: `rotate(${Math.random() * 10 - 5}deg)`,
                          display: 'inline-block'
                        }}
                      >
                        {word.text}
                      </Typography>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Not enough journal entries to generate a word cloud
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InsightsView;
