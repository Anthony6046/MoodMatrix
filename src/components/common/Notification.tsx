import React from 'react';
import { Snackbar, Alert, AlertProps } from '@mui/material';

interface NotificationProps {
  open: boolean;
  message: string;
  severity: AlertProps['severity'];
  onClose: () => void;
  autoHideDuration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 3000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        sx={{ 
          width: '100%',
          borderRadius: 2,
          boxShadow: theme => theme.palette.mode === 'dark' 
            ? '5px 5px 10px #252532, -5px -5px 10px #353546'
            : '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff',
        }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
