import React, {useState, useContext} from 'react';
import DatabaseContext from '../contexts/DatabaseContext';
import UserContext from '../contexts/UserContext';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

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


function AddProduct(){
  const {products,addProduct,removeProduct} = useContext(DatabaseContext);
  const {users} = useContext(UserContext);

  const classes = useStyles();
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
  const [open, setOpen] = React.useState(false);
  const [message,setMessage] = React.useState();

  const handleClose = () => {
    setOpen(false);
  };

  function handleChange(event){
    const {name,value} = event.target;
    setProduct({
      ...product,
      [name]: value
    })
  }

  const saveProduct = (event) => {
    if (product.pName === ""){
      const mess = "Product name cannot be empty";
      setMessage(mess);
      setOpen(true);
    }else if (product.quantity === ""){
      const mess = "Product quantity cannot be empty";
      setMessage(mess);
      setOpen(true);
    }else if (product.price === ""){
      const mess = "Product price cannot be empty";
      setMessage(mess);
      setOpen(true);
    }else {
      product.insertedBy = users.currentLoggedIn.username;
      product.originalPrice = product.price;
      addProduct(product);
      const mess = "Product added successfully";
      setMessage(mess);
      setOpen(true);

      setProduct({
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
    }



    event.preventDefault();

  }
  return (
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
      <TextField required id="standard-required" label="Product Name" name="pName" value={product.pName} onChange={handleChange}/>
      <TextField required id="standard-required" label="Product Type" name="type" value={product.type} onChange={handleChange} />
    </div>
    <div>
      <TextField required id="standard-required" type="number" label="Quantity" name="quantity" value={product.quantity} onChange={handleChange}/>
      <TextField id="standard-basic" label="Size" name="size" value={product.size} onChange={handleChange}/>
      <TextField id="standard-basic" label="Color" name="color" value={product.color} onChange={handleChange}/>
    </div>
    <div>
      <TextField required id="standard-required" type="number" label="Price Per Unit" name="price" value={product.price} onChange={handleChange} />
    </div>
    <div className="centered">
    <Button variant="secondary" size='lg' block onClick={saveProduct}>
      Add Product
    </Button>
    </div>

    </form>
    </div>
  );
}

export default AddProduct;
