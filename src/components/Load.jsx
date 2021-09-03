import React, {useState, useContext} from 'react';
import {ProductProvider} from '../contexts/DatabaseContext';
import UserContext from '../contexts/UserContext';

import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';

function Load(props) {
  const {users,addUser,deleteUser,login} = useContext(UserContext);
  console.log("users token",users.token)
  const [token,setToken] = useState(users.token);


    if(!users.token){
      return (
          <Login />
      )
    }

    return (
        <Dashboard  />
    );



}

export default Load;
