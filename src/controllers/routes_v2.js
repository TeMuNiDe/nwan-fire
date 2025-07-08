import express from "express";
import UserDb from "../models/UserDb.js";
import AssetDb from "../models/AssetDb.js";
import LiabilityDb from "../models/LiabilityDb.js";
import TransactionDb from "../models/TransactionDb.js";
import logger from "../utils/logger.js"; // Import the logger utility

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

        // Request logging middleware
        this.api_router.use((req, res, next) => {
            const { method, originalUrl, body, query } = req;
            logger.log(`Request: ${method} ${originalUrl}`);
            if (Object.keys(body).length > 0) {
                logger.log(`  Body: ${JSON.stringify(body)}`);
            }
            if (Object.keys(query).length > 0) {
                logger.log(`  Query Parameters: ${JSON.stringify(query)}`);
            }

            // Response logging
            const originalSend = res.send;
            const originalJson = res.json;

            res.send = function (data) {
                logger.log(`Response for ${method} ${originalUrl}: ${data}`);
                originalSend.apply(res, arguments);
            };

            res.json = function (data) {
                originalJson.apply(res, arguments);
            };

            next();
        });

        setupUserRoutes(this.api_router, this.userDb, this.assetDb, this.liabilityDb, this.transactionDb);
        setupAssetRoutes(this.api_router, this.userDb, this.assetDb);
        setupLiabilityRoutes(this.api_router, this.userDb, this.liabilityDb);
        setupTransactionRoutes(this.api_router, this.userDb, this.transactionDb);
    }

    getApiRouter() {
        return this.api_router;
    }
}
