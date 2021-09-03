import React, {useState,useContext, useRef } from 'react';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import DatabaseContext from '../contexts/DatabaseContext';
import UserContext from '../contexts/UserContext';
import Button from '@material-ui/core/Button';
import ReactToPdf from 'react-to-pdf';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import tills from '../tills';
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
    minWidth: 650,
  },
});

function TestDay(){
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [message,setMessage] = React.useState();
  const {reports,recordSell,removeReport,setRRD} = useContext(DatabaseContext);
  const [stateProductID,setStateProductID] = React.useState("");
  const {users,dataReloaded,setDataReloaded} = useContext(UserContext);
  const [price,setPrice] = useState(0);
  var today = new Date();

  console.log("dataReloaded", dataReloaded);
  if (dataReloaded) {
    setRRD(true);
    setDataReloaded(false);
  }

  const filteredReports = reports.filter((obj) =>
  (obj.year === today.getFullYear() && obj.month === today.getMonth()
  && obj.day === today.getDate()));
  const rows = [];
  //let newP = 0;
  console.log("filtered",filteredReports);

  const newRows = [];
  tills.forEach((till) => {
    const sameTill = filteredReports.filter((obj) => obj.tillNo === till.tillNo);
    console.log("sametill",sameTill);
    console.log(till.tillNo);

    if (sameTill.length >= 1) {
      let tp = 0;
      sameTill.forEach((st) => {
        tp = tp + (parseInt(st.price) * parseInt(st.soldQuantity));
      });
      const obj = {
        name: till.name,
        price: tp,
        values: sameTill
      }
      //console.log(obj);
      newRows.push(obj);
    }

  });
  console.log("newRows",newRows);

  const handleDelete = (event) =>  {
    removeReport(stateProductID);
    setOpen(false);
  }

  const openDialog = (r,e) => {
    const mess = "Are you sure you want to DELETE receipt " + r.name + " " + "(Served By: " + r.servedBy + ", price: " + r.price + ")";
    setMessage(mess);
    setStateProductID(r._id);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const name = "dailyReport_" + today.getDay() + "-" + today.getMonth() + "-" + today.getFullYear() + ".pdf";
  

  const ref = React.createRef();

  return (
    <div>
    <ReactToPdf targetRef={ref} filename={name}>
        {({toPdf}) => (
          <Button style={{margin: "10px"}} onClick={toPdf} color="secondary">
          Generate PDF
        </Button>
        )}
      </ReactToPdf>


      <div ref={ref}>
        {newRows.map((nr) => {
          return (
            <div>
            <div>{nr.name}</div>

            <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Quantity Sold</TableCell>
                <TableCell align="right">Sold By</TableCell>
                <TableCell align="right">Till Number</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Customer Name</TableCell>
                <TableCell align="right">Customer Phone</TableCell>
                <TableCell align="right">M-pesa Code</TableCell>
                <TableCell align="right">Sale Description</TableCell>
                {users.currentLoggedIn.auth === "Admin" && (
                <TableCell align="right">Delete Report</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {nr.values.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                  <TableCell align="right">{row.soldQuantity}</TableCell>
                  <TableCell align="right">{row.servedBy}</TableCell>
                  <TableCell align="right">{row.tillNo}</TableCell>
                  <TableCell align="right">{row.type}</TableCell>
                  <TableCell align="right">{row.customerName}</TableCell>
                  <TableCell align="right">{row.customerPhone}</TableCell>
                  <TableCell align="right">{row.mpesaCode}</TableCell>
                  <TableCell align="right">{row.sellDesc}</TableCell>
                  {users.currentLoggedIn.auth === "Admin" && (
                    <TableCell align="right">
                      <DeleteIcon color="secondary" onClick={(e) => openDialog(row,e)}/>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div>Total price: <e style={{color: "red"}}>Ksh {nr.price}</e></div>
        <br/>
            </div>
          )

        })}

        </div>




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

          <Button style={{margin: "10px"}} onClick={handleClose} color="primary">
            NO
          </Button>
          <Button style={{margin: "10px"}} onClick={handleDelete} color="secondary">
            YES
          </Button>


        </DialogActions>
      </Dialog>

    </div>
  );
}

export default TestDay;
