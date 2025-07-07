import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AssetDialog from './AssetDialog';
import LiabilityDialog from './LiabilityDialog';
import { useUser } from '../../contexts/UserContext';
import AppSnackbar from '../common/AppSnackbar';

function TransactionDialog({ open, onClose, itemData }) {
    const { userId } = useUser();
  
  const [id, setId] = useState(null);
  const [date, setDate] = useState(null);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [targetId, setTargetId] = useState('');

  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [openAssetDialog, setOpenAssetDialog] = useState(false);
  const [openLiabilityDialog, setOpenLiabilityDialog] = useState(false);
  const [currentSelectionType, setCurrentSelectionType] = useState(''); // 'source' or 'target'
  const API_URL = process.env.REACT_APP_API_URL

  const assetCache = useRef({});
  const liabilityCache = useRef({});
  const [cacheRefreshKey, setCacheRefreshKey] = useState(1);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (itemData) {
      setId(itemData._id || null);
      setDate(itemData.date ? new Date(itemData.date) : null);
      setAmount(itemData.amount || '');
      setSource(itemData.source || '');
      setSourceId(itemData.source_id || '');
      setCategory(itemData.category || '');
      setName(itemData.name || '');
      setDescription(itemData.description || '');
      setTarget(itemData.target || '');
      setTargetId(itemData.target_id || '');
    } else {
      handleClear();
    }
  }, [itemData]);

  useEffect(() => {
    if (!open || !userId) return;

    const fetchAssets = async () => {
      if (assetCache.current[userId] && cacheRefreshKey === 0) {
        setAssets(assetCache.current[userId]);
        return;
      }
      try {
        const assetsResponse = await fetch(`${API_URL}/users/${userId}/assets?fields=_id,name`);
        const assetsData = await assetsResponse.json();
        assetCache.current[userId] = assetsData;
        setAssets(assetsData);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    const fetchLiabilities = async () => {
      if (liabilityCache.current[userId] && cacheRefreshKey === 0) {
        setLiabilities(liabilityCache.current[userId]);
        return;
      }
      try {
        const liabilitiesResponse = await fetch(`${API_URL}/users/${userId}/liabilities?fields=_id,name`);
        const liabilitiesData = await liabilitiesResponse.json();
        liabilityCache.current[userId] = liabilitiesData;
        setLiabilities(liabilitiesData);
      } catch (error) {
        console.error('Error fetching liabilities:', error);
      }
    };

    const needsAssetFetch = ['asset'].includes(source) || ['asset'].includes(target);
    const needsLiabilityFetch = ['liability'].includes(source) || ['liability'].includes(target);

    if (needsAssetFetch) {
      fetchAssets();
    }
    if (needsLiabilityFetch) {
      fetchLiabilities();
    }

    if (cacheRefreshKey > 0) {
      setCacheRefreshKey(0);
    }

  }, [open, userId, source, target, cacheRefreshKey]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSave = async () => {
    const transaction = {
      _id: id,
      date: date ? date.getTime() : null,
      amount: parseFloat(amount),
      source,
      source_id: sourceId,
      category,
      name,
      description,
      target,
      target_id: targetId,
    };

    try {
      const method = transaction._id ? 'PUT' : 'POST';
      const url = transaction._id
        ? `${API_URL}/users/${userId}/transactions/${transaction._id}`
        : `${API_URL}/users/${userId}/transactions`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setSnackbarMessage('Transaction saved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose(true); // Signal success to parent
    } catch (error) {
      console.error("Error saving transaction:", error);
      setSnackbarMessage(`Error saving transaction: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      // Do not close dialog on error
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      const response = await fetch(`${API_URL}/users/${userId}/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setSnackbarMessage('Transaction deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose(true); // Signal success to parent
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setSnackbarMessage(`Error deleting transaction: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      // Do not close dialog on error
    }
  };

  const handleClear = () => {
    setId(null);
    setDate(null);
    setAmount('');
    setSource('');
    setSourceId('');
    setCategory('');
    setName('');
    setDescription('');
    setTarget('');
    setTargetId('');
  };

  const handleOpenNewDialog = (type, selectionType) => {
    setCurrentSelectionType(selectionType);
    if (type === 'asset') {
      setOpenAssetDialog(true);
    } else if (type === 'liability') {
      setOpenLiabilityDialog(true);
    }
  };

  const handleSaveNewAsset = (refreshNeeded) => {
    if (refreshNeeded) {
      assetCache.current[userId] = null; // Invalidate specific user's asset cache
      setCacheRefreshKey(prev => prev + 1); // Increment to trigger useEffect
      setSnackbarMessage('New Asset added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    setOpenAssetDialog(false);
  };

  const handleSaveNewLiability = (refreshNeeded) => {
    if (refreshNeeded) {
      liabilityCache.current[userId] = null; // Invalidate specific user's liability cache
      setCacheRefreshKey(prev => prev + 1); // Increment to trigger useEffect
      setSnackbarMessage('New Liability added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    setOpenLiabilityDialog(false);
  };

  const getOptions = (type) => {
    if (type === 'asset') {
      return assets;
    } else if (type === 'liability') {
      return liabilities;
    }
    return [];
  };

  const handleSourceChange = (e) => {
    setSource(e.target.value);
    setSourceId(''); // Clear sourceId when source type changes
  };

  const handleTargetChange = (e) => {
    setTarget(e.target.value);
    setTargetId(''); // Clear targetId when target type changes
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{itemData ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                id="description"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="amount"
                label="Amount"
                type="number"
                fullWidth
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="category"
                label="Category"
                type="text"
                fullWidth
                variant="outlined"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="source-label">Source</InputLabel>
                <Select
                  labelId="source-label"
                  id="source"
                  value={source}
                  label="Source"
                  onChange={handleSourceChange}
                >
                  <MenuItem value={"income"}>Income</MenuItem>
                  <MenuItem value={"expense"}>Expense</MenuItem>
                  <MenuItem value={"asset"}>Asset</MenuItem>
                  <MenuItem value={"liability"}>Liability</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {['asset', 'liability'].includes(source) && (
              <Grid item xs={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="source-id-label">Source {String(source).charAt(0).toUpperCase() + String(source).slice(1)}</InputLabel>
                  <Select
                    labelId="source-id-label"
                    id="sourceId"
                    value={sourceId}
                    label="Source ID"
                    onChange={(e) => setSourceId(e.target.value)}
                  >
                    {getOptions(source).map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.name}
                      </MenuItem>
                    ))}
                    <MenuItem value="addNew" onClick={() => handleOpenNewDialog(source, 'source')}>
                      <em>Add new...</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="target-label">Target</InputLabel>
                <Select
                  labelId="target-label"
                  id="target"
                  value={target}
                  label="Target"
                  onChange={handleTargetChange}
                >
                  <MenuItem value={"income"}>Income</MenuItem>
                  <MenuItem value={"expense"}>Expense</MenuItem>
                  <MenuItem value={"asset"}>Asset</MenuItem>
                  <MenuItem value={"liability"}>Liability</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {['asset', 'liability'].includes(target) && (
              <Grid item xs={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="target-id-label">Target {String(target).charAt(0).toUpperCase() + String(target).slice(1)}</InputLabel>
                  <Select
                    labelId="target-id-label"
                    id="targetId"
                    value={targetId}
                    label="Target ID"
                    onChange={(e) => setTargetId(e.target.value)}
                  >
                    {getOptions(target).map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.name}
                      </MenuItem>
                    ))}
                    <MenuItem value="addNew" onClick={() => handleOpenNewDialog(target, 'target')}>
                      <em>Add new...</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClear}>Clear</Button>
          {itemData && (
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
          )}
          <Button onClick={() => onClose(false)}>Cancel</Button> {/* Pass false on cancel */}
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <AssetDialog
        open={openAssetDialog}
        onClose={handleSaveNewAsset} // Pass handleSaveNewAsset as onClose
        itemData={null} // Always add new
      />
      <LiabilityDialog
        open={openLiabilityDialog}
        onClose={handleSaveNewLiability} // Pass handleSaveNewLiability as onClose
        itemData={null} // Always add new
      />
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </>
  );
}

export default TransactionDialog;
