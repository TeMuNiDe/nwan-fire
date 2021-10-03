import React,{Component} from 'react';
import {User} from '../models/model';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TablePagination from '@material-ui/core/TablePagination';
import TableContainer from '@material-ui/core/TableContainer';

const styles = theme => ({
    table: {
      minWidth: 650,
    }, 
    thead:{
      background: theme.palette.secondary.main,
      border: 0,
    }
  });


class Investments extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {loaded:false,user:props.user,investments:null};
    }
    
    componentDidMount() {
        this.setState({loaded:true,investments:new User().getInvestments()})
    }


    handleChangePage  (event, newPage) {
      //TODO
     };
     
      handleChangeRowsPerPage (event)  {
       //TODO
     };
     
    render() {
        const {classes} = this.props;
        if(this.state.loaded){
        let html =   <TableContainer><Table size="small" className={classes.table}>
          <TableHead className={classes.thead}>
            <TableRow>
              {Object.keys(this.state.investments[0]).map((key)=>(
                  <TableCell>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
        {this.state.investments.map( (investment)=> (
          <TableRow>
              {Object.values(investment).map((value)=>(<TableCell>{value}</TableCell>))};
          </TableRow>
        ))}
        </TableBody>
      </Table>
      <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={this.state.investments.length}
      rowsPerPage={5} 
      page={0}
      onPageChange={this.handleChangePage}
      onRowsPerPageChange={this.handleChangeRowsPerPage}
    />
    </TableContainer>
      return html ;
    } else return <Typography>Loading</Typography>     
    }
 }

 
 Investments.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
   
  export default withStyles(styles)(Investments);