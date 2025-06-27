//import DBManager from './db_manager.js';
import express, { Router } from 'express';
import path from 'path';
import cors from 'cors';
import RouteManagerV2 from './controllers/routes_v2.js';

var app  = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })) 
app.use(express.static(path.join(path.resolve(),'/build')));
//app.use('/api',cors(),new RouteManager().getApiRouter());
app.use('/api/v2',cors(),new RouteManagerV2().getApiRouter());


app.get('*', function(req, res){
  res.status(404).send('what???');
});

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("Server listening at "+ process.env.REACT_APP_SERVER_HOST);
});
