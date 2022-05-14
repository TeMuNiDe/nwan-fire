import React,{Component} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import EditSharpIcon from '@material-ui/icons/EditSharp';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import NewProperty from './NewProperty';
import EditProperty from './EditProperty';

import { Dialog } from '@material-ui/core';

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

class Assets extends React.Component { 

    
    constructor(props) {
        super(props);
        this.state = {loaded:false,open:false,open_edit:false,user:props.user,assets:null,open:false};
        this.refresh = this.refresh.bind(this)
      }
  
      refresh() {
        if(!this.state.loaded) {
        fetch("http://localhost:3000/api/user/"+this.state.user.id+"/assets")
        .then(res=>res.json())
        .then((result)=>{this.setState({assets:result,loaded:true})}).catch(e=>{console.log(e)});
        }
      }

    render() {


        const {classes} = this.props;
        if(this.state.assets!=null){
        let html = <Accordion TransitionProps={{ unmountOnExit: true }} onChange={this.refresh}><AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography>Asstes</Typography><Typography>Current{this.props.user.assets.current_value} </Typography>
        <Typography>5 year Projection{this.props.user.assets["5y_value"]}</Typography>
        <Typography>10 year Projection{this.props.user.assets["10y_value"]}</Typography>
        </AccordionSummary>
        <AccordionDetails><TableContainer> <Table size="small" className={classes.table}>
          <TableHead className={classes.thead}>
            <TableRow>
              <TableCell></TableCell>
              {Object.keys(this.state.assets[0]).filter((key)=>{return key!=="_id"&&key!=="_rev"&&key!=="data"}).map((key)=>(
                  <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
        {this.state.assets.map( (asset,index)=> (
          <TableRow key={index} onMouseEnter={()=>{this.setState({hover:index})}}  onMouseLeave={()=>{this.setState({hover:null})}} >
            <TableCell><span style={{visibility:this.state.hover==index?"visible":"hidden"}}>
                <EditSharpIcon onClick={()=>{this.setState({open_edit:true,edit_object:asset})}} fontSize="small"></EditSharpIcon></span></TableCell>
              {Object.keys(asset).filter((key)=>{return key!=="_id"&&key!=="_rev"&&key!=="data"}).map((key)=>(<TableCell key={key}>{asset[key]}</TableCell>))}
              
          </TableRow>
        ))}
        <TableRow>
          <TableCell>
          <Button  variant="outlined" onClick={(e)=>{this.setState({open:true})}}>Add</Button>
        </TableCell></TableRow>
        </TableBody>
   
      </Table>
      <Dialog open={this.state.open} onClose={(e)=>{this.setState({open:false})}}>
          <NewProperty onSuccess={()=>{this.setState({loaded:false});this.refresh()}} data="asset" keys={Object.keys(this.state.assets[0]).filter((key)=>{return key!=="_id"&&key!=="_rev"&&key!=="data"})}></NewProperty>
          </Dialog>
          <Dialog open={this.state.open_edit} onClose={(e)=>{this.setState({open_edit:false})}}>
          <EditProperty onSuccess={()=>{this.setState({loaded:false});this.refresh();this.setState({open_edit:false})}} object={this.state.edit_object} ></EditProperty>
          </Dialog>
 
    </TableContainer></AccordionDetails></Accordion>
      return html ;
    } else {
      let html = <Accordion TransitionProps={{ unmountOnExit: true }} onChange={this.refresh}><AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography>Asstes</Typography><Typography>Current{this.props.user.assets.current_value} </Typography>
      <Typography>5 year Projection{this.props.user.assets["5y_value"]}</Typography>
      <Typography>10 year Projection{this.props.user.assets["10y_value"]}</Typography>
      </AccordionSummary>
      <AccordionDetails><Typography>Loading</Typography> </AccordionDetails></Accordion>
     return html;
     }

    }
    
 }
 export default withStyles(styles)(Assets);