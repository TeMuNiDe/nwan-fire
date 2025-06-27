import React from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function Details() {
  // Placeholder data
  const assets = [
    { name: 'Asset 1', type: 'Type A', value: '10000', term: '5 Years' },
    { name: 'Asset 2', type: 'Type B', value: '25000', term: '10 Years' },
    { name: 'Asset 3', type: 'Type C', value: '5000', term: '2 Years' },
  ];

  const liabilities = [
    { name: 'Liability 1', type: 'Type X', value: '15000', term: '3 Years' },
    { name: 'Liability 2', type: 'Type Y', value: '30000', term: '7 Years' },
    { name: 'Liability 3', type: 'Type Z', value: '10000', term: '4 Years' },
  ];

  const totalAssets = 100000; // Placeholder total
  const totalLiabilities = 100000; // Placeholder total

  const renderCardContent = (title, total, data, icon) => (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Box ml={1}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body1">{total}</Typography>
        </Box>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
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
                <TableCell>{item.value}</TableCell>
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
