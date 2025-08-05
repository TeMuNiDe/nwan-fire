import express, { Router } from 'express';
import path from 'path';
import cors from 'cors';
import RouteManagerV2 from './controllers/routes_v2.js';
import chatRouter from './bot/chat_controller.js';
import smsRouter from './bot/sms_handler.js';

var app  = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })) 
app.use(express.static(path.join(path.resolve(),'/build')));
//app.use('/api',cors(),new RouteManager().getApiRouter());
app.use('/api/v2',cors(),new RouteManagerV2().getApiRouter());
app.use('/chat', cors(), chatRouter());
app.use('/sms', cors(), smsRouter());

app.get('*', function(req, res) {
  res.sendFile(path.join(path.resolve(), '/build', 'index.html'));
});

var port = process.env.PORT_SERVER || 3000
app.listen(port, function() {
    console.log("Server listening at "+ process.env.REACT_APP_SERVER_HOST);
});
