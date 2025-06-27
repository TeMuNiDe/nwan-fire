const schema = require('./schema');
const { validateObject } = require('../utils/validator');

class Transaction {
    constructor(transaction) {
        validateObject(transaction, schema.properties.transactions.items, 'Transaction');

        this.user = transaction.user;
        this._id = transaction._id;
        this.date = transaction.date;
        this.amount = transaction.amount;
        this.source = transaction.source;
        this.sourceId = transaction.source_id;
        this.category = transaction.category;
        this.name = transaction.name;
        this.description = transaction.description;
        this.target = transaction.target;
        this.targetId = transaction.target_id;
    }

    getUser() {
        return this.user;
    }

    setUser(user) {
        this.user = user;
    }

    get_Id() {
        return this._id;
    }

    set_Id(_id) {
        this._id = _id;
    }

    getDate() {
        return this.date;
    }

    setDate(date) {
        this.date = date;
    }

    getAmount() {
        return this.amount;
    }

    setAmount(amount) {
        this.amount = amount;
    }


    getSource() {
        return this.source;
    }

    getSourceId() {
        return this.sourceId;
    }

    setSourceId(sourceId) {
        this.sourceId = sourceId;
    }

    getCategory() {
        return this.category;
    }

    setCategory(category) {
        this.category = category;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }

    getTargetId() {
        return this.targetId;
    }

    setTargetId(targetId) {
        this.targetId = targetId;
    }

    toJson() {
        return {
            user: this.user,
            _id: this._id,
            date: this.date,
            amount: this.amount,
            source: this.source,
            source_id: this.sourceId,
            category: this.category,
            name: this.name, // Corrected from title to name
            description: this.description,
            target: this.target,
            target_id: this.targetId
        };
    }
}

module.exports = Transaction;
