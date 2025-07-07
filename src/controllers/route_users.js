import { filterObjectByFields } from "../utils/route_utils.js";
import User from "../models/User.js";

export default function setupUserRoutes(api_router, userDb, assetDb, liabilityDb, transactionDb) {
    // User Endpoints
    api_router.route('/users/:id').get(async (req, res) => {
        try {
            const user = await userDb.getUser(req.params.id);
            if (user) {
                let userJson = user.toJSON();
                const fieldsParam = req.query.fields;

                if (fieldsParam) {
                    const fields = fieldsParam.split(',');
                    userJson = filterObjectByFields(userJson, fields);
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

    api_router.route('/users').post(async (req, res) => {
        try {
            const newUser = new User(req.body); // Convert raw JSON to User object
            const response = await userDb.postUser(newUser);
            res.status(201).json(response);
        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });

    api_router.route('/users/:id').put(async (req, res) => {
        try {
            const userId = req.params.id;
            const updatedUser = new User(req.body); // Convert raw JSON to User object
            const response = await userDb.putUser(userId, updatedUser);
            if (!response || !response.ok) {
                return res.status(400).json({ "error": "Failed to update user info" });
             }
            res.status(200).json({ ok: response.ok });
        } catch (error) {
            res.status(500).json({ "error": "Failed to update user info" });
        }
    });

    api_router.route('/users/:id').delete(async (req, res) => {
        try {
            const userId = req.params.id;
            const response = await userDb.deleteDocument(userId);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });

    api_router.route('/users/:id/networth').post(async (req, res) => {
        const user = await userDb.getUser(req.params.id);
        if (user) {
            const assets = await assetDb.getUserAssets(req.params.id);
            const liabilities = await liabilityDb.getUserLiabilities(req.params.id);

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

    api_router.route('/users/:id/capacity').get(async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await userDb.getUser(userId);
            
            if (!user) {
                return res.status(404).json({ "error": "User not found" });
            }

            const transactions = await transactionDb.getUserTransactions(userId);
            const capacity = User.calculateInvestmentCapacity(user, transactions);

            res.json(capacity);

        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });
}
