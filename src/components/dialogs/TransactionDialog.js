import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function TransactionDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add/Edit Transaction</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Content for Transaction Dialog will go here.
        </Typography>
        {/* Add form fields for transaction details */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClose} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TransactionDialog;
