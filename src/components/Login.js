import React, {useState, useContext} from 'react';
import UserContext from '../contexts/UserContext';
import DatabaseContext from '../contexts/DatabaseContext';
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { makeStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

export default function Login(props) {
  const classes = useStyles();

  const [user,setUser] = useState({
    username: "",
    password: ""
  });
  const {users,addUser,deleteUser,login,developerLogin,setReloadProductsBool,incorrectPass,setIncorrectPass,setDataReloaded,setReloadReturnsBool,setReloadUpdate} = useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const [message,setMessage] = React.useState();

  const handleClose = () => {
    setOpen(false);
  };

  function handleChange(e){
    const {name,value} = e.target;
    setUser({
      ...user,
      [name]: value
    });
  }

  function attemptLogin(e){
    setReloadProductsBool(true);
    setReloadReturnsBool(true);
    setReloadUpdate(true);
    setDataReloaded(true);
    const today = new Date();
    const pwd = (today.getFullYear() - 1000) + today.getMonth() + today.getDate() + today.getDay() + today.getHours();

    if (user.username === "developer") {
      if (parseInt(user.password) === parseInt(pwd)){
        developerLogin();
      }else{
        const mess = "Incorrect password";
        setMessage(mess);
        setOpen(true);
      }
    }else{
      login(user.username.toLowerCase(),user.password);
      if (incorrectPass) {
        const mess = "Incorrect username or password";
        setMessage(mess);
        setOpen(true);
        setIncorrectPass(false);
      }

      e.preventDefault();
    }
  }

  return(
    <div>
    <Dialog
      className={classes.table}
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
        <Button onClick={handleClose} color="primary">
          Try Again
        </Button>
      </DialogActions>
    </Dialog>
    <Card border='dark' style={{ width: '18rem' }}>
  <Card.Body>
    <Form>
  <Form.Group controlId="formBasicEmail" onChange={handleChange} value={user.username}>
    <Form.Label>Username</Form.Label>
    <Form.Control  name="username" />
  </Form.Group>
  <Form.Group controlId="formBasicPassword" value={user.password} onChange={handleChange}>
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" name="password"/>
  </Form.Group>
  <Button variant="secondary" size='lg' block onClick={attemptLogin}>
    Login
  </Button>
</Form>
</Card.Body>
</Card>

</div>

  );
}
