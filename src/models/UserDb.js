import BaseDb from "./BaseDb.js";
import schemas from "./schema.js";
import User from "./User.js";

class UserDb extends BaseDb {
    constructor() {
        super("users", schemas.properties.users.items); // Assuming 'users' in schema.json is an array of user objects
    }

    async getUser(id) {
        let selector = {
            "_id": {
                "$eq": id
            }
        };
        let result = await this.postFind(selector);
        if (result && result.docs.length > 0) {
            return new User(result.docs[0]);
        } else {
            return null;
        }
    }

    async postUser(user) {
        if (!(user instanceof User)) {
            throw new Error("Invalid input: user must be an instance of User class.");
        }
        return await this.postDocument(user.toJSON());
    }

    async putUser(id, user) {
        if (!(user instanceof User)) {
            throw new Error("Invalid input: user must be an instance of User class.");
        }
        return await this.putDocument(id, user.toJSON());
    }
}

export default UserDb;
