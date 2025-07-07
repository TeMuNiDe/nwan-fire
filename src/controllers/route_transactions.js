import { filterObjectByFields } from "../utils/route_utils.js";
import Transaction from "../models/Transaction.js";

export default function setupTransactionRoutes(api_router, userDb, transactionDb) {
    // User Property Endpoints (Transactions)
    api_router.route('/users/:userId/transactions').get(async (req, res) => {
        try {
            const user = await userDb.getUser(req.params.userId);
            if (!user) {
                return res.status(404).json({ "error": "User not found" });
            }

            let transactions = await transactionDb.getUserTransactions(req.params.userId);
            let transactionsJson = transactions.map(transaction => transaction.toJSON());
            const fieldsParam = req.query.fields;

            if (fieldsParam) {
                const fields = fieldsParam.split(',');
                transactionsJson = transactionsJson.map(transaction => filterObjectByFields(transaction, fields));
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

    api_router.route('/users/:userId/transactions').post(async (req, res) => {
        try {
            const newTransactionData = req.body;
            newTransactionData.user = req.params.userId;
            const newTransaction = new Transaction(newTransactionData);
            const response = await transactionDb.postTransaction(newTransaction);
            res.status(201).json(response);
        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });

    api_router.route('/users/:userId/transactions/:id').put(async (req, res) => {
        try {
            const transactionId = req.params.id;
            const updatedTransactionData = req.body;
            updatedTransactionData.user = req.params.userId; // Ensure user ID is set
            const updatedTransaction = new Transaction(updatedTransactionData);
            const response = await transactionDb.putTransaction(transactionId, updatedTransaction);
            res.status(200).json({ ok: response.ok });
        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });

    api_router.route('/users/:userId/transactions/:id').delete(async (req, res) => {
        try {
            const transactionId = req.params.id;
            const response = await transactionDb.deleteDocument(transactionId);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });

    api_router.route('/users/:userId/transactions/query-by-date').post(async (req, res) => {
        try {
            const { start_date, end_date } = req.body;
            const userId = req.params.userId;

            if (!start_date || !end_date) {
                return res.status(400).json({ "error": "start_date and end_date are required in the request body." });
            }

            const user = await userDb.getUser(userId);
            if (!user) {
                return res.status(404).json({ "error": "User not found" });
            }

            const transactions = await transactionDb.getTransactionsInDateRange(userId, start_date, end_date);

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

    api_router.route('/users/:userId/transactions/trend').post(async (req, res) => {
        try {
            const { startDate, endDate, aggregation } = req.body;
            const userId = req.params.userId;

            if (!startDate || !endDate || !aggregation) {
                return res.status(400).json({ "error": "startDate, endDate, and aggregation are required in the request body." });
            }

            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);

            const transactions = await transactionDb.getTransactionsInDateRange(userId, startDate, endDate);

            if (!transactions) {
                return res.status(404).json({ "error": "No transactions found for user in the specified date range." });
            }

            const trendData = Transaction.getTrendData(transactions, startDateObj, endDateObj, aggregation);
            res.json(trendData);

        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });
}
