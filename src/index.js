import {Table} from './views/Table.js';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
const table_data = {
    
    "head": [
        "Start Time",
        "Principal",
        "Increment",
        " Increment Frequency",
        "Compounding Freqency"
       ],
       "data": [
        [
         "05/09/2020",
         "10000",
         "5000",
         "1",
         "3"
        ],
        [
         "05/09/2021",
         "20000",
         "7500",
         "6",
         "12"
        ],
        [
         "05/09/2021",
         "15000",
         "4000",
         "3",
         "12"
        ]
       ]
}

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = table_data;
    }
    componentDidMount () {
        fetch ("http://localhost:3000/investments")
        .then(res=>res.json())
        .then((result)=>{
            console.log(result);
            this.setState(result)});
         }
    render(){
       return (<Table data={this.state}></Table>);
    }
}

ReactDOM.render(<App/>,document.getElementById('root'));
