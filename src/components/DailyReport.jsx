import React, {useState,useContext} from 'react';
import DatabaseContext from '../contexts/DatabaseContext';
import UserContext from '../contexts/UserContext';
import Button from '@material-ui/core/Button';

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


function DailyReport(){
  const classes = useStyles();
  const {reports,recordSell,removeReport,setRRD} = useContext(DatabaseContext);
  const {users,dataReloaded,setDataReloaded} = useContext(UserContext);
  const [price,setPrice] = useState(0);
  var today = new Date();
  console.log("reports", reports);
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

  const handleDelete = (reportID, event) =>  {
    removeReport(reportID);
  }


  return (
    <div>
    {newRows.map((nr) => {
      return (
        <div>
        <div >{nr.name}</div>
        <div >Total price: {nr.price}</div>
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
              {users.currentLoggedIn.auth === "Admin" && (
                <TableCell align="right">
                  <DeleteIcon color="secondary" onClick={(e) => handleDelete(row._id,e)}/>
                </TableCell>
              )}
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

export default DailyReport;
