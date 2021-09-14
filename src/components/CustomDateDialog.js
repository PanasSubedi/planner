import { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Button, Checkbox, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography
} from '@material-ui/core';

import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const useStyles = makeStyles(() => ({
  datePicker: {
    marginBottom: 10
  }
}))

export const CustomDateDialog = ({
  showDateRangeDialog, setShowDateRangeDialog,
  setCustomDateRange,
}) => {

  const [dateRange, setDateRange] = useState(true);

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const changeDateRange = () => {
    if (dateRange){
      setSelectedDateRange({
        startDate: selectedDateRange.startDate,
        endDate: selectedDateRange.startDate,
      })
    }

    setDateRange(!dateRange);
  }

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

  const classes = useStyles();

  return (
    <Dialog
      open={showDateRangeDialog}
      onClose={() => setShowDateRangeDialog(false)}
      aria-labelledby="form-dialog-title"
      fullWidth
    >
      <DialogTitle id="form-dialog-title">Choose custom date</DialogTitle>
      <DialogContent>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          { dateRange && <Typography variant="caption">From</Typography>}
          <DatePicker
            className={classes.datePicker}
            value={selectedDateRange.startDate}
            onChange={newDate => handleDateChange('start', newDate)}
            fullWidth autoOk
          />

          { dateRange &&
            <>
              <Typography variant="caption">To</Typography>
              <DatePicker
                className={classes.datePicker}
                value={selectedDateRange.endDate}
                onChange={newDate => handleDateChange('end', newDate)}
                fullWidth autoOk
              />
            </>
          }
        </MuiPickersUtilsProvider>

        <FormControlLabel
          control={
            <Checkbox
              checked={dateRange}
              onChange={changeDateRange}
              color="primary"
            />
          }
          label="Date Range"
        />

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
