
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
class Expenditures extends React.Component { 
    
    constructor(props) {
        super(props);
        this.state = {loaded:false,user:props.user,expenditures:null};
    }
    
    componentDidMount() {
        this.setState({loaded:true,expenditures:new User().getExpenditures()})
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
          <TableRow key="head" >
           <TableCell rowSpan={2}>Name</TableCell><TableCell colSpan={5}>Amount</TableCell>
          </TableRow>
          <TableRow>
            {this.state.expenditures.index.months.map((month)=>(
                <TableCell>{month}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
        {this.state.expenditures.index.names.map( (name)=> (
          <TableRow><TableCell>{name}</TableCell>
            {this.state.expenditures.data.filter(item=>item.name==name).map((item) => (
              <TableCell>{item.amount}</TableCell>
            ))}
          </TableRow>
        ))}
        </TableBody>
      </Table>
      <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={this.state.expenditures.data.length}
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

 Expenditures.propTypes = {
  classes: PropTypes.object.isRequired,
};

 
export default withStyles(styles)(Expenditures);