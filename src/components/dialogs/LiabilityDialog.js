import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, Grid, FormControlLabel, Checkbox, Chip, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Chart from 'react-apexcharts';
import { startOfDay } from 'date-fns';
import { useUser } from '../../contexts/UserContext';
import AppSnackbar from '../common/AppSnackbar';

function LiabilityDialog({ open, onClose, itemData }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [value, setValue] = useState('');
  const [acquired, setAcquired] = useState(new Date());
  const [autoUpdate, setAutoUpdate] = useState(false);

  const [gain, setGain] = useState(0);
  const [ageDisplay, setAgeDisplay] = useState('N/A');

  const { userId } = useUser();
  const API_URL = process.env.REACT_APP_API_URL;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [chartData, setChartData] = useState({ series: [], options: {} });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.name = name ? "" : "Name is required.";
    tempErrors.type = type ? "" : "Type is required.";
    tempErrors.value = value && !isNaN(parseFloat(value)) ? "" : "Value is required and must be a number.";
    tempErrors.acquired = acquired && !isNaN(acquired.getTime()) ? "" : "Acquired Date is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  useEffect(() => {
    if (itemData) {
      setName(itemData.name || '');
      setDescription(itemData.description || '');
      setType(itemData.type || '');
      setValue(itemData.value && itemData.value.length > 0 ? itemData.value[itemData.value.length - 1].value : '');
      setAcquired(itemData.acquired ? new Date(itemData.acquired) : null);
      setAutoUpdate(itemData.auto_update || false);

      // Calculate Gain, Age, and Chart Data
      if (itemData.value && itemData.value.length > 0) {
        const values = itemData.value.map(v => ({ x: new Date(v.date), y: v.value }));
        const firstValue = values[0]?.y;
        const latestValue = values[values.length - 1]?.y;

        if (values.length > 1 && firstValue !== 0) {
          setGain(((latestValue - firstValue) / firstValue) * 100);
        } else {
          setGain(0);
        }

        if (acquired && !isNaN(acquired.getTime())) {
          const now = new Date();
          const diffMs = now - acquired;
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          if (diffDays < 90) {
            setAgeDisplay(`${diffDays} days`);
          } else if (diffDays < 1095) { // 3 years * 365
            const diffMonths = Math.floor(diffDays / 30);
            setAgeDisplay(`${diffMonths} months`);
          } else {
            const diffYears = Math.floor(diffDays / 365);
            setAgeDisplay(`${diffYears} years`);
          }
        } else {
          setAgeDisplay('N/A');
        }

        setChartData({
          series: [{
            name: itemData.name || 'Value',
            data: values
          }],
          options: {
            chart: {
              type: 'area',
              height: 350,
              zoom: {
                enabled: true
              },
              toolbar: {
                show: true
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth'
            },
            xaxis: {
              type: 'datetime',
              labels: {
                datetimeUTC: false,
              }
            },
            tooltip: {
              x: {
                format: 'dd MMM yyyy'
              }
            },
            fill: {
              type: 'gradient',
              gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 100]
              }
            },
          }
        });
      }
    } else {
      handleClear();
    }
    setErrors({}); // Clear errors on itemData change
  }, [itemData]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSave = async () => {
    if (validateForm()) {
      const liability = {
        _id: itemData ? itemData._id : null,
        name,
        description,
        type,
        value: [{ date: startOfDay(new Date()).getTime(), value: parseFloat(value) }],
        acquired: acquired ? acquired.getTime() : null,
        auto_update: autoUpdate,
      };

      try {
        const method = liability._id ? 'PUT' : 'POST';
        const url = liability._id
          ? `${API_URL}/users/${userId}/liabilities/${liability._id}`
          : `${API_URL}/users/${userId}/liabilities`;

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(liability),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        setSnackbarMessage('Liability saved successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        onClose(true); // Signal success to parent
      } catch (error) {
        console.error("Error saving liability:", error);
        setSnackbarMessage(`Error saving liability: ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        // Do not close dialog on error
      }
    }
  };

  const handleDelete = async () => {
    if (!itemData || !itemData._id) return;

    try {
      const response = await fetch(`${API_URL}/users/${userId}/liabilities/${itemData._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setSnackbarMessage('Liability deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose(true); // Signal success to parent
    } catch (error) {
      console.error("Error deleting liability:", error);
      setSnackbarMessage(`Error deleting liability: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      // Do not close dialog on error
    }
  };

  const handleClear = () => {
    setName('');
    setDescription('');
    setType('');
    setValue('');
    setAcquired(new Date());
    setAutoUpdate(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{itemData ? 'Edit Liability' : 'Add New Liability'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: "" }); }}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              id="type"
              label="Type"
              type="text"
              fullWidth
              variant="outlined"
              value={type}
              onChange={(e) => { setType(e.target.value); setErrors({ ...errors, type: "" }); }}
              error={!!errors.type}
              helperText={errors.type}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              id="value"
              label="Value"
              type="number"
              fullWidth
              variant="outlined"
              value={value}
              onChange={(e) => { setValue(e.target.value); setErrors({ ...errors, value: "" }); }}
              error={!!errors.value}
              helperText={errors.value}
            />
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Acquired Date"
                value={acquired}
                onChange={(newValue) => { setAcquired(newValue); setErrors({ ...errors, acquired: "" }); }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    fullWidth
                    variant="outlined"
                    error={!!errors.acquired}
                    helperText={errors.acquired}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={autoUpdate}
                  onChange={(e) => setAutoUpdate(e.target.checked)}
                  name="autoUpdate"
                  color="primary"
                />
              }
              label="Auto Update"
            />
          </Grid>
          {itemData && (
            <>
              <Grid item xs={12}>
                <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
                  <Chip label={`Change: ${gain.toFixed(2)}%`} color={gain >= 0 ? "success" : "error"} />
                  <Chip label={`Age: ${ageDisplay}`} />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Chart options={chartData.options} series={chartData.series} type="area" height={350} />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear}>Clear</Button>
        {itemData && (
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        )}
        <Button onClick={() => onClose(false)}>Cancel</Button> {/* Pass false on cancel */}
        <Button onClick={handleSave} variant="contained" disabled={Object.values(errors).some(x => x !== "") || !name || !type || !value || !acquired || isNaN(acquired.getTime())}>
          Save
        </Button>
      </DialogActions>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </Dialog>
  );
}

export default LiabilityDialog;
