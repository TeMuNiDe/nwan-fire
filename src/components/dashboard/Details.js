import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from '../../contexts/UserContext';
import AssetDialog from '../dialogs/AssetDialog';
import LiabilityDialog from '../dialogs/LiabilityDialog';
import AppSnackbar from '../common/AppSnackbar'; // Import AppSnackbar

function Details() {
  const { userId } = useUser();
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL;

  const [openAssetDialog, setOpenAssetDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [openLiabilityDialog, setOpenLiabilityDialog] = useState(false);
  const [selectedLiability, setSelectedLiability] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchAssets = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/assets`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        const formattedAssets = data.map(asset => {
          const acquiredDate = asset.acquired ? new Date(asset.acquired) : null;
          let age = 'N/A';
          if (acquiredDate && !isNaN(acquiredDate)) {
            const now = new Date();
            const diffMs = now - acquiredDate;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays < 90) {
              age = `${diffDays} days`;
            } else if (diffDays < 1095) { // 3 years * 365
              const diffMonths = Math.floor(diffDays / 30);
              age = `${diffMonths} months`;
            } else {
              const diffYears = Math.floor(diffDays / 365);
              age = `${diffYears} years`;
            }
          }
          return {
            ...asset, // Keep all original asset data for editing
            displayValue: asset.value && asset.value.length > 0 ? asset.value[asset.value.length - 1].value : 0,
            age,
          };
        });
        setAssets(formattedAssets);
        setTotalAssets(formattedAssets.reduce((sum, asset) => sum + asset.displayValue, 0));
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
        const formattedLiabilities = data.map(liability => {
          const acquiredDate = liability.acquired ? new Date(liability.acquired) : null;
          let age = 'N/A';
          if (acquiredDate && !isNaN(acquiredDate)) {
            const now = new Date();
            const diffMs = now - acquiredDate;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays < 90) {
              age = `${diffDays} days`;
            } else if (diffDays < 1095) { // 3 years * 365
              const diffMonths = Math.floor(diffDays / 30);
              age = `${diffMonths} months`;
            } else {
              const diffYears = Math.floor(diffDays / 365);
              age = `${diffYears} years`;
            }
          }
          return {
            ...liability, // Keep all original liability data for editing
            displayValue: liability.value && liability.value.length > 0 ? liability.value[liability.value.length - 1].value : 0,
            age,
          };
        });
        setLiabilities(formattedLiabilities);
        setTotalLiabilities(formattedLiabilities.reduce((sum, liability) => sum + liability.displayValue, 0));
      }
    } catch (error) {
      console.error("Error fetching liabilities:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAssets();
      fetchLiabilities();
    }
  }, [userId, API_URL]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOpenNewAssetDialog = () => {
    setSelectedAsset(null);
    setOpenAssetDialog(true);
  };

  const handleOpenEditAssetDialog = (asset) => {
    setSelectedAsset(asset);
    setOpenAssetDialog(true);
  };

  const handleCloseAssetDialog = (refreshNeeded) => {
    setOpenAssetDialog(false);
    setSelectedAsset(null);
    if (refreshNeeded) {
      fetchAssets(); // Refresh assets list only if save/delete was successful
      //setSnackbarMessage('Operation successful!');
      //setSnackbarSeverity('success');
      //setSnackbarOpen(true);
    }
  };

  const handleOpenNewLiabilityDialog = () => {
    setSelectedLiability(null);
    setOpenLiabilityDialog(true);
  };

  const handleOpenEditLiabilityDialog = (liability) => {
    setSelectedLiability(liability);
    setOpenLiabilityDialog(true);
  };

  const handleCloseLiabilityDialog = (refreshNeeded) => {
    setOpenLiabilityDialog(false);
    setSelectedLiability(null);
    if (refreshNeeded) {
      fetchLiabilities(); // Refresh liabilities list only if save/delete was successful
      //setSnackbarMessage('Operation successful!');
      //setSnackbarSeverity('success');
      //setSnackbarOpen(true);
    }
  };

  const renderCardContent = (title, total, data, icon, type) => (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <Box ml={1}>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body1">{total.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={type === 'asset' ? handleOpenNewAssetDialog : handleOpenNewLiabilityDialog}
        >
          Add New
        </Button>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f8f0fc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Value</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Age</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item._id}
                onClick={() => (type === 'asset' ? handleOpenEditAssetDialog(item) : handleOpenEditLiabilityDialog(item))}
                sx={{ '&:hover': { cursor: 'pointer', backgroundColor: '#f5f5f5' } }}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.displayValue.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</TableCell>
                <TableCell>{item.age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  return (
    <Box>
    <Grid container size={12} spacing={5} justifyContent={'center'}>
      <Grid size={{xs:12,md:6}}>
        {renderCardContent(
          'Assets',
          totalAssets,
          assets,
          <ArrowUpwardIcon color="success" />,
          'asset'
        )}
      </Grid>
      <Grid size={{xs:12,md:6}}>
        {renderCardContent(
          'Liabilities',
          totalLiabilities,
          liabilities,
          <ArrowDownwardIcon color="error" />,
          'liability'
        )}
      </Grid>

    </Grid>
    
      <AssetDialog
        open={openAssetDialog}
        onClose={handleCloseAssetDialog}
        itemData={selectedAsset}
      />

      <LiabilityDialog
        open={openLiabilityDialog}
        onClose={handleCloseLiabilityDialog}
        itemData={selectedLiability}
      />

      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default Details;
