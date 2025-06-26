import BaseDb from "./BaseDb.js";
import schemas from "./schema.js";

class LiabilityDb extends BaseDb {
    constructor() {
        super("liability", schemas.properties.liabilities.items); // Assuming 'liabilities' in schema.json is an array of liability objects
    }

    async getLiability(id) {
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

    async getUserLiabilities(userId) {
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
}

export default LiabilityDb;
