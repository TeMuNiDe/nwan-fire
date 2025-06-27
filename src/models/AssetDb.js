import BaseDb from "./BaseDb.js";
import schemas from "./schema.js";

class AssetDb extends BaseDb {
    constructor() {
        super("assets", schemas.properties.assets.items); // Assuming 'assets' in schema.json is an array of asset objects
    }

    async getAsset(id) {
        let selector = {
            "_id": {
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

    async getUserAssets(userId) {
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

export default AssetDb;
