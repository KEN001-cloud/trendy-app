import React, {useState, useContext} from 'react';
import {ProductProvider} from '../contexts/DatabaseContext';
import UserContext from '../contexts/UserContext';
import StoreIcon from '@material-ui/icons/Store';

import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import AdminUser from './AdminUser';
import Preferences from './Preferences';
import AddProduct from './AddProduct';
import TestDay from './TestDay';
import Products from './Products';
import Users from './Users';
import Sell from './Sell';
import DailyReport from './DailyReport';
import MonthlyReport from './MonthlyReport';
import Test2 from './Test2';
import Returned from './Returned';

import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  root2: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Dashboard(props) {

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const {users,logOut} = useContext(UserContext);


  function handleSignOut(){
    logOut();
  }

  const handleClick = () => {
    setOpen(!open);
  };
  return(
    <BrowserRouter>
    <div>

    <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <StoreIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Trendy Essentials
          </Typography>
          
          <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
        </Toolbar>
      </AppBar>
    </header>


<div class="container-fluid">
  <div class="row">
    <nav class="col-md-2 d-none d-md-block bg-light sidebar">
      <div class="sidebar-sticky">
      <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Dashboard
        </ListSubheader>
      }
      className={classes.root}
    >
      <ListItem button>
        <Link  to="/Products">
        <ListItemText primary="Products" />
        </Link>
      </ListItem>
      {users.currentLoggedIn.auth === "Admin" && (
        <ListItem button>
        <Link  to="/AddProduct">
          <ListItemText primary="Add product" />
          </Link>
        </ListItem>
      )}

      <ListItem button>
      <Link  to="/">
        <ListItemText primary="Make Sell" />
        </Link>
      </ListItem>

      <ListItem button>
      <Link  to="/Returns">
        <ListItemText primary="Returns" />
        </Link>
      </ListItem>
    </List>

    {users.currentLoggedIn.auth === "Admin" && (
      <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Admin
        </ListSubheader>
      }
      className={classes.root}
    >
      <ListItem button>
      <Link  to="/Admin">
        <ListItemText primary="Create New User" />
        </Link>
      </ListItem>

      <ListItem button>
      <Link  to="/Users">
        <ListItemText primary="Users" />
        </Link>
      </ListItem>
      </List>
    )}

    <List
    component="nav"
    aria-labelledby="nested-list-subheader"
    subheader={
      <ListSubheader component="div" id="nested-list-subheader">
        Reports
      </ListSubheader>
    }
    className={classes.root}
  >


    <ListItem button>

    <Link  to="/DailyReport">
      <ListItemText primary="Today" />
      </Link>
    </ListItem>
    <ListItem button>
    <Link  to="/MonthlyReport">
      <ListItemText primary="Monthly" />
      </Link>
    </ListItem>
  </List>

      </div>
    </nav>

    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

    {users.currentLoggedIn.auth === "Admin" ?(
      <Switch>
      <ProductProvider>

      <Route exact path='/Products'>
        <Products/>
      </Route>

      <Route exact path='/AddProduct'>
        <AddProduct />
      </Route>

      <Route exact path='/Returns'>
        <Returned />
      </Route>

        <Route exact path='/Admin'>
          <AdminUser />
        </Route>

        <Route exact path='/Users'>
          <Users />
        </Route>

        <Route exact path='/DailyReport'>
          <TestDay />
        </Route>

        <Route exact path='/MonthlyReport'>
          <Test2 />
        </Route>

      <Route exact path='/'>
        <Sell />
      </Route>


      </ProductProvider>

      </Switch>
    ): (
      <Switch>
      <ProductProvider>

      <Route exact path='/Products'>
        <Products/>
      </Route>

      <Route exact path='/'>
        <Sell />
      </Route>

      <Route exact path='/Returns'>
        <Returned />
      </Route>

      <Route exact path='/DailyReport'>
        <TestDay />
      </Route>

      <Route exact path='/MonthlyReport'>
          <Test2 />
        </Route>


      </ProductProvider>

      </Switch>
    )}


    </main>
    </div>
    </div>
    </div>
    </BrowserRouter>
  );
}
