/* eslint-disable */

//TO-DO: Add Polynimial regression results
//TO-DO: Add graph

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TableCell, TableRow, Typography } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

  const styles = theme => ({
    table: {
      minWidth: 650,
    }, 
    thead:{
      background: theme.palette.secondary.main,
      border: 0,
    },
    form : {
    margin: theme.spacing(1),
    }
  });
  class ProjectionView extends React.Component { 

    constructor(props) {
        super(props);  
        }
    render() {
        const {classes} = this.props;
        if(this.props.results!=null) {
         let fields = Object.keys(this.props.results.result_linear).filter((key)=>{return  key=="r2"||key=="string"||key=="y5"||key=="y10"});
        let html  = <div> <Typography>Projections of :{this.props.data}</Typography> 
        <TableContainer><Table size="small" className={classes.table}>
          <TableHead className={classes.thead}><TableRow>
            <TableCell> </TableCell>
        
              {fields.map((key)=>(
                  <TableCell key={key}>{key}</TableCell>
              ))}
        
          </TableRow>
          </TableHead>
          <TableBody>
          {Object.keys(this.props.results).filter((key)=>{return key!=="results_poly"&&key!=="month_5"&&key!=="month_10"}).map((result)=> (
            <TableRow key={result}><TableCell>{result}</TableCell>
            {fields.map((key)=>(<TableCell key={key}>  {this.props.results[result][key]}  </TableCell>))}            
            </TableRow>
          ))} 

          </TableBody>
          </Table></TableContainer>
        </div>
     return html;    
    } else {

            return <div></div>
        }
    }
  }
 ProjectionView.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  export default withStyles(styles)(ProjectionView);
