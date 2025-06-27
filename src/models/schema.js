module.exports = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "users": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": { "type": "string" },
                    "name": { "type": "string" },
                    "email": { "type": "string", "format": "email" },
                    "auth_token": { "type": "string" },
                    "risk_score": { "type": "number" },
                    "risk_tolerance": {
                        "type": "string",
                        "enum": ["standard", "aggressive", "conservative"]
                    },
                    "date_of_birth": { "type": "integer" },
                    "net_worth": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "date": { "type": "integer" },
                                "value": { "type": "number" }
                            },
                            "required": ["date", "value"]
                        }
                    }
                },
                "required": ["id", "name", "email", "auth_token", "risk_score", "risk_tolerance", "date_of_birth", "net_worth"]
            }
        },
        "assets": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "user": { "type": "string" },
                    "id": { "type": "string" },
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
                    "user_weight": { "type": "number" },
                    "aquired": { "type": "integer" },
                    "auto_update": { "type": "boolean" },
                    "in_progress": { "type": "boolean" }
                },
                "required": ["user", "id", "name","description", "type", "value","code", "user_weight", "aquired", "auto_update", "in_progress"]
            }
        },
        "liabilities": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "user": { "type": "string" },
                    "id": { "type": "string" },
                    "name": { "type": "string" },
                    'description': { "type": "string" },
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
                    "aquired": { "type": "integer" },
                    "auto_update": { "type": "boolean" }
                },
                "required": ["user", "id", "name","description", "type", "value", "aquired", "auto_update"]
            }
        },
        "transactions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "user": { "type": "string" },
                    "id": { "type": "string" },
                    "date": { "type": "integer" },
                    "amount": { "type": "number" },
                    "type": { "type": "string" ,
                        "enum": ["credit", "debit"]
                    },
                    "source": {
                        "type": "string",
                        "enum": ["income", "expense","asset", "liability"]
                    },
                    "source_id": { "type": "string" },
                    "category": { "type": "string" },
                    "title": { "type": "string" },
                    "description": { "type": "string" },
                    "target": {
                        "type": "string" ,
                        "enum": ["income","expense","asset", "liability"]
                    },
                    "target_id": { "type": "string" }
                },
                "required": [
                    "user", "id", "date", "amount", "type", "source", "source_id",
                    "category", "title", "description", "target", "target_id"
                ]
            }
        }
    },
    "required": ["users", "assets", "liabilities", "transactions"]
};
