import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
  useTheme,
  IconButton,
  Avatar,
  Tab,
  Tabs,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel
} from '@mui/material';
import EmojiPicker, { EmojiClickData, Theme as EmojiTheme } from 'emoji-picker-react';
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  FormatQuote as QuoteIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Delete as DeleteIcon,
  Wallpaper as WallpaperIcon,
  AccountCircle as ProfileIcon,
  PhotoCamera as PhotoCameraIcon,
  PhotoLibrary as PhotoLibraryIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useAppContext } from '../../context/AppContext';
import { MoodEntry, MoodLevel } from '../../types';
import html2canvas from 'html2canvas';

// Emoji mapping for mood levels
const moodEmojis = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄'
};

// Sample mood entries to ensure there's always something to select
const sampleMoodEntries: MoodEntry[] = [
  {
    id: 'sample-1',
    date: new Date().toISOString(),
    moodLevel: 5 as MoodLevel,
    moodTags: ['Happy', 'Excited', 'Energetic'],
    journalNote: 'Today was an amazing day! I accomplished all my goals and felt really productive.',
    reflectionPrompt: 'What made you feel happy today?',
    reflectionResponse: 'I felt happy because I was able to spend time with friends and make progress on my personal projects.',
    activities: ['Exercise', 'Reading', 'Social']
  },
  {
    id: 'sample-2',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    moodLevel: 3 as MoodLevel,
    moodTags: ['Neutral', 'Calm'],
    journalNote: 'A typical day with some ups and downs. Nothing special happened.',
    reflectionPrompt: 'What could have made your day better?',
    reflectionResponse: 'I could have taken more breaks and practiced mindfulness to appreciate the small moments.',
    activities: ['Work', 'Meditation']
  },
  {
    id: 'sample-3',
    date: new Date(Date.now() - 172800000).toISOString(), // Day before yesterday
    moodLevel: 4 as MoodLevel,
    moodTags: ['Content', 'Relaxed', 'Grateful'],
    journalNote: 'Had a relaxing day. Took some time for self-care and enjoyed a good book.',
    reflectionPrompt: 'What are you grateful for today?',
    reflectionResponse: 'I am grateful for the quiet moments and the opportunity to recharge.',
    activities: ['Reading', 'Self-care', 'Rest']
  }
];

// Colors for mood levels - will be used in future updates
// const moodColors = {
//   1: '#3f51b5', // Blue (sad)
//   2: '#7986cb', // Light blue (low)
//   3: '#9575cd', // Purple (neutral)
//   4: '#ff8a65', // Orange (good)
//   5: '#ff5722'  // Deep orange (great)
// };

// Card themes
const cardThemes = [
  { name: 'Classic', primary: '#5c6bc0', secondary: '#f5f5f5', text: '#333333' },
  { name: 'Calm', primary: '#4fc3f7', secondary: '#e1f5fe', text: '#01579b' },
  { name: 'Warm', primary: '#ff8a65', secondary: '#fff3e0', text: '#bf360c' },
  { name: 'Nature', primary: '#81c784', secondary: '#e8f5e9', text: '#2e7d32' },
  { name: 'Bold', primary: '#7e57c2', secondary: '#ede7f6', text: '#4527a0' }
];

// Card layouts
const cardLayouts = [
  { name: 'Minimal', showTags: false, showJournal: false, showReflection: false },
  { name: 'Standard', showTags: true, showJournal: false, showReflection: true },
  { name: 'Detailed', showTags: true, showJournal: true, showReflection: true }
];

// Maximum file size in bytes (1MB)
const MAX_FILE_SIZE = 1 * 1024 * 1024;

// Allowed image types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const MoodCardView: React.FC = () => {
  const { moodEntries, isLoading } = useAppContext();
  const theme = useTheme();
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [selectedTheme, setSelectedTheme] = useState(cardThemes[0]);
  const [selectedLayout, setSelectedLayout] = useState(cardLayouts[1]);
  const [customMessage, setCustomMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [customEmoji, setCustomEmoji] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Image upload states
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [useBackgroundImage, setUseBackgroundImage] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [imageDialogTab, setImageDialogTab] = useState(0); // 0 for profile, 1 for background
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  
  // Social media sharing states
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  
  // Refs for file inputs
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement>(null);
  
  // We don't need to create sample entries anymore since we have predefined samples
  // This comment is kept to maintain code structure
  
  // Combine real and sample entries, prioritizing real entries
  const availableEntries = moodEntries.length > 0 ? moodEntries : sampleMoodEntries;
  
  // Get the most recent entries for selection
  const recentEntries = [...availableEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
    
  // Set the first entry as selected if none is selected yet
  useEffect(() => {
    if (recentEntries.length > 0 && !selectedEntry) {
      setSelectedEntry(recentEntries[0]);
    }
  }, [recentEntries, selectedEntry]);
  
  const handleEntryChange = (event: SelectChangeEvent<string>) => {
    const entryId = event.target.value;
    const entry = moodEntries.find(e => e.id === entryId) || null;
    setSelectedEntry(entry);
  };
  
  const handleThemeChange = (event: SelectChangeEvent<string>) => {
    const themeName = event.target.value;
    const theme = cardThemes.find(t => t.name === themeName) || cardThemes[0];
    setSelectedTheme(theme);
  };
  
  const handleLayoutChange = (event: SelectChangeEvent<string>) => {
    const layoutName = event.target.value;
    const layout = cardLayouts.find(l => l.name === layoutName) || cardLayouts[0];
    setSelectedLayout(layout);
  };
  
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setCustomEmoji(emojiData.emoji);
    setShowEmojiPicker(false);
  };
  
  // Handle profile image upload
  const handleProfileImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setSnackbarMessage('Image too large. Maximum size is 1MB.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setSnackbarMessage('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    // Create a URL for the image
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result as string);
      setSnackbarMessage('Profile image uploaded successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle background image upload
  const handleBackgroundImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Capacitor camera integration
  const handleTakePicture = async () => {
    try {
      // Import dynamically to avoid issues with web version
      const { takePicture } = await import('../../capacitor');
      const imageUrl = await takePicture();
      
      if (imageUrl) {
        setBackgroundImage(imageUrl);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      setSnackbarMessage('Failed to take picture. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      // Import dynamically to avoid issues with web version
      const { selectPictureFromGallery } = await import('../../capacitor');
      const imageUrl = await selectPictureFromGallery();
      
      if (imageUrl) {
        setBackgroundImage(imageUrl);
      }
    } catch (error) {
      console.error('Error selecting picture:', error);
      setSnackbarMessage('Failed to select picture. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current || !selectedEntry) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `mood-card-${format(parseISO(selectedEntry.date), 'yyyy-MM-dd')}.png`;
      link.href = imgData;
      link.click();
    } catch (error) {
      console.error('Error downloading card:', error);
    } finally {
      setDownloading(false);
    }
  };
  
  // Handle sharing to social media
  const handleShare = async () => {
    if (!cardRef.current || !selectedEntry) return;
    
    try {
      const canvas = await html2canvas(cardRef.current);
      const imgData = canvas.toDataURL('image/png');
      setShareUrl(imgData);
      setOpenShareDialog(true);
    } catch (error) {
      console.error('Error preparing image for sharing:', error);
      setSnackbarMessage('Error preparing image for sharing');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Share to specific platforms
  const shareToSocialMedia = (platform: string) => {
    if (!shareUrl || !selectedEntry) return;
    
    const text = `My mood on ${format(parseISO(selectedEntry.date), 'MMMM d, yyyy')} was ${selectedEntry.moodLevel}/5 - Tracked with Mood Matrix`;
    const hashtags = 'moodtracking,mentalhealth,wellbeing';
    
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${hashtags}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
        break;
      case 'pinterest':
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(text)}`;
        break;
      default:
        // For platforms that don't have direct sharing APIs, we'll show instructions
        setSnackbarMessage(`To share on ${platform}, save the image and upload it manually.`);
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
        setOpenShareDialog(false);
        return;
    }
    
    // Open the share link in a new window
    window.open(shareLink, '_blank');
    setOpenShareDialog(false);
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
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          color: theme => theme.palette.mode === 'dark' ? '#e91e63' : '#9c27b0'
        }}>
          Mood Cards
        </Typography>
        <Typography variant="subtitle1" sx={{ 
          color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
        }}>
          Create shareable visual summaries of your mood entries
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 3 } }}>
        {/* Card Preview */}
        <Box sx={{ flex: { md: 2 } }}>
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
              mb: { xs: 2, md: 0 }
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ 
              color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)'
            }}>
              Card Preview
            </Typography>
            
            {selectedEntry ? (
              <Box 
                ref={cardRef} 
                sx={{ 
                  mt: 2, 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: theme => theme.palette.mode === 'dark' 
                    ? `${selectedTheme.primary}22` // Slightly transparent primary color in dark mode
                    : selectedTheme.secondary,
                  color: theme => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : selectedTheme.text,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  maxWidth: 500,
                  mx: 'auto',
                  border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  backgroundImage: useBackgroundImage && backgroundImage ? `url(${backgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Overlay for better text readability when using background image */}
                {useBackgroundImage && backgroundImage && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 0
                  }} />
                )}
                
                {/* Card Header */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2,
                  pb: 2,
                  borderBottom: `1px solid ${selectedTheme.primary}20`,
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Typography variant="h6" sx={{ color: selectedTheme.text }}>
                    Mood Matrix
                  </Typography>
                  <Typography variant="body2" sx={{ color: selectedTheme.text }}>
                    {format(parseISO(selectedEntry.date), 'MMMM d, yyyy')}
                  </Typography>
                </Box>
                
                {/* Mood Display */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {profileImage ? (
                    <Avatar 
                      src={profileImage} 
                      alt="Profile" 
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        mr: 2,
                        border: `2px solid ${selectedTheme.primary}`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }} 
                    />
                  ) : (
                    <Typography variant="h2" sx={{ mr: 2 }}>
                      {customEmoji || moodEmojis[selectedEntry.moodLevel as MoodLevel]}
                    </Typography>
                  )}
                  <Box>
                    <Typography variant="h5" sx={{ color: selectedTheme.text, fontWeight: 'medium' }}>
                      Mood Level: {selectedEntry.moodLevel}/5
                    </Typography>
                    {customMessage && (
                      <Typography variant="body1" sx={{ color: selectedTheme.text, mt: 1, fontStyle: 'italic' }}>
                        "{customMessage}"
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                {/* Tags */}
                {selectedLayout.showTags && selectedEntry.moodTags.length > 0 && (
                  <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: selectedTheme.text }}>
                      Mood Tags:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedEntry.moodTags.map(tag => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          sx={{ 
                            bgcolor: `${selectedTheme.primary}20`, 
                            color: selectedTheme.text,
                            borderColor: selectedTheme.primary
                          }} 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                
                {/* Journal Note */}
                {selectedLayout.showJournal && selectedEntry.journalNote && (
                  <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: selectedTheme.text }}>
                      Journal Note:
                    </Typography>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 1, 
                      bgcolor: `${selectedTheme.primary}10`,
                      borderLeft: `3px solid ${selectedTheme.primary}`
                    }}>
                      <Typography variant="body2" sx={{ 
                        color: selectedTheme.text,
                        whiteSpace: 'pre-wrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {selectedEntry.journalNote}
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                {/* Reflection */}
                {selectedLayout.showReflection && selectedEntry.reflectionPrompt && selectedEntry.reflectionResponse && (
                  <Box sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: selectedTheme.text }}>
                      Daily Reflection:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <QuoteIcon sx={{ color: selectedTheme.primary, mr: 1, fontSize: 20, mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" sx={{ 
                          color: selectedTheme.text, 
                          fontStyle: 'italic',
                          opacity: 0.7
                        }}>
                          {selectedEntry.reflectionPrompt}
                        </Typography>
                        <Typography variant="body2" sx={{ color: selectedTheme.text, mt: 1 }}>
                          {selectedEntry.reflectionResponse}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
                
                {/* Footer */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  pt: 2,
                  mt: 2,
                  borderTop: `1px solid ${selectedTheme.primary}20`
                }}>
                  <Typography variant="caption" sx={{ color: selectedTheme.text, opacity: 0.7 }}>
                    Generated with Mood Matrix
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ 
                  color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.6)',
                  mb: 1
                }}>
                  No Mood Entry Selected
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)'
                }}>
                  Select a mood entry to generate a card.
                </Typography>
              </Box>
            )}
            
            {selectedEntry && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                <Button 
                  variant="contained" 
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? 'Downloading...' : 'Download Card'}
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<ShareIcon />}
                  onClick={handleShare}
                  color="primary"
                >
                  Share Card
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
        
        {/* Card Settings */}
        <Box sx={{ flex: { md: 1 } }}>
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
            <Typography variant="h6" gutterBottom sx={{ 
              color: theme.palette.text.primary
            }}>
              Card Options
            </Typography>
            
            {/* Entry Selection */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="entry-select-label" sx={{
                  color: theme.palette.text.primary
                }}>Select Mood Entry</InputLabel>
                <Select
                  labelId="entry-select-label"
                  id="entry-select"
                  value={selectedEntry?.id || ''}
                  onChange={handleEntryChange}
                  label="Select Mood Entry"
                  sx={{
                    color: theme.palette.text.primary,
                    '& .MuiSelect-icon': {
                      color: theme.palette.text.primary
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: theme.palette.mode === 'dark' ? '#2d2d3a' : undefined,
                      }
                    }
                  }}
                  renderValue={(selected) => {
                    const entry = moodEntries.find(e => e.id === selected);
                    if (!entry) return 'Select Mood Entry';
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ fontSize: '1.2rem', display: 'inline-flex', mr: 1 }}>
                          {moodEmojis[entry.moodLevel as MoodLevel]}
                        </Box>
                        {format(parseISO(entry.date), 'MMM d, yyyy')} - {entry.moodLevel}/5
                      </Box>
                    );
                  }}
                >
                  {recentEntries.length > 0 ? (
                    recentEntries.map(entry => (
                      <MenuItem key={entry.id} value={entry.id} sx={{
                        color: theme.palette.mode === 'dark' ? theme.palette.text.primary : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Box component="span" sx={{ fontSize: '1.5rem', display: 'inline-flex', mr: 1 }}>
                          {moodEmojis[entry.moodLevel as MoodLevel]}
                        </Box>
                        <Box component="span">
                          {format(parseISO(entry.date), 'MMM d, yyyy')} - {entry.moodLevel}/5
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled sx={{ color: theme.palette.text.secondary }}>
                      No mood entries available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              {moodEntries.length === 0 && !isLoading && (
                <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                  These are sample entries. Add your own mood entries from the dashboard for personalized cards.
                </Typography>
              )}
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Image Upload Options */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ 
                color: theme.palette.text.primary
              }}>
                Card Images
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ProfileIcon />}
                  onClick={() => {
                    setImageDialogTab(0);
                    setOpenImageDialog(true);
                  }}
                  sx={{ 
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider
                  }}
                >
                  {profileImage ? 'Change Profile Image' : 'Add Profile Image'}
                </Button>
                {profileImage && (
                  <IconButton 
                    color="error" 
                    onClick={() => {
                      setProfileImage(null);
                      setSnackbarMessage('Profile image removed');
                      setSnackbarSeverity('success');
                      setSnackbarOpen(true);
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<WallpaperIcon />}
                  onClick={() => {
                    setImageDialogTab(1);
                    setOpenImageDialog(true);
                  }}
                  sx={{ 
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider
                  }}
                >
                  {backgroundImage ? 'Change Background' : 'Add Background'}
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {backgroundImage && (
                    <IconButton 
                      color="error" 
                      onClick={() => {
                        setBackgroundImage(null);
                        setUseBackgroundImage(false);
                        setSnackbarMessage('Background image removed');
                        setSnackbarSeverity('success');
                        setSnackbarOpen(true);
                      }}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                  <FormControlLabel
                    control={
                      <Switch 
                        size="small"
                        checked={useBackgroundImage}
                        onChange={(e) => setUseBackgroundImage(e.target.checked)}
                        disabled={!backgroundImage}
                      />
                    }
                    label="Use Background"
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        fontSize: '0.875rem',
                        color: theme.palette.text.secondary
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />

            {/* Emoji Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ 
                color: theme.palette.text.primary
              }}>
                Custom Emoji
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box 
                  sx={{ 
                    width: 50, 
                    height: 50, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '2rem',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                  }}
                >
                  {customEmoji || (selectedEntry ? moodEmojis[selectedEntry.moodLevel as MoodLevel] : '😊')}
                </Box>
                <Button 
                  variant="outlined" 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  sx={{ 
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider
                  }}
                >
                  {showEmojiPicker ? 'Close Picker' : 'Choose Emoji'}
                </Button>
              </Box>
              
              {showEmojiPicker && (
                <Box sx={{ 
                  mt: 2, 
                  position: 'relative',
                  zIndex: 1000,
                  '& .EmojiPickerReact': {
                    '--epr-bg-color': theme.palette.mode === 'dark' ? '#2d2d3a' : '#ffffff',
                    '--epr-text-color': theme.palette.text.primary,
                    width: '100%',
                    '--epr-search-input-bg-color': theme.palette.mode === 'dark' ? '#3d3d4a' : '#f5f5f5',
                    '--epr-category-label-bg-color': theme.palette.mode === 'dark' ? '#2d2d3a' : '#ffffff'
                  }
                }}>
                  <EmojiPicker 
                    onEmojiClick={handleEmojiClick} 
                    searchDisabled={false}
                    width="100%"
                    height={350}
                    previewConfig={{ showPreview: false }}
                    theme={theme.palette.mode === 'dark' ? EmojiTheme.DARK : EmojiTheme.LIGHT}
                  />
                </Box>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Theme Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ 
                color: theme.palette.text.primary
              }}>
                Card Theme
              </Typography>
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  value={selectedTheme.name}
                  onChange={handleThemeChange}
                  sx={{
                    color: theme.palette.text.primary,
                    '& .MuiSelect-icon': {
                      color: theme.palette.text.primary
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: theme.palette.mode === 'dark' ? '#2d2d3a' : undefined,
                      }
                    }
                  }}
                >
                  {cardThemes.map(themeOption => (
                    <MenuItem key={themeOption.name} value={themeOption.name} sx={{
                      color: theme.palette.mode === 'dark' ? theme.palette.text.primary : undefined
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 16, 
                            height: 16, 
                            borderRadius: '50%', 
                            bgcolor: themeOption.primary,
                            mr: 1
                          }} 
                        />
                        {themeOption.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {/* Layout Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ 
                color: theme.palette.text.primary
              }}>
                Card Layout
              </Typography>
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  value={selectedLayout.name}
                  onChange={handleLayoutChange}
                  sx={{
                    color: theme.palette.text.primary,
                    '& .MuiSelect-icon': {
                      color: theme.palette.text.primary
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: theme.palette.mode === 'dark' ? '#2d2d3a' : undefined,
                      }
                    }
                  }}
                >
                  {cardLayouts.map(layoutOption => (
                    <MenuItem key={layoutOption.name} value={layoutOption.name} sx={{
                      color: theme.palette.mode === 'dark' ? theme.palette.text.primary : undefined
                    }}>
                      {layoutOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Custom Message */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ 
                color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
              }}>
                Custom Message
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a personal message..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiInputBase-input': {
                    color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : undefined
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : undefined
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : undefined
                  },
                  '& .MuiInputLabel-root': {
                    color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined
                  }
                }}
              />
            </Box>
            
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<EditIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ 
                mt: 1,
                color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : undefined,
                borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : undefined,
                '&:hover': {
                  borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : undefined,
                  backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : undefined
                }
              }}
            >
              Edit Custom Message
            </Button>
          </Paper>
        </Box>
      </Box>

      {/* Custom Message Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: theme.palette.mode === 'dark' ? '#2d2d3a' : undefined
          }
        }}
      >
        <DialogTitle>Custom Message</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter your custom message..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => setOpenDialog(false)} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Image Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<PhotoCameraIcon />}
        onClick={() => setOpenImageDialog(true)}
        sx={{ mt: 2 }}
      >
        Upload Image
      </Button>

      {/* Image Upload Dialog */}
      <Dialog 
        open={openImageDialog} 
        onClose={() => setOpenImageDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Tabs 
            value={imageDialogTab} 
            onChange={(_, newValue) => setImageDialogTab(newValue)}
            centered
          >
            <Tab label="Profile Image" icon={<ProfileIcon />} />
            <Tab label="Background Image" icon={<WallpaperIcon />} />
          </Tabs>
        </DialogTitle>
        <DialogContent>
          {imageDialogTab === 0 ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              {profileImage ? (
                <Box sx={{ mb: 2 }}>
                  <Avatar 
                    src={profileImage} 
                    alt="Profile" 
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} 
                  />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current profile image
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mb: 2 }}>
                  <Avatar 
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'action.disabled' }} 
                  >
                    <ProfileIcon sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    No profile image selected
                  </Typography>
                </Box>
              )}
              
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={profileImageInputRef}
                onChange={handleProfileImageUpload}
              />
              
              <Button
                variant="contained"
                startIcon={<AddPhotoIcon />}
                onClick={() => profileImageInputRef.current?.click()}
                sx={{ mt: 2 }}
              >
                Select Image
              </Button>
              
              <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                Recommended: Square image, max 1MB. Will be displayed as a circle.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              {backgroundImage ? (
                <Box sx={{ mb: 2 }}>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 150, 
                      backgroundImage: `url(${backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 1,
                      mb: 2
                    }} 
                  />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current background image
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mb: 2 }}>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 150, 
                      bgcolor: 'action.disabledBackground',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      mb: 2
                    }} 
                  >
                    <WallpaperIcon sx={{ fontSize: 50, color: 'action.disabled' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    No background image selected
                  </Typography>
                </Box>
              )}
              
              {/* Web file upload */}
              <IconButton
                component="label"
                aria-label="upload background image"
                color="primary"
                sx={{ mr: 1 }}
              >
                <PhotoCameraIcon />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                />
              </IconButton>
              
              {/* Take picture with camera (mobile only) */}
              <IconButton
                aria-label="take picture"
                color="primary"
                onClick={handleTakePicture}
                sx={{ mr: 1 }}
              >
                <PhotoCameraIcon />
              </IconButton>
              
              {/* Select from gallery (mobile only) */}
              <IconButton
                aria-label="select from gallery"
                color="primary"
                onClick={handleSelectFromGallery}
                sx={{ mr: 1 }}
              >
                <PhotoLibraryIcon />
              </IconButton>
              
              <Button
                variant="contained"
                startIcon={<AddPhotoIcon />}
                onClick={() => backgroundImageInputRef.current?.click()}
                sx={{ mt: 2 }}
              >
                Select Image
              </Button>
              
              <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                Recommended: Landscape image, max 1MB. Will be displayed as a background.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenImageDialog(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => setOpenImageDialog(false)}
            variant="contained" 
            color="primary"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Social Media Sharing Dialog */}
      <Dialog
        open={openShareDialog}
        onClose={() => setOpenShareDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: theme.palette.mode === 'dark' ? '#2d2d3a' : undefined,
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.mode === 'dark' ? '#252530' : undefined
        }}>
          Share to Social Media
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
            Choose a platform to share your mood card:
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<img src="https://cdn-icons-png.flaticon.com/512/124/124021.png" alt="Twitter" width="20" height="20" />}
              onClick={() => shareToSocialMedia('twitter')}
              fullWidth
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Twitter
            </Button>
            
            <Button 
              variant="outlined" 
              startIcon={<img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="20" height="20" />}
              onClick={() => shareToSocialMedia('facebook')}
              fullWidth
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Facebook
            </Button>
            
            <Button 
              variant="outlined" 
              startIcon={<img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="20" height="20" />}
              onClick={() => shareToSocialMedia('linkedin')}
              fullWidth
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              LinkedIn
            </Button>
            
            <Button 
              variant="outlined" 
              startIcon={<img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="20" height="20" />}
              onClick={() => shareToSocialMedia('instagram')}
              fullWidth
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Instagram
            </Button>
            
            <Button 
              variant="outlined" 
              startIcon={<img src="https://cdn-icons-png.flaticon.com/512/145/145808.png" alt="Pinterest" width="20" height="20" />}
              onClick={() => shareToSocialMedia('pinterest')}
              fullWidth
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Pinterest
            </Button>
            
            <Button 
              variant="outlined" 
              startIcon={<img src="https://cdn-icons-png.flaticon.com/512/5968/5968841.png" alt="WhatsApp" width="20" height="20" />}
              onClick={() => shareToSocialMedia('whatsapp')}
              fullWidth
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              WhatsApp
            </Button>
          </Box>
          
          <Box sx={{ mt: 4, p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Note: Some platforms like Instagram may require you to download the image first and then upload it manually through their app.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.mode === 'dark' ? '#252530' : undefined,
          px: 3,
          py: 1.5
        }}>
          <Button onClick={() => handleDownload()} startIcon={<DownloadIcon />} color="primary">
            Download Instead
          </Button>
          <Button onClick={() => setOpenShareDialog(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MoodCardView;
