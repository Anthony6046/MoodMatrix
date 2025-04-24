import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { GlobalStyles } from '@mui/material';

const DarkModeStyles: React.FC = () => {
  const { settings } = useAppContext();
  
  // Only apply these styles in dark mode
  if (settings.theme !== 'dark') {
    return null;
  }
  
  return (
    <GlobalStyles
      styles={{
        // Typography styles
        '.MuiTypography-root': {
          color: 'rgba(255, 255, 255, 0.9) !important',
        },
        '.MuiFormLabel-root, .MuiInputLabel-root': {
          color: '#000000 !important',
        },
        '.MuiTypography-h4': {
          color: '#e91e63 !important',
        },
        '.MuiTypography-h5, .MuiTypography-h6': {
          color: 'rgba(255, 255, 255, 0.9) !important',
        },
        '.MuiTypography-subtitle1, .MuiTypography-body2': {
          color: 'rgba(255, 255, 255, 0.7) !important',
        },
        '.MuiTypography-body1': {
          color: 'rgba(255, 255, 255, 0.9) !important',
        },
        
        // Input text color fixes
        '.MuiInputBase-input, .MuiInput-input, .MuiFilledInput-input, .MuiOutlinedInput-input, textarea': {
          color: '#000000 !important',
        },
        '.MuiSelect-select, .MuiMenuItem-root': {
          color: '#000000 !important',
        },
        '.MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.3) !important',
        },
        '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.5) !important',
        },
        '.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#e91e63 !important',
        },
        '.MuiInputBase-root': {
          backgroundColor: 'rgba(255, 255, 255, 0.9) !important',
        },
        '.MuiInputLabel-root': {
          color: 'rgba(255, 255, 255, 0.7) !important',
        },
        
        // Button text color fixes
        '.MuiButton-root': {
          color: 'rgba(255, 255, 255, 0.9) !important',
        },
        '.MuiButton-contained': {
          backgroundColor: '#e91e63 !important',
        },
        '.MuiButton-outlined': {
          borderColor: 'rgba(255, 255, 255, 0.3) !important',
        },
        '.MuiButton-outlined:hover': {
          borderColor: 'rgba(255, 255, 255, 0.5) !important',
          backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
        },
        
        // Dialog styles
        '.MuiDialog-paper': {
          backgroundColor: '#2d2d3a !important',
        },
        '.MuiDialogTitle-root': {
          color: 'rgba(255, 255, 255, 0.9) !important',
        },
        '.MuiDialogContent-root': {
          color: 'rgba(255, 255, 255, 0.9) !important',
        },
        
        // List item styles
        '.MuiListItemText-primary': {
          color: 'rgba(255, 255, 255, 0.9) !important',
        },
        '.MuiListItemText-secondary': {
          color: 'rgba(255, 255, 255, 0.7) !important',
        },
      }}
    />
  );
};

export default DarkModeStyles;
