
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useUser } from '../../contexts/UserContext';
import {
  min, startOfDay, endOfDay,
  startOfWeek, endOfWeek,
  startOfMonth, endOfMonth,
  startOfYear, endOfYear,
  subDays, subWeeks, subMonths, subYears,
  format,
  getUnixTime, fromUnixTime, addDays, addWeeks, addMonths, addYears,
  isBefore, isEqual, isAfter
} from 'date-fns';

function Trend() {
  const { userId } = useUser();
  const [aggregation, setAggregation] = useState('monthly');
  const [period, setPeriod] = useState('thisYear'); // New state for period selection
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [chartData, setChartData] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const now = new Date(); // Current date and time

  useEffect(() => {
    const fetchTrendData = async () => {
      if (!userId) return;

      let calculatedStartDate, calculatedEndDate;

      switch (period) {
        case 'thisWeek':
          calculatedStartDate = startOfWeek(now, { weekStartsOn: 1 });
          calculatedEndDate = endOfWeek(now, { weekStartsOn: 1 });
          break;
        case 'thisMonth':
          calculatedStartDate = startOfMonth(now);
          calculatedEndDate = endOfMonth(now);
          break;
        case 'thisYear':
          calculatedStartDate = startOfYear(now);
          calculatedEndDate = endOfYear(now);
          break;
        case 'yearToDate':
          calculatedStartDate = startOfYear(now);
          calculatedEndDate = now; // Graph ends today
          break;
        case 'customRange':
          calculatedStartDate = customStartDate;
          calculatedEndDate = customEndDate;
          break;
        default:
          calculatedStartDate = startOfYear(now);
          calculatedEndDate = endOfYear(now);
          break;
      }

      // Ensure calculatedEndDate does not exceed today for API call
      const apiEndDate = min([calculatedEndDate, now]);

      if (!calculatedStartDate || !apiEndDate) return; // Don't fetch if dates are not set for custom range

      try {
        const response = await fetch(`${API_URL}/users/${userId}/transactions/trend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate: calculatedStartDate.getTime(),
            endDate: apiEndDate.getTime(),
            aggregation: aggregation,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const formattedChartData = data.map(item => ({
          name: format(fromUnixTime(item.date / 1000), getDateFormat(aggregation)),
          income: item.income,
          expenditure: item.expenditure,
        }));
        setChartData(formattedChartData);

      } catch (error) {
        console.error("Error fetching cash flow trend data:", error);
        setChartData([]);
      }
    };

    fetchTrendData();
  }, [userId, API_URL, aggregation, period, customStartDate, customEndDate]);

  // Helper function to determine date format for XAxis label
  const getDateFormat = (agg) => {
    switch (agg) {
      case 'daily': return 'MMM dd';
      case 'weekly': return 'w, yyyy';
      case 'monthly': return 'MMM yyyy';
      case 'yearly': return 'yyyy';
      default: return 'MMM dd';
    }
  };


  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
    if (event.target.value !== 'customRange') {
      setCustomStartDate(null);
      setCustomEndDate(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Cash Flow Trend
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="aggregation-label">Aggregation</InputLabel>
            <Select
              labelId="aggregation-label"
              id="aggregation-select"
              value={aggregation}
              label="Aggregation"
              onChange={(e) => setAggregation(e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="period-label">Period</InputLabel>
            <Select
              labelId="period-label"
              id="period-select"
              value={period}
              label="Period"
              onChange={handlePeriodChange}
            >
              <MenuItem value="thisWeek">This Week</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
              <MenuItem value="thisYear">This Year</MenuItem>
              <MenuItem value="yearToDate">Year to Date</MenuItem>
              <MenuItem value="customRange">Custom Range</MenuItem>
            </Select>
          </FormControl>

          {period === 'customRange' && (
            <>
              <DatePicker
                label="From Date"
                value={customStartDate}
                onChange={(newValue) => setCustomStartDate(newValue)}
                renderInput={(params) => <TextField {...params} sx={{ minWidth: 150 }} />}
                maxDate={customEndDate ? min([customEndDate, now]) : now} // Prevent selecting a start date after the end date
              />

              <DatePicker
                label="To Date"
                value={customEndDate}
                onChange={(newValue) => setCustomEndDate(newValue)}
                renderInput={(params) => <TextField {...params} sx={{ minWidth: 150 }} />}
                minDate={customStartDate ? customStartDate : null} // Prevent selecting an end date before the start date
              />
            </>
          )}
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
