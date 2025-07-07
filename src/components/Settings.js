import React, { useState, useEffect } from 'react';
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
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useUser } from '../contexts/UserContext';
const API_URL = process.env.REACT_APP_API_URL;

function Settings() {
  const { userId, user, fetchUser } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    riskScore: '',
    riskTolerance: '',
    dateOfBirth: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        riskScore: user.risk_score || '',
        riskTolerance: user.risk_tolerance || '',
        dateOfBirth: user.date_of_birth || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: userId,
          auth_token: user.auth_token,
          name: formData.name,
          email: formData.email,
          risk_score: parseFloat(formData.riskScore),
          risk_tolerance: formData.riskTolerance,
          date_of_birth: formData.dateOfBirth,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user info');
      }

      setSnackbarMessage('User information updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchUser(); // Refresh user data in context
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbarMessage(error.message || 'Failed to update user info');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Grid container spacing={3}>
      <Grid size={12}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{xs:12,md:6}}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="risk-tolerance-label">Risk Tolerance</InputLabel>
                    <Select
                      labelId="risk-tolerance-label"
                      id="risk-tolerance-select"
                      name="riskTolerance"
                      value={formData.riskTolerance}
                      label="Risk Tolerance"
                      onChange={handleChange}
                    >
                      <MenuItem value="Conservative">Conservative</MenuItem>
                      <MenuItem value="Standard">Standard</MenuItem>
                      <MenuItem value="Aggressive">Aggressive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{xs:12,md:6}}>
                  <TextField
                    fullWidth
                    label="Risk Score"
                    name="riskScore"
                    type="number"
                    value={formData.riskScore}
                    onChange={handleChange}
                    slotProps={{input:{ step: 0.01 }}}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}}>
                  <DatePicker
                      label="Date of Birth"
                      onChange={(newValue)=>{ setFormData((prevData) => ({...prevData,"dateOfBirth": newValue.getTime()}))}}
                      value={new Date(formData.dateOfBirth)}
                      slotProps={{textField:{sx:{minWidth: 150 }}}}
                      />
                </Grid>
                <Grid size={{xs:12}}>
                  <Button variant="contained" onClick={handleSave}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
    </LocalizationProvider>
  );
}

export default Settings;
