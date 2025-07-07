import BaseDb from "./BaseDb.js";
import schemas from "./schema.js";
import Asset from "./Asset.js";

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
            return new Asset(result.docs[0]);
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
        if (result && result.docs) {
            return result.docs.map(doc => new Asset(doc));
        } else {
            return null;
        }
    }

    async postAsset(asset) {
        if (!(asset instanceof Asset)) {
            throw new Error("Invalid input: asset must be an instance of Asset class.");
        }
        return await this.postDocument(asset.toJSON());
    }

    async putAsset(id, updatedAsset) {
        if (!(updatedAsset instanceof Asset)) {
            throw new Error("Invalid input: updatedAsset must be an instance of Asset class.");
        }

        // Fetch the existing asset from the database
        const existingAsset = await this.getAsset(id);

        if (!existingAsset) {
            throw new Error(`Asset with ID ${id} not found.`);
        }

        // Update properties using setter methods to trigger custom logic
        // Iterate over properties of updatedAsset and apply to existingAsset
        for (const key in updatedAsset) {
            // Skip _id and user as they should not be changed during an update
            if (key === '_id' || key === 'user') {
                continue;
            }

            // Special handling for 'value' as the app sends only the latest entry
            if (key === 'value' && Array.isArray(updatedAsset[key]) && updatedAsset[key].length > 0) {
                existingAsset.setValue(updatedAsset[key][0].value);
            } else {
                // Construct setter method name (e.g., 'setName', 'setAcquired')
                const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
                if (typeof existingAsset[setterName] === 'function') {
                    existingAsset[setterName](updatedAsset[key]);
                } else {
                    // Fallback for properties without a specific setter, directly assign
                    existingAsset[key] = updatedAsset[key];
                }
            }
        }
        
        // Persist the updated asset back to the database
        return await this.putDocument(id, existingAsset.toJSON());
    }
}

export default AssetDb;
