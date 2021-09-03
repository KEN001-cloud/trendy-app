import React, {useState, useContext} from 'react';
//import {} from '../contexts/UserContext';
import {bcrypt} from '../App';

import UserContext, {usersDB} from '../contexts/UserContext';

import Form from "react-bootstrap/Form";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";
import Card from "react-bootstrap/Card";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const saltRounds = 10;


function AdminUser(props) {
  const {users,addUser,deleteUser,login} = useContext(UserContext);
  console.log("users data",users);

  const classes = useStyles();
  const [authOption, setOption] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState({
    username: "",
    password: "",
    auth: ""
  });

  const [message,setMessage] = React.useState();

  const options = ['User','Admin'];
  const defaultOption = options[0]

  function handleChange(event) {
    const {name,value} = event.target;
    setUser({
      ...user,
      [name]:value
    });

  }
  const handleClose = () => {
    setOpen(false);
  };
  function validateData(event){
    if (user.username !== "" && user.password !== ""){
      const nameToLower = user.username.toLowerCase();
      usersDB.findOne({username: nameToLower}, (err,doc) => {
        if (doc){
          const mess = "User " + user.username + " already exists. Enter a different username "
          setMessage(mess);
          setOpen(true);
        }else{
          bcrypt.hash(user.password,saltRounds, (err,hash) => {
            if (err){
              console.log(err);
            }else{
              const newUser = {
                username: user.username.toLowerCase(),
                password: hash,
                auth: user.auth
              }
              addUser(newUser);
              const mess = "Added user " + user.username + " with " + user.auth + " Authentication."
              setMessage(mess);
              setOpen(true);
            }
          });
        }
      });
      setUser({
        username: "",
        password: "",
        auth: ""
      })
    }else{
      const mess = "Username or password cannot be null";
      setMessage(mess);
      setOpen(true);
    }
    event.preventDefault();

  }
  function onSelect(event){
    setUser({
      ...user,
      "auth":event.value
    });
  }
  return(
    <div>
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
        <Button onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>

    <form className={classes.root} noValidate autoComplete="off">
    <div>
      <TextField required id="standard-required" label="Username" onChange={handleChange} name="username" value={user.username} />
    </div>
    <div>
    <TextField
          id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          name="password"
          value={user.password} onChange={handleChange}
        />
    </div>
    <div>
    <TextField
          id="standard-select-currency"
          select
          label="Select Authentication"
          name="auth"
          value={authOption}
          onChange={handleChange}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option} name='auth'>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div className="not-centered">
      <Button variant="secondary" size='lg' block onClick={validateData}>
        Create User
      </Button>
      </div>
    </form>


</div>
  );
}

export default AdminUser;
