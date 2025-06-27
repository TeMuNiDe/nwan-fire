import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from '@mui/material';

function Budget() {
  const [investmentCapacity] = useState(60000);
  const [aggressiveCapacity] = useState(40000);
  const [conservativeCapacity] = useState(20000);

  const [investedAmount, setInvestedAmount] = useState(0);
  const [aggressiveInvested, setAggressiveInvested] = useState(0);
  const [conservativeInvested, setConservativeInvested] = useState(0);

  const initialPlanningRows = [
    { id: 1, name: 'Investment 1', type: 'Aggressive', amount: 10000 },
    { id: 2, name: 'Investment 2', type: 'Conservative', amount: 5000 },
    { id: 3, name: 'Investment 3', type: 'Aggressive', amount: 15000 },
    { id: 4, name: 'Investment 4', type: 'Conservative', amount: 7000 },
    { id: 5, name: 'Investment 5', type: 'Aggressive', amount: 8000 },
  ];

  const [planningRows, setPlanningRows] = useState(initialPlanningRows);
  const [editingRows, setEditingRows] = useState(initialPlanningRows);

  useEffect(() => {
    calculateInvestedAmounts(planningRows);
  }, [planningRows]);

  const calculateInvestedAmounts = (rows) => {
    let totalInvested = 0;
    let totalAggressive = 0;
    let totalConservative = 0;

    rows.forEach((row) => {
      const amount = parseFloat(row.amount);
      if (!isNaN(amount)) {
        totalInvested += amount;
        if (row.type === 'Aggressive') {
          totalAggressive += amount;
        } else if (row.type === 'Conservative') {
          totalConservative += amount;
        }
      }
    });

    setInvestedAmount(totalInvested);
    setAggressiveInvested(totalAggressive);
    setConservativeInvested(totalConservative);
  };

  const handleEditRowChange = (id, field, value) => {
    setPlanningRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
    setEditingRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleClear = (id) => {
    setEditingRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, name: '', type: '', amount: '' } : row
      )
    );
    setPlanningRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, name: '', type: '', amount: '' } : row
      )
    );
  };

  const handleDelete = (id) => {
    setPlanningRows((prevRows) => prevRows.filter((row) => row.id !== id));
    setEditingRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleAddNewRow = () => {
    const newId = Math.max(...planningRows.map((row) => row.id), 0) + 1;
    const newRow = { id: newId, name: '', type: '', amount: '' };
    setPlanningRows((prevRows) => [...prevRows, newRow]);
    setEditingRows((prevRows) => [...prevRows, newRow]);
  };

  const getPercentageOfTerm = (row) => {
    const amount = parseFloat(row.amount);
    if (isNaN(amount) || amount === 0) return '0.00%';
    if (row.type === 'Aggressive' && aggressiveInvested > 0) {
      return ((amount / aggressiveInvested) * 100).toFixed(2) + '%';
    } else if (row.type === 'Conservative' && conservativeInvested > 0) {
      return ((amount / conservativeInvested) * 100).toFixed(2) + '%';
    }
    return '0.00%';
  };

  const getPercentageOfTotal = (row) => {
    const amount = parseFloat(row.amount);
    if (isNaN(amount) || amount === 0 || investedAmount === 0) return '0.00%';
    return ((amount / investedAmount) * 100).toFixed(2) + '%';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Investment Capacity
              </Typography>
              <Typography variant="h3" sx={{ color: 'success.main', mb: 1 }}>
                {investmentCapacity.toLocaleString()}
              </Typography>
              <Typography variant="body1">
                Aggressive : {aggressiveCapacity.toLocaleString()}
              </Typography>
              <Typography variant="body1">
                Conservative : {conservativeCapacity.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Invested amount
              </Typography>
              <Typography variant="h3" sx={{ color: 'primary.main', mb: 1 }}>
                {investedAmount.toLocaleString()}
              </Typography>
              <Typography variant="body1">
                Aggressive : {aggressiveInvested.toLocaleString()}
              </Typography>
              <Typography variant="body1">
                Conservative : {conservativeInvested.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Investment Planning
      </Typography>

      <TableContainer component={Card} variant="outlined">
        <Table sx={{ minWidth: 650 }} aria-label="investment planning table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="Left">Amount</TableCell>
              <TableCell>Percentage of Term</TableCell>
              <TableCell>Percentage of Total</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editingRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <TextField
                    fullWidth
                    value={row.name}
                    onChange={(e) => handleEditRowChange(row.id, 'name', e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth size="small">
                    <Select
                      value={row.type}
                      onChange={(e) => handleEditRowChange(row.id, 'type', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Aggressive">Aggressive</MenuItem>
                      <MenuItem value="Conservative">Conservative</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="Left">
                  <TextField
                    fullWidth
                    type="number"
                    value={row.amount}
                    onChange={(e) => handleEditRowChange(row.id, 'amount', e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: 'success.light',
                      color: 'white',
                      borderRadius: '4px',
                      p: 1,
                      textAlign: 'center',
                      minWidth: '100px',
                    }}
                  >
                    <Typography variant="body2">{getPercentageOfTerm(row)}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: 'success.light',
                      color: 'white',
                      borderRadius: '4px',
                      p: 1,
                      textAlign: 'center',
                      minWidth: '100px',
                    }}
                  >
                    <Typography variant="body2">{getPercentageOfTotal(row)}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Button variant="outlined" onClick={() => handleClear(row.id)} sx={{ mr: 1 }} size="small">
                    Clear
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(row.id)} size="small">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Button variant="contained" onClick={handleAddNewRow}>
          New
        </Button>
      </Box>
    </Box>
  );
}

export default Budget;
