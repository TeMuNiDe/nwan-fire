import fetch from "node-fetch";
import Ajv from "ajv";

// Note: You will need to install ajv: npm install ajv

class BaseDb {
    constructor(dbName, schema) {
        this.dbName = dbName;
        this.dbHost = process.env.DB_HOST;
        this.ajv = new Ajv();
        this.validate = this.ajv.compile(schema);
    }

    _stripRev(doc) {
        if (doc && doc._rev !== undefined) {
            const { _rev, ...rest } = doc;
            return rest;
        }
        return doc;
    }

    async postFind(selector) {
        let result = await fetch(`${this.dbHost}/${this.dbName}/_find`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "selector": selector })
        }).then((res) => { if (res.status == 200) { return res.json() } else { return null } });

        if (result && result.docs) {
            result.docs = result.docs.map(doc => this._stripRev(doc));
        }
        return result;
    }

    async postDocument(doc) {
        if (!this.validate(doc)) {
            console.error("Validation errors:", this.validate.errors);
            throw new Error("Document failed schema validation.");
        }

        // Rename 'id' to '_id' if 'id' exists and '_id' does not
        if (doc.id && !doc._id) {
            doc._id = doc.id;
            delete doc.id;
        }

        // If document already contains _id, it's a bad request for POST
        if (doc._id) {
            throw new Error("Document object should not contain _id for POST operations. Use PUT to update an existing document.");
        }

        let result = await fetch(`${this.dbHost}/${this.dbName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(doc)
        }).then((res) => { if (res.status == 200) { return res.json() } else { return null } });
        return result;
    }

    async putDocument(id, doc) {
        if (!this.validate(doc)) {
            console.error("Validation errors:", this.validate.errors);
            throw new Error("Document failed schema validation.");
        }

        // Get the existing document to retrieve its _rev
        let existingDocResponse = await fetch(`${this.dbHost}/${this.dbName}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (existingDocResponse.status === 404) {
            throw new Error(`Document with _id ${id} not found.`);
        }

        if (existingDocResponse.status !== 200) {
            throw new Error(`Failed to retrieve document with _id ${id}. Status: ${existingDocResponse.status}`);
        }

        const existingDocJson = await existingDocResponse.json();
        doc._rev = existingDocJson._rev; // Add _rev for update

        let result = await fetch(`${this.dbHost}/${this.dbName}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(doc)
        }).then((res) => { if (res.status == 200) { return res.json() } else { return null } });
        return result;
    }

    async deleteDocument(id) {
        // First, get the document to retrieve its _rev
        let doc_response = await fetch(`${this.dbHost}/${this.dbName}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (doc_response.status === 404) {
            return 404; // Document not found
        }

        if (doc_response.status !== 200) {
            return null; // Other error
        }

        const doc = await doc_response.json();
        const rev = doc._rev;

        let result = await fetch(`${this.dbHost}/${this.dbName}/${id}?rev=${rev}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => { if (res.status == 200) { return res.json() } else { return null } });
        return result;
    }
}

export default BaseDb;
