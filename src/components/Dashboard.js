import React from 'react';
import { Box, Typography } from '@mui/material';

// Import sub-components for Dashboard
import Networth from './dashboard/Networth';
import Details from './dashboard/Details';
import Investments from './dashboard/Investments';

function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Networth />
      <Details />
      <Investments />
    </Box>
  );
}

export default Dashboard;
