import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

// Import sub-components for CashFlow
import Trend from './cashflow/Trend';
import Transactions from './cashflow/Transactions';
function CashFlow() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Cash Flow
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid size={12}>
      <Trend />
        </Grid>
        <Grid size={12} >
      <Transactions />
        </Grid>
      </Grid>
    </Box>
  );
}

export default CashFlow;
