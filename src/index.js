/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // We will create this file next
import AppLayout from './components/AppLayout'; // We will create this component next
 
class App extends React.Component{
    constructor(props) {
        super(props);
  
    }

    componentDidMount(){

    }

    render(){
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppLayout />
        </ThemeProvider>
      );
  }
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
