import express from "express";
import UserDb from "../models/UserDb.js";
import AssetDb from "../models/AssetDb.js";
import LiabilityDb from "../models/LiabilityDb.js";
import TransactionDb from "../models/TransactionDb.js";

import setupUserRoutes from "./route_users.js";
import setupAssetRoutes from "./route_assets.js";
import setupLiabilityRoutes from "./route_liabilities.js";
import setupTransactionRoutes from "./route_transactions.js";

export default class RouteManagerV2 {
    api_router;
    userDb;
    assetDb;
    liabilityDb;
    transactionDb;

    constructor() {
        this.api_router = express.Router();
        this.userDb = new UserDb();
        this.assetDb = new AssetDb();
        this.liabilityDb = new LiabilityDb();
        this.transactionDb = new TransactionDb();

        setupUserRoutes(this.api_router, this.userDb, this.assetDb, this.liabilityDb, this.transactionDb);
        setupAssetRoutes(this.api_router, this.userDb, this.assetDb);
        setupLiabilityRoutes(this.api_router, this.userDb, this.liabilityDb);
        setupTransactionRoutes(this.api_router, this.userDb, this.transactionDb);
    }

    getApiRouter() {
        return this.api_router;
    }
}
