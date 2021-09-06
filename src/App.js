import { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Container, Grid,
  List, ListItem,
  Button,
  Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@material-ui/core';

import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import { startOfMonth, lastDayOfMonth, startOfWeek, endOfWeek } from 'date-fns';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {

  },
  title: {
    flexGrow: 1,
  },
  errorMessage: {
    color: 'red',
  }
}));

const TIME_RANGE_LABELS = [
  {
    id: 1,
    label: 'today',
  },
  {
    id: 2,
    label: 'this week',
  },
  {
    id: 3,
    label: 'this month',
  },
];

function App() {

  const [dateRangeLabel, setDateRangeLabel] = useState(TIME_RANGE_LABELS[0].id)
  const [dateRange, setDateRange] = useState({startDate: new Date(), endDate: new Date()})

  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showDateRangeDialog, setShowDateRangeDialog] = useState(false);

  useEffect(() => {
    if (dateRangeLabel === 1){
      // today
      setDateRange({
        startDate: new Date(),
        endDate: new Date()
      });
    }

    else if (dateRangeLabel === 2){
      // this week
      const today = new Date();
      setDateRange({
        startDate: startOfWeek(today),
        endDate: endOfWeek(today)
      })
    }

    else if (dateRangeLabel === 3){
      // this month
      const today = new Date();
      setDateRange({
        startDate: startOfMonth(today),
        endDate: lastDayOfMonth(today)
      })
    }

  }, [dateRangeLabel]);

  useEffect(() => {
    const startDate = getDateInAPIFormat(dateRange.startDate);
    const endDate = getDateInAPIFormat(dateRange.endDate);

    setLoading(true);
    fetch('api/tasks/'+startDate+'/'+endDate)
      .then(response => response.json())
      .then(data => {

        if ('error' in data){
          setTotalTasks(0);
          setTasks([]);
          setErrorMessage(data.error);
          setLoading(false);
        }

        else {
          setTotalTasks(data.total_items);
          setTasks(data.items);
          setLoading(false);
        }
      })
      .catch(() => {
        setTasks([]);
        setErrorMessage('Internal error. Failed to retrieve tasks.');
        setLoading(false);
      });

  }, [dateRange]);

  const getLabelForSelectedRange = () => {
    const label = TIME_RANGE_LABELS.filter(label => label.id === dateRangeLabel)
    if (label.length === 1){
      return label[0].label.charAt(0).toUpperCase() + label[0].label.slice(1) + '\'s tasks';
    }

    else {
      return ''
    }
  }

  const getDateInAPIFormat = date => {
    return date.getDate().toString() + "-"
          + (date.getMonth()+1).toString() + "-"
          + (date.getFullYear()).toString();
  }

  const handleDateChange = (startEnd, newDate) => {
    if (startEnd === 'start'){
      setSelectedDateRange(prevRange => ({startDate: newDate, endDate: prevRange.endDate}));
    }
    else {
      setSelectedDateRange(prevRange => ({startDate: prevRange.startDate, endDate: newDate}));
    }
  }

  const setCustomDateRange = () => {
    setDateRange({
      startDate: selectedDateRange.startDate,
      endDate: selectedDateRange.endDate,
    });
    setShowDateRangeDialog(false);
  }

  const showCustomDateDialog = () => {
    setSelectedDateRange({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    })
    setDateRangeLabel(null);
    setShowDateRangeDialog(true);
  }

  const classes = useStyles();

  return (
    <Container>
      <Typography variant="h5" className={classes.title}>
        Planner
      </Typography>
      <Grid container>
        <Grid item sm={8}>
          <Typography variant="h6">{ getLabelForSelectedRange() }</Typography>
          <Typography variant="caption">{getDateInAPIFormat(dateRange.startDate)} to {getDateInAPIFormat(dateRange.endDate)}</Typography>
        </Grid>
        <Grid item sm={4}>
          { TIME_RANGE_LABELS.map(label => (
            <Button
              disabled={label.id === dateRangeLabel}
              onClick={() => setDateRangeLabel(label.id)}
              key={label.id}
            >{label.label}</Button>
          )) }
          <Button onClick={showCustomDateDialog}>custom date</Button>
        </Grid>
        <Grid item sm={12}>
          <List>
            { tasks.map((task, index) => (
              <ListItem
                divider
                key={task.id}
              >
                { `${index+1}.  ${task.title}` }
              </ListItem>
            )) }
          </List>
          <Typography variant="caption" className={classes.errorMessage}>
            { errorMessage !== '' && <>Error: {errorMessage}<br /></>}
          </Typography>

          <Typography variant="caption">
            { loading ? <>Loading...</> : <>{totalTasks} total tasks</> }
          </Typography>
        </Grid>
      </Grid>

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
          <Button onClick={setCustomDateRange} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

export default App;
