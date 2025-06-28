import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Divider,
  Grid,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

import Distribution from './Distribution';
import { useUser } from '../../contexts/UserContext';

function Transactions() {
  const { userId } = useUser();

  const [dateRange, setDateRange] = useState('Today');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [displayNamesCache, setDisplayNamesCache] = useState(new Map());
  const API_URL = process.env.REACT_APP_API_URL

  const pathMap = {asset: 'assets',liability: 'liabilities'}

  const fetchProperty = async (type, id, property) => {
    const cacheKey = `${type}-${id}-${property}`;
    if (displayNamesCache.has(cacheKey)) {
      return displayNamesCache.get(cacheKey);
    }

    try {
      const response = await fetch(`${API_URL}/users/${userId}/${pathMap[type]}/${id}/${property}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${property} for ${type} with ID ${id}`);
      }
      const data = await response.json();
      const value = data[property];
      setDisplayNamesCache(prev => new Map(prev).set(cacheKey, value));
      return value;
    } catch (error) {
      console.error(`Error fetching ${type} ${property}:`, error);
      return `Unknown ${type}`;
    }
  };

  const getDisplayName = async (type, id) => {
    if (type === 'income' || type === 'expense') {
      return type.charAt(0).toUpperCase() + type.slice(1);
    } else if (type === 'asset' || type === 'liability') {
      return await fetchProperty(type, id, 'name');
    }
    return 'N/A';
  };

  useEffect(() => {
    const today = new Date();
    let calculatedStartDate = null;
    let calculatedEndDate = null;

    switch (dateRange) {
      case 'Today':
        calculatedStartDate = startOfDay(today);
        calculatedEndDate = endOfDay(today);
        break;
      case 'This week':
        calculatedStartDate = startOfWeek(today, { weekStartsOn: 1 });
        calculatedEndDate = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case 'This Month':
        calculatedStartDate = startOfMonth(today);
        calculatedEndDate = endOfMonth(today);
        break;
      case 'Custom Range':
        break;
      default:
        break;
    }

    if (dateRange !== 'Custom Range' && calculatedStartDate && calculatedEndDate) {
      setStartDate(calculatedStartDate);
      setEndDate(calculatedEndDate);
    }
  }, [dateRange]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (startDate && endDate && userId) {
        try {
          const response = await fetch(`${API_URL}/users/${userId}/transactions/query-by-date`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              start_date: startDate.getTime(),
              end_date: endDate.getTime(),
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch transactions');
          }
          const data = await response.json();
          setTransactions(data);
        } catch (error) {
          console.error('Error fetching transactions:', error);
          setTransactions([]);
        }
      } else {
        setTransactions([]);
      }
    };

    fetchTransactions();
  }, [startDate, endDate, userId]);

  useEffect(() => {
    const resolveDisplayNames = async () => {
      const newDisplayNamesCache = new Map(displayNamesCache);
      for (const transaction of transactions) {
        if ((transaction.source === 'asset' || transaction.source === 'liability') && transaction.source_id) {
          const cacheKey = `${transaction.source}-${transaction.source_id}-name`;
          if (!newDisplayNamesCache.has(cacheKey)) {
            const name = await fetchProperty(transaction.source, transaction.source_id, 'name');
            newDisplayNamesCache.set(cacheKey, name);
          }
        }
        if ((transaction.target === 'asset' || transaction.target === 'liability') && transaction.target_id) {
          const cacheKey = `${transaction.target}-${transaction.target_id}-name`;
          if (!newDisplayNamesCache.has(cacheKey)) {
            const name = await fetchProperty(transaction.target, transaction.target_id, 'name');
            newDisplayNamesCache.set(cacheKey, name);
          }
          }
      }
      setDisplayNamesCache(newDisplayNamesCache);
    };

    if (transactions.length > 0) {
      resolveDisplayNames();
    }
  }, [transactions, userId]);

  const handleDateRangeChange = (event) => {
    const value = event.target.value;
    setDateRange(value);
    if (value === 'Custom Range') {
      setOpenDatePicker(true);
    } else {
      setOpenDatePicker(false);
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item size={12}>
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ mr: 1 }}>$</Typography>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
              Transactions
            </Typography>
            <Typography variant="h5" color="text.secondary">
              {totalAmount.toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="date-range-select-label">Filter</InputLabel>
          <Select
            labelId="date-range-select-label"
            id="date-range-select"
            value={dateRange}
            label="Filter"
            onChange={handleDateRangeChange}
          >
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="This week">This week</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Custom Range">Custom Range</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {openDatePicker && dateRange === 'Custom Range' && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              maxDate={endDate}
              onChange={handleStartDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              minDate={startDate}
              onChange={handleEndDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </LocalizationProvider>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f0fc' }}>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{transaction.name}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>
                  {transaction.source === 'income' || transaction.source === 'expense'
                    ? transaction.source.charAt(0).toUpperCase() + transaction.source.slice(1)
                    : displayNamesCache.get(`${transaction.source}-${transaction.source_id}-name`) || 'Loading...'}
                </TableCell>
                <TableCell>
                  {transaction.target === 'income' || transaction.target === 'expense'
                    ? transaction.target.charAt(0).toUpperCase() + transaction.target.slice(1)
                    : displayNamesCache.get(`${transaction.target}-${transaction.target_id}-name`) || 'Loading...'}
                </TableCell>
                <TableCell>{format(new Date(transaction.date), 'yyyy-MM-dd')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
      </Grid>
      <Grid item size={12}>
      <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid item size={12}>
      <Distribution
        transactions={transactions}
        startDate={startDate}
        endDate={endDate}
        getDisplayName={getDisplayName}
      />
      </Grid>
    </Grid>
  );
}

export default Transactions;
