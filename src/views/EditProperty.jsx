import React,{Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
    form : {
    margin: theme.spacing(1),
    }
  });

  class EditProperty extends React.Component { 

    constructor(props) {
        super(props);
        let keys = Object.keys(this.props.object).filter((key)=>{return key!=="_id"&&key!=="_rev"&&key!=="data"});
        this.state = {submitted:false,keys:keys};
        this.handleSave = this.handleSave.bind(this);


        }
     componentDidMount() {
        this.state.keys.forEach((key)=>{
            this.setState({[key]:this.props.object[key]});
         });
     }
    handleSave() {
        this.setState({submitted:true});
        let unfilled = [];
        this.state.keys.forEach((key)=>{
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
         this.state.keys.forEach((key)=>{
            body[key]=this.state[key];
         }); 

        body.data=this.props.object.data;
        body._id =this.props.object._id;
        body._rev = this.props.object._rev;  
        console.log(body);

         
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
            
        };
        fetch('http://localhost:3000/api/property', requestOptions)
        .then(response => {
            console.log(response.json())
            this.props.onSuccess();
        })
        .catch(e=>console.log(e));
    
    }

    render() {
        const {classes} = this.props;
        return <form className={classes.form} noValidate autoComplete="off">
        {this.state.keys.map((key)=>(
                      <TextField defaultValue={this.props.object[key]}  error={this.state.submitted&&!typeof this.state[key]=="undefined"} className={classes.form} onChange={(e)=>{
                          this.setState({[key]:isNaN(e.target.value)?e.target.value:parseInt(e.target.value)})
                        }} id={key} key={key} variant="outlined" label={key} required={true}/>
                ))}
        <Button  variant="outlined" onClick={this.handleSave}>Save</Button>
        </form>
      
    }
}
    
 EditProperty.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
   
  export default withStyles(styles)(EditProperty);
