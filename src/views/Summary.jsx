import React,{Component} from 'react';

import Incomes from './Incomes'
import Investments from './Investments'
import Expenditures from './Expenditures'
import Assets from './Assets'
import Liabilities from './Liabilities'

export default class Summary extends React.Component {
   
    render() {

    let html = <div> <Incomes user={this.props.user} />
        <Expenditures user={this.props.user} />
        <Investments user={this.props.user} />
        <Assets user={this.props.user} />
        <Liabilities user={this.props.user} /></div>

    return html;
    }        


}