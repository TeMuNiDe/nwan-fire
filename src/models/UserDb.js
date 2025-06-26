import BaseDb from "./BaseDb.js";
import schemas from "./schema.js";

class UserDb extends BaseDb {
    constructor() {
        super("user", schemas.properties.users.items); // Assuming 'users' in schema.json is an array of user objects
    }

    async getUser(id) {
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
}

export default UserDb;
