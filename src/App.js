import { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Container, Grid,
  List, ListItem,
  Button,
  Typography,
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

  useEffect(() => {
    if (dateRangeLabel === 1){
      // today
      setDateRange({
        startDate: new Date(),
        endDate: new Date()
      })
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
        setTotalTasks(data.total_items);
        setTasks(data.items);
        setLoading(false);
      })
      .catch(() => {
        setTasks([]);
        setErrorMessage('Internal error. Failed to retrieve tasks.');
        setLoading(false);
      });

  }, [dateRange]);

  const getDateInAPIFormat = date => {
    return date.getDate().toString() + "-"
          + (date.getMonth()+1).toString() + "-"
          + (date.getFullYear()).toString()
  }

  const classes = useStyles();

  return (
    <Container>
      <Typography variant="h5" className={classes.title}>
        Planner
      </Typography>
      <Grid container>
        <Grid item sm={8}>
          <Typography variant="h6">Today's tasks</Typography>
        </Grid>
        <Grid item sm={4}>
          { TIME_RANGE_LABELS.map(label => (
            <Button
              disabled={label.id === dateRangeLabel}
              onClick={() => setDateRangeLabel(label.id)}
              key={label.id}
            >{label.label}</Button>
          )) }
          <Button onClick={() => setDateRangeLabel(null)}>custom date</Button>
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
            { errorMessage !== '' && <>{errorMessage}<br /></>}
          </Typography>

          <Typography variant="caption">
            { loading ? <>Loading...</> : <>{totalTasks} total tasks</> }
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
