import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

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
      <Grid container spacing={2} justifyContent="center">
      <Grid size={12} >
      <Networth />
      </Grid>
      <Grid size={12} >
      <Details />
      </Grid>
      <Grid size={12} >
      <Investments />
      </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
