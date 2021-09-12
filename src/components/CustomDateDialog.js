import { useState } from 'react';

import {
  Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@material-ui/core';

import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

export const CustomDateDialog = ({
  showDateRangeDialog, setShowDateRangeDialog,
  setCustomDateRange,
}) => {

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleDateChange = (startEnd, newDate) => {
    if (startEnd === 'start'){
      setSelectedDateRange(prevRange => ({startDate: newDate, endDate: prevRange.endDate}));
    }
    else {
      setSelectedDateRange(prevRange => ({startDate: prevRange.startDate, endDate: newDate}));
    }
  }

  const returnSelectedData = () => {
    setCustomDateRange(selectedDateRange.startDate, selectedDateRange.endDate);
  }

  return (
    <Dialog open={showDateRangeDialog} onClose={() => setShowDateRangeDialog(false)} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Choose custom date</DialogTitle>
      <DialogContent>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker value={selectedDateRange.startDate} onChange={newDate => handleDateChange('start', newDate)} />
          <DatePicker value={selectedDateRange.endDate} onChange={newDate => handleDateChange('end', newDate)} />
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowDateRangeDialog(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={returnSelectedData} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
