import React,{Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Summary from './Summary.jsx'
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));



export default function Home(props) {
     
        const classes = useStyles();
        let html = <div className={classes.root}>
            <Container maxWidth="lg">
        <Typography>Hi,{props.user.name}</Typography>
        <Grid container spacing={2}>
           <Grid item sm={12} md={12} lg={4}><Paper className={classes.paper} elevation={3}><Typography>Current Networth : {props.user.networth.current_value}</Typography></Paper></Grid>
           <Grid item sm={12} md={6} lg={4}><Paper className={classes.paper} elevation={0}><Typography>5 Year Projection : {props.user.networth["5y_value"]}</Typography></Paper></Grid>
           <Grid item sm={12} md={6} lg={4}><Paper className={classes.paper} elevation={3}><Typography>10 Year Projection : {props.user.networth["10y_value"]}</Typography></Paper></Grid>
        </Grid><Summary user={props.user}/></Container></div> 

        return html;
    
}