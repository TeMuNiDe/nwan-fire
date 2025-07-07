const schema = require('../models/schema');

function validateObject(obj, schemaDef, objName) {
    if (!obj) {
        throw new Error(`${objName} data is missing.`);
    }

    // Validate required fields
    if (schemaDef.required) {
        for (const field of schemaDef.required) {
            if (!(field in obj)) {
                throw new Error(`${objName} validation error: Missing required field '${field}'.`);
            }
        }
    }

    for (const key in obj) {
        const value = obj[key];
        const propSchema = schemaDef.properties[key];

        if (key === '_id' && value===null) {
            // Allow _id to be null for new objects
            continue;

        }

        if (!propSchema) {
            // Allow extra properties for now, or throw an error if strict schema is desired
            // throw new Error(`${objName} validation error: Unexpected field '${key}'.`);
            continue;
        }

        // Type validation
        if (propSchema.type && propSchema.type !=='array' && typeof value !== propSchema.type) {
            if (propSchema.type === 'integer' && typeof value === 'number' && Number.isInteger(value)) {
                // Allow numbers that are integers for 'integer' type
            }  else if (propSchema.type === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
                throw new Error(`${objName} validation error: Field '${key}' must be an object, but received ${typeof value}.`);
            } else {
                throw new Error(`${objName} validation error: Field '${key}' must be of type '${propSchema.type}', but received '${typeof value}'.`);
            }
        } else if (propSchema.type === 'array' && value.constructor.name != 'Array') {
                console.log(value.constructor.name != 'Array')
                console.log(" :: ");
                console.log(propSchema.type === 'array' && value.constructor.name != 'Array');
                throw new Error(`${objName} validation error: Field '${key}' must be an array, but received ${typeof value}.`);
        }

        // Enum validation
        if (propSchema.enum && !propSchema.enum.includes(value)) {
            throw new Error(`${objName} validation error: Field '${key}' has an invalid value '${value}'. Must be one of ${propSchema.enum.join(', ')}.`);
        }

        // Format validation (basic for email)
        if (propSchema.format === 'email' && typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            throw new Error(`${objName} validation error: Field '${key}' must be a valid email address.`);
        }

        // Nested object validation
        if (propSchema.type === 'object' && propSchema.properties && typeof value === 'object' && !Array.isArray(value)) {
            validateObject(value, propSchema, `${objName}.${key}`);
        }

        // Nested array items validation
        if (propSchema.type === 'array' && propSchema.items && Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                validateObject(value[i], propSchema.items, `${objName}.${key}[${i}]`);
            }
        }
    }
}

module.exports = { validateObject };
