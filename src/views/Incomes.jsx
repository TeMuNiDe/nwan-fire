
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
class Incomes extends React.Component { 
    
    constructor(props) {
        super(props);
        this.state = {loaded:false,user:props.user,incomes:null};
    }
    
    componentDidMount() {
        this.setState({loaded:true,incomes:new User().getIncomes()})
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
            {this.state.incomes.index.months.map((month)=>(
                <TableCell>{month}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
        {this.state.incomes.index.names.map( (name)=> (
          <TableRow><TableCell>{name}</TableCell>
            {this.state.incomes.data.filter(item=>item.name==name).map((item) => (
              <TableCell>{item.net}</TableCell>
            ))}
          </TableRow>
        ))}
        </TableBody>
      </Table>
        <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={this.state.incomes.index.months.length}
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


 Incomes.propTypes = {
  classes: PropTypes.object.isRequired,
}

 
export default withStyles(styles)(Incomes);