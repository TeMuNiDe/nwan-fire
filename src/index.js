/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
 
class App extends React.Component{
    constructor(props) {
        super(props);
  
    }

    componentDidMount(){

    }

    render(){
      return <p>Hello, World!</p>;
  }
}
ReactDOM.render(<App/>,document.getElementById('root'));
