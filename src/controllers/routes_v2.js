import express from "express";
import { get_sample_user, get_sample_assets, get_sample_liabilities, get_sample_transactions } from "../models/model_v2.js";
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
            if (user && user.get_Id() === req.params.id) {
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
                const userId = req.params.id;
                const updatedUser = req.body;
                const response = await this.userDb.putDocument(userId, updatedUser);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:id').delete(async (req, res) => {
            try {
                const userId = req.params.id;
                const response = await this.userDb.deleteDocument(userId);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:id/networth').get((req, res) => {
            const user = get_sample_user(); // Assuming get_sample_user returns a User object
            if (user && user.get_Id() === req.params.id) {
                res.json(user.getNetWorth());
            } else {
                res.status(404).json({ "error": "Net worth data not found for user" });
            }
        });

        this.api_router.route('/users/:id/capacity').get(async (req, res) => {
            try {
                const userId = req.params.id;
                const user = get_sample_user(); // For now, using sample user as per existing logic
                
                if (!user || user.get_Id() !== userId) {
                    return res.status(404).json({ "error": "User not found" });
                }

                const transactions = get_sample_transactions(); // Assuming get_sample_transactions returns an array of Transaction objects
                
                let totalIncome = 0;
                let totalExpense = 0;

                if (transactions) {
                    transactions.forEach(transaction => {
                        if (transaction.source === 'income') {
                            totalIncome += transaction.amount;
                        } else if (transaction.target === 'expense') {
                            totalExpense += transaction.amount;
                        }
                    });
                }

                const investmentCapacity = totalIncome - totalExpense;
                const riskScore = user.getRiskScore(); // Assuming risk_score is a factor between 0 and 1
                const aggressiveCapacity = riskScore * investmentCapacity;
                const conservativeCapacity = investmentCapacity - aggressiveCapacity;

                res.json({
                    investmentCapacity: investmentCapacity,
                    aggressiveCapacity: aggressiveCapacity,
                    conservativeCapacity: conservativeCapacity
                });

            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        // User Property Endpoints (Assets, Liabilities, Transactions)
        this.api_router.route('/users/:userId/assets').get((req, res) => {
            const assets = get_sample_assets(); // Assuming get_sample_asset returns an Asset object
            if (assets && assets.length > 0) {
                res.json(assets.map(asset => asset.toJson())); // Return as an array for consistency
            } else {
                res.status(404).json({ "error": "Assets not found for user" });
            }
        });

        this.api_router.route('/users/:userId/assets/filter').post(async (req, res) => {
            try {
                const userId = req.params.userId;
                const filter = req.body; // Expecting a filter object, e.g., { "in_progress": true }

                // For now, using sample assets and filtering them
                // In a real scenario, this would query the database
                const allAssets = get_sample_assets(); 
                const filteredAssets = allAssets.filter(asset => {
                    // Simple filter logic: check if all key-value pairs in filter match the asset
                    return Object.keys(filter).every(key => asset[key] === filter[key]);
                });

                if (filteredAssets.length > 0) {
                    res.json(filteredAssets.map(asset => asset.toJson()));
                } else {
                    res.status(404).json({ "error": "No assets found matching the filter for user" });
                }
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/assets').post(async (req, res) => {
            try {
                const newAsset = req.body;
                newAsset.user = req.params.userId; // Ensure user ID is set
                const response = await this.assetDb.postDocument(newAsset);
                res.status(201).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/assets/:id').put(async (req, res) => {
            try {
                const assetId = req.params.id;
                const updatedAsset = req.body;
                const response = await this.assetDb.putDocument(assetId, updatedAsset);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/assets/:id').delete(async (req, res) => {
            try {
                const assetId = req.params.id;
                const response = await this.assetDb.deleteDocument(assetId);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/liabilities').get((req, res) => {
            const liabilities = get_sample_liabilities(); // Assuming get_sample_liability returns a Liability object
            if (liabilities && liabilities.length > 0) {
                res.json(liabilities.map(liability => liability.toJson())); // Return as an array for consistency
            } else {
                res.status(404).json({ "error": "Liabilities not found for user" });
            }
        });

        this.api_router.route('/users/:userId/liabilities').post(async (req, res) => {
            try {
                const newLiability = req.body;
                newLiability.user = req.params.userId; // Ensure user ID is set
                const response = await this.liabilityDb.postDocument(newLiability);
                res.status(201).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/liabilities/:id').put(async (req, res) => {
            try {
                const liabilityId = req.params.id;
                const updatedLiability = req.body;
                const response = await this.liabilityDb.putDocument(liabilityId, updatedLiability);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/liabilities/:id').delete(async (req, res) => {
            try {
                const liabilityId = req.params.id;
                const response = await this.liabilityDb.deleteDocument(liabilityId);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/transactions').get((req, res) => {
            const transactions = get_sample_transactions(); // Assuming get_sample_transaction returns a Transaction object
            if (transactions && transactions.length > 0) {
                res.json(transactions.map(transaction => transaction.toJson())); // Return as an array for consistency
            } else {
                res.status(404).json({ "error": "Transactions not found for user" });
            }
        });

        this.api_router.route('/users/:userId/transactions').post(async (req, res) => {
            try {
                const newTransaction = req.body;
                newTransaction.user = req.params.userId; // Ensure user ID is set
                const response = await this.transactionDb.postDocument(newTransaction);
                res.status(201).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/transactions/:id').put(async (req, res) => {
            try {
                const transactionId = req.params.id;
                const updatedTransaction = req.body;
                const response = await this.transactionDb.putDocument(transactionId, updatedTransaction);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/transactions/:id').delete(async (req, res) => {
            try {
                const transactionId = req.params.id;
                const response = await this.transactionDb.deleteDocument(transactionId);
                res.status(200).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/transactions/query-by-date').post(async (req, res) => {
            try {
                const { start_date, end_date } = req.body;
                const userId = req.params.userId;

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
