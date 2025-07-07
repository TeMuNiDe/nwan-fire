import express from "express";
import { get_sample_assets, get_sample_liabilities, get_sample_transactions } from "../models/model_v2.js";
import UserDb from "../models/UserDb.js";
import AssetDb from "../models/AssetDb.js";
import LiabilityDb from "../models/LiabilityDb.js";
import TransactionDb from "../models/TransactionDb.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Liability from "../models/Liability.js";
import Asset from "../models/Asset.js";
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
        this.api_router.route('/users/:id').get(async (req, res) => {
            try {
                const user = await this.userDb.getUser(req.params.id);
                if (user) {
                    let userJson = user.toJSON();
                    const fieldsParam = req.query.fields;

                    if (fieldsParam) {
                        const fields = fieldsParam.split(',');
                        userJson = this._filterObjectByFields(userJson, fields);
                    }
                    res.json(userJson);
                } else {
                    res.status(404).json({ "error": "User not found" });
                }
            } catch (error) {
                if (error.message.startsWith("Field '")) {
                    res.status(404).json({ "error": error.message });
                } else {
                    res.status(500).json({ "error": error.message });
                }
            }
        });

        this.api_router.route('/users').post(async (req, res) => {
            try {
                const newUser = new User(req.body); // Convert raw JSON to User object
                const response = await this.userDb.postUser(newUser);
                res.status(201).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:id').put(async (req, res) => {
            try {
                const userId = req.params.id;
                const updatedUser = new User(req.body); // Convert raw JSON to User object
                const response = await this.userDb.putUser(userId, updatedUser);
                if (!response || !response.ok) {
                    return res.status(400).json({ "error": "Failed to update user info" });
                 }
                res.status(200).json({ ok: response.ok });
            } catch (error) {
                res.status(500).json({ "error": "Failed to update user info" });
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

        this.api_router.route('/users/:id/networth').post(async (req, res) => {

            
            const user = await this.userDb.getUser(req.params.id);
            if (user) {
                const assets = await this.assetDb.getUserAssets(req.params.id);
                const liabilities = await this.liabilityDb.getUserLiabilities(req.params.id);

                const { start_date, end_date, aggregation } = req.body;

                if (!start_date || !end_date || !aggregation) {
                    return res.status(400).json({ "error": "startDate, endDate, and aggregation are required in the request body." });
                }
                let startDateObj = start_date ? new Date(parseInt(start_date)) : null;
                let endDateObj = end_date ? new Date(parseInt(end_date)) : null;
                const agg = aggregation || 'monthly'; // Default to monthly if not provided

                // If no dates are provided, set a default range (e.g., last year)
                if (!startDateObj || !endDateObj) {
                    endDateObj = new Date();
                    startDateObj = new Date();
                    startDateObj.setFullYear(endDateObj.getFullYear() - 1); // Default to last year
                }

                try {
                    const netWorthData = User.calculateNetWorth(assets, liabilities, startDateObj, endDateObj, agg);
                    res.json(netWorthData);
                } catch (error) {
                    res.status(500).json({ "error": error.message });
                }
            } else {
                res.status(404).json({ "error": "Net worth data not found for user" });
            }
        });

        this.api_router.route('/users/:id/capacity').get(async (req, res) => {
            try {
                const userId = req.params.id;
                const user = await this.userDb.getUser(userId);
                
                if (!user) {
                    return res.status(404).json({ "error": "User not found" });
                }

                const transactions = await this.transactionDb.getUserTransactions(userId);
                const capacity = User.calculateInvestmentCapacity(user, transactions);

                res.json(capacity);

            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        // User Property Endpoints (Assets, Liabilities, Transactions)
        this.api_router.route('/users/:userId/assets').get(async (req, res) => {
            try {
                const user = await this.userDb.getUser(req.params.userId);
                if (!user) {
                    return res.status(404).json({ "error": "User not found" });
                }

                let assets = await this.assetDb.getUserAssets(req.params.userId);
                let assetsJson = assets.map(asset => asset.toJSON());
                const fieldsParam = req.query.fields;

                if (fieldsParam) {
                    const fields = fieldsParam.split(',');
                    assetsJson = assetsJson.map(asset => this._filterObjectByFields(asset, fields));
                }

                if (assetsJson && assetsJson.length > 0) {
                    res.json(assetsJson);
                } else {
                    res.status(200).json([]);
                }
            } catch (error) {
                if (error.message.startsWith("Field '")) {
                    res.status(404).json({ "error": error.message });
                } else {
                    res.status(500).json({ "error": error.message });
                }
            }
        });

        this.api_router.route('/users/:userId/assets/filter').post(async (req, res) => {
            try {
                const userId = req.params.userId;
                const user = await this.userDb.getUser(userId);
                if (!user) {
                    return res.status(404).json({ "error": "User not found" });
                }

                const filter = req.body;

                const allAssets = await this.assetDb.getUserAssets(userId);
                const filteredAssets = allAssets.filter(asset => {
                    return Object.keys(filter).every(key => asset.toJSON()[key] === filter[key]);
                });

                if (filteredAssets.length > 0) {
                    res.json(filteredAssets.map(asset => asset.toJSON()));
                } else {
                    res.status(200).json([]);
                }
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/assets').post(async (req, res) => {
            try {
                const newAssetData = req.body;
                newAssetData.user = req.params.userId;
                const newAsset = new Asset(newAssetData);
                const response = await this.assetDb.postAsset(newAsset);
                res.status(201).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/assets/:id').put(async (req, res) => {
            try {
                const assetId = req.params.id;
                const updatedAssetData = req.body;
                updatedAssetData.user = req.params.userId; // Ensure user ID is set
                const updatedAsset = new Asset(updatedAssetData);
                const response = await this.assetDb.putAsset(assetId, updatedAsset);
                res.status(200).json({ ok: response.ok });
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

        this.api_router.route('/users/:userId/liabilities').get(async (req, res) => {
            try {
                const user = await this.userDb.getUser(req.params.userId);
                if (!user) {
                    return res.status(404).json({ "error": "User not found" });
                }

                let liabilities = await this.liabilityDb.getUserLiabilities(req.params.userId);
                let liabilitiesJson = liabilities.map(liability => liability.toJSON());
                const fieldsParam = req.query.fields;

                if (fieldsParam) {
                    const fields = fieldsParam.split(',');
                    liabilitiesJson = liabilitiesJson.map(liability => this._filterObjectByFields(liability, fields));
                }

                if (liabilitiesJson && liabilitiesJson.length > 0) {
                    res.json(liabilitiesJson);
                } else {
                    res.status(200).json([]);
                }
            } catch (error) {
                if (error.message.startsWith("Field '")) {
                    res.status(404).json({ "error": error.message });
                } else {
                    res.status(500).json({ "error": error.message });
                }
            }
        });

        this.api_router.route('/users/:userId/liabilities').post(async (req, res) => {
            try {
                const newLiabilityData = req.body;
                newLiabilityData.user = req.params.userId;
                const newLiability = new Liability(newLiabilityData);
                const response = await this.liabilityDb.postLiability(newLiability);
                res.status(201).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/liabilities/:id').put(async (req, res) => {
            try {
                const liabilityId = req.params.id;
                const updatedLiabilityData = req.body;
                updatedLiabilityData.user = req.params.userId; // Ensure user ID is set
                const updatedLiability = new Liability(updatedLiabilityData);
                const response = await this.liabilityDb.putLiability(liabilityId, updatedLiability);
                res.status(200).json({ ok: response.ok });
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

        this.api_router.route('/users/:userId/transactions').get(async (req, res) => {
            try {
                const user = await this.userDb.getUser(req.params.userId);
                if (!user) {
                    return res.status(404).json({ "error": "User not found" });
                }

                let transactions = await this.transactionDb.getUserTransactions(req.params.userId);
                let transactionsJson = transactions.map(transaction => transaction.toJSON());
                const fieldsParam = req.query.fields;

                if (fieldsParam) {
                    const fields = fieldsParam.split(',');
                    transactionsJson = transactionsJson.map(transaction => this._filterObjectByFields(transaction, fields));
                }

                if (transactionsJson && transactionsJson.length > 0) {
                    res.json(transactionsJson);
                } else {
                    res.status(200).json([]);
                }
            } catch (error) {
                if (error.message.startsWith("Field '")) {
                    res.status(404).json({ "error": error.message });
                } else {
                    res.status(500).json({ "error": error.message });
                }
            }
        });

        this.api_router.route('/users/:userId/transactions').post(async (req, res) => {
            try {
                const newTransactionData = req.body;
                newTransactionData.user = req.params.userId;
                const newTransaction = new Transaction(newTransactionData);
                const response = await this.transactionDb.postTransaction(newTransaction);
                res.status(201).json(response);
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        this.api_router.route('/users/:userId/transactions/:id').put(async (req, res) => {
            try {
                const transactionId = req.params.id;
                const updatedTransactionData = req.body;
                updatedTransactionData.user = req.params.userId; // Ensure user ID is set
                const updatedTransaction = new Transaction(updatedTransactionData);
                const response = await this.transactionDb.putTransaction(transactionId, updatedTransaction);
                res.status(200).json({ ok: response.ok });
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

                const user = await this.userDb.getUser(userId);
                if (!user) {
                    return res.status(404).json({ "error": "User not found" });
                }

                const transactions = await this.transactionDb.getTransactionsInDateRange(userId, start_date, end_date);
                //const allSampleTransactions = get_sample_transactions();

                const startDateObj = new Date(start_date);
                const endDateObj = new Date(end_date);

                const filteredTransactions = transactions.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate >= startDateObj && transactionDate <= endDateObj;
                });

                if (filteredTransactions.length > 0) {
                    res.json(filteredTransactions.map(transaction => transaction.toJSON()));
                } else {
                    res.status(200).json([]);
                }
            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        // Generic Asset Property Endpoint
        this.api_router.route('/users/:userId/assets/:id/:property').get(async (req, res) => {
            const assetId = req.params.id;
            const property = req.params.property;
            const assets =  await this.assetDb.getUserAssets(req.params.userId);
            const asset = assets.find(a => a.get_Id() === assetId);

            if (asset) {
                const assetJson = asset.toJSON();
                if (assetJson.hasOwnProperty(property)) {
                    res.json({ [property]: assetJson[property] });
                } else {
                    res.status(404).json({ "error": `Property '${property}' not found for asset with ID '${assetId}'` });
                }
            } else {
                res.status(404).json({ "error": `Asset with ID '${assetId}' not found` });
            }
        });

        this.api_router.route('/users/:userId/transactions/trend').post(async (req, res) => {
            try {
                const { startDate, endDate, aggregation } = req.body;
                const userId = req.params.userId;

                if (!startDate || !endDate || !aggregation) {
                    return res.status(400).json({ "error": "startDate, endDate, and aggregation are required in the request body." });
                }

                const startDateObj = new Date(startDate);
                const endDateObj = new Date(endDate);

                const transactions = await this.transactionDb.getTransactionsInDateRange(userId, startDate, endDate);
                //const transactions = get_sample_transactions();

                if (!transactions) {
                    return res.status(404).json({ "error": "No transactions found for user in the specified date range." });
                }

                const trendData = Transaction.getTrendData(transactions, startDateObj, endDateObj, aggregation);
                res.json(trendData);

            } catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });

        // Generic Liability Property Endpoint
        this.api_router.route('/users/:userId/liabilities/:id/:property').get(async (req, res) => {
            const liabilityId = req.params.id;
            const property = req.params.property;
            const liabilities = await this.liabilityDb.getUserLiabilities(req.params.userId);
            const liability = liabilities.find(l => l.get_Id() === liabilityId);

            if (liability) {
                const liabilityJson = liability.toJSON();
                if (liabilityJson.hasOwnProperty(property)) {
                    res.json({ [property]: liabilityJson[property] });
                } else {
                    res.status(404).json({ "error": `Property '${property}' not found for liability with ID '${liabilityId}'` });
                }
            } else {
                res.status(404).json({ "error": `Liability with ID '${liabilityId}' not found` });
            }
        });
    }

    _filterObjectByFields(obj, fields) {
        const filteredObj = {};
        for (const field of fields) {
            if (obj.hasOwnProperty(field)) {
                filteredObj[field] = obj[field];
            } else {
                throw new Error(`Field '${field}' does not exist.`);
            }
        }
        return filteredObj;
    }

    getApiRouter() {
        return this.api_router;
    }
}
