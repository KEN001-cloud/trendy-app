import React, {useState,useContext} from 'react';
import DatabaseContext from '../contexts/DatabaseContext';
import UserContext from '../contexts/UserContext';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import tills from '../tills';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import MenuItem from '@material-ui/core/MenuItem';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  table: {
    minWidth: 650,
  },option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  }
}));
const options = [];

tills.forEach((till) => {
  options.push(till.tillNo);
});

function Sell(){
  const [tillOption, setTillOption] = React.useState();
  const [authOption, setOption] = React.useState();
  const [errortext,setErrorText] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [message,setMessage] = React.useState();
  const [dia,setDia] = React.useState();
  const [maxVal, setMaxVal] = React.useState(10);
  const [custDetDia, setCustDetDia] = React.useState(false);
  const [saleDescBool, setSaleDescBool] = React.useState(false); 

  const [freePosition, setFreePosition] = React.useState("")

  const options2 = ["Wholesale", "Retail"];

  const classes = useStyles();
  //const {reports,recordSell} = useContext(SaleContext);
  //const {} = useContext(DatabaseContext);

  const {products,reports,recordSell,updateProduct2,updateBool,setUpdateFalse,setRemindLater,setLastUpdateDateFunc,setUP} = useContext(DatabaseContext);
  const {users,updateReload,setReloadUpdate} = useContext(UserContext);
  console.log(users.currentLoggedIn);

  if (updateReload) {
    setUP();
    setReloadUpdate(false);
  }

  const [opu, setOpu] = useState(updateBool);


  // console.log("days diff",Math.round(days));

  console.log("products", products);
  const items = [];
  products.map((d) => {
    if (d.quantity > 0 ) {
      const item = {
        id: d._id,
        name: d.pName,
        description: d.type
      }
      items.push(item);
    }
  })

  console.log("items",items);

  const [price,setPrice] = useState(0);

  const [selectedItems,setSelectedItems] = React.useState({
    sellID: "",
    selected: [],
    servedBy: "",
    totalPrice: ""
  });

  const [customerDetails, setCustomerDetails] = React.useState({
    customerName: "",
    customerPhone: "",
    mpesaCode: ""
  });

  function handleChange(event){
    const {name,value} = event.target;
    setCustomerDetails({
      ...customerDetails,
      [name]: value
    })
  }

  const handleOnSearch = (string, results) => {
    console.log("found",string, results);
  }

  const handleOnSelect = (item) => {
    setMaxVal(0);
    const addedItem = products.find((obj) => obj._id === item.id);
    let existSelected = false;
    selectedItems.selected.map((obj) => {
      if (obj.pID === item.id){
        existSelected = true;
      }
    });

    const addedItem2 = {
      pID: addedItem._id,
      pName: addedItem.pName,
      type: addedItem.type,
      quantity: addedItem.quantity,
      size: addedItem.size,
      color: addedItem.color,
      price: addedItem.price,
      insertedBy: addedItem.insertedBy,
      makeSellQuantity: addedItem.makeSellQuantity,
      tillNo: addedItem.tillNo,
      position: addedItem.position,
      sellDesc: addedItem.sellDesc,
      originalPrice: addedItem.originalPrice
    }

    console.log("added item 2",addedItem2);

    if(!existSelected)  {
      const newPrice = parseInt(addedItem.price) + price;
      setPrice(newPrice);

      setSelectedItems((selectedItems) => {
        if (freePosition === "" || freePosition === null) {
          addedItem2.position = selectedItems.selected.length + 1;
        }else{
          addedItem2.position = freePosition;
        }
        
        const selected = [...selectedItems.selected,addedItem2];
        selected.sort((a,b) => a.position-b.position);
        return {
          sellID: "",
          totalPrice: price,
          servedBy: users.currentLoggedIn.username,
          selected
        }
      })
    }


    console.log("the selected" , selectedItems.selected)

  }
  function handleSaleDescChange(pid, event) {
    setMaxVal(0);
    const si = selectedItems.selected.find((obj) => obj.pID === pid);
    const saleDescription = event.target.value;
    let p = si.price;
    if (saleDescription === "Wholesale") {
      const np = (parseInt(price) - (parseInt(si.price) * parseInt(si.makeSellQuantity))) + (parseInt(si.originalPrice) * parseInt(si.makeSellQuantity))
      setPrice(np);
      p = si.originalPrice;

    }
    const updatedItem = {
      pID: si.pID,
      pName: si.pName,
      type: si.type,
      quantity: si.quantity,
      size: si.size,
      color: si.color,
      price: p,
      insertedBy: si.insertedBy,
      makeSellQuantity: si.makeSellQuantity,
      tillNo: si.tillNo,
      position: si.position,
      sellDesc: saleDescription,
      originalPrice: si.originalPrice
    }
    setSelectedItems((selectedItems) => {
      const selected = selectedItems.selected.filter((obj) => obj.pID !== pid);
      selected.push(updatedItem);
      console.log("before sort", selected);
      selected.sort((a,b) => a.position-b.position);
      console.log("after sort", selected);
      return{
        sellID: "",
        totalPrice: price,
        servedBy: users.currentLoggedIn.username,
        selected
      }
    });

    event.preventDefault();
  }
  function handleTillChange(productID,event) {
    const si = selectedItems.selected.find((obj) => obj.pID === productID);
    const newTillNo = event.target.value;
    const updatedItem = {
      pID: si.pID,
      pName: si.pName,
      type: si.type,
      quantity: si.quantity,
      size: si.size,
      color: si.color,
      price: si.price,
      insertedBy: si.insertedBy,
      makeSellQuantity: si.makeSellQuantity,
      tillNo: newTillNo,
      position: si.position,
      sellDesc: si.sellDesc,
      originalPrice: si.originalPrice
    }

    setSelectedItems((selectedItems) => {
      const selected = selectedItems.selected.filter((obj) => obj.pID !== productID);
      selected.push(updatedItem);
      console.log("before sort", selected);
      selected.sort((a,b) => a.position-b.position);
      console.log("after sort", selected);
      return{
        sellID: "",
        totalPrice: price,
        servedBy: users.currentLoggedIn.username,
        selected
      }
    });

    event.preventDefault();

  }

  const handlePriceChange = (id,e) => {
    const si = selectedItems.selected.find((obj) => obj.pID === id);
    let newPrice = e.target.value;

    const oldprice = parseInt(si.price) * parseInt(si.makeSellQuantity);
    let nTp = (parseInt(price) - parseInt(oldprice)) + (parseInt(newPrice) * parseInt(si.makeSellQuantity));


    if (nTp.toString() === "NaN"){
      newPrice = 0;
      nTp = (parseInt(price) - parseInt(oldprice));

      setPrice(nTp)
    }else{
      setPrice(nTp);
    }

    const updatedItem = {
      pID: si.pID,
      pName: si.pName,
      type: si.type,
      quantity: si.quantity,
      size: si.size,
      color: si.color,
      price: newPrice,
      insertedBy: si.insertedBy,
      makeSellQuantity: si.makeSellQuantity,
      tillNo: si.tillNo,
      position: si.position,
      sellDesc: si.sellDesc,
      originalPrice: si.originalPrice
    }

    setSelectedItems((selectedItems) => {
      const selected = selectedItems.selected.filter((obj) => obj.pID !== id);
      selected.push(updatedItem);
      console.log("before sort", selected);
      selected.sort((a,b) => a.position-b.position);
      console.log("after sort", selected);
      return{
        sellID: "",
        totalPrice: price,
        servedBy: users.currentLoggedIn.username,
        selected
      }
    });



    e.preventDefault();
  }

  const decreaseQuantity = (productID,event) => {
    const si = selectedItems.selected.find((obj) => obj.pID === productID);
    const quantityInStock = si.quantity;
    console.log("current makesell quantity",si.makeSellQuantity);
    if (si.makeSellQuantity > 1){
      const newMakeSellQuantity = si.makeSellQuantity - 1;
      const updatedItem = {
        pID: si.pID,
        pName: si.pName,
        type: si.type,
        quantity: si.quantity,
        size: si.size,
        color: si.color,
        price: si.price,
        insertedBy: si.insertedBy,
        makeSellQuantity: newMakeSellQuantity,
        tillNo: si.tillNo,
        position: si.position,
        sellDesc: si.sellDesc,
        originalPrice: si.originalPrice
      }
      setSelectedItems((selectedItems) => {
        const selected = selectedItems.selected.filter((obj) => obj.pID !== productID);
        selected.push(updatedItem)
        selected.sort((a,b) => a.position-b.position);
        return{
          sellID: "",
          totalPrice: price,
          servedBy: users.currentLoggedIn.username,
          selected
        }
      });
      const newPrice = price - parseInt(si.price);
      setPrice(newPrice);
    }
    event.preventDefault();

  }

  const increaseQuantity = (productID, event) => {
    const si = selectedItems.selected.find((obj) => obj.pID === productID);
    const quantityInStock = si.quantity;
    const newMakeSellQuantity = si.makeSellQuantity + 1
    if (newMakeSellQuantity <= quantityInStock) {
      const updatedItem = {
        pID: si.pID,
        pName: si.pName,
        type: si.type,
        quantity: si.quantity,
        size: si.size,
        color: si.color,
        price: si.price,
        insertedBy: si.insertedBy,
        makeSellQuantity: newMakeSellQuantity,
        tillNo: si.tillNo,
        position: si.position,
        sellDesc: si.sellDesc,
        originalPrice: si.originalPrice
      }

      setSelectedItems((selectedItems) => {
        const selected = selectedItems.selected.filter((obj) => obj.pID !== productID);
        selected.push(updatedItem);
        selected.sort((a,b) => a.position-b.position);
        return{
          sellID: "",
          totalPrice: price,
          servedBy: users.currentLoggedIn.username,
          selected
        }
      });
      const newPrice = price + parseInt(si.price);
      setPrice(newPrice);
    }
    event.preventDefault();

  }

  const handleClick = (productID, event) => {
    setMaxVal(0);
    const si = selectedItems.selected.find((obj) => obj.pID === productID);
    const oldprice = si.price;
    const newPrice = price - (oldprice * si.makeSellQuantity);
    console.log(newPrice);
    setFreePosition(si.position);

    setPrice(newPrice);
    setSelectedItems((selectedItems) => {
      const selected = selectedItems.selected.filter((obj) => obj.pID !== productID);
      
      selected.sort((a,b) => a.position-b.position);
      return{
        sellID: "",
        totalPrice: price,
        servedBy: users.currentLoggedIn.username,
        selected
      }
    })
    event.preventDefault();
  }

  const handleOnFocus = () => {
    setMaxVal(10);
    console.log('Focused');
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleClose2 = () => {
    setUpdateFalse();
    setOpu(false);
  }

  const handleClose4 = () => {
    setDia(false);
  }

  const handleClose5 = () => {
    setCustDetDia(false);
    setErrorText("");
  }

  const handleRemindLater = () => {
    setRemindLater();
    setOpu(false);
    setUpdateFalse();
  }

  const handleUpdate = () => {
    setLastUpdateDateFunc();
    setOpu(false);
    setDia(true);
  }

  const loadCustDialog = () => {
    if (selectedItems.selected.length !== 0){
      let tillBool = true;

    selectedItems.selected.forEach((item) => {
      if(item.tillNo === ""){
        tillBool = false;
        const mess = "Insert Missing TillNumbers";
        setMessage(mess);
        setOpen(true);
      }else if (item.sellDesc === ""){
        tillBool = false;
        const mess = "Insert Missing Sale Descriptions";
        setMessage(mess);
        setOpen(true);
      }

    });
    if (tillBool){
      setCustDetDia(true);
    }
    }
  }

  const submit = (event) => {
    let cancel = false;
    for (let i=0; i<reports.length; i++){
      let r = reports[i];
      
      if (r.mpesaCode.toUpperCase() === customerDetails.mpesaCode.toUpperCase() || customerDetails.mpesaCode === ""){
        setErrorText("Mpesa code exists or empty");
        cancel = true;
        break;
      }
    }

    if (!cancel){
      var today = new Date();
    const yr = today.getFullYear();
    const mth = today.getMonth();
    const dy = today.getDate();

      selectedItems.selected.forEach((s) => {
        const newQ = s.quantity - s.makeSellQuantity;
        console.log(" id value: ", s.pID);
        updateProduct2(s.pID,newQ);
      });

      selectedItems.selected.forEach((sit) => {
        const obj = {
          color: sit.color,
          name: sit.pName,
          soldQuantity: sit.makeSellQuantity,
          price: sit.price,
          size: sit.size,
          tillNo: sit.tillNo,
          sellDesc: sit.sellDesc,
          type: sit.type,
          servedBy: users.currentLoggedIn.username,
          year: yr,
          month: mth,
          day: dy,
          customerName: customerDetails.customerName,
          customerPhone: customerDetails.customerPhone,
          mpesaCode: customerDetails.mpesaCode
        };
        recordSell(obj);
        });

        //recordSell(selectedItems);
        console.log("selectedItems",selectedItems);
        setSelectedItems({
          sellID: "",
          selected: [],
          servedBy: "",
          itemPrice: 0
        });

        setPrice(0);
        setCustDetDia(false);

        setCustomerDetails({
          customerName: "",
          customerPhone: "",
          mpesaCode: ""
        })
    }
    
    
    event.preventDefault();


  }

  return(
    <div>
    <ReactSearchAutocomplete
            items={items}
            fuseOptions={{ keys: ["name", "description"] }}
            onSearch={handleOnSearch}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            maxResults={maxVal}
          />

          <br />
          {selectedItems.selected[0] !== null &&
            <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Increase</TableCell>
              <TableCell align="right">Decrease</TableCell>
              <TableCell align="right">Delete</TableCell>
              <TableCell align="right">Sale description</TableCell>
              <TableCell align="right">Till Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedItems.selected.map((row) => (
              <TableRow key={row.pID}>
                <TableCell component="th" scope="row">
                  {row.pName}
                </TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">
                {row.sellDesc === "Retail" ?

                  <TextField
                        id="standard-select-currency"
                        name="price"
                        value={row.price}
                        type="number"
                        onChange={(e) => handlePriceChange(row.pID,e)}
                      >
                        {row.price}
                      </TextField>
                      : row.originalPrice
                 }

                    </TableCell>
                <TableCell align="right">{row.makeSellQuantity}</TableCell>
                <TableCell align="right">{row.size}</TableCell>
                <TableCell align="right">
                  <AddBoxIcon onClick={(e) => increaseQuantity(row.pID,e)}/>
                </TableCell>
                <TableCell align="right">
                  <RemoveCircleIcon onClick={(e) => decreaseQuantity(row.pID,e)}/>
                </TableCell>
                <TableCell align="right">
                  <DeleteIcon onClick={(e) => handleClick(row.pID,e)}/>
                </TableCell>
                <TableCell align="right">
                <TextField
                      id="standard-select-currency"
                      select
                      name="saleDesc"
                      value={authOption}
                      onChange={(e) => handleSaleDescChange(row.pID,e)}
                    >
                      {options2.map((option2) => (
                        <MenuItem key={option2} value={option2} name='auth'>
                          {option2}
                        </MenuItem>
                      ))}
                    </TextField>
                    </TableCell>
                    <TableCell align="right">
                <TextField
                      id="standard-select-currency"
                      select
                      name="auth"
                      value={authOption}
                      onChange={(e) => handleTillChange(row.pID,e)}
                    >
                      {options.map((option) => (
                        <MenuItem key={option} value={option} name='auth'>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
          }
          <br />
          <div  className ="container"  >
          <div className="price" style={{float: "left", fontSize: 20}}>
            Ksh {price}
          </div>
          <div className="farend" style={{float: "right"}}>
          <Fab variant="extended" color="primary" onClick={(e) => loadCustDialog(e)}>
              <AttachMoneyIcon className={classes.extendedIcon} />
                Make Sell
          </Fab>
          </div>
          <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Trendy Essentials"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <div>
            <Button onClick={handleClose} color="primary">
              Got it
            </Button>
            </div>

        </DialogActions>
      </Dialog>

      <Dialog
    open={opu}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose2}
    aria-labelledby="alert-dialog-slide-title"
    aria-describedby="alert-dialog-slide-description"
  >
    <DialogTitle id="alert-dialog-slide-title">{"Trendy Essentials"}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">
        Update required. Ensure you have a stable Internet Connection
      </DialogContentText>
    </DialogContent>
    <DialogActions>
        <div>
        <Button style={{marginRight: "20px"}} onClick={handleRemindLater} color="primary">
          Remind Me Later
        </Button>
        <Button style={{marginRight: "20px"}} onClick={handleUpdate} color="secondary">
          Update Now
        </Button>
        </div>
    </DialogActions>
  </Dialog>

  <Dialog
open={dia}
TransitionComponent={Transition}
keepMounted
onClose={handleClose4}
aria-labelledby="alert-dialog-slide-title"
aria-describedby="alert-dialog-slide-description"
>
<DialogTitle id="alert-dialog-slide-title">{"Trendy Essentials"}</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-slide-description">
    Update started. Do not turn off internet connection
  </DialogContentText>
</DialogContent>
<DialogActions>
    <div>
    <Button style={{marginRight: "20px"}} onClick={handleClose4} color="primary">
      GOT IT
    </Button>
    </div>
</DialogActions>
</Dialog>

<Dialog
open={custDetDia}
TransitionComponent={Transition}
keepMounted
onClose={handleClose5}
aria-labelledby="alert-dialog-slide-title"
aria-describedby="alert-dialog-slide-description"
>
<DialogTitle id="alert-dialog-slide-title">{"Trendy Essentials"}</DialogTitle>
<DialogContent>
<DialogContentText id="alert-dialog-slide-description">
  Insert Customer Details
</DialogContentText>

<div>
<div>
  <TextField required id="standard-required" label="Customer Name" name="customerName" value={customerDetails.customerName} onChange={handleChange}
  style={{margin: "10px"}}/>
  <TextField required id="standard-required" style={{margin: "10px"}} label="Phone number" name="customerPhone" value={customerDetails.customerPhone} onChange={handleChange} />
</div>
<div>
  <TextField required id="standard-required" style={{margin: "10px"}} label="M-pesa Code" name="mpesaCode" value={customerDetails.mpesaCode} onChange={handleChange}
    error={errortext !== ""} helperText={errortext !== "" ? errortext: ' '}
  />
</div>
</div>
</DialogContent>
<DialogActions>
  <div>
  <Button style={{marginRight: "20px"}} onClick={handleClose5} color="primary">
    CANCEL
  </Button>

  <Button style={{marginRight: "20px"}} onClick={submit} color="primary">
    RECORD SALE
  </Button>

  </div>
</DialogActions>
</Dialog>
          </div>
    </div>
  )
}

export default Sell;
