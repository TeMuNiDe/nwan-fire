import * as lancedb from "@lancedb/lancedb";
import { generateEmbedding } from "../utils/embeddings.js";
import TransactionMappingDb from './TransactionMappingDb.js'; // Import TransactionMappingDb
import { Field, Schema,  Utf8, FixedSizeList, Float32 } from "apache-arrow"; // Import necessary types from apache-arrow

const DB_PATH = process.env.LANCEDB_PATH || "lancedb"; // Default path for LanceDB storage
const TABLE_NAME = "transaction_embeddings";
const EMBEDDING_DIMENSION = 768; // Assuming Gemini's embedding-001 model outputs 768 dimensions

let db;
let table;
const transactionMappingDb = new TransactionMappingDb(); // Instantiate TransactionMappingDb

async function initializeVectorDb() {
    if (!db) {
        db = await lancedb.connect(DB_PATH);
    }
    try {
        table = await db.openTable(TABLE_NAME);
    } catch (error) {
        if (error.message.includes("was not found")) {
            console.log(`Table ${TABLE_NAME} not found, creating it.`);
            // Define the schema for the table using Apache Arrow Schema
            const transactionEmbeddingSchema = new Schema([
                new Field("id", new Utf8(),true),
                new Field("vector", new FixedSizeList(EMBEDDING_DIMENSION, new Field("item", new Float32(),true))),
                new Field("originalMessage", new Utf8(),true),
            ]);
            
            // Create the table with the explicit Apache Arrow schema and an empty initial data array
            table = await db.createEmptyTable(TABLE_NAME, transactionEmbeddingSchema);
        } else {
            console.error("Error opening or creating LanceDB table:", error);
            throw error;
        }
    }
}

export async function addTransactionEmbedding(transactionMappingId, originalMessage) {
    await initializeVectorDb();
    try {
        const embedding = await generateEmbedding(originalMessage);
        const data = [{
            id: transactionMappingId,
            vector: embedding,
            originalMessage: originalMessage,
        }];
        await table.add(data);
        console.log(`Added embedding for transaction mapping ID: ${transactionMappingId}`);
    } catch (error) {
        console.error(`Error adding embedding for transaction mapping ID ${transactionMappingId}:`, error);
        throw error;
    }
}

export async function searchSimilarTransactions(queryMessage, limit = 5, minSimilarity = 0.8) {
    await initializeVectorDb();
    try {
        const queryEmbedding = await generateEmbedding(queryMessage);
        const results = await table.search(queryEmbedding[0].values)
                                   .distanceType("cosine")
                                   .distanceRange(minSimilarity, 1.0)
                                   .limit(limit)
                                   .toArray();
        
        // Filter results based on actual cosine similarity if LanceDB's distance isn't directly cosine similarity
        // For now, assuming _distance is 1 - cosine_similarity
        if (!results || results.length === 0) {
            return []; // No results found
        }
        const filteredResults = results

        // Fetch full TransactionMapping objects from CouchDB
        const transactionMappings = [];
        for (const result of filteredResults) {
            const mapping = await transactionMappingDb.getTransactionMapping(result.id);
            if (mapping) {
                transactionMappings.push(mapping);
            }
        }
        return transactionMappings;

    } catch (error) {
        console.error("Error searching similar transactions:", error);
        throw error;
    }
}

// Initialize the DB when the module is loaded
initializeVectorDb().catch(console.error);
