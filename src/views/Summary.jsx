import React,{Component} from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Incomes from './Incomes'
import Investments from './Investments'
import Expenditures from './Expenditures'
import Assets from './Assets'
import Liabilities from './Liabilities'

export default class Summary extends React.Component {
   
    render() {

    let html = <div> <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography>Income</Typography><Typography>Last Month : {this.props.user.income.last_month} </Typography>
        <Typography>Average : {this.props.user.income.average} </Typography>
        </AccordionSummary>
        <AccordionDetails><Incomes user={this.props.user} /></AccordionDetails></Accordion>
        <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography>Expenditure</Typography><Typography>Last Month : {this.props.user.expenditure.last_month} </Typography>
        <Typography>Average : {this.props.user.expenditure.average} </Typography>
        </AccordionSummary>
        <AccordionDetails><Expenditures user={this.props.user} /></AccordionDetails></Accordion>
        <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography>Investments</Typography><Typography>Current{this.props.user.investments.current_value} </Typography>
        <Typography>5 year Projection{this.props.user.investments["5y_value"] }</Typography>
        <Typography>10 year Projection{this.props.user.investments["10y_value"]} </Typography>
        </AccordionSummary>
        <AccordionDetails><Investments user={this.props.user} /></AccordionDetails></Accordion>
        <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography>Asstes</Typography><Typography>Current{this.props.user.assets.current_value} </Typography>
        <Typography>5 year Projection{this.props.user.assets["5y_value"]}</Typography>
        <Typography>10 year Projection{this.props.user.assets["10y_value"]}</Typography>
        </AccordionSummary>
        <AccordionDetails><Assets user={this.props.user} /></AccordionDetails></Accordion>
        <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography>Liabilites</Typography><Typography>Current{this.props.user.liabilities.current_value} </Typography>
        <Typography>5 year Projection{this.props.user.liabilities["5y_value"] }</Typography>
        <Typography>10 year Projection{this.props.user.liabilities["10y_value"]} </Typography>
        </AccordionSummary>
        <AccordionDetails><Liabilities user={this.props.user} /></AccordionDetails></Accordion></div>

    return html;
    }        


}