import express from "express";
import {Projections} from "../models/projections.js";
import { UserManager,PropertyManager } from "../models/model.js";
import { auth } from "./auth.js";

export default class RouteManager {
    api_router;
    nested_router;
    property_manager;
    user_manager;
    constructor (){
        this.property_manager = new PropertyManager();
        this.user_manager = new UserManager();
         this.api_router = express.Router();
         this.nested_router = express.Router({mergeParams: true});
         this.api_router.route('/').get((req, res) => {
          res.send("Router is Working, Welcome to API");
        });
        this.api_router.route('/user/:id').get((req, res, next)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req, res) => {
            let data = this.user_manager.getUser(parseInt(req.params.id));
            data.then((data)=>{res.json(data)});
        });
        this.api_router.route('/user/:id/update/:property').get((req, res, next)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req, res) => {
            let data = this.property_manager.updateUserProperty(parseInt(req.params.id),req.params.property);
            data.then(data=>{res.json(data)});
        });

        this.api_router.route('/user/:id/investments').get((req, res, next)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req, res) => {
            let data = this.user_manager.getInvestments(parseInt(req.params.id));
            data.then((data)=>{res.json(data)});
        });

        this.api_router.route('/user/:id/incomes').get((req, res, next)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req, res) => {
            let data = this.user_manager.getIncomes(parseInt(req.params.id));
            data.then((data)=>{res.json(PropertyManager.indexEntries(data))});
        });

        this.api_router.route('/user/:id/expenditures').get((req, res, next)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req, res) => {
            let data = this.user_manager.getExpenditures(parseInt(req.params.id));
            data.then((data)=>{res.json(PropertyManager.indexEntries(data))});
        });

        this.api_router.route('/user/:id/assets').get((req, res, next)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req, res) => {
            let data = this.user_manager.getAssets(parseInt(req.params.id));
            data.then((data)=>{res.json(data)});
        });

        this.api_router.route('/user/:id/liabilities').get((req, res, next)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"user":req.params.id,"reason":"Authentication Failure"})}
        }).get((req, res) => {
            let data = this.user_manager.getLiabilities(parseInt(req.params.id));
            data.then((data)=>{res.json(data)});
        });
    
        this.api_router.route('/property/:id').get((req, res, next)=>{
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"property":req.params.id,"reason":"Authentication Failure"})}
        }).get((req, res) => {
            let data = this.property_manager.getProperty(req.params.id);
            console.log("Property");
            data.then((property)=>{res.json(property)});
        });
        
        this.api_router.route('/property').post((req, res, next) => {
            if(auth(parseInt(req.body.user))) {next()} else {res.status(401).json({"property":req.params.id,"reason":"Authentication Failure"})}
        }).post((req, res) => {
            let response = this.property_manager.setProperty(req.body);
            response.then(response=>res.json(response));
        });
        this.api_router.route('/user/:id/regress/:property').get((req, res, next) => {
            if(auth(parseInt(req.params.id))) {next()} else {res.status(401).json({"property":req.params.id,"reason":"Authentication Failure"})}
        }).get((req, res) => {
            let data = [];
            if(req.params.property=="income") {
                data = this.user_manager.getIncomes(parseInt(req.params.id));
            }
            if(req.params.property=="expenditure") {
                data = this.user_manager.getExpenditures(parseInt(req.params.id));
            }
            data.then((data)=>{res.json(Projections.projectAll(data))});
        });
        
        this.api_router.route('*').all((req, res)=>{res.status(400).json({"error":"Invalid Syntax"})});
    }
    getApiRouter() {
        return this.api_router;
    }
 
} 