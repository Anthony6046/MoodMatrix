import React from 'react';
import { 
  Box, 
  Typography, 
  Card,
  CardContent,
  CardActionArea,
  Chip,
  useTheme
} from '@mui/material';


import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ThemeOption, AppTheme } from '../../types';
import { useAppContext } from '../../context/AppContext';

// Define available themes
export const appThemes: ThemeOption[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'The original Mood Matrix theme',
    isPremium: false,
    primaryColor: '#9c27b0',
    secondaryColor: '#e91e63',
    backgroundColor: '#f5f5f5',
    cardColor: '#ffffff',
    accentColor: '#ba68c8'
  },
  {
    id: 'calmPastels',
    name: 'Calm Pastels',
    description: 'Soft, soothing pastel colors',
    isPremium: false,
    primaryColor: '#9575cd',
    secondaryColor: '#f48fb1',
    backgroundColor: '#f3e5f5',
    cardColor: '#ffffff',
    accentColor: '#ce93d8'
  },
  {
    id: 'deepForest',
    name: 'Deep Forest',
    description: 'Rich, earthy forest tones',
    isPremium: false,
    primaryColor: '#2e7d32',
    secondaryColor: '#8d6e63',
    backgroundColor: '#e8f5e9',
    cardColor: '#ffffff',
    accentColor: '#81c784'
  },
  {
    id: 'sunsetGlow',
    name: 'Sunset Glow',
    description: 'Warm sunset-inspired colors',
    isPremium: true,
    primaryColor: '#ff9800',
    secondaryColor: '#ff5722',
    backgroundColor: '#fff3e0',
    cardColor: '#ffffff',
    accentColor: '#ffb74d'
  },
  {
    id: 'minimalMono',
    name: 'Minimal Mono',
    description: 'Clean monochromatic design',
    isPremium: true,
    primaryColor: '#424242',
    secondaryColor: '#757575',
    backgroundColor: '#f5f5f5',
    cardColor: '#ffffff',
    accentColor: '#9e9e9e'
  },
  {
    id: 'oceanBlue',
    name: 'Ocean Blue',
    description: 'Calming ocean-inspired blues',
    isPremium: false,
    primaryColor: '#0277bd',
    secondaryColor: '#00acc1',
    backgroundColor: '#e1f5fe',
    cardColor: '#ffffff',
    accentColor: '#4fc3f7'
  }
];

interface ThemeSelectorProps {
  onThemeChange: (themeId: AppTheme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeChange }) => {
  const { settings } = useAppContext();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const handleThemeSelect = (themeId: AppTheme) => {
    // Find the theme
    const selectedTheme = appThemes.find(theme => theme.id === themeId);
    
    // Check if it's premium and user doesn't have premium
    if (selectedTheme?.isPremium && !settings.isPremium) {
      // Show premium upgrade message or dialog
      alert('This is a premium theme. Upgrade to premium to unlock it!');
      return;
    }
    
    // Apply the theme
    onThemeChange(themeId);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        App Theme
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose a theme to personalize your Mood Matrix experience
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {appThemes.map(appTheme => {
          const isSelected = settings.appTheme === appTheme.id;
          const isPremiumLocked = appTheme.isPremium && !settings.isPremium;
          
          return (
            <Box key={appTheme.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)' } }}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2,
                  position: 'relative',
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                  boxShadow: theme => theme.palette.mode === 'dark' 
                    ? '5px 5px 10px #252532, -5px -5px 10px #353546'
                    : '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff',
                  border: isSelected ? `2px solid ${isDarkMode ? appTheme.secondaryColor : appTheme.primaryColor}` : 'none',
                  opacity: isPremiumLocked ? 0.7 : 1,
                  overflow: 'visible'
                }}
              >
                {isSelected && (
                  <CheckCircleIcon 
                    sx={{ 
                      position: 'absolute', 
                      top: -10, 
                      right: -10, 
                      color: isDarkMode ? appTheme.secondaryColor : appTheme.primaryColor,
                      bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'white',
                      borderRadius: '50%',
                      zIndex: 1
                    }} 
                  />
                )}
                
                <CardActionArea 
                  onClick={() => handleThemeSelect(appTheme.id)}
                  disabled={isPremiumLocked}
                  sx={{ 
                    borderRadius: 2,
                    height: '100%'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {appTheme.name}
                      </Typography>
                      
                      {appTheme.isPremium && (
                        <Chip 
                          icon={<LockIcon fontSize="small" />} 
                          label="Premium" 
                          size="small"
                          color="secondary"
                          sx={{ 
                            bgcolor: settings.isPremium ? 'rgba(233, 30, 99, 0.1)' : undefined,
                            '.MuiChip-icon': {
                              color: 'inherit'
                            }
                          }}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {appTheme.description}
                    </Typography>
                    
                    {/* Color preview */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Box 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          bgcolor: appTheme.primaryColor,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Box 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          bgcolor: appTheme.secondaryColor,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Box 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          bgcolor: appTheme.accentColor,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }} 
                      />
                    </Box>
                    
                    {/* Theme preview */}
                    <Box 
                      sx={{ 
                        height: 60, 
                        borderRadius: 1,
                        bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : appTheme.backgroundColor,
                        p: 1,
                        display: 'flex',
                        gap: 1
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: '60%', 
                          height: '100%', 
                          borderRadius: 1,
                          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : appTheme.cardColor,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }} 
                      />
                      <Box 
                        sx={{ 
                          width: '40%', 
                          height: '100%', 
                          borderRadius: 1,
                          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : appTheme.cardColor,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }} 
                      />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ThemeSelector;
