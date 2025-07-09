import BaseDb from "./BaseDb.js";
import schemas from "./schema.js";
import TransactionMapping from "./TransactionMapping.js";

class TransactionMappingDb extends BaseDb {
    constructor() {
        super("transaction_mappings", schemas.properties.transactionMappings.items);
    }

    async postTransactionMapping(transactionMapping) {
        if (!(transactionMapping instanceof TransactionMapping)) {
            throw new Error("Invalid input: transactionMapping must be an instance of TransactionMapping class.");
        }
        const result = await this.postDocument(transactionMapping.toJSON());
        if (result && result.id) {
            transactionMapping.setId(result.id);
        }
        return result;
    }

    async getTransactionMapping(id) {
        let selector = {
            "_id": {
                "$eq": id
            }
        };
        let result = await this.postFind(selector);
        if (result && result.docs.length > 0) {
            return new TransactionMapping(result.docs[0]);
        } else {
            return null;
        }
    }

    async getTransactionMappingsByUserId(userId) {
        let selector = {
            "transaction.user": {
                "$eq": userId
            }
        };
        let result = await this.postFind(selector);
        if (result && result.docs) {
            return result.docs.map(doc => new TransactionMapping(doc));
        } else {
            return [];
        }
    }
}

export default TransactionMappingDb;
