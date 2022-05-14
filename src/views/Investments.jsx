import React,{Component} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import NewProperty from './NewProperty';
import EditProperty from './EditProperty';

import EditSharpIcon from '@material-ui/icons/EditSharp';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TablePagination from '@material-ui/core/TablePagination';
import TableContainer from '@material-ui/core/TableContainer';
import { Dialog } from '@material-ui/core';
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
    },
    form : {
    margin: theme.spacing(1),
    }
  });


class Investments extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {loaded:false,open:false,open_edit:false,user:props.user,investments:null};
        this.refresh = this.refresh.bind(this)
    }
    


    refresh() {
      if(!this.state.loaded) {
      fetch("http://localhost:3000/api/user/"+this.state.user.id+"/investments")
      .then(res=>res.json())
      .then((result)=>{this.setState({investments:result,loaded:true})}).catch(e=>{console.log(e)});
      }
    }

     
    render() {
        const {classes} = this.props;
        if(this.state.investments!=null){
        let html =   <Accordion TransitionProps={{ unmountOnExit: true }} onChange={this.refresh}><AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography>Investments</Typography><Typography>Current{this.props.user.investments.current_value} </Typography>
        <Typography>5 year Projection{this.props.user.investments["5y_value"] }</Typography>
        <Typography>10 year Projection{this.props.user.investments["10y_value"]} </Typography>
        </AccordionSummary>
        <AccordionDetails><TableContainer><Table size="small" className={classes.table}>
          <TableHead className={classes.thead}>
            <TableRow>
              <TableCell></TableCell>
              {Object.keys(this.state.investments[0]).filter((key)=>{return key!=="_id"&&key!=="_rev"&&key!=="data"}).map((key)=>(
                  <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
        {this.state.investments.map( (investment,index)=> (
          <TableRow key={index} onMouseEnter={()=>{this.setState({hover:index})}}  onMouseLeave={()=>{this.setState({hover:null})}}>
            <TableCell><span style={{visibility:this.state.hover==index?"visible":"hidden"}}>
                <EditSharpIcon onClick={()=>{this.setState({open_edit:true,edit_object:investment})}} fontSize="small"></EditSharpIcon></span></TableCell>
              {Object.keys(investment).filter((key)=>{return key!=="_id"&&key!=="_rev"&&key!=="data"}).map((key)=>(<TableCell key={key} >{investment[key]}</TableCell>))}
          </TableRow>
        ))}
          <TableRow>
          <TableCell>
          <Button  variant="outlined" onClick={(e)=>{this.setState({open:true})}}>Add</Button>
        </TableCell></TableRow>
        </TableBody>
   
      </Table>
      <Dialog open={this.state.open} onClose={(e)=>{this.setState({open:false})}}>
          <NewProperty onSuccess={()=>{this.setState({loaded:false});this.refresh()}} data="investment" keys={Object.keys(this.state.investments[0]).filter((key)=>{return key!=="_id"&&key!=="_rev"&&key!=="data"})}></NewProperty>
          </Dialog>
          <Dialog open={this.state.open_edit} onClose={(e)=>{this.setState({open_edit:false})}}>
          <EditProperty onSuccess={()=>{this.setState({loaded:false});this.refresh();this.setState({open_edit:false})}} object={this.state.edit_object} ></EditProperty>
          </Dialog>
    </TableContainer></AccordionDetails></Accordion>
      return html ;
    } else {
      
      let html = <Accordion TransitionProps={{ unmountOnExit: true }} onChange={this.refresh}><AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography>Investments</Typography><Typography>Current{this.props.user.investments.current_value} </Typography>
      <Typography>5 year Projection{this.props.user.investments["5y_value"] }</Typography>
      <Typography>10 year Projection{this.props.user.investments["10y_value"]} </Typography>
      </AccordionSummary>
      <AccordionDetails><Typography>Loading</Typography></AccordionDetails></Accordion>
      
      return html }     
    }
 }

 
 Investments.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
   
  export default withStyles(styles)(Investments);