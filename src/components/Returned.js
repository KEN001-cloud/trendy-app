import React, {useState, useContext} from 'react';
import DatabaseContext from '../contexts/DatabaseContext';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import UserContext from '../contexts/UserContext';
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';

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
    minWidth: 650,
  },
  alert: {
    color: 'red',
  }
});


function Returned(props){
  const {returnedGoods,addReturnedGood,removeReturnedGood,setRD,setRRG} = useContext(DatabaseContext);
  const {users,reloadReturnedGoods,setReloadReturnsBool} = useContext(UserContext);
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [message,setMessage] = React.useState();
  const [stateProductID,setStateProductID] = React.useState("");
  const [formDialogBool,setFormDialogBool] = React.useState(false);
  const [returned,setReturnedGood] = React.useState({
    pName: "",
    type: "",
    quantity: "",
    size: "",
    color: "",
    price: "",
    insertedBy: "",
    makeSellQuantity: 1,
    tillNo: "",
    position: 0
  });

  const handleClose = () => {
    setOpen(false);
    setFormDialogBool(false);
  };

  if (reloadReturnedGoods){
    setRRG();
    setReloadReturnsBool(false);
  }

  const handleRemove = () => {
    removeReturnedGood(stateProductID);
    setOpen(false);
    setStateProductID("");
  }

  const handleClick = (productID, productName, productType,event) => {
    setFormDialogBool(false);
    const mess = "Are you sure you want to DELETE returned Good " + productName + " " + "(type: " + productType + ", product ID: " + productID + ")";
    setMessage(mess);
    setStateProductID(productID);
    setOpen(true);

    event.preventDefault();
  }

  function handleSave(){
    returned.insertedBy = users.currentLoggedIn.username;
    addReturnedGood(returned);
    setReturnedGood({
      pName: "",
      type: "",
      quantity: "",
      size: "",
      color: "",
      price: "",
      insertedBy: "",
      makeSellQuantity: 1,
      tillNo: "",
      position: 0
    });
    setOpen(false);
  }

  function handleChange(event){
    const {name,value} = event.target;
    setReturnedGood({
      ...returned,
      [name]: value
    });
  }

  const handleAdd = (event) => {
    setFormDialogBool(true);
    const mess = "Add Returned Good";
    setMessage(mess);
    setOpen(true);

    event.preventDefault();
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
        {formDialogBool && (
          <div>
          <div>
            <TextField required id="standard-required" label="Product Name" name="pName" value={returned.pName} onChange={handleChange}
            style={{margin: "10px"}}/>
            <TextField required id="standard-required" style={{margin: "10px"}} label="Product Type" name="type" value={returned.type} onChange={handleChange} />
          </div>
          <div>
            <TextField required id="standard-required" style={{margin: "10px"}} type="number" label="Quantity" name="quantity" value={returned.quantity} onChange={handleChange}/>
            <TextField id="standard-basic" style={{margin: "10px"}} label="Size" name="size" value={returned.size} onChange={handleChange}/>
            <TextField id="standard-basic" style={{margin: "10px"}} label="Color" name="color" value={returned.color} onChange={handleChange}/>
          </div>
          <div>
            <TextField required id="standard-required" style={{margin: "10px"}} type="number" label="Price Per Unit" name="price" value={returned.price} onChange={handleChange} />
          </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
      {formDialogBool ? (
        <div>
        <Button style={{marginRight: "20px"}} onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button style={{marginRight: "20px"}} onClick={handleSave} color="primary">
          Save
        </Button>
        </div>
      ):(
        <div>
        <Button style={{margin: "10px"}} onClick={handleClose} color="primary">
          NO
        </Button>
        <Button style={{margin: "10px"}} onClick={handleRemove} color="secondary">
          YES
        </Button>
        </div>
      )}

      </DialogActions>
    </Dialog>
    <Button style={{margin: "10px"}} onClick={handleAdd} color="secondary">
      Add Returned Good
    </Button>
          <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell align="left">ID</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Color</TableCell>
            {users.currentLoggedIn.auth === "Admin" && (
            <TableCell align="right">Delete Returned</TableCell>
            )}

          </TableRow>
        </TableHead>
        <TableBody>
          {returnedGoods.map((row) => (
            <TableRow key={row._id}>
            <TableCell align="right"  className={row.quantity === 0 ? classes.alert : null}>{row._id}</TableCell>
              <TableCell component="th" scope="row"  className={row.quantity === 0 ? classes.alert : null}>
                {row.pName}
              </TableCell>
              <TableCell align="right"  className={row.quantity === 0 ? classes.alert : null}>{row.type}</TableCell>
              <TableCell align="right"  className={row.quantity === 0 ? classes.alert : null}>{row.price}</TableCell>
              <TableCell align="right"  className={row.quantity === 0 ? classes.alert : null} >{row.quantity}</TableCell>
              <TableCell align="right"  className={row.quantity === 0 ? classes.alert : null}>{row.size}</TableCell>
              <TableCell align="right"  className={row.quantity === 0 ? classes.alert : null}>{row.color}</TableCell>
              {users.currentLoggedIn.auth === "Admin" && (
                <TableCell align="right">
                  <DeleteIcon color="secondary" onClick={(e) => handleClick(row._id,row.pName,row.type,e)}/>
                </TableCell>
              )}

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

export default Returned;
