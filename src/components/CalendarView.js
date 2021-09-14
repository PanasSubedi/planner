import { useState, useEffect } from 'react';

import Calendar from 'react-calendar';
import '../styles/Calendar.css';

import {
  Grid,
  Typography,
  Button,
} from '@material-ui/core';

import {
  startOfMonth, lastDayOfMonth,
  format as dateFnsFormat
} from 'date-fns';

import { TasksView } from './TasksView';

let tasksExist = {};

export const CalendarView = ({
  tasks, deleteTask, totalTasks,
  getDateInFormat,
  handleCreateEditButtonPress,
  setDateRange,
  loading, links,
  currentPage, setCurrentPage,
}) => {

  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {

    setDateRange({
      startDate: calendarDate,
      endDate: calendarDate
    })

  }, [calendarDate]);

  useEffect(() => {
    const firstDay = startOfMonth(calendarDate).getDate();
    const lastDay = lastDayOfMonth(calendarDate).getDate();

    for (let i=firstDay; i<=lastDay; i++){
      const currentDate = new Date(calendarDate.getMonth()+1 + "-" + i + "-" + calendarDate.getFullYear())
      fetch(
        '/api/tasks/' + getDateInFormat(currentDate, 'api') + '/' + 'exist'
      ).then(
        response => response.json()
      ).then(
        data => {
          if ('error' in data){
            alert("Internal error.");
          }

          else {
            tasksExist[i] = data.exist;
          }
        }
      ).catch(
        err => alert("Internal error.")
      )
    }
  }, [calendarDate.getMonth(), calendarDate.getYear()]);

  return (
    <Grid container spacing={2}>
      <Grid item sm={6}>
        <Calendar
          onChange={setCalendarDate}
          value={calendarDate}
          tileContent={({ date }) => date.getMonth() === calendarDate.getMonth() && tasksExist[date.getDate()] ? "*" : ""}
        />
      </Grid>
      <Grid item sm={6}>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6">{dateFnsFormat(calendarDate, 'dd LLLL, yyyy')}</Typography>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={() => handleCreateEditButtonPress(0, calendarDate)}>create</Button>
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
