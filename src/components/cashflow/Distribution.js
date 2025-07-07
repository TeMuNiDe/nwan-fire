import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B'];

function Distribution({ transactions}) {

  // Data for Pie Chart 1: Expenses by Category
  const expensesByCategory = transactions
    .filter(t => t.target === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

  const pieChart1Data = Object.keys(expensesByCategory).map(category => ({
    name: category,
    value: expensesByCategory[category],
  }));

  // Data for Pie Chart 2: Transactions by Target Type
  const transactionsByTargetType = transactions.reduce((acc, transaction) => {
    let type = '';
    if (transaction.target === 'expense') {
      type = 'Expenditures';
    } else if (transaction.target === 'asset') {
      type = 'Savings';
    } else if (transaction.target === 'liability') {
      type = 'Settlements';
    }

    if (type) {
      acc[type] = (acc[type] || 0) + transaction.amount;
    }
    return acc;
  }, {});

  const pieChart2Data = Object.keys(transactionsByTargetType).map(type => ({
    name: type,
    value: transactionsByTargetType[type],
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Distribution
      </Typography>
      <Grid container spacing={2}>
        {/* Pie Chart 1: Expenses by Category */}
        <Grid size={{xs:12, md:6}}>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Expenses by Category
          </Typography>
          {pieChart1Data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChart1Data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {pieChart1Data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              No expense transactions for the selected period.
            </Typography>
          )}
        </Grid>

        {/* Pie Chart 2: Transactions by Target Type */}
        <Grid size={{xs:12, md:6}}>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Transactions by Target Type
          </Typography>
          {pieChart2Data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChart2Data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#82ca9d"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {pieChart2Data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              No transactions for the selected period.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Distribution;
