import { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Grid,
  Button,
  Typography,
} from '@material-ui/core';

import {
  startOfMonth, lastDayOfMonth,
  startOfWeek, endOfWeek,
} from 'date-fns';

import { TasksView } from './TasksView';
import { CustomDateDialog } from './CustomDateDialog';

const useStyles = makeStyles(theme => ({
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

export const TaskListView = ({
  tasks, deleteTask, totalTasks,
  errorMessage, loading,
  getDateInFormat,
  handleCreateEditButtonPress,
  currentPage, setCurrentPage,
  links,
  dateRange, setDateRange,
}) => {

  const [dateRangeLabel, setDateRangeLabel] = useState(TIME_RANGE_LABELS[0].id)

  const [showDateRangeDialog, setShowDateRangeDialog] = useState(false);

  useEffect(() => {

    // on change of labels, change date range which in turn fetches new data (App.js)
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

  }, [dateRangeLabel, setDateRange]);

  const getLabelForSelectedRange = () => {
    const label = TIME_RANGE_LABELS.filter(label => label.id === dateRangeLabel)
    if (label.length === 1){
      return label[0].label.charAt(0).toUpperCase() + label[0].label.slice(1) + '\'s tasks';
    }

    else {
      return ''
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

  const classes = useStyles();

  return (
    <>
      <Grid container>
        <Grid item sm={6}>
          <Typography variant="h6">{ getLabelForSelectedRange() }</Typography>
          <Typography variant="caption">{getDateInFormat(dateRange.startDate, 'display')} to {getDateInFormat(dateRange.endDate, 'display')}</Typography>
        </Grid>
        <Grid item sm={2} style={{textAlign: 'right'}}>
          <Button variant="outlined" onClick={() => handleCreateEditButtonPress(0, new Date())}>create</Button>
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
            tasks={tasks} totalTasks={totalTasks}
            getDateInFormat={getDateInFormat}
            handleCreateEditButtonPress={handleCreateEditButtonPress}
            deleteTask={deleteTask}
            loading={loading} links={links}
            currentPage={currentPage} setCurrentPage={setCurrentPage}
          />

          <Typography variant="caption" className={classes.errorMessage}>
            { errorMessage !== '' && <>Error: {errorMessage}<br /></>}
          </Typography>

        </Grid>
      </Grid>

      <CustomDateDialog
        showDateRangeDialog={showDateRangeDialog}
        setShowDateRangeDialog={setShowDateRangeDialog}
        setCustomDateRange={setCustomDateRange}
      />

    </>
  )
}
