import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, useTheme, FormControl, InputLabel, Select, MenuItem, ButtonGroup, Button, TextField } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { useUser } from '../../contexts/UserContext';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  min, startOfDay, endOfDay,
  startOfWeek, endOfWeek,
  startOfMonth, endOfMonth,
  startOfYear, endOfYear,
  subDays, subWeeks, subMonths, subYears,
  format, isSameDay, isSameWeek, isSameMonth, isSameYear,
  isToday, isThisWeek, isThisMonth, isThisYear,
  getUnixTime, fromUnixTime, addDays, addWeeks, addMonths, addYears,
  isBefore, isEqual, isAfter, parse, setWeek, setYear
} from 'date-fns';

const Networth = () => {
  const theme = useTheme();
  const { userId } = useUser();
  const [networthData, setNetworthData] = useState([]);
  const [currentNetworth, setCurrentNetworth] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL;

  const [aggregation, setAggregation] = useState('monthly'); // daily, weekly, monthly, yearly
  const [period, setPeriod] = useState('thisYear'); // thisWeek, thisMonth, thisYear, yearToDate, customRange
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const now = new Date(); // Current date and time
  useEffect(() => {
    const fetchNetworth = async () => {
      if (!userId) return;

      let startDate, apiEndDate, graphEndDate;

      switch (period) {
        case 'thisWeek':
          startDate = startOfWeek(now, { weekStartsOn: 1 });
          graphEndDate = endOfWeek(now, { weekStartsOn: 1 });
          break;
        case 'thisMonth':
          startDate = startOfMonth(now);
          graphEndDate = endOfMonth(now);
          break;
        case 'thisYear':
          startDate = startOfYear(now);
          graphEndDate = endOfYear(now);
          break;
        case 'yearToDate':
          startDate = startOfYear(now);
          graphEndDate = now; // Graph ends today
          break;
        case 'customRange':
          startDate = customStartDate;
          graphEndDate = customEndDate;
          break;
        default:
          startDate = startOfYear(now);
          graphEndDate = endOfYear(now);
          break;
      }
      apiEndDate = min([graphEndDate, now]); // Ensure apiEndDate does not exceed today

      if (!startDate || !graphEndDate) return; // Don't fetch if dates are not set for custom range

      try {
        const response = await fetch(`${API_URL}/users/${userId}/networth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            start_date: startDate.getTime(),
            end_date: apiEndDate.getTime(), // Use apiEndDate for fetching
            aggregation: aggregation,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Generate data for the chart, including future projections
        const chartData = [];
        let currentDate = startDate;
        const lastActualNetworthValue = data && data.length > 0 ? data[data.length - 1].value : 0;
        setCurrentNetworth(lastActualNetworthValue);

        // Create a map for quick lookup of actual data
        const actualDataMap = new Map(data.map(item => [item.date, item.value]));

        // Determine the last date for which we have actual data
        const lastActualDataEpoch = data && data.length > 0 ? data[data.length - 1].date : null;
        let lastActualDataDate = null;
        if (lastActualDataEpoch) {
          lastActualDataDate = fromUnixTime(lastActualDataEpoch / 1000); // Convert milliseconds to seconds for fromUnixTime
        }

        while (isBefore(currentDate, addDays(graphEndDate, 1))) {
          
          const formattedDate = format(currentDate, getDateFormat(aggregation));
          let key = null
          switch (aggregation) {
            case 'daily': key = getUnixTime(startOfDay(currentDate)) * 1000
              break;
            case 'weekly': key = getUnixTime(startOfWeek(currentDate, { weekStartsOn: 0 })) * 1000; 
              break;
            case 'monthly': key = getUnixTime(startOfMonth(currentDate)) * 1000;
              break;
            case 'yearly': key = getUnixTime(startOfYear(currentDate)) * 1000;
              break;
          }

          const actualValue = actualDataMap.get(key)!==undefined? actualDataMap.get(key) : null;

          let projectedValue = null;
          let actualChartValue = actualValue;
          // If there's actual data for this date, show it.
          // If it's the last actual data point, also start the projection from here.
          if (actualValue !== null) {
            projectedValue = lastActualNetworthValue; // Connect projection to the last actual point
          } 
          if (lastActualDataDate && isBefore(currentDate, lastActualDataDate) ) {
            // If after the last actual data point, only show projection
            projectedValue = null;
          } else {
            projectedValue = lastActualNetworthValue; // Use the last actual net worth for projection
          }

          chartData.push({
            name: formattedDate,
            'Actual Net Worth': actualChartValue,
            'Projected Net Worth': projectedValue,
          });

          currentDate = getNextDate(currentDate, aggregation);
        }
        setNetworthData(chartData);

      } catch (error) {
        console.error("Error fetching net worth data:", error);
        setNetworthData([]);
        setCurrentNetworth(0);
      }
    };

    fetchNetworth();
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

  // Helper function to get the next date based on aggregation
  const getNextDate = (date, agg) => {
    switch (agg) {
      case 'daily': return addDays(date, 1);
      case 'weekly': return addWeeks(date, 1);
      case 'monthly': return addMonths(date, 1);
      case 'yearly': return addYears(date, 1);
      default: return addDays(date, 1);
    }
  };

  const handleAggregationChange = (event) => {
    setAggregation(event.target.value);
  };

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
    if (event.target.value !== 'customRange') {
      setCustomStartDate(null);
      setCustomEndDate(null);
    }
  };

  return (
    <Card sx={{ height: '100%', backgroundColor: theme.palette.background.paper, borderRadius: '8px' }} xs={12}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ViewInArIcon sx={{ mr: 1 }} />
          <Box>
            <Typography variant="h6" component="div">
              Networth
            </Typography>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              {currentNetworth.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="aggregation-label">Aggregation</InputLabel>
            <Select
              labelId="aggregation-label"
              id="aggregation-select"
              value={aggregation}
              label="Aggregation"
              onChange={handleAggregationChange}
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={customStartDate}
                maxDate={customEndDate?min([customEndDate,now]):now} // Ensure start date is not after end date
                onChange={(newValue) => setCustomStartDate(newValue)}
                renderInput={(params) => <TextField {...params} sx={{ minWidth: 150 }} />}
              />
              <DatePicker
                label="End Date"
                value={customEndDate}
                minDate={customStartDate?customStartDate:null} // Ensure end date is not before start date
                onChange={(newValue) => setCustomEndDate(newValue)}
                renderInput={(params) => <TextField {...params} sx={{ minWidth: 150 }} />}
              />
            </LocalizationProvider>
          )}
        </Box>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={networthData}
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
            <Line type="monotone" dataKey="Actual Net Worth" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Projected Net Worth" stroke="#82ca9d" strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Networth;
