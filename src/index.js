import Home from './views/Home';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {User} from './models/model'
import CssBaseline from "@material-ui/core/CssBaseline";

import { createTheme, ThemeProvider } from '@material-ui/core/styles';


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
        this.state = {user:new User().toJSON()};
    }

    componentDidMount(){
        this.setState({user:new User().toJSON()});
    }

    render(){

       return <ThemeProvider theme={theme}>
        <CssBaseline />
       <Home user={this.state.user}/>
       </ThemeProvider>;
    }
}
ReactDOM.render(<App/>,document.getElementById('root'));
