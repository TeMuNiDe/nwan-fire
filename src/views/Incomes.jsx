/* eslint-disable */

import React,{Component} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import NewProperty from './NewProperty';
import EditProperty from './EditProperty';
import { Dialog } from '@material-ui/core';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TablePagination from '@material-ui/core/TablePagination';
import TableContainer from '@material-ui/core/TableContainer';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ProjectionView from './Projections';

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
        this.state = {loaded:false,open_new:false,open_edit:false,open_regress:false,user:props.user,incomes:null,regression:{inputs:null,results:null}};
        this.refresh = this.refresh.bind(this)
        this.regress = this.regress.bind(this)
      }
      

      refresh() {
       if(!this.state.loaded) {
        fetch("http://localhost:3000/api/user/"+this.state.user.id+"/incomes")
        .then(res=>res.json())
        .then((result)=>{this.setState({incomes:result,loaded:true})}).catch(e=>{console.log(e)});
        fetch("http://localhost:3000/api/user/"+this.state.user.id)
        .then(res=>res.json())
        .then((result)=>{this.setState({user:result,loaded:true})}).catch(e=>{console.log(e)});
      }
      }
      
      regress() {
        fetch("http://localhost:3000/api/user/"+this.state.user.id+"/regress/income")
        .then(res=>res.json())
        .then((result)=>{this.setState({regression:result,open_regress:true})}).catch(e=>{console.log(e)});
      }
  
       
    
    render() {
      const {classes} = this.props;
      if(this.state.incomes!=null){
      let html =   <Accordion TransitionProps={{ unmountOnExit: true }} onChange={this.refresh}><AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography>Income</Typography><Typography>Last Month : {this.state.user.income.last_month} </Typography>
      <Typography>Average : {this.state.user.income.average} </Typography>
      </AccordionSummary>
      <AccordionDetails><TableContainer><Table size="small" className={classes.table}>
        <TableHead className={classes.thead}>
          <TableRow key="head" >
           <TableCell rowSpan={2}>Name</TableCell><TableCell colSpan={5}>Amount</TableCell>
          </TableRow>
          <TableRow>
            {this.state.incomes.index.months.map((month)=>(
                <TableCell key={month}>{new Date(month*1000).toLocaleDateString()}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
        {this.state.incomes.index.names.map( (name,index_name)=> (
          <TableRow key={name}><TableCell>{name}</TableCell>
            {this.state.incomes.data.filter(item=>item.name==name).map((item,index) => (
              <TableCell key={index} onMouseEnter={()=>{this.setState({hover:index_name+"_"+index})}}  onMouseLeave={()=>{this.setState({hover:null})}} >{item.net}
              <span style={{visibility:this.state.hover==index_name+"_"+index?"visible":"hidden"}}>
                <EditSharpIcon onClick={()=>{this.setState({open_edit:true,edit_object:item})}} fontSize="small"></EditSharpIcon></span></TableCell>
            ))}
          </TableRow>
        ))}
             <TableRow>
          <TableCell><Button  variant="outlined" onClick={(e)=>{this.setState({open_new:true})}}>Add</Button></TableCell>
          <TableCell><Button  variant="outlined" onClick={(e)=>{this.regress()}}>Project</Button>
</TableCell>
        </TableRow>
        </TableBody>
      </Table>
      <Dialog open={this.state.open_new} onClose={(e)=>{this.setState({open_new:false})}}>
          <NewProperty onSuccess={(response)=>{this.setState({loaded:false,user:response.user,incomes:response.properties})}} data="income" keys={Object.keys(this.state.incomes.data[0]).filter((key)=>{return key!=="_id"&&key!=="_rev"&&key!=="data"})}></NewProperty>
          </Dialog>
          <Dialog open={this.state.open_edit} onClose={(e)=>{this.setState({open_edit:false})}}>
          <EditProperty onSuccess={(response)=>{this.setState({loaded:false,user:response.user,incomes:response.properties});this.setState({open_edit:false})}} object={this.state.edit_object} ></EditProperty>
          </Dialog>
          <Dialog open={this.state.open_regress} onClose={(e)=>{this.setState({open_regress:false})}}>
         <ProjectionView data="income" results={this.state.regression.results} inputs={this.state.regression.inputs}/>
          </Dialog>
      </TableContainer></AccordionDetails></Accordion>
      return html ;
    }
     else return <Accordion onChange={this.refresh} TransitionProps={{ unmountOnExit: true }} ><AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header"><Typography>Income</Typography><Typography>Last Month : {this.state.user.income.last_month} </Typography><Typography>Average : {this.state.user.income.average} </Typography></AccordionSummary><AccordionDetails><Typography>Loading</Typography> </AccordionDetails></Accordion>
 }

}

 Incomes.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Incomes);