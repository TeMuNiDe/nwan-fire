import BaseDb from "./BaseDb.js";
import schemas from "./schema.js";

class TransactionDb extends BaseDb {
    constructor() {
        super("transaction", schemas.properties.transactions.items); // Assuming 'transactions' in schema.json is an array of transaction objects
    }

    async getTransaction(id) {
        let selector = {
            "id": {
                "$eq": id
            }
        };
        let result = await this.postFind(selector);
        if (result && result.docs.length > 0) {
            return result.docs[0];
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
        if (result) {
            return result.docs;
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
        if (result) {
            return result.docs;
        } else {
            return null;
        }
    }
}

export default TransactionDb;
