import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ViewInArIcon from '@mui/icons-material/ViewInAr'; // Assuming a Cube icon is available in MUI

const data = [
  { name: 'Jan', 'Port 1': 4000, 'Port 2': 2400, 'Port 3': 2400 },
  { name: 'Feb', 'Port 1': 3000, 'Port 2': 1398, 'Port 3': 2210 },
  { name: 'Mar', 'Port 1': 2000, 'Port 2': 9800, 'Port 3': 2290 },
  { name: 'Apr', 'Port 1': 2780, 'Port 2': 3908, 'Port 3': 2000 },
  { name: 'May', 'Port 1': 1890, 'Port 2': 4800, 'Port 3': 2181 },
  { name: 'Jun', 'Port 1': 2390, 'Port 2': 3800, 'Port 3': 2500 },
  { name: 'Jul', 'Port 1': 3490, 'Port 2': 4300, 'Port 3': 2100 },
  { name: 'Aug', 'Port 1': 4000, 'Port 2': 2400, 'Port 3': 2400 },
  { name: 'Sep', 'Port 1': 3000, 'Port 2': 1398, 'Port 3': 2210 },
  { name: 'Oct', 'Port 1': 2000, 'Port 2': 9800, 'Port 3': 2290 },
  { name: 'Nov', 'Port 1': 2780, 'Port 2': 3908, 'Port 3': 2000 },
  { name: 'Dec', 'Port 1': 1890, 'Port 2': 4800, 'Port 3': 2181 },
];

const Networth = () => {
  const theme = useTheme();

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
              1000000
            </Typography>
          </Box>
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
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
            <Line type="monotone" dataKey="Port 1" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Port 2" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Port 3" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Networth;
