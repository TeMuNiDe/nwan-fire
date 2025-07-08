import BaseDb from "./BaseDb.js";
import schemas from "./schema.js";
import Conversation from "./Conversation.js";

class ConversationDb extends BaseDb {
    constructor() {
        super("conversations", schemas.properties.conversations.items);
    }

    async getConversation(id) {
        let selector = {
            "_id": {
                "$eq": id
            }
        };
        let result = await this.postFind(selector);
        if (result && result.docs.length > 0) {
            return new Conversation(result.docs[0]);
        } else {
            return null;
        }
    }

    async getUserConversation(userId, conversationId) {
        let selector = {
            "user": {
                "$eq": userId
            },
            "_id": {
                "$eq": conversationId
            }
        };
        let result = await this.postFind(selector);
        if (result && result.docs.length > 0) {
            return new Conversation(result.docs[0]);
        } else {
            return null;
        }
    }

    async postConversation(conversation) {
        if (!(conversation instanceof Conversation)) {
            throw new Error("Invalid input: conversation must be an instance of Conversation class.");
        }
        const result = await this.postDocument(conversation.toJSON());
        if (result && result.id) {
            conversation.setId(result.id); // Update the conversation object with the DB-generated ID
        }
        return result;
    }

    async putConversation(id, updatedConversation) {
        if (!(updatedConversation instanceof Conversation)) {
            throw new Error("Invalid input: updatedConversation must be an instance of Conversation class.");
        }

        // Fetch the existing conversation from the database
        const existingConversation = await this.getConversation(id);

        if (!existingConversation) {
            throw new Error(`Conversation with ID ${id} not found.`);
        }

        // Update properties
        existingConversation.setContents(updatedConversation.getContents());
        existingConversation.setTimestamp(updatedConversation.getTimestamp());
        existingConversation.setUser(updatedConversation.getUser());

        // Persist the updated conversation back to the database
        return await this.putDocument(id, existingConversation.toJSON());
    }
}

export default ConversationDb;
