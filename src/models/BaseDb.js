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

    async postFind(selector) {
        let result = await fetch(`${this.dbHost}/${this.dbName}/_find`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "selector": selector })
        }).then((res) => { if (res.status == 200) { return res.json() } else { return null } });
        return result;
    }

    async postDocument(doc) {
        if (!this.validate(doc)) {
            console.error("Validation errors:", this.validate.errors);
            throw new Error("Document failed schema validation.");
        }

        // Check if document exists
        if (doc._id) {
            let get_result = await fetch(`${this.dbHost}/${this.dbName}/${doc._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.status);
            if (get_result == 200) {
                let result = await this.putDocument(doc._id, doc);
                return result;
            }
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
