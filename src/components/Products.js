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


function Products(props){
  const {products,addProduct,removeProduct,updateProduct,setRD} = useContext(DatabaseContext);
  const {users,reloadProducts,setReloadProductsBool} = useContext(UserContext);
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [message,setMessage] = React.useState();
  const [stateProductID,setStateProductID] = React.useState("");
  const [formDialogBool,setFormDialogBool] = React.useState(false);
  const [product,setProduct] = React.useState({
    pID: "",
    pName: "",
    type: "",
    quantity: "",
    size: "",
    color: "",
    price: "",
    insertedBy: "",
    makeSellQuantity: 1,
    tillNo: "",
    position: 0,
    sellDesc: "",
    originalPrice: ""
  });

  const handleClose = () => {
    setOpen(false);
    setFormDialogBool(false);
  };

  if (reloadProducts){
    setRD(true);
    setReloadProductsBool(false);
  }else{
    setRD(false);
  }

  const handleRemove = () => {
    removeProduct(stateProductID);
    setOpen(false);
    setStateProductID("");
  }

  const handleClick = (productID, productName, productType,event) => {
    setFormDialogBool(false);
    const mess = "Are you sure you want to DELETE product " + productName + " " + "(type: " + productType + ", product ID: " + productID + ")";
    setMessage(mess);
    setStateProductID(productID);
    setOpen(true);

    event.preventDefault();
  }

  function handleSave(){
    console.log("Product ID: ", stateProductID);
    updateProduct(stateProductID,product);
    setOpen(false);
  }

  function handleChange(event){
    const {name,value} = event.target;
    setProduct({
      ...product,
      [name]: value
    })
  }

  const editItem = (row,event) => {
    console.log(row);
    const object = {
      pID: row.pID,
      pName: row.pName,
      type: row.type,
      quantity: row.quantity,
      size: row.size,
      color: row.color,
      price: row.price,
      insertedBy: row.insertedBy,
      makeSellQuantity: row.makeSellQuantity,
      tillNo: row.tillNo,
      position: row.position,
      sellDesc: row.sellDesc,
      originalPrice: row.originalPrice
    }
    setFormDialogBool(true);
    const mess = "Edit product";
    setMessage(mess);
    setStateProductID(row._id);
    setProduct(object);
    setOpen(true);

    event.preventDefault();
  }

  const sortedArray = products.sort((a,b) => {
    return a.pName.localeCompare(b.pName);
  })


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
            <TextField required id="standard-required" label="Product Name" name="pName" value={product.pName} onChange={handleChange}
            style={{margin: "10px"}}/>
            <TextField required id="standard-required" style={{margin: "10px"}} label="Product Type" name="type" value={product.type} onChange={handleChange} />
          </div>
          <div>
            <TextField required id="standard-required" style={{margin: "10px"}} type="number" label="Quantity" name="quantity" value={product.quantity} onChange={handleChange}/>
            <TextField id="standard-basic" style={{margin: "10px"}} label="Size" name="size" value={product.size} onChange={handleChange}/>
            <TextField id="standard-basic" style={{margin: "10px"}} label="Color" name="color" value={product.color} onChange={handleChange}/>
          </div>
          <div>
            <TextField required id="standard-required" style={{margin: "10px"}} type="number" label="Price Per Unit" name="price" value={product.price} onChange={handleChange} />
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
            <TableCell align="right">Delete Product</TableCell>
            )}
            {users.currentLoggedIn.auth === "Admin" && (
            <TableCell align="right">Edit Product</TableCell>
            )}
            
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedArray.map((row) => (
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
              {users.currentLoggedIn.auth === "Admin" && (
              <TableCell align="right">
                <EditIcon onClick={(e) => editItem(row,e)}/>
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

export default Products;
