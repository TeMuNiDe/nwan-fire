import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { useUser } from '../../contexts/UserContext';

const Networth = () => {
  const theme = useTheme();
  const { userId } = useUser();
  const [networthData, setNetworthData] = useState([]);
  const [currentNetworth, setCurrentNetworth] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchNetworth = async () => {
      try {
        const response = await fetch(`${API_URL}users/${userId}/networth`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data && data.length > 0) {
          const formattedData = data.map(item => ({
            name: new Date(item.date * 1000).toLocaleString('default', { month: 'short' }),
            'Net Worth': item.value,
          }));
          setNetworthData(formattedData);
          // Get the latest net worth value
          setCurrentNetworth(data[data.length - 1].value);
        }
      } catch (error) {
        console.error("Error fetching net worth data:", error);
      }
    };

    if (userId) {
      fetchNetworth();
    }
  }, [userId, API_URL]);

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
              {currentNetworth.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </Typography>
          </Box>
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
            <Line type="monotone" dataKey="Net Worth" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Networth;
