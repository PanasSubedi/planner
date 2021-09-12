import { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Container, Grid,
  Typography,
  FormControlLabel, Switch,
} from '@material-ui/core';

import {
  format as dateFnsFormat,
} from 'date-fns';

import { TaskListView } from './components/TaskListView';
import { CalendarView } from './components/CalendarView';

import { AddEditDialog } from './components/AddEditDialog';

import { fetchData } from './helpers/fetchData';
import { handleAddEdit } from './helpers/handleAddEdit';
import { handleDelete } from './helpers/handleDelete';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  },
  newTaskInput: {
    marginBottom: 25
  }
}));

function App() {

  const [calendarView, setCalendarView] = useState(false);

  const [tasks, setTasks] = useState([]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(new Date());
  const [createDialogTitle, setCreateDialogTitle] = useState('Create');
  const [createError, setCreateError] = useState('');
  const [editTaskID, setEditTaskID] = useState(0);

  const [links, setLinks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [totalTasks, setTotalTasks] = useState(0);

  const [dateRange, setDateRange] = useState({startDate: new Date(), endDate: new Date()});

  useEffect(() => {
    const startDate = getDateInFormat(dateRange.startDate, 'api');
    const endDate = getDateInFormat(dateRange.endDate, 'api');

    if (currentPage !== 1){
      setCurrentPage(1);
    }

    else {
      fetchData(
        setLoading, setErrorMessage, setTasks, setTotalTasks, setLinks,
        startDate, endDate, currentPage
      );
    }
  }, [dateRange]);

  useEffect(() => {
    const startDate = getDateInFormat(dateRange.startDate, 'api');
    const endDate = getDateInFormat(dateRange.endDate, 'api');

    fetchData(
      setLoading, setErrorMessage, setTasks, setTotalTasks, setLinks,
      startDate, endDate, currentPage
    );

  }, [currentPage])

  const getDateInFormat = (date, format) => {
    if (format === 'api'){
      return dateFnsFormat(date, 'dd-MM-yyyy');
    }

    else if (format === 'display'){
      return dateFnsFormat(date, 'dd-LLL-yyyy');
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

    handleAddEdit(
      url, method,
      newTaskTitle, newTaskDate, getDateInFormat,
      setLoading, setDateRange, setShowCreateDialog, setCreateError,
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
      <Grid container>
        <Grid item sm={10}>
          <Typography variant="h5" className={classes.title}>
            Planner
          </Typography>
        </Grid>
        <Grid item sm={2} style={{textAlign: 'right'}}>
          <FormControlLabel
            control={
              <Switch
                checked={calendarView}
                onChange={() => setCalendarView(!calendarView)}
                color="primary"
              />
            }
            label="Calendar"
          />
        </Grid>
      </Grid>

      {
        calendarView
        ?
          <CalendarView
            tasks={tasks} deleteTask={deleteTask} totalTasks={totalTasks}
            getDateInFormat={getDateInFormat} loading={loading}
            handleCreateEditButtonPress={handleCreateEditButtonPress}
            setDateRange={setDateRange}
            links={links}
            currentPage={currentPage} setCurrentPage={setCurrentPage}
          />
        :
          <TaskListView
            tasks={tasks} deleteTask={deleteTask} totalTasks={totalTasks}
            errorMessage={errorMessage} loading={loading}
            getDateInFormat={getDateInFormat}
            handleCreateEditButtonPress={handleCreateEditButtonPress}
            currentPage={currentPage} setCurrentPage={setCurrentPage}
            links={links}
            dateRange={dateRange} setDateRange={setDateRange}
          />
      }

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
