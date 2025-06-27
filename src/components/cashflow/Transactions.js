import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Transactions() {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Transactions
      </Typography>
      <Typography variant="body1">
        Content for Transactions section will go here.
      </Typography>
    </Paper>
  );
}

export default Transactions;
