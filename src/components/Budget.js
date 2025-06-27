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
import { useUser } from '../contexts/UserContext';

function Budget() {
  const { userId } = useUser();
  const [investmentCapacity, setInvestmentCapacity] = useState(0);
  const [longTermCapacity, setLongTermCapacity] = useState(0); // Renamed from aggressiveCapacity
  const [shortTermCapacity, setShortTermCapacity] = useState(0); // Renamed from conservativeCapacity

  const [investedAmount, setInvestedAmount] = useState(0);
  const [longTermInvested, setLongTermInvested] = useState(0); // Renamed from aggressiveInvested
  const [shortTermInvested, setShortTermInvested] = useState(0); // Renamed from conservativeInvested

  const [planningRows, setPlanningRows] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCapacityAndInProgressAssets = async () => {
      if (!userId) return;

      try {
        // Fetch capacity data
        const capacityResponse = await fetch(`${API_URL}users/${userId}/capacity`);
        if (!capacityResponse.ok) {
          throw new Error(`HTTP error! status: ${capacityResponse.status}`);
        }
        const capacityData = await capacityResponse.json();
        setInvestmentCapacity(capacityData.investmentCapacity);
        setLongTermCapacity(capacityData.aggressiveCapacity); // Map aggressive to long term
        setShortTermCapacity(capacityData.conservativeCapacity); // Map conservative to short term

        // Fetch in_progress assets
        const assetsResponse = await fetch(`${API_URL}users/${userId}/assets/filter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ in_progress: true }),
        });
        if (!assetsResponse.ok) {
          throw new Error(`HTTP error! status: ${assetsResponse.status}`);
        }
        const inProgressAssets = await assetsResponse.json();

        if (inProgressAssets) {
          const initialRows = inProgressAssets.map((asset, index) => ({
            id: asset.id || index, // Use asset ID or index as fallback
            name: asset.name,
            type: asset.scope, // Use 'scope' for type
            amount: asset.value && asset.value.length > 0 ? asset.value.sort((a, b) => b.date - a.date)[0].value : 0,
          }));
          setPlanningRows(initialRows);
          setEditingRows(initialRows);
        }
      } catch (error) {
        console.error("Error fetching data for Budget component:", error);
      }
    };

    fetchCapacityAndInProgressAssets();
  }, [userId, API_URL]);

  useEffect(() => {
    calculateInvestedAmounts(planningRows);
  }, [planningRows]);

  const calculateInvestedAmounts = (rows) => {
    let totalInvested = 0;
    let totalLongTerm = 0;
    let totalShortTerm = 0;

    rows.forEach((row) => {
      const amount = parseFloat(row.amount);
      if (!isNaN(amount)) {
        totalInvested += amount;
        if (row.type === 'Long Term') {
          totalLongTerm += amount;
        } else if (row.type === 'Short Term' || row.type === 'Liquid') { // Consider Liquid as Short Term for this calculation
          totalShortTerm += amount;
        }
      }
    });

    setInvestedAmount(totalInvested);
    setLongTermInvested(totalLongTerm);
    setShortTermInvested(totalShortTerm);
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
    if (row.type === 'Long Term' && longTermInvested > 0) {
      return ((amount / longTermInvested) * 100).toFixed(2) + '%';
    } else if ((row.type === 'Short Term' || row.type === 'Liquid') && shortTermInvested > 0) {
      return ((amount / shortTermInvested) * 100).toFixed(2) + '%';
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
                Long Term : {longTermCapacity.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </Typography>
              <Typography variant="body1">
                Short Term : {shortTermCapacity.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
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
                {investedAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </Typography>
              <Typography variant="body1">
                Long Term : {longTermInvested.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </Typography>
              <Typography variant="body1">
                Short Term : {shortTermInvested.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
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
                      <MenuItem value="Long Term">Long Term</MenuItem>
                      <MenuItem value="Short Term">Short Term</MenuItem>
                      <MenuItem value="Liquid">Liquid</MenuItem>
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
                    inputProps={{ step: "0.01" }}
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
