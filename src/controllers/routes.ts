import express from "express";
import { User,Investment,Income,Expenditure,Asset,Liability } from "../models/model";
import { auth } from "./auth";

export default class RouteManger {
    api_router:express.Router;
    constructor (){
         this.api_router = express.Router();
         this.api_router.route('/').get((req: express.Request, res: express.Response) => {
          res.send("Router is Working, Welcome to API");
        });
        this.api_router.route('/user/:id').all((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            res.json(new User().toJSON())
        });
        this.api_router.route('/investment/:id').all((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"investment":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            res.json(new Investment().toJSON())
        });
        this.api_router.route('/income/:id').all((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"income":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            res.json(new Income().toJSON())
        });
        this.api_router.route('/expenditure/:id').all((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"expenditure":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            res.json(new Expenditure().toJSON())
        });
        this.api_router.route('/asset/:id').all((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"asset":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            res.json(new Asset().toJSON())
        });
        this.api_router.route('/liability/:id').all((req: express.Request, res: express.Response, next: express.NextFunction)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"liability":req.params.id,"reason":"Authentication Failure"})}
        }).get((req: express.Request, res: express.Response) => {
            res.json(new Liability().toJSON())
        })
        
        this.api_router.route('*').all((req: express.Request, res: express.Response, next: express.NextFunction)=>{res.status(400).json({"error":"Invalid Syntax"})});
    }
    getApiRouter() {
        return this.api_router;
    }
    getLocalRouter() {
        return this.api_router;
    }
} 