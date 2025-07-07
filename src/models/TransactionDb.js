import BaseDb from "./BaseDb.js";
import schemas from "./schema.js";
import Transaction from "./Transaction.js";

class TransactionDb extends BaseDb {
    constructor() {
        super("transactions", schemas.properties.transactions.items); // Assuming 'transactions' in schema.json is an array of transaction objects
    }

    async getTransaction(id) {
        let selector = {
            "_id": {
                "$eq": id
            }
        };
        let result = await this.postFind(selector);
        if (result && result.docs.length > 0) {
            return new Transaction(result.docs[0]);
        } else {
            return null;
        }
    }

    async getUserTransactions(userId) {
        let selector = {
            "user": {
                "$eq": userId
            }
        };
        let result = await this.postFind(selector);
        if (result && result.docs) {
            return result.docs.map(doc => new Transaction(doc));
        } else {
            return null;
        }
    }

    async getTransactionsInDateRange(userId, startDate, endDate) {
        let selector = {
            "user": {
                "$eq": userId
            },
            "date": {
                "$gte": startDate,
                "$lte": endDate
            }
        };
        let result = await this.postFind(selector);
        if (result && result.docs) {
            return result.docs.map(doc => new Transaction(doc));
        } else {
            return null;
        }
    }

    async postTransaction(transaction) {
        if (!(transaction instanceof Transaction)) {
            throw new Error("Invalid input: transaction must be an instance of Transaction class.");
        }
        return await this.postDocument(transaction.toJSON());
    }

    async putTransaction(id, transaction) {
        if (!(transaction instanceof Transaction)) {
            throw new Error("Invalid input: transaction must be an instance of Transaction class.");
        }
        return await this.putDocument(id, transaction.toJSON());
    }
}

export default TransactionDb;
