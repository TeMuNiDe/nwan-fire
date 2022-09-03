/* eslint-disable */

import Home from './views/Home';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from "@material-ui/core/CssBaseline";

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';


const theme = createTheme({
    
    palette: {
        type: 'dark',
        primary: {
          main: '#13A8BA',
        },
        secondary: {
          main: '#13ba77',
        },
        background: {
          default: '#1a2034',
          paper: '#202940',
        },
      }
  });


  
class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {user:0};
    }

    componentDidMount(){
        fetch("http://localhost:3000/api/user/0")
        .then(res=>res.json())
        .then((result)=>{this.setState({user:result})})
        .catch(e=>{console.log(e)});
        
    }

    render(){
      if(this.state.user!=0){
       return <ThemeProvider theme={theme}>
        <CssBaseline />
       <Home user={this.state.user}/>
       </ThemeProvider>;
    } else {
      return <Typography>Loading</Typography>;
    }

  }
}
ReactDOM.render(<App/>,document.getElementById('root'));
