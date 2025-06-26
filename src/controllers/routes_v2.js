import express from "express";
import { get_sample_user, get_sample_asset, get_sample_liability, get_sample_transaction } from "../models/model_v2.js";
import UserDb from "../models/UserDb.js";
import AssetDb from "../models/AssetDb.js";
import LiabilityDb from "../models/LiabilityDb.js";
import TransactionDb from "../models/TransactionDb.js";

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

        // User Endpoints
        this.api_router.route('/users/:id').get((req, res) => {
            const user = get_sample_user(); // Assuming get_sample_user returns a User object
            if (user && user.getId() === parseInt(req.params.id)) {
                res.json(user.toJson());
            } else {
                res.status(404).json({ "error": "User not found" });
            }
        });

        this.api_router.route('/users').post(async (req, res) => {
            try {
                const newUser = req.body;
                const response = await this.userDb.postDocument(newUser);
                res.status(201).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:id').put(async (req, res) => {
            try {
                const userId = parseInt(req.params.id);
                const updatedUser = req.body;
                const response = await this.userDb.putDocument(userId, updatedUser);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:id').delete(async (req, res) => {
            try {
                const userId = parseInt(req.params.id);
                const response = await this.userDb.deleteDocument(userId);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        // User Property Endpoints (Assets, Liabilities, Transactions)
        this.api_router.route('/users/:userId/assets').get((req, res) => {
            const asset = get_sample_asset(); // Assuming get_sample_asset returns an Asset object
            if (asset && asset.getUser() === parseInt(req.params.userId)) {
                res.json([asset.toJson()]); // Return as an array for consistency
            } else {
                res.status(404).json({ "error": "Assets not found for user" });
            }
        });

        this.api_router.route('/users/:userId/assets').post(async (req, res) => {
            try {
                const newAsset = req.body;
                newAsset.user = parseInt(req.params.userId); // Ensure user ID is set
                const response = await this.assetDb.postDocument(newAsset);
                res.status(201).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/assets/:id').delete(async (req, res) => {
            try {
                const assetId = parseInt(req.params.id);
                const response = await this.assetDb.deleteDocument(assetId);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/liabilities').get((req, res) => {
            const liability = get_sample_liability(); // Assuming get_sample_liability returns a Liability object
            if (liability && liability.getUser() === parseInt(req.params.userId)) {
                res.json([liability.toJson()]); // Return as an array for consistency
            } else {
                res.status(404).json({ "error": "Liabilities not found for user" });
            }
        });

        this.api_router.route('/users/:userId/liabilities').post(async (req, res) => {
            try {
                const newLiability = req.body;
                newLiability.user = parseInt(req.params.userId); // Ensure user ID is set
                const response = await this.liabilityDb.postDocument(newLiability);
                res.status(201).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/liabilities/:id').delete(async (req, res) => {
            try {
                const liabilityId = parseInt(req.params.id);
                const response = await this.liabilityDb.deleteDocument(liabilityId);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/transactions').get((req, res) => {
            const transaction = get_sample_transaction(); // Assuming get_sample_transaction returns a Transaction object
            if (transaction && transaction.getUser() === parseInt(req.params.userId)) {
                res.json([transaction.toJson()]); // Return as an array for consistency
            } else {
                res.status(404).json({ "error": "Transactions not found for user" });
            }
        });

        this.api_router.route('/users/:userId/transactions').post(async (req, res) => {
            try {
                const newTransaction = req.body;
                newTransaction.user = parseInt(req.params.userId); // Ensure user ID is set
                const response = await this.transactionDb.postDocument(newTransaction);
                res.status(201).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/transactions/:id').delete(async (req, res) => {
            try {
                const transactionId = parseInt(req.params.id);
                const response = await this.transactionDb.deleteDocument(transactionId);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/transactions/query-by-date').post(async (req, res) => {
            try {
                const { start_date, end_date } = req.body;
                const userId = parseInt(req.params.userId);

                if (!start_date || !end_date) {
                    return res.status(400).json({ "error": "start_date and end_date are required in the request body." });
                }

                const transactions = await this.transactionDb.getTransactionsInDateRange(userId, start_date, end_date);

                if (transactions) {
                    res.json(transactions);
                } else {
                    res.status(404).json({ "error": "No transactions found for user in the specified date range." });
                }
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }

    getApiRouter() {
        return this.api_router;
    }
}
