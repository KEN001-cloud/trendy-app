import React, {useState} from 'react';
import {UserProvider} from './contexts/UserContext';

// import logo from './logo.svg';
import './App.css';
import Load from './components/Load'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

const bcrypt = require('bcryptjs');

function App() {

  return (
    <UserProvider>
      <Load />
    </UserProvider>

  );
}

export {bcrypt};

export default App;


// "build": {
//   "appId": "com.aidenriddler.app",
//   "productName": "Trendy Essentials",
//   "target": "NSIS",
//   "files": [
//     "build/**/*",
//     "node_modules/**/*"
//   ],
//   "directories": {
//     "buildResources": "assets"
//   },
//   "nsis": {
//     "allowToChangeInstallationDirectory": true,
//     "oneClick": false
//   }
// }
