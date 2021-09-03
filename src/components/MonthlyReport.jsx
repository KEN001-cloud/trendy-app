import React, {useState,useContext} from 'react';
import DatabaseContext from '../contexts/DatabaseContext';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


function MonthlyReport(){
  const classes = useStyles();
  const {reports,recordSell,removeReport} = useContext(DatabaseContext);
  const [price,setPrice] = useState(0);
  var today = new Date();
  const [clickedMonth, setClickedMonth] = useState(today.getMonth());
  //console.log("reports",reports);
  // reports.forEach((rp) => {
  //   removeReport(rp._id);
  // })

  const months = [{id: 0,value: "January"},{id: 1,value: "February"},{id: 2,value: "March"},{id: 3,value: "April"}
,{id: 4,value: "May"},{id: 5,value: "June"},{id: 6,value: "July"},{id: 7,value: "August"},{id: 8,value: "September"}
,{id: 9,value: "October"},{id: 10,value: "November"},{id: 11,value: "December"}]

  const filteredReports = reports.filter((obj) =>
  (obj.year === today.getFullYear() && obj.month === clickedMonth));
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

  // newRows.forEach((rep) => {
  //   rows.push(createData(rep.servedBy,rep.totalPrice,rep._id,rep.selected));
  //   newP = newP + parseInt(rep.totalPrice);
  // });
  //console.log(rows);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (id,e) => {
    setAnchorEl(null);
    setClickedMonth(id);
  };

  return (
    <div>
    <div>
    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
    Select Month
  </Button>
  <Menu
    id="simple-menu"
    anchorEl={anchorEl}
    keepMounted
    open={Boolean(anchorEl)}
    onClose={handleClose}
  >{months.map((month) => {
    return(
      <MenuItem onClick={(e) => handleClose(month.id,e)}>{month.value}</MenuItem>
    )
  })}
  </Menu>
  </div>
    {newRows.map((nr) => {
      return (
        <div>
        <div>{nr.name}</div>
        <div>Total price: {nr.price}</div>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <br />
        </div>
      )

    })}

    </div>
  )
}

export default MonthlyReport;
