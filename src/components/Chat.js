import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // Using this for collapse initially
import ChatIcon from '@mui/icons-material/Chat'; // Icon for collapsed state

function Chat() {
  const [isCollapsed, setIsCollapsed] = useState(false); // State for collapse

  const handleClose = () => {
    // TODO: Implement close functionality
    console.log('Close button clicked');
  };

  const handleCollapse = () => {
    setIsCollapsed(true);
  };

  const handleExpand = () => {
    setIsCollapsed(false);
  };

  if (isCollapsed) {
    return (
      <IconButton
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16, // Position at bottom left
          zIndex: 1300, // Ensure it's above other content
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
        onClick={handleExpand}
      >
        <ChatIcon />
      </IconButton>
    );
  }

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      bgcolor: '#f3e5f5', // Light purple background from image
      borderRadius: 2,
      boxShadow: 3,
      width: 350, // Example width
      position: 'fixed', // Position fixed for floating window
      bottom: 16,
      right: 16, // Position at bottom right initially, can adjust later
      zIndex: 1200, // Ensure it's above most content
    }}>
      {/* Title Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">
          AI Assitant
        </Typography>
        <Box>
          <IconButton size="small" onClick={handleCollapse}>
            <KeyboardArrowDownIcon />
          </IconButton>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Chat Content Area */}
      <Paper elevation={0} sx={{ flexGrow: 1, p: 2, overflowY: 'auto', mb: 1, bgcolor: 'white' }}>
        <Typography variant="body2" color="text.secondary">
          Chat content will appear here.
        </Typography>
      </Paper>

      {/* Input Area */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type your message..."
        />
        <Button variant="contained" color="primary">
          Send
        </Button>
        <Button variant="outlined" color="secondary">
          Clear
        </Button>
      </Box>
    </Box>
  );
}

export default Chat;
