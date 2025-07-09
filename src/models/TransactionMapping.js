const schema = require('./schema');
const { validateObject } = require('../utils/validator');

class TransactionMapping {
    constructor({ _id = null, originalMessage, transaction, timestamp }) {
        validateObject({ originalMessage, transaction,timestamp }, schema.properties.transactionMappings.items, 'TransactionMapping');

        this._id = _id;
        this.originalMessage = originalMessage;
        this.transaction = transaction;
        this.timestamp = timestamp || Date.now();
    }

    toJSON() {
        return {
            _id: this._id,
            originalMessage: this.originalMessage,
            transaction: this.transaction,
            timestamp: this.timestamp
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
}

module.exports = TransactionMapping;
