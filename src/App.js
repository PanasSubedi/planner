import { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Container, Grid,
  List, ListItem,
  Button,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {

  },
  title: {
    flexGrow: 1,
  },
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

  const [timeRangeLabel, setTimeRangeLabel] = useState(TIME_RANGE_LABELS[0].id)
  const [tasks, setTasks] = useState([]);

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
              disabled={label.id === timeRangeLabel}
              onClick={() => setTimeRangeLabel(label.id)}
            >{label.label}</Button>
          )) }
          <Button onClick={() => setTimeRangeLabel(null)}>custom date</Button>
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
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
