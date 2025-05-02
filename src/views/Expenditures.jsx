/* eslint-disable */

import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import NewProperty from './NewProperty';
import EditProperty from './EditProperty';
import EditSharpIcon from '@material-ui/icons/EditSharp';

import { Dialog } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TableContainer from '@material-ui/core/TableContainer';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


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
        this.state = {loaded:false,open:false,open_edit:false,user:props.user,expenditures:null};
        this.refresh = this.refresh.bind(this)
      }
      

  
      refresh() {
        if(!this.state.loaded) {
        fetch("http://localhost:3000/api/user/"+this.state.user.id+"/expenditures")
        .then(res=>res.json())
        .then((result)=>{this.setState({expenditures:result,loaded:true})}).catch(e=>{console.log(e)});
        }
      }
  
       
 
    render() {
      const {classes} = this.props;
      if(this.state.expenditures!=null){
      let html =  <Accordion  TransitionProps={{ unmountOnExit: true }} onChange={this.refresh}><AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography>Expenditure</Typography><Typography>Last Month : {this.state.user.expenditure.last_month} </Typography>
      <Typography>Average : {this.state.user.expenditure.average} </Typography>
      </AccordionSummary>
      <AccordionDetails> <TableContainer><Table size="small" className={classes.table}>
        <TableHead className={classes.thead}>
          <TableRow key="head" >
           <TableCell rowSpan={2}>Name</TableCell><TableCell colSpan={5}>Amount</TableCell>
          </TableRow>
          <TableRow>
            {this.state.expenditures.index.dates.map((date)=>(
                <TableCell key={date}>{new Date(date*1000).toLocaleDateString()}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
        {this.state.expenditures.index.names.map((name,index_name)=> (
          <TableRow key={name}><TableCell>{name}</TableCell>
            {this.state.expenditures.data.filter(item=>item.name===name).map((item,index) => (
              <TableCell key={index} onMouseEnter={()=>{this.setState({hover:index_name+"_"+index})}}  onMouseLeave={()=>{this.setState({hover:null})}}  >{item.net}
              <span style={{visibility:this.state.hover===index_name+"_"+index?"visible":"hidden"}}>
                <EditSharpIcon onClick={()=>{this.setState({open_edit:true,edit_object:item})}} fontSize="small"></EditSharpIcon></span></TableCell>
            ))}
          </TableRow>
        ))}
             <TableRow>
          <TableCell>          <Button  variant="outlined" onClick={(e)=>{this.setState({open:true})}}>Add</Button>
        </TableCell>
        </TableRow>
        </TableBody>
      </Table>
      <Dialog open={this.state.open} onClose={(e)=>{this.setState({open:false})}}>
          <NewProperty  onSuccess={(response)=>{this.setState({loaded:false,user:response.user,expenditures:response.properties})}} data="expenditure" keys={Object.keys(this.state.expenditures.data[0]).filter((key)=>{return key!=="_id"&&key!=="_rev"&&key!=="data"})}></NewProperty>
          </Dialog>
          <Dialog open={this.state.open_edit} onClose={(e)=>{this.setState({open_edit:false})}}>
          <EditProperty onSuccess={(response)=>{this.setState({loaded:false,user:response.user,expenditures:response.properties});this.setState({open_edit:false})}} object={this.state.edit_object} ></EditProperty>
          </Dialog>
    </TableContainer></AccordionDetails></Accordion>
      return html ;
    } else {
    
     let html = <Accordion TransitionProps={{ unmountOnExit: true }} onChange={this.refresh}><AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
     <Typography>Expenditure</Typography><Typography>Last Month : {this.state.user.expenditure.last_month} </Typography>
     <Typography>Average : {this.state.user.expenditure.average} </Typography>
     </AccordionSummary>
     <AccordionDetails><Typography>Loading</Typography></AccordionDetails></Accordion>      
     return html
    }}   
 }

 Expenditures.propTypes = {
  classes: PropTypes.object.isRequired,
};

 
export default withStyles(styles)(Expenditures);