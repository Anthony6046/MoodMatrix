import React from 'react';
import { GlobalStyles, useTheme, useMediaQuery } from '@mui/material';

/**
 * ResponsiveStyles component applies global style overrides to enhance
 * the app's responsiveness across different device sizes
 */
const ResponsiveStyles: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <GlobalStyles
      styles={(theme) => ({
        // Responsive typography
        '.MuiTypography-h4': {
          fontSize: isMobile ? '1.75rem !important' : '2.125rem',
        },
        '.MuiTypography-h5': {
          fontSize: isMobile ? '1.5rem !important' : '1.5rem',
        },
        '.MuiTypography-h6': {
          fontSize: isMobile ? '1.25rem !important' : '1.25rem',
        },
        
        // Responsive padding for different device sizes
        '.MuiPaper-root': {
          padding: isMobile ? '16px !important' : '24px !important',
          marginLeft: '0 !important',
          marginRight: '0 !important',
        },
        
        // Responsive buttons
        '.MuiButton-root': {
          padding: isMobile ? '6px 16px !important' : '8px 22px !important',
        },
        
        // Responsive grid layouts
        '.MuiGrid-container': {
          padding: isMobile ? '8px !important' : '16px !important',
          marginLeft: '0 !important',
          marginRight: '0 !important',
        },
        
        // Responsive card content
        '.MuiCardContent-root': {
          padding: isMobile ? '16px !important' : '24px !important',
        },
        
        // Responsive dialog content
        '.MuiDialogContent-root': {
          padding: isMobile ? '16px !important' : '24px !important',
        },
        
        // Responsive form fields
        '.MuiFormControl-root': {
          marginBottom: isMobile ? '16px !important' : '24px !important',
        },
        
        // Responsive list items
        '.MuiListItem-root': {
          paddingTop: isMobile ? '8px !important' : '12px !important',
          paddingBottom: isMobile ? '8px !important' : '12px !important',
        },
        
        // Responsive tabs
        '.MuiTab-root': {
          minWidth: isMobile ? '72px !important' : '90px !important',
          padding: isMobile ? '6px 12px !important' : '12px 16px !important',
        },
        
        // Responsive icons
        '.MuiSvgIcon-root': {
          fontSize: isMobile ? '1.25rem !important' : 'inherit',
        },
      })}
    />
  );
};

export default ResponsiveStyles;
