import BaseDb from "./BaseDb.js";
import schemas from "./schema.js";
import Liability from "./Liability.js";

class LiabilityDb extends BaseDb {
    constructor() {
        super("liabilities", schemas.properties.liabilities.items); // Assuming 'liabilities' in schema.json is an array of liability objects
    }

    async getLiability(id) {
        let selector = {
            "_id": {
                "$eq": id
            }
        };
        let result = await this.postFind(selector);
        if (result && result.docs.length > 0) {
            return new Liability(result.docs[0]);
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
        if (result && result.docs) {
            return result.docs.map(doc => new Liability(doc));
        } else {
            return null;
        }
    }

    async postLiability(liability) {
        if (!(liability instanceof Liability)) {
            throw new Error("Invalid input: liability must be an instance of Liability class.");
        }
        return await this.postDocument(liability.toJSON());
    }

    async putLiability(id, updatedLiability) {
        if (!(updatedLiability instanceof Liability)) {
            throw new Error("Invalid input: updatedLiability must be an instance of Liability class.");
        }

        // Fetch the existing liability from the database
        const existingLiability = await this.getLiability(id);

        if (!existingLiability) {
            throw new Error(`Liability with ID ${id} not found.`);
        }

        // Update properties using setter methods to trigger custom logic
        // Iterate over properties of updatedLiability and apply to existingLiability
        for (const key in updatedLiability) {
            // Skip _id and user as they should not be changed during an update
            if (key === '_id' || key === 'user') {
                continue;
            }

            // Special handling for 'value' as the app sends only the latest entry
            if (key === 'value' && Array.isArray(updatedLiability[key]) && updatedLiability[key].length > 0) {
                existingLiability.setValue(updatedLiability[key][0].value);
            } else {
                // Construct setter method name (e.g., 'setName', 'setAcquired')
                const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
                if (typeof existingLiability[setterName] === 'function') {
                    existingLiability[setterName](updatedLiability[key]);
                } else {
                    // Fallback for properties without a specific setter, directly assign
                    existingLiability[key] = updatedLiability[key];
                }
            }
        }
        
        // Persist the updated liability back to the database
        return await this.putDocument(id, existingLiability.toJSON());
    }
}

export default LiabilityDb;
