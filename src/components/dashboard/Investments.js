import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useUser } from '../../contexts/UserContext';
import { ResponsiveContainer } from 'recharts';

const COLORS1 = ['#82ca9d', '#ff8042', '#8884d8', '#FFBB28', '#FF8042']; // Green, Orange, Blue, Yellow, Red
const COLORS2 = ['#ff8042', '#8884d8', '#82ca9d']; // Orange, Blue, Green

function Investments() {
  const { userId } = useUser();
  const [investmentTypeData, setInvestmentTypeData] = useState([]);
  const [investmentScopeData, setInvestmentScopeData] = useState([]); // Renamed from investmentTermData
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${userId}/assets`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const assets = await response.json();

        if (assets) {
          // Helper to get the most recent value from the 'value' array
          const getLatestValue = (valueArray) => {
            if (!valueArray || valueArray.length === 0) return 0;
            // Sort by date in descending order and take the first element's value
            return valueArray.sort((a, b) => b.date - a.date)[0].value;
          };

          // Process data for Chart 1 (Investment Type Distribution)
          const typeMap = {};
          assets.forEach(asset => {
            const type = asset.type || 'Other';
            const value = getLatestValue(asset.value);
            typeMap[type] = (typeMap[type] || 0) + value;
          });
          const formattedTypeData = Object.keys(typeMap).map(type => ({
            name: type,
            value: typeMap[type],
          }));
          setInvestmentTypeData(formattedTypeData);

          // Process data for Chart 2 (Investment Scope Distribution)
          const scopeMap = {};
          assets.forEach(asset => {
            const scope = asset.scope || 'Undefined'; // Use the new 'scope' field
            const value = getLatestValue(asset.value);
            scopeMap[scope] = (scopeMap[scope] || 0) + value;
          });
          const formattedScopeData = Object.keys(scopeMap).map(scope => ({
            name: scope,
            value: scopeMap[scope],
          }));
          setInvestmentScopeData(formattedScopeData); // Renamed state setter
        }
      } catch (error) {
        console.error("Error fetching investment data:", error);
      }
    };

    if (userId) {
      fetchInvestments();
    }
  }, [userId, API_URL]);

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {/* Chart 1: By Type */}
        <Grid size={{ xs: 12, sm: 12, md: 12, lg:6 }} >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
             Assets Type
            </Typography>
             <ResponsiveContainer width="100%" height={250}>
            <PieChart  >
              <Pie
                data={investmentTypeData}
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
                label={({ name, percent }) => `${name} - ${(percent * 100).toFixed(0)}%`}
              >
                {investmentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS1[index % COLORS1.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString('en-US', { style: 'currency', currency: 'INR' })} />
              <Legend />
            </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Chart 2: By Scope */}
        <Grid size={{ xs: 12, sm: 12, md: 12,lg:6  }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              Assets Scope
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
             <PieChart >
              <Pie
                data={investmentScopeData} // Renamed data source
        
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
                label={({ name, percent }) => `${name} - ${(percent * 100).toFixed(0)}%`}
              >
                {investmentScopeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString('en-US', { style: 'currency', currency: 'INR' })} />
              <Legend />
            </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Investments;
