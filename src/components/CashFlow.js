import React from 'react';
import { Box, Typography } from '@mui/material';

// Import sub-components for CashFlow
import Trend from './cashflow/Trend';
import Transactions from './cashflow/Transactions';
import Distribution from './cashflow/Distribution';

function CashFlow() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Cash Flow
      </Typography>
      <Trend />
      <Transactions />
      <Distribution />
    </Box>
  );
}

export default CashFlow;
