import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, Grid, FormControlLabel, Checkbox, InputLabel, Select, MenuItem, FormControl, Chip, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Chart from 'react-apexcharts';
import { startOfDay } from 'date-fns';
import { useUser } from '../../contexts/UserContext';
import AppSnackbar from '../common/AppSnackbar';

function AssetDialog({ open, onClose, itemData }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [value, setValue] = useState('');
  const [units, setUnits] = useState('');
  const [code, setCode] = useState('');
  const [userWeight, setUserWeight] = useState('');
  const [acquired, setAcquired] = useState(new Date());
  const [scope, setScope] = useState('');
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  const [gain, setGain] = useState(0);
  const [cagr, setCagr] = useState(0);
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
    tempErrors.value = value && !isNaN(parseFloat(value)) ? "" : "Current Value is required and must be a number.";
    tempErrors.units = units && !isNaN(parseFloat(units)) ? "" : "Units is required and must be a number.";
    tempErrors.code = code ? "" : "Code is required.";
    tempErrors.acquired = acquired && !isNaN(acquired.getTime()) ? "" : "Acquired Date is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  useEffect(() => {
    if (itemData) {
      setName(itemData.name || '');
      setDescription(itemData.description || '');
      setType(itemData.type || '');
      setUnits(itemData.units || '');
      setCode(itemData.code || '');
      setValue(itemData.value && itemData.value.length > 0 ? itemData.value[itemData.value.length - 1].value : '');
      setUserWeight(itemData.user_weight || '');
      setAcquired(itemData.acquired ? new Date(itemData.acquired) : null);
      setScope(itemData.scope || '');
      setAutoUpdate(itemData.auto_update || false);
      setInProgress(itemData.in_progress || false);

      // Calculate Gain, CAGR, Age, and Chart Data
      if (itemData.value && itemData.value.length > 0) {
        const values = itemData.value.map(v => ({ x: new Date(v.date), y: v.value }));
        const firstValue = values[0]?.y;
        const latestValue = values[values.length - 1]?.y;

        if (values.length > 1 && firstValue !== 0) {
          setGain(((latestValue - firstValue) / firstValue) * 100);
        } else {
          setGain(0);
        }

        if (acquired && !isNaN(acquired.getTime()) && values.length > 1 && firstValue !== 0) {
          const acquiredTime = acquired.getTime();
          const latestTime = values[values.length - 1].x.getTime();
          const diffYears = (latestTime - acquiredTime) / (1000 * 60 * 60 * 24 * 365.25);
          if (diffYears > 0) {
            setCagr((Math.pow(latestValue / firstValue, 1 / diffYears) - 1) * 100);
          } else {
            setCagr(0);
          }
        } else {
          setCagr(0);
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
      const asset = {
        _id: itemData ? itemData._id : null,
        name,
        description,
        type,
        units: parseFloat(units),
        code,
        value: [{ date: startOfDay(new Date()).getTime(), value: parseFloat(value) }],
        user_weight: parseFloat(userWeight),
        acquired: acquired ? acquired.getTime() : null,
        scope,
        auto_update: autoUpdate,
        in_progress: inProgress,
      };

      try {
        const method = asset._id ? 'PUT' : 'POST';
        const url = asset._id
          ? `${API_URL}/users/${userId}/assets/${asset._id}`
          : `${API_URL}/users/${userId}/assets`;

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(asset),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        setSnackbarMessage('Asset saved successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        onClose(true); // Signal success to parent
      } catch (error) {
        console.error("Error saving asset:", error);
        setSnackbarMessage(`Error saving asset: ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        // Do not close dialog on error
      }
    }
  };

  const handleDelete = async () => {
    if (!itemData || !itemData._id) return;

    try {
      const response = await fetch(`${API_URL}/users/${userId}/assets/${itemData._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setSnackbarMessage('Asset deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose(true); // Signal success to parent
    } catch (error) {
      console.error("Error deleting asset:", error);
      setSnackbarMessage(`Error deleting asset: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      // Do not close dialog on error
    }
  };

  const handleClear = () => {
    setName('');
    setDescription('');
    setType('');
    setUnits('');
    setCode('');
    setValue('');
    setUserWeight('');
    setAcquired(new Date());
    setScope('');
    setAutoUpdate(false);
    setInProgress(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{itemData ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
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
              id="units"
              label="Units"
              type="number"
              fullWidth
              variant="outlined"
              value={units}
              onChange={(e) => { setUnits(e.target.value); setErrors({ ...errors, units: "" }); }}
              error={!!errors.units}
              helperText={errors.units}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              id="code"
              label="Code"
              type="text"
              fullWidth
              variant="outlined"
              value={code}
              onChange={(e) => { setCode(e.target.value); setErrors({ ...errors, code: "" }); }}
              error={!!errors.code}
              helperText={errors.code}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              id="value"
              label="Current Value"
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
            <TextField
              margin="dense"
              id="userWeight"
              label="User Weight"
              type="number"
              fullWidth
              variant="outlined"
              value={userWeight}
              onChange={(e) => setUserWeight(e.target.value)}
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
            <FormControl fullWidth margin="dense">
              <InputLabel id="scope-label">Scope</InputLabel>
              <Select
                labelId="scope-label"
                id="scope"
                value={scope}
                label="Scope"
                onChange={(e) => setScope(e.target.value)}
              >
                <MenuItem value={"Short Term"}>Short Term</MenuItem>
                <MenuItem value={"Long Term"}>Long Term</MenuItem>
                <MenuItem value={"Liquid"}>Liquid</MenuItem>
              </Select>
            </FormControl>
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
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={inProgress}
                  onChange={(e) => setInProgress(e.target.checked)}
                  name="inProgress"
                  color="primary"
                />
              }
              label="In Progress"
            />
          </Grid>
          {itemData && (
            <>
              <Grid item xs={12}>
                <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
                  <Chip label={`Change: ${gain.toFixed(2)}%`} color={gain >= 0 ? "success" : "error"} />
                  <Chip label={`CAGR: ${cagr.toFixed(2)}%`} color={cagr >= 0 ? "success" : "error"} />
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
        <Button onClick={handleSave} variant="contained" disabled={Object.values(errors).some(x => x !== "") || !scope ||!name || !type || !value || !units || !code || !acquired || isNaN(acquired.getTime())}>
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

export default AssetDialog;
