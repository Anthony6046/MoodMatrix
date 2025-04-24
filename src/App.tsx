import React, { useMemo, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import DarkModeStyles from './components/common/DarkModeStyles';
import ResponsiveStyles from './components/common/ResponsiveStyles';
import Notification from './components/common/Notification';
import PageTransition from './components/common/PageTransition';
import './App.css';
import { useAppContext } from './context/AppContext';
import { hideSplashScreen, setStatusBarStyleDark, setStatusBarStyleLight, isNativePlatform } from './capacitor';


// Lazy load components for better performance
const Dashboard = lazy(() => import('./components/Dashboard'));
const MoodHistory = lazy(() => import('./components/mood/MoodHistory'));
const JournalView = lazy(() => import('./components/journal/JournalView'));
const HabitsView = lazy(() => import('./components/habits/HabitsView'));
const MoodCardView = lazy(() => import('./components/moodcard/MoodCardView'));
const SettingsView = lazy(() => import('./components/settings/SettingsView'));
const InsightsView = lazy(() => import('./components/insights/InsightsView'));

// Loading component for suspense fallback
const LoadingFallback = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(45, 45, 58, 0.7)' : 'rgba(248, 249, 255, 0.7)',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}
  >
    <CircularProgress color="secondary" />
  </Box>
);

// Wrapper component to access context
const AppWithTheme = () => {
  const { settings, notification, hideNotification } = useAppContext();
  
  // Initialize Capacitor plugins
  useEffect(() => {
    if (isNativePlatform()) {
      // Hide splash screen after a short delay
      setTimeout(() => {
        hideSplashScreen();
      }, 1000);
      
      // Set status bar style based on theme
      if (settings.theme === 'dark') {
        setStatusBarStyleDark();
      } else {
        setStatusBarStyleLight();
      }
    }
  }, [settings.theme]);
  
  // Create theme based on user settings
  const theme = useMemo(() => createTheme({
    palette: {
      mode: settings.theme,
      primary: {
        main: settings.theme === 'dark' ? '#e91e63' : '#9c27b0', // Pink in dark mode, Purple in light mode
        light: settings.theme === 'dark' ? '#f48fb1' : '#ba68c8',
        dark: settings.theme === 'dark' ? '#c2185b' : '#7b1fa2',
      },
      secondary: {
        main: settings.theme === 'dark' ? '#9c27b0' : '#e91e63', // Purple in dark mode, Pink in light mode
        light: settings.theme === 'dark' ? '#ba68c8' : '#f48fb1',
        dark: settings.theme === 'dark' ? '#7b1fa2' : '#c2185b',
      },
      text: {
        primary: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
        secondary: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      },
      background: {
        default: settings.theme === 'dark' ? '#1e1e2f' : '#f5f5f5',
        paper: settings.theme === 'dark' ? '#2d2d3a' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff',
            '&:hover': {
              boxShadow: 'inset 5px 5px 10px #e6e6e6, inset -5px -5px 10px #ffffff',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: '#f8f9ff',
              '&.Mui-focused': {
                boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.1)',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: '2px 2px 4px #e6e6e6, -2px -2px 4px #ffffff',
          },
        },
      },
    },
  }), [settings.theme]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DarkModeStyles />
      <ResponsiveStyles />
      {notification && (
        <Notification
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={hideNotification}
        />
      )}
      <Router>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
            <Route path="/" element={
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <PageTransition><Dashboard /></PageTransition>
                </Suspense>
              </ErrorBoundary>
            } />
            <Route path="/history" element={
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <PageTransition><MoodHistory /></PageTransition>
                </Suspense>
              </ErrorBoundary>
            } />
            <Route path="/journal" element={
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <PageTransition><JournalView /></PageTransition>
                </Suspense>
              </ErrorBoundary>
            } />
            <Route path="/habits" element={
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <PageTransition><HabitsView /></PageTransition>
                </Suspense>
              </ErrorBoundary>
            } />
            <Route path="/mood-cards" element={
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <PageTransition><MoodCardView /></PageTransition>
                </Suspense>
              </ErrorBoundary>
            } />
            <Route path="/insights" element={
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <PageTransition><InsightsView /></PageTransition>
                </Suspense>
              </ErrorBoundary>
            } />
            <Route path="/settings" element={
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <PageTransition><SettingsView /></PageTransition>
                </Suspense>
              </ErrorBoundary>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </AnimatePresence>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  // Base theme for initial render
  const theme = createTheme({
    palette: {
      primary: {
        main: '#9c27b0', // Purple
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
      secondary: {
        main: '#e91e63', // Dark pink
        light: '#f48fb1',
        dark: '#c2185b',
      },
      background: {
        default: '#f8f9ff',
        paper: '#ffffff',
      },
      text: {
        primary: '#424242',
        secondary: '#757575',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff',
            '&:hover': {
              boxShadow: 'inset 5px 5px 10px #e6e6e6, inset -5px -5px 10px #ffffff',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: '#f8f9ff',
              '&.Mui-focused': {
                boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.1)',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: '2px 2px 4px #e6e6e6, -2px -2px 4px #ffffff',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AppWithTheme />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
