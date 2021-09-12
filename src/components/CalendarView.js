import { useState, useEffect } from 'react';

import Calendar from 'react-calendar';
import '../styles/Calendar.css';

import {
  Grid,
  Typography,
  Button,
} from '@material-ui/core';

import {
  format as dateFnsFormat
} from 'date-fns';

import { TasksView } from './TasksView';

export const CalendarView = ({
  tasks, deleteTask, totalTasks,
  getDateInFormat,
  handleCreateEditButtonPress,
  setDateRange,
  loading, links,
  currentPage, setCurrentPage,
}) => {

  const [date, setDate] = useState(new Date());

  useEffect(() => {

    setDateRange({
      startDate: date,
      endDate: date
    })

  }, [date]);

  return (
    <Grid container spacing={2}>
      <Grid item sm={6}>
        <Calendar
          onChange={setDate}
          value={date}
        />
      </Grid>
      <Grid item sm={6}>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6">{dateFnsFormat(date, 'dd LLLL, yyyy')}</Typography>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={() => handleCreateEditButtonPress(0)}>create</Button>
          </Grid>
        </Grid>

        <TasksView
          tasks={tasks} totalTasks={totalTasks}
          showDate={false}
          getDateInFormat={getDateInFormat}
          handleCreateEditButtonPress={handleCreateEditButtonPress}
          deleteTask={deleteTask}
          loading={loading} links={links}
          currentPage={currentPage} setCurrentPage={setCurrentPage}
        />

      </Grid>
    </Grid>
  )
}
