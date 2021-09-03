import React, {useContext} from 'react';
import UserContext from '../contexts/UserContext';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});


function Users(props){
  const [open, setOpen] = React.useState(false);
  const [message,setMessage] = React.useState();
  const [dUserName,setDUserName] = React.useState("");
  const {users,addUser,deleteUser,login} = useContext(UserContext);
  const classes = useStyles();

  const handleClick = (username, event) => {
    const mess = "Delete user " + username;
    setMessage(mess);
    setDUserName(username);
    setOpen(true);

    event.preventDefault();
  }
  const handleRemove = () => {
    deleteUser(dUserName);
    setOpen(false);
  }

  const handleClose = () => {
    setOpen(false);
  }
  return(
    <div>
          <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell align="right">Authentication</TableCell>
            <TableCell align="right">Action</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {users.availableUsers.map((row) => (
            (row.username !== "admin") &&
            (<TableRow key={row.username}>
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell align="right">{row.auth}</TableCell>
              <TableCell align="right">
              <Button color="secondary"  size='lg'  block onClick={(e) => handleClick(row.username,e)}>
                Delete User
              </Button>
              </TableCell>
            </TableRow>)
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
    <DialogTitle id="alert-dialog-slide-title">{"App Alert"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {message}
        </DialogContentText>

      </DialogContent>
      <DialogActions>

        <Button style={{margin: "10px"}} onClick={handleClose} color="primary">
          NO
        </Button>
        <Button style={{margin: "10px"}} onClick={handleRemove} color="secondary">
          YES
        </Button>

      </DialogActions>
    </Dialog>
    </div>
  )
}

export default Users;
