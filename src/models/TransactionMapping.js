const schema = require('./schema');
const { validateObject } = require('../utils/validator');

class TransactionMapping {
    constructor({ _id = null, originalMessage, transaction, timestamp, embedding = null }) {
        validateObject({ originalMessage, transaction, timestamp }, schema.properties.transactionMappings.items, 'TransactionMapping');

        this._id = _id;
        this.originalMessage = originalMessage;
        this.transaction = transaction;
        this.timestamp = timestamp || Date.now();
        this.embedding = embedding; // New field for storing the embedding
    }

    toJSON() {
        return {
            _id: this._id,
            originalMessage: this.originalMessage,
            transaction: this.transaction,
            timestamp: this.timestamp,
            embedding: this.embedding // Include embedding in JSON output
        };
    }

    // Getters
    getId() {
        return this._id;
    }

    getOriginalMessage() {
        return this.originalMessage;
    }

    getTransaction() {
        return this.transaction;
    }

    getTimestamp() {
        return this.timestamp;
    }

    getEmbedding() {
        return this.embedding;
    }

    // Setters
    setId(id) {
        this._id = id;
    }

    setOriginalMessage(message) {
        this.originalMessage = message;
    }

    setTransaction(transaction) {
        this.transaction = transaction;
    }

    setTimestamp(timestamp) {
        this.timestamp = timestamp;
    }

    setEmbedding(embedding) {
        this.embedding = embedding;
    }
}

module.exports = TransactionMapping;
