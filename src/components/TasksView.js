import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  IconButton,
  Grid,
  Typography
} from '@material-ui/core';

import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';

import { renderPagination } from '../helpers/renderPagination';

export const TasksView = ({
  tasks, totalTasks,
  getDateInFormat = date => "",
  showDate = true,
  handleCreateEditButtonPress, deleteTask,
  loading, links,
  currentPage, setCurrentPage
}) => (
  <>
    { tasks.length !== 0 && <TableContainer>
      <Table aria-label="table">
        <TableHead>
          <TableRow>
            <TableCell width="5%">SN</TableCell>
            {showDate && <TableCell width="10%">Date</TableCell>}
            <TableCell width="75%">Task</TableCell>
            <TableCell width={ showDate ? "10%" : "20%"}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { tasks.map((task, index) => (
              <TableRow hover key={task._id}>
                <TableCell>
                  { index+1 }</TableCell>
                { showDate && <TableCell>
                  { getDateInFormat(new Date(task.date), 'display') }
                </TableCell> }
                <TableCell>
                  { task.title }
                </TableCell>
                <TableCell style={{textAlign: 'right'}}>
                  <IconButton onClick={() => handleCreateEditButtonPress(task._id)} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => deleteTask(task._id)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer> }
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
  </>
)
