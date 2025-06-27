import React, { useState, useEffect } from 'react';
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
  TextField, // Added TextField import
  Divider,
  Grid, // Added Divider import
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

import Distribution from './Distribution'; // Import Distribution component

// Placeholder data
const placeholderTransactions = [
  { id: 1, name: 'Grocery', category: 'Food', amount: 150, source: 'liability', source_id: 'liability1', target: 'asset', target_id: 'asset1', date: '2025-06-27' },
  { id: 2, name: 'Salary', category: 'Income', amount: 3000, source: 'income', source_id: '', target: 'asset', target_id: 'asset1', date: '2025-06-26' },
  { id: 3, name: 'Rent', category: 'Housing', amount: 1200, source: 'asset', source_id: 'asset1', target: 'expense', target_id: '', date: '2025-06-25' },
  { id: 4, name: 'Coffee', category: 'Food', amount: 5, source: 'asset', source_id: 'asset1', target: 'expense', target_id: '', date: '2025-06-27' },
  { id: 5, name: 'Books', category: 'Education', amount: 50, source: 'asset', source_id: 'asset2', target: 'expense', target_id: '', date: '2025-06-24' },
  { id: 6, name: 'Dinner', category: 'Food', amount: 80, source: 'asset', source_id: 'asset1', target: 'expense', target_id: '', date: '2025-06-23' },
  { id: 7, name: 'Utilities', category: 'Bills', amount: 100, source: 'asset', source_id: 'asset1', target: 'expense', target_id: '', date: '2025-06-22' },
  { id: 8, name: 'Gym Membership', category: 'Health', amount: 40, source: 'asset', source_id: 'asset2', target: 'expense', target_id: '', date: '2025-06-21' },
  { id: 9, name: 'Transportation', category: 'Travel', amount: 20, source: 'asset', source_id: 'asset1', target: 'expense', target_id: '', date: '2025-06-20' },
  { id: 10, name: 'Movie Tickets', category: 'Entertainment', amount: 25, source: 'asset', source_id: 'asset1', target: 'expense', target_id: '', date: '2025-06-19' },
];

// Placeholder assets and liabilities
const placeholderAssets = [
  { id: 'asset1', name: 'Savings Account' },
  { id: 'asset2', name: 'Investment Portfolio' },
];

const placeholderLiabilities = [
  { id: 'liability1', name: 'Credit Card Debt' },
  { id: 'liability2', name: 'Student Loan' },
];

function Transactions() {
  const [dateRange, setDateRange] = useState('Today');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Helper function to get display name for source/target
  const getDisplayName = (type, id) => {
    if (type === 'income' || type === 'expense') {
      return type.charAt(0).toUpperCase() + type.slice(1); // Capitalize "Income" or "Expense"
    } else if (type === 'asset') {
      const asset = placeholderAssets.find(a => a.id === id);
      return asset ? asset.name : 'Unknown Asset';
    } else if (type === 'liability') {
      const liability = placeholderLiabilities.find(l => l.id === id);
      return liability ? liability.name : 'Unknown Liability';
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
        calculatedStartDate = startOfWeek(today, { weekStartsOn: 1 }); // Monday as start of week
        calculatedEndDate = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case 'This Month':
        calculatedStartDate = startOfMonth(today);
        calculatedEndDate = endOfMonth(today);
        break;
      case 'Custom Range':
        // Handled by DatePicker
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
    if (startDate && endDate) {
      const filtered = placeholderTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(placeholderTransactions); // Show all if no range selected
    }
  }, [startDate, endDate, dateRange]);

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

  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

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
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.name}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>{getDisplayName(transaction.source, transaction.source_id)}</TableCell>
                <TableCell>{getDisplayName(transaction.target, transaction.target_id)}</TableCell>
                <TableCell>{format(new Date(transaction.date), 'yyyy-MM-dd')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
      </Grid>
      <Grid item size={12}>
      <Divider sx={{ my: 2 }} /> {/* Add Divider here */}
      </Grid>
      <Grid item size={12}>
      <Distribution
        transactions={filteredTransactions}
        assets={placeholderAssets}
        liabilities={placeholderLiabilities}
        startDate={startDate}
        endDate={endDate}
        getDisplayName={getDisplayName}
      />
      </Grid>
    </Grid>
  );
}

export default Transactions;
