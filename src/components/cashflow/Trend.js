import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Assuming @mui/lab is available for DatePicker
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'; // Assuming @mui/lab is available for DatePicker
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'; // Assuming @mui/lab is available for DatePicker

// Placeholder data generation function
const generatePlaceholderData = (granularity, startDate, endDate) => {
  // This is a placeholder function.
  // In a real application, this would fetch or calculate data
  // based on the selected granularity and date range.
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    let label;
    let nextDate = new Date(currentDate);

    if (granularity === 'daily') {
      label = currentDate.toLocaleDateString();
      nextDate.setDate(currentDate.getDate() + 1);
    } else if (granularity === 'weekly') {
      // Simple week representation (e.g., start date of the week)
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
      startOfWeek.setDate(diff);
      label = `Week of ${startOfWeek.toLocaleDateString()}`;
      nextDate.setDate(currentDate.getDate() + 7);
    } else { // monthly
      label = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      nextDate.setMonth(currentDate.getMonth() + 1);
    }

    data.push({
      name: label,
      income: Math.floor(Math.random() * 500) + 500, // Placeholder income
      expenditure: Math.floor(Math.random() * 300) + 200, // Placeholder expenditure
    });

    currentDate = nextDate;
  }

  return data;
};

function Trend() {
  const [granularity, setGranularity] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1))); // Default to one year ago
  const [endDate, setEndDate] = useState(new Date()); // Default to today
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Update data whenever granularity or date range changes
    if (startDate && endDate) {
      setChartData(generatePlaceholderData(granularity, startDate, endDate));
    }
  }, [granularity, startDate, endDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Cash Flow Trend
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="granularity-label">Granularity</InputLabel>
            <Select
              labelId="granularity-label"
              id="granularity-select"
              value={granularity}
              label="Granularity"
              onChange={(e) => setGranularity(e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>

          <DatePicker
            label="From Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
            maxDate={endDate} // Prevent selecting a start date after the end date
          />

          <DatePicker
            label="To Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
            minDate={startDate} // Prevent selecting an end date before the start date
          />
        </Box>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#8884d8" name="Income" />
              <Bar dataKey="expenditure" fill="#82ca9d" name="Expenditure" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body1">No data available for the selected range.</Typography>
        )}
      </Paper>
    </LocalizationProvider>
  );
}

export default Trend;
