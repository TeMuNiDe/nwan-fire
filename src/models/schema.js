module.exports = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "users": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "_id": { "type": "string" },
                    "name": { "type": "string" },
                    "email": { "type": "string", "format": "email" },
                    "auth_token": { "type": "string" },
                    "risk_score": { "type": "number" },
                    "risk_tolerance": {
                        "type": "string",
                        "enum": ["Standard", "Aggressive", "Conservative"]
                    },
                    "date_of_birth": { "type": "integer" }
                },
                "required": ["name", "email", "auth_token", "risk_score", "risk_tolerance", "date_of_birth"]
            }
        },
        "assets": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "user": { "type": "string" },
                    "_id": { "type": "string" },
                    "name": { "type": "string" },
                    "type": { "type": "string" },
                    "description": { "type": "string" },
                    "units": { "type": "number" },
                    "code": { "type": "string" },
                    "value": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "date": { "type": "integer" },
                                "value": { "type": "number" }
                            },
                            "required": ["date", "value"]
                        }
                    },
                    "scope": {"type": "string",enum: ["Short Term", "Long Term","Liquid"]},
                    "user_weight": { "type": "number" },
                    "acquired": { "type": "integer" },
                    "auto_update": { "type": "boolean" },
                    "in_progress": { "type": "boolean" }
                },
                "required": ["user", "name","description", "type", "value","code","units", "user_weight","scope", "acquired", "auto_update", "in_progress"]
            }
        },
        "liabilities": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "user": { "type": "string" },
                    "_id": { "type": "string" },
                    "name": { "type": "string" },
                    "description": { "type": "string" },
                    "type": { "type": "string" },
                    "value": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "date": { "type": "integer" },
                                "value": { "type": "number" }
                            },
                            "required": ["date", "value"]
                        }
                    },
                    "acquired": { "type": "integer" },
                    "auto_update": { "type": "boolean" }
                },
                "required": ["user", "name","description", "type", "value", "acquired", "auto_update"]
            }
        },
        "transactions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "user": { "type": "string" },
                    "_id": { "type": "string" },
                    "date": { "type": "integer" },
                    "amount": { "type": "number" },
                    "source": {
                        "type": "string",
                        "enum": ["income", "expense","asset", "liability"]
                    },
                    "source_id": { "type": "string" },
                    "category": { "type": "string" },
                    "name": { "type": "string" },
                    "description": { "type": "string" },
                    "target": {
                        "type": "string" ,
                        "enum": ["income","expense","asset", "liability"]
                    },
                    "target_id": { "type": "string" }
                },
                "required": [
                    "user", "date", "amount", "source", "source_id",
                    "category", "name", "description", "target", "target_id"
                ]
            }
        }
    },
    "required": ["users", "assets", "liabilities", "transactions"]
};
