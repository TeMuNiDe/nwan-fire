/* eslint-disable */
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
    form : {
    margin: theme.spacing(1),
    }
  });

  class NewProperty extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {submitted:false};
        this.handleSave = this.handleSave.bind(this);

        }

    handleSave() {
        this.setState({submitted:true});
        let unfilled = [];
        this.props.keys.forEach((key)=>{
            if(typeof this.state[key]=="undefined") {
                unfilled.push(key);
            }
        });

        if (unfilled.length>0) {
            console.log("Unfilled");
            console.log(unfilled);
            return;        
         }
         let body = {};
         this.props.keys.forEach((key)=>{
            body[key]=this.state[key];
         }); 

        body.data=this.props.data;
         console.log(body);

         
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
            
        };
        fetch('http://localhost:3000/api/property', requestOptions)
        .then(response => response.json())
        .then(data=>{
            console.log("Response From Db");
            console.log(data);
            console.log(data.user);
             this.props.onSuccess(data);
        })
        .catch(e=>console.log(e));
    
    }

    render() {
        const {classes} = this.props;
        return <form className={classes.form} noValidate autoComplete="off">
        {this.props.keys.map((key)=>(
                      <TextField  error={this.state.submitted&&!typeof this.state[key]=="undefined"} className={classes.form} onChange={(e)=>{
                          this.setState({[key]:key.match("date")?new Date(e.target.value).getTime()/1000:isNaN(e.target.value)?e.target.value:parseInt(e.target.value)})
                        }} id={key} key={key} variant="outlined" label={key} type={key.match("date")?"date":"text"}  required={true}/>
                ))}
        <Button  variant="outlined" onClick={this.handleSave}>Save</Button>
        </form>
      
    }
}
    
 NewProperty.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
   
  export default withStyles(styles)(NewProperty);
