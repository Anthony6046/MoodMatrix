import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  useMediaQuery, 
  useTheme,
  Divider,
  Tooltip,
  Badge,
  Fade,
  Zoom
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Home as HomeIcon, 
  CalendarMonth as CalendarIcon, 
  Book as JournalIcon, 
  CheckCircle as HabitsIcon, 
  CardGiftcard as MoodCardIcon, 
  Settings as SettingsIcon,
  Insights as InsightsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // Will be used for responsive layout adjustments in future updates
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  // Always keep navigation expanded for better mobile experience
  const navCollapsed = false;
  // Menu toggle state for future feature expansion
  // const [menuOpen, setMenuOpen] = useState(true);
  const location = useLocation();
  const { settings, updateSettings } = useAppContext();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Removed collapsible navigation functionality for better mobile experience

  // Will be used for collapsible menu sections in future updates
  // const handleMenuToggle = () => {
  //   setMenuOpen(!menuOpen);
  // };

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
    { text: 'Mood History', icon: <CalendarIcon />, path: '/history' },
    { text: 'Journal', icon: <JournalIcon />, path: '/journal' },
    { text: 'Habits', icon: <HabitsIcon />, path: '/habits' },
    { text: 'Mood Cards', icon: <MoodCardIcon />, path: '/mood-cards' },
    { text: 'Insights', icon: <InsightsIcon />, path: '/insights' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <div>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: navCollapsed ? 'center' : 'space-between',
        p: 1,
        background: theme => theme.palette.mode === 'dark' 
          ? 'linear-gradient(45deg, #2d2d3a 0%, #353546 100%)' 
          : 'linear-gradient(45deg, #f5f5f5 0%, #ffffff 100%)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        mb: 1
      }}>
        {!navCollapsed && (
          <Zoom in={!navCollapsed} timeout={300}>
            <Typography variant="h6" noWrap component="div" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #ba68c8 30%, #f48fb1 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              ml: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box
                component="img"
                src="/logo-m2-large.svg"
                alt="Mood Matrix Logo"
                className="App-logo"
                sx={{ 
                  width: 40, 
                  height: 40,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  mr: 1,
                  animation: 'App-logo-spin infinite 8s linear',
                  '@keyframes App-logo-spin': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' }
                  }
                }}
              />
              Mood Matrix
            </Typography>
          </Zoom>
        )}
        {/* Removed collapsible button for better mobile experience */}
      </Box>
      <Divider sx={{ mb: 1 }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={navCollapsed ? item.text : ''} placement="right" arrow>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: navCollapsed ? 'center' : 'initial',
                  px: 2.5,
                  borderRadius: '8px',
                  mx: 1,
                  my: 0.5,
                  background: location.pathname === item.path ? 
                    (theme.palette.mode === 'dark' ? 'rgba(233, 30, 99, 0.15)' : 'rgba(156, 39, 176, 0.1)') : 
                    'transparent',
                  '&:hover': {
                    background: theme.palette.mode === 'dark' ? 'rgba(233, 30, 99, 0.1)' : 'rgba(156, 39, 176, 0.05)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': location.pathname === item.path ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '60%',
                    background: 'linear-gradient(45deg, #9c27b0 30%, #e91e63 90%)',
                    borderRadius: '0 4px 4px 0',
                  } : {}
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: navCollapsed ? 'auto' : 3,
                    justifyContent: 'center',
                    color: location.pathname === item.path ? 
                      (theme.palette.mode === 'dark' ? '#e91e63' : '#9c27b0') : 
                      (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'),
                    transition: 'all 0.2s ease-in-out',
                    transform: location.pathname === item.path ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!navCollapsed && (
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      opacity: navCollapsed ? 0 : 1,
                      color: location.pathname === item.path ? 
                        (theme.palette.mode === 'dark' ? '#e91e63' : '#9c27b0') : 
                        (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'),
                      '& .MuiTypography-root': {
                        fontWeight: location.pathname === item.path ? 600 : 400,
                        transition: 'all 0.2s ease-in-out'
                      }
                    }} 
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      {!navCollapsed && (
        <Box sx={{ mt: 'auto', p: 2 }}>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
            Mood Matrix v1.0
          </Typography>
        </Box>
      )}
    </div>
  );

  // Toggle theme handler
  const handleThemeToggle = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
  };

  // Get current date for header
  const [currentDate, setCurrentDate] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: `${drawerWidth}px` },
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          background: theme => theme.palette.mode === 'dark' 
            ? 'linear-gradient(to right, #1e1e2f, #2d2d3a)' 
            : 'linear-gradient(to right, #ffffff, #f8f9ff)',
          borderBottom: '1px solid',
          borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure AppBar is above drawer on mobile
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: { xs: 64, sm: 70 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { md: 'none' }, color: theme => theme.palette.mode === 'dark' ? '#e91e63' : '#9c27b0' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              noWrap 
              component="div"
              sx={{ 
                color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ba68c8 30%, #f48fb1 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              <Box
                component="img"
                src="/logo-m2-large.svg"
                alt="Mood Matrix Logo"
                sx={{ 
                  width: { xs: 30, sm: 35 }, 
                  height: { xs: 30, sm: 35 },
                  mr: 1,
                  display: { xs: 'inline-flex', md: 'none' }
                }}
              />
              Mood Matrix
            </Typography>
            <Fade in={true} timeout={1000}>
              <Typography 
                variant="body2" 
                sx={{ 
                  ml: 2, 
                  display: { xs: 'none', sm: 'block' },
                  color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                  fontStyle: 'italic'
                }}
              >
                {formattedDate}
              </Typography>
            </Fade>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton 
                onClick={handleThemeToggle} 
                sx={{ 
                  color: theme => theme.palette.mode === 'dark' ? '#e91e63' : '#9c27b0',
                  '&:hover': {
                    background: theme => theme.palette.mode === 'dark' ? 'rgba(233, 30, 99, 0.1)' : 'rgba(156, 39, 176, 0.1)'
                  }
                }}
              >
                {settings.theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={settings.reminderTime ? "Notifications On" : "Notifications Off"}>
              <IconButton 
                component={Link}
                to="/settings"
                sx={{ 
                  color: theme => theme.palette.mode === 'dark' ? '#e91e63' : '#9c27b0',
                  '&:hover': {
                    background: theme => theme.palette.mode === 'dark' ? 'rgba(233, 30, 99, 0.1)' : 'rgba(156, 39, 176, 0.1)'
                  }
                }}
              >
                <Badge badgeContent={0} color="secondary">
                  {settings.reminderTime ? <NotificationsIcon /> : <NotificationsOffIcon />}
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          width: { 
            xs: 0,
            md: drawerWidth 
          }, 
          flexShrink: { md: 0 },
          transition: 'width 0.3s'
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: settings.theme === 'dark' ? '#2d2d3a' : '#fff',
              color: settings.theme === 'dark' ? '#fff' : 'inherit',
              borderRight: 'none',
              boxShadow: settings.theme === 'dark' 
                ? '4px 0 8px rgba(0, 0, 0, 0.2)'
                : '4px 0 8px rgba(0, 0, 0, 0.05)',
              overflowX: 'hidden',
              transition: 'width 0.3s'
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          px: { xs: 2, sm: 3 }, // Reduced left/right padding on mobile
          pt: { xs: 5, sm: 6 }, // Increased top padding to prevent title overlap
          pb: { xs: 3, sm: 5 }, // Reduced bottom padding on mobile
          width: { 
            xs: '100%',
            sm: `calc(100% - ${drawerWidth}px)` 
          },
          bgcolor: settings.theme === 'dark' ? '#2d2d3a' : '#f8f9ff',
          color: settings.theme === 'dark' ? '#fff' : 'inherit',
          minHeight: '100vh',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Add extra spacing to prevent title overlap */}
        <Toolbar sx={{ mb: 4 }} />
        <Box sx={{ pt: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
