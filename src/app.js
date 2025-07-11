//import DBManager from './db_manager.js';
import express, { Router } from 'express';
import path from 'path';
import cors from 'cors';
import RouteManager from './controllers/routes.js';

var app  = express();

/*
var corsOptions = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
*/

//const dbManager = new DBManager();
/* app.get("/init",function (req,res) {

});


app.get("/investments",cors(corsOptions),function (req,res) {
    let investmentPromise = dbManager.getInvestments();
    investmentPromise.then((data) =>{
    console.log(data);
    res.json(data);
    });
});
 */

app.use(express.json());
app.use(express.urlencoded({ extended: true })) 
app.use(express.static(path.join(path.resolve(),'/build')));
//var apiRouter:Router = new RouteManager().getApiRouter();
app.use('/api',cors(),new RouteManager().getApiRouter());
//app.use('/api',cors(),apiRouter);


app.get('*', function(req, res){
  res.status(404).send('what???');
});

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("Server listening at http://localhost:" + port);
});