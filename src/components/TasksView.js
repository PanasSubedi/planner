import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  IconButton,
} from '@material-ui/core';

import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';

export const TasksView = ({
  tasks,
  getDateInFormat,
  handleCreateEditButtonPress, deleteTask,
}) => (
  <>
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
  </>
)
