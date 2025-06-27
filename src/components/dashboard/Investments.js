import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const investmentData1 = [
  { name: 'Savings', value: 30 },
  { name: 'Cons.', value: 20 },
  { name: 'Agressive', value: 50 },
];

const investmentData2 = [
  { name: 'Short term', value: 30 },
  { name: 'Long term', value: 70 },
];

const COLORS1 = ['#82ca9d', '#ff8042', '#8884d8']; // Green, Orange, Blue
const COLORS2 = ['#ff8042', '#8884d8']; // Orange, Blue

function Investments() {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Investments
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {/* Chart 1 */}
        <Grid item size={{ xs: 12, sm: 6, md: 6 }} >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <PieChart  width={400} height={250}>
              <Pie
                data={investmentData1}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
                label={({ name, percent }) => `${name} - ${(percent * 100).toFixed(0)}%`}
              >
                {investmentData1.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS1[index % COLORS1.length]} />
                ))}
              </Pie>
              <Tooltip />
              {/* <Legend /> */} {/* Legend is not in the image */}
            </PieChart>
          </Box>
        </Grid>

        {/* Chart 2 */}
        <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <PieChart width={400} height={250}>
              <Pie
                data={investmentData2}
               cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
                label={({ name, percent }) => `${name} - ${(percent * 100).toFixed(0)}%`}
              >
                {investmentData2.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                ))}
              </Pie>
              <Tooltip />
              {/* <Legend /> */} {/* Legend is not in the image */}
            </PieChart>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Investments;
