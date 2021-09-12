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
  startOfMonth, lastDayOfMonth,
  startOfWeek, endOfWeek,
  format as dateFnsFormat,
} from 'date-fns';

import { TasksView } from './components/TasksView';
import { CustomDateDialog } from './components/CustomDateDialog';
import { AddEditDialog } from './components/AddEditDialog';

import { handleDelete } from './helpers/handleDelete';
import { handleAddEdit } from './helpers/handleAddEdit';
import { renderPagination } from './helpers/renderPagination';

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

  const setCustomDateRange = (startDate, endDate) => {
    setDateRange({
      startDate: startDate,
      endDate: endDate,
    });
    setDateRangeLabel(null);
    setShowDateRangeDialog(false);
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

    handleAddEdit(
      url, method,
      newTaskTitle, newTaskDate, getDateInFormat,
      setLoading, setDateRange, setShowCreateDialog, setDateRangeLabel, setCreateError,
    );

  }

  const deleteTask = taskID => {
    handleDelete(
      taskID,
      setLoading,
      dateRange, setDateRange,
      setErrorMessage,
    )
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
          <Button onClick={() => setShowDateRangeDialog(true)}>custom date</Button>
        </Grid>
        <Grid item sm={12}>


          <TasksView
            tasks={tasks}
            getDateInFormat={getDateInFormat}
            handleCreateEditButtonPress={handleCreateEditButtonPress}
            deleteTask={deleteTask}
          />

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
              { renderPagination(links, currentPage, setCurrentPage) }
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <CustomDateDialog
        showDateRangeDialog={showDateRangeDialog}
        setShowDateRangeDialog={setShowDateRangeDialog}
        setCustomDateRange={setCustomDateRange}
      />

      <AddEditDialog
        showCreateDialog={showCreateDialog}
        setShowCreateDialog={setShowCreateDialog}
        handleCreateEditTask={handleCreateEditTask}
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        newTaskDate={newTaskDate}
        setNewTaskDate={setNewTaskDate}
        createDialogTitle={createDialogTitle}
        createError={createError}
        classes={classes}
      />

    </Container>
  );
}

export default App;
