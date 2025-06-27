import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
} from '@mui/material';

function Settings() {
  return (
    <Grid container spacing={3}>
      <Grid item size={12}>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
          <FormControl  sx={{ mb: 2 }}>
            <InputLabel id="risk-tolerance-label">Risk Tolerance</InputLabel>
            <Select
              labelId="risk-tolerance-label"
              id="risk-tolerance-select"
              value="Standard"
              label="Risk Tolerance"
            >
              <MenuItem value="Conservative">Conservative</MenuItem>
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Aggressive">Aggressive</MenuItem>
            </Select>
          </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
          <TextField
            id="risk-score"
            label="Risk Score"
            type="number"
            defaultValue="0.75"
            InputProps={{ inputProps: { step: 0.01 } }}
          />
            </Grid>
            </Grid>
        </CardContent>
      </Card>
    </Box>
    </Grid>
    </Grid>
  );
}

export default Settings;
