import { CodeSharp } from "@material-ui/icons";
import express from "express";
import { UserManager,PropertyManager } from "../models/model";
import { auth } from "./auth";

export default class RouteManager {
    api_router:express.Router;
    nested_router:express.Router;
    property_manager:PropertyManager;
    user_manager:UserManager;
    constructor (){
        this.property_manager = new PropertyManager();
        this.user_manager = new UserManager();
         this.api_router = express.Router();
         this.nested_router = express.Router({mergeParams: true});
         this.api_router.route('/').get((req: express.Request, res: express.Response) => {
          res.send("Router is Working, Welcome to API");
        });
        this.api_router.route('/user/:id').get((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            let data = this.user_manager.getUser(parseInt(req.params.id));
            data.then((data)=>{res.json(data)});
        });
        this.api_router.route('/user/:id/update/:property').get((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            let data = this.property_manager.updateUserProperty(parseInt(req.params.id),req.params.property);
            data.then(data=>{res.json(data)});
        });

        this.api_router.route('/user/:id/investments').get((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            let data = this.user_manager.getInvestments(parseInt(req.params.id));
            data.then((data)=>{res.json(data)});
        });

        this.api_router.route('/user/:id/incomes').get((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            let data = this.user_manager.getIncomes(parseInt(req.params.id));
            data.then((data)=>{res.json(PropertyManager.indexEntries(data))});
        });

        this.api_router.route('/user/:id/expenditures').get((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            let data = this.user_manager.getExpenditures(parseInt(req.params.id));
            data.then((data)=>{res.json(PropertyManager.indexEntries(data))});
        });

        this.api_router.route('/user/:id/assets').get((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            let data = this.user_manager.getAssets(parseInt(req.params.id));
            data.then((data)=>{res.json(data)});
        });

        this.api_router.route('/user/:id/liabilities').get((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            let data = this.user_manager.getLiabilities(parseInt(req.params.id));
            data.then((data)=>{res.json(data)});
        });
    
        this.api_router.route('/property/:id').get((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"property":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            let data = this.property_manager.getProperty(req.params.id);
            console.log("Property");
            data.then((property)=>{res.json(property)});
        });
        
        this.api_router.route('/property').post((req: express.Request, res: express.Response) => {
            let response = this.property_manager.setProperty(req.body);
            response.then(response=>res.json(response));
        });
        
        this.api_router.route('*').all((req: express.Request, res: express.Response, next: express.NextFunction)=>{res.status(400).json({"error":"Invalid Syntax"})});
    }
    getApiRouter() {
        return this.api_router;
    }
 
} 