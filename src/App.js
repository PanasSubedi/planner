import { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

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

import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';

import {
  startOfMonth, lastDayOfMonth,
  startOfWeek, endOfWeek,
  format as dateFnsFormat,
} from 'date-fns';

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
  },
  newTaskInput: {
    marginBottom: 25
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

  const [links, setLinks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showDateRangeDialog, setShowDateRangeDialog] = useState(false);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(new Date());
  const [createError, setCreateError] = useState('');
  const [createDialogTitle, setCreateDialogTitle] = useState('Create');
  const [editTaskID, setEditTaskID] = useState(0);

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
    const startDate = getDateInFormat(dateRange.startDate, 'api');
    const endDate = getDateInFormat(dateRange.endDate, 'api');

    if (currentPage !== 1){
      setCurrentPage(1);
    }

    else {

      setLoading(true);
      setErrorMessage('');
      setTasks([]);
      setTotalTasks(0);
      setLinks({});

      fetch('api/tasks/'+startDate+'/'+endDate+'?page='+currentPage)
        .then(response => response.json())
        .then(data => {

          if ('error' in data){
            setErrorMessage(data.error);
            setLoading(false);
          }

          else {
            setTotalTasks(data.total_items);
            setTasks(data.items);
            setLoading(false);
            setLinks(data.links);
          }
        })
        .catch(() => {
          setErrorMessage('Internal error. Failed to retrieve tasks.');
          setLoading(false);
        });

    }
  }, [dateRange]);

  useEffect(() => {
    const startDate = getDateInFormat(dateRange.startDate, 'api');
    const endDate = getDateInFormat(dateRange.endDate, 'api');

    setLoading(true);
    setErrorMessage('');
    setTasks([]);
    setTotalTasks(0);
    setLinks({});

    fetch('api/tasks/'+startDate+'/'+endDate+'?page='+currentPage)
      .then(response => response.json())
      .then(data => {

        if ('error' in data){
          setErrorMessage(data.error);
          setLoading(false);
        }

        else {
          setTotalTasks(data.total_items);
          setTasks(data.items);
          setLoading(false);
          setLinks(data.links);
        }
      })
      .catch(() => {
        setErrorMessage('Internal error. Failed to retrieve tasks.');
        setLoading(false);
      });
  }, [currentPage])

  const getLabelForSelectedRange = () => {
    const label = TIME_RANGE_LABELS.filter(label => label.id === dateRangeLabel)
    if (label.length === 1){
      return label[0].label.charAt(0).toUpperCase() + label[0].label.slice(1) + '\'s tasks';
    }

    else {
      return ''
    }
  }

  const getDateInFormat = (date, format) => {
    if (format === 'api'){
      return dateFnsFormat(date, 'dd-MM-yyyy');
    }

    else if (format === 'display'){
      return dateFnsFormat(date, 'dd-LLL-yyyy');
    }
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
    setDateRangeLabel(null);
    setShowDateRangeDialog(false);
  }

  const showCustomDateDialog = () => {
    setSelectedDateRange({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    })
    setShowDateRangeDialog(true);
  }

  const renderPagination = () => {

    if (Object.keys(links).length === 0){
      return
    }

    else if (links.next_page === null && links.prev_page === null){
      return
    }

    else {
      return (
        <>
          <Button onClick={() => setCurrentPage(currentPage-1)} disabled={links.prev_page === null}>&lt;</Button>
          <Typography variant="caption">Page { currentPage }</Typography>
          <Button onClick={() => setCurrentPage(currentPage+1)} disabled={links.next_page === null}>&gt;</Button><br/>
        </>
      )
    }

  }

  const handleCreateEditButtonPress = (taskID) => {

    if (taskID === 0){
      setEditTaskID(0);
      setNewTaskDate(new Date());
      setNewTaskTitle('');
      setCreateDialogTitle('Create');
    }

    else {
      const task = tasks.filter(task => task._id === taskID)[0];
      setEditTaskID(taskID);
      setNewTaskDate(new Date(task.date));
      setNewTaskTitle(task.title);
      setCreateDialogTitle('Edit');
    }

    setCreateError('');
    setShowCreateDialog(true);
  }

  const handleCreateEditTask = () => {

    let method, url;
    if (createDialogTitle === 'Create'){
      method = 'POST';
      url = '/api/tasks';
    }

    else if (createDialogTitle === 'Edit'){
      method = 'PUT';
      url = '/api/tasks/' + editTaskID;
    }

    setLoading(true);
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'title': newTaskTitle,
        'date': getDateInFormat(newTaskDate, 'api'),
      })
    }).then(
      response => {
        if (response.status === 200){
          setDateRange({
            startDate: newTaskDate,
            endDate: newTaskDate,
          });

          setLoading(false);
          setShowCreateDialog(false);
          return {};
        }

        else {
          return response.json();
        }
      }
    ).then(
      data => {
        if ('error' in data){
          setCreateError('Error: ' + data.error);
          setLoading(false);
        }
      }
    ).catch( err => {
      setCreateError('Internal error. Failed to create task.');
      setLoading(false);
    });
  }

  const handleDelete = taskID => {

    setLoading(true);
    fetch('/api/tasks/'+ taskID, {
      method: 'DELETE',
    }).then(
      response => {
        if (response.status === 200){
          setDateRange({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          });

          setLoading(false);
          return {};
        }

        else {
          return response.json();
        }
      }
    ).then(
      data => {
        if ('error' in data){
          setErrorMessage('Error: ' + data.error);
          setLoading(false);
        }
      }
    ).catch( err => {
      setCreateError('Internal error. Failed to delete task.');
      setLoading(false);
    });
  }

  const classes = useStyles();

  return (
    <Container>
      <Typography variant="h5" className={classes.title}>
        Planner
      </Typography>
      <Grid container>
        <Grid item sm={6}>
          <Typography variant="h6">{ getLabelForSelectedRange() }</Typography>
          <Typography variant="caption">{getDateInFormat(dateRange.startDate, 'display')} to {getDateInFormat(dateRange.endDate, 'display')}</Typography>
        </Grid>
        <Grid item sm={2} style={{textAlign: 'right'}}>
          <Button variant="outlined" onClick={() => handleCreateEditButtonPress(0)}>create</Button>
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


          { tasks.length !== 0 && <TableContainer>
            <Table aria-label="table">
              <TableHead>
                <TableRow>
                  <TableCell width="5%">SN</TableCell>
                  <TableCell width="10%">Date</TableCell>
                  <TableCell width="75%">Task</TableCell>
                  <TableCell width="10%"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { tasks.map((task, index) => (
                    <TableRow hover key={task._id}>
                      <TableCell>
                        { index+1 }</TableCell>
                      <TableCell>
                        { getDateInFormat(new Date(task.date), 'display') }
                      </TableCell>
                      <TableCell>
                        { task.title }
                      </TableCell>
                      <TableCell style={{textAlign: 'right'}}>
                        <IconButton onClick={() => handleCreateEditButtonPress(task._id)} size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(task._id)} size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer> }

          <Typography variant="caption" className={classes.errorMessage}>
            { errorMessage !== '' && <>Error: {errorMessage}<br /></>}
          </Typography>

          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="caption">
                { loading ? <>Loading...</> : <>{totalTasks} total tasks</> }
              </Typography>
            </Grid>
            <Grid item>
              { renderPagination() }
            </Grid>
          </Grid>
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
          <Button onClick={handleCreateEditTask} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

export default App;
