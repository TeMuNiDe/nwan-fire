import express from 'express';
import { functionCalls } from './api_tools.js';
import logger from "../utils/logger.js";
import TransactionMappingDb from '../models/TransactionMappingDb.js';
import TransactionMapping from '../models/TransactionMapping.js';
import { addTransactionEmbedding } from '../models/VectorDB.js'; // Import the function to add embeddings

const smsRouter = express.Router();
const transactionMappingDb = new TransactionMappingDb();

const geminiModels = process.env.GEMINI_MODELS ? process.env.GEMINI_MODELS.split(',') : [];
let modelIndex = 0;

export default () => {
    smsRouter.use((req, res, next) => {
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

    smsRouter.post('/', async (req, res) => {
        const { message, userId } = req.body;

        if (!message || !userId) {
            return res.status(400).json({ error: "Message and userId are required." });
        }

        try {
            const userAssetsResponse = await functionCalls.get_user_assets({ userId });
            const userLiabilitiesResponse = await functionCalls.get_user_liabilities({ userId });
            const transactionMappings = await transactionMappingDb.getTransactionMappingsByUserId(userId);

            if (!userAssetsResponse.success) {
                throw new Error(`Failed to fetch user assets: ${userAssetsResponse.error}`);
            }
            if (!userLiabilitiesResponse.success) {
                throw new Error(`Failed to fetch user liabilities: ${userLiabilitiesResponse.error}`);
            }
            
            modelIndex++;
            const classificationArgs = {
                message,
                userId,
                userAssets: JSON.stringify(userAssetsResponse.output),
                userLiabilities: JSON.stringify(userLiabilitiesResponse.output),
                transactionMappings: JSON.stringify(transactionMappings ? transactionMappings.map(m => m.toJSON()) : []),
                model: geminiModels[modelIndex % geminiModels.length]
            };

            const classificationResult = await functionCalls.classify_transaction(classificationArgs);

            if (!classificationResult.success) {
                return res.status(500).json({ error: `Failed to classify transaction: ${classificationResult.error}` });
            }

            const classifiedTransaction = classificationResult.output;

            if (!classifiedTransaction.is_transaction) {
                return res.status(400).send("Not a transactional message.");
            }

            const requiredFields = ["name", "amount", "date", "description", "category", "source", "target"];
            const missingFields = requiredFields.filter(field => !classifiedTransaction[field]);

            if (missingFields.length > 0) {
                return res.status(202).json({ missing_fields: missingFields});
            }

            const transactionData = {
                ...classifiedTransaction,
                userId,
                originalMessage: message
            };

            const addTransactionResult = await functionCalls.add_user_transaction(transactionData);

            if (addTransactionResult.success) {
                const { transaction, originalMessage } = addTransactionResult.output;
                const id = null;
                const timestamp = transaction.date ? new Date(transaction.date).getTime() : new Date().getTime();
                const newMapping = new TransactionMapping({id, originalMessage, transaction, timestamp});
                await transactionMappingDb.postTransactionMapping(newMapping);
                await addTransactionEmbedding(newMapping.getId(), originalMessage);
                logger.log(`Transaction mapping saved: ${JSON.stringify(newMapping.toJSON())}`);
                return res.status(201).send("Successfully created.");
            } else {
                return res.status(500).json({ error: `Failed to add transaction: ${addTransactionResult.error}` });
            }
        } catch (error) {
            logger.log(`Error processing SMS: ${error.message}`);
            res.status(500).json({ error: "Failed to process SMS." });
        }
    });

    return smsRouter;
};
