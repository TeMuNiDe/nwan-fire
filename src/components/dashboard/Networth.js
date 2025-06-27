import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Networth() {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Networth
      </Typography>
      <Typography variant="body1">
        Content for Networth section will go here.
      </Typography>
    </Paper>
  );
}

export default Networth;
