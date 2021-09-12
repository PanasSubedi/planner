import { useState } from 'react';

import {
  Container, Grid,
  Button, TextField,
  Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  IconButton,
} from '@material-ui/core';

import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

export const AddEditDialog = ({
  showCreateDialog, setShowCreateDialog,
  handleCreateEditTask,
  newTaskTitle, setNewTaskTitle,
  newTaskDate, setNewTaskDate,
  createDialogTitle,
  createError,
  classes,
}) => {

  return (
    <Dialog
      open={showCreateDialog}
      onClose={() => setShowCreateDialog(false)}
      fullWidth
    >
      <DialogTitle id="form-dialog-title">{createDialogTitle} task</DialogTitle>
      <DialogContent>
        <TextField
          value={newTaskTitle}
          onChange={event => setNewTaskTitle(event.target.value)}
          label="Title"
          className={classes.newTaskInput}
          fullWidth
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker fullWidth className={classes.newTaskInput} value={newTaskDate} onChange={setNewTaskDate} />
        </MuiPickersUtilsProvider>
        <Typography variant="caption" className={classes.errorMessage}>
          { createError !== '' && <>Error: {createError}<br /></>}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowCreateDialog(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleCreateEditTask('POST', '/api/tasks')} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
