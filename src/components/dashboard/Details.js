import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useUser } from '../../contexts/UserContext';

function Details() {
  const { userId } = useUser();
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${userId}/assets`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data) {
          const formattedAssets = data.map(asset => ({
            name: asset.name,
            type: asset.type,
            value: asset.value && asset.value.length > 0 ? asset.value[asset.value.length - 1].value : 0,
            term: 'N/A', // Term is not available in sample data, setting to N/A
          }));
          setAssets(formattedAssets);
          setTotalAssets(formattedAssets.reduce((sum, asset) => sum + asset.value, 0));
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    const fetchLiabilities = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${userId}/liabilities`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data) {
          const formattedLiabilities = data.map(liability => ({
            name: liability.name,
            type: liability.type,
            value: liability.value && liability.value.length > 0 ? liability.value[liability.value.length - 1].value : 0,
            term: 'N/A', // Term is not available in sample data, setting to N/A
          }));
          setLiabilities(formattedLiabilities);
          setTotalLiabilities(formattedLiabilities.reduce((sum, liability) => sum + liability.value, 0));
        }
      } catch (error) {
        console.error("Error fetching liabilities:", error);
      }
    };

    if (userId) {
      fetchAssets();
      fetchLiabilities();
    }
  }, [userId, API_URL]);

  const renderCardContent = (title, total, data, icon) => (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Box ml={1}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body1">{total.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</Typography>
        </Box>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f8f0fc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Value</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Term</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.value.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</TableCell>
                <TableCell>{item.term}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  return (
    <Grid container spacing={5} justifyContent={'center'}>
      <Grid item  size={{xs:12,md:6}}>
        {renderCardContent(
          'Assets',
          totalAssets,
          assets,
          <ArrowUpwardIcon color="success" />
        )}
      </Grid>
      <Grid item size={{xs:12,md:6}}>
        {renderCardContent(
          'Liabilities',
          totalLiabilities,
          liabilities,
          <ArrowDownwardIcon color="error" />
        )}
      </Grid>
    </Grid>
  );
}

export default Details;
