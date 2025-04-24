import React from 'react';
import { GlobalStyles } from '@mui/material';

/**
 * CompactStyles component applies global style overrides to make the app more compact
 * with a maximum of 15px padding on all components
 */
const CompactStyles: React.FC = () => {
  return (
    <GlobalStyles
      styles={(theme) => ({
        '.MuiPaper-root': {
          padding: '12px !important',
        },
        '.MuiCardContent-root': {
          padding: '12px !important',
          '&:last-child': {
            paddingBottom: '12px !important',
          },
        },
        '.MuiDialogContent-root': {
          padding: '12px !important',
        },
        '.MuiDialogActions-root': {
          padding: '8px 12px !important',
        },
        '.MuiListItem-root': {
          paddingTop: '6px !important',
          paddingBottom: '6px !important',
        },
        '.MuiAccordionDetails-root': {
          padding: '8px 12px 12px !important',
        },
        '.MuiTabPanel-root': {
          padding: '12px !important',
        },
        '.MuiBox-root': {
          '& .MuiBox-root': {
            padding: '0 !important', // Reset nested Box padding
          },
        },
      })}
    />
  );
};

export default CompactStyles;
