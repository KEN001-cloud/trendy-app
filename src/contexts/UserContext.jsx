import React, {useState} from 'react';

const bcrypt = require('bcryptjs');

const Datastore = require('nedb');
var usersDB = new Datastore({
  filename: "path/to/registeredUsers.db",
  autoload: true,
  onload: err => {
      if (err) {
          console.log("Error loading the DB: " + err);
      }
},
timestampData: true
}
);

let firstUsers = [];

usersDB.find({},(err,docs) => {
  docs.forEach((doc) => {
    firstUsers.push(doc);
  });
});

const UserContext = React.createContext();


export const UserProvider = (props) => {
  const [reloadProducts,setReloadProducts] = useState(false);
  const [updateReload,setUpdateReload] =  useState(false);
  const [reloadReturnedGoods,setReloadReturnsBool] =  useState(false);
  const [incorrectPass,setIncorrectPass] = useState(false);
  const [dataReloaded, setDataReloaded] = useState(false);
  const [users,setUsers] = useState({
    currentLoggedIn: {
      username: "",
      auth: ""
    },
    availableUsers: firstUsers,
    token: false
  });

  function setReloadProductsBool(bool){
    console.log("setting reloadProducts value to ", bool)
    setReloadProducts(bool);

  }

  function setReloadUpdate(bool) {
    setUpdateReload(bool);
  }
  function logOut(){
    setUsers({
      ...users,
      currentLoggedIn: {
        username: "",
        auth: ""
      },
      token: false
    });
  }
  function developerLogin(){
    const loggedUser = {
      username: "developermode",
      auth: "Admin"
    }
    setUsers({
      ...users,
      currentLoggedIn: loggedUser,
      token: true
    })
  }
  function login(uName,pword){
    usersDB.findOne({username: uName},(err,doc) => {
      if (err){
        console.log(err);
      }else{
        if(doc !== null){
          bcrypt.compare(pword,doc.password, (err,res) => {
            if (res === true){
              const loggedUser = {
                username: uName,
                auth: doc.auth
              }
              setUsers({
                ...users,
                currentLoggedIn: loggedUser,
                token: true
              })
            }else{
              setIncorrectPass(true);
            }
          })
        }

      }
    })
  }

  const addUser = (user) => {
    usersDB.insert(user, (err,newDoc) => {
      if(err){
        console.log(err);
      }else{
        console.log('Inserted ', newDoc.username, newDoc.auth);
      }
    });
    let updatedUsers = [];
    usersDB.find({},(err,docs) => {
      docs.forEach((doc) => {
        updatedUsers.push(doc);
      })
    });
    setUsers({
      ...users,
      availableUsers: updatedUsers
    });

  }
  const deleteUser = (name) => {
    console.log(name);
    usersDB.remove({username: name}, {multi: true}, (err, userRemoved) => {
      if(err){
        console.log(err);
      }else{
        console.log(userRemoved);
      }
    });
    setUsers((users) => {
      const updatedUsers = users.availableUsers.filter((obj) => obj.username !== name);
      return ({
        ...users,
        availableUsers: updatedUsers
      });
    });
  }
  return (
    <UserContext.Provider value= {{users,addUser,deleteUser,login,logOut,developerLogin,
      reloadProducts,setReloadProductsBool,incorrectPass,setIncorrectPass,dataReloaded,
      setDataReloaded,updateReload,setReloadUpdate,reloadReturnedGoods,setReloadReturnsBool}}>
      {props.children}
    </UserContext.Provider>
  )
}

export {usersDB};

export default UserContext;
