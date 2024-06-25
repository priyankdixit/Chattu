import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import React from 'react'

const ConfirmDeleteDialog = ({open,handleClose,deleteHandler}) => {
  return (
    <Dialog open={open} onClose={handleClose}>Confirm Delete
    <DialogContent>
        <DialogContentText>
            Are you sure u wnat to delet this grp?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleClose}>No</Button>
        <Button onClick={deleteHandler} color='error'>Yes</Button>
    </DialogActions>
    </Dialog>
  )
}

export default ConfirmDeleteDialog