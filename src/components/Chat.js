import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Chat() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Chat
      </Typography>
      <Paper elevation={3} sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
        <Typography variant="body2" color="text.secondary">
          Chat content will appear here.
        </Typography>
      </Paper>
      {/* Add input field and send button here later */}
    </Box>
  );
}

export default Chat;
