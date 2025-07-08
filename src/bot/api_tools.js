import { Type } from "@google/genai";
import schemas from "../models/schema.js";
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL; // Assuming your API server runs on port 3001

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const functionDeclarations = [
{  name:"get_user_details",
    description: "Retrieve user details",
    parameters: {
        type: Type.OBJECT,
        properties: {
            userId: {
                type: Type.STRING,
                description: "The ID of the user whose details are to be retrieved"
            },
            fields: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING
                },
                description: `List of comma seperated fields to retrieve for the user. If not specified, all fields will be returned. Options include ${schemas.properties.users.items.required.join(",")} `
            }
        },
        required: ["userId"]
    }
},
{  name: "get_user_assets",
    description: "Retrieve all assets owned by a user",
    parameters: {
        type: Type.OBJECT,
        properties: {
            userId: {
                type: Type.STRING,
                description: "The ID of the user whose assets are to be retrieved"
            },
            fields: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING
                },
                description: `List of comma seperated fields to retrieve for each asset. If not specified, all fields will be returned. Options include ${schemas.properties.assets.items.required.join(",")}`
            }
        },
        required: ["userId"]
    }
},
{  name: "get_user_liabilities",
    description: "Retrieve all liabilities associated with a user",
    parameters: {
        type: Type.OBJECT,
        properties: {
            userId: {
                type: Type.STRING,
                description: "The ID of the user whose liabilities are to be retrieved"
            },
            fields: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING
                },
                description: `List of comma seperated fields to retrieve for each liability. If not specified, all fields will be returned. Options include ${schemas.properties.liabilities.items.required.join(",")}`
            }
        },
        required: ["userId"]
    }
},
{  name: "get_user_transactions",
    description: "Retrieve all transactions associated with a user",
    parameters: {
        type: Type.OBJECT,
        properties: {
            userId: {
                type: Type.STRING,
                description: "The ID of the user whose transactions are to be retrieved"
            },
            fields: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING
                },
                description: `List of comma seperated fields to retrieve for each transaction. If not specified, all fields will be returned. Options include ${schemas.properties.transactions.items.required.join(",")}`
            }
        },
        required: ["userId"]
    }
},
{  name: "get_user_transactions_by_date",
    description: "Retrieve transactions for a user within a specified date range",
    parameters: {
        type: Type.OBJECT,
        properties: {
            userId: {
                type: Type.STRING,
                description: "The ID of the user whose transactions are to be retrieved"
            },
            startDate: {
                type: Type.STRING,
                format: "date-time",
                description: "The start date for the transaction search in YYYY-MM-DD format"
            },
            endDate: {
                type: Type.STRING,
                format: "date-time",
                description: "The end date for the transaction search in YYYY-MM-DD format"
            }
        },
        required: ["userId", "startDate", "endDate"]
    }
},
{  name: "add_user_transaction",
    description: "Add a new transaction for a user",
    parameters: {
        type: Type.OBJECT,
        properties: {
            userId: {
                type: Type.STRING,
                description: "The ID of the user for whom the transaction is being added"
            },
            amount: {
                type: Type.NUMBER,
                description: "The amount of the transaction"
            },
            date: {
                type: Type.STRING,
                format: "date-time",
                description: "The date of the transaction in DD-MM-YYYY format"
            },
            description: {
                type: Type.STRING,
                description: "A brief description of the transaction"
            },
            category: {
                type: Type.STRING,
                description: "The category of the transaction (e.g., 'Shopping', 'Travel', 'Food', etc.)"
            },
            source:{
                type:Type.STRING,
                enum:['income','expense','asset','liability'],
                description: "The source of the transaction, indicating whether it is an income(Ex: Salary), expense (Ex: Rent, Shopping etc.),asset(Ex: Savings, Stocks), or liability (Ex: Loan, Credit Card, etc.)"
            },

            target:{
                type:Type.STRING,
                enum:['income','expense','asset','liability'],
                description: "The target of the transaction, indicating whether it is an income(Ex: Salary), expense (Ex: Rent, Shopping etc.),asset(Ex: Savings, Stocks), or liability (Ex: Loan, Credit Card, etc.)"
            },
            source_id: {
                type: Type.STRING,
                description: "The ID of the source associated with the transaction if source is asset or liability"
            },
            target_id: {
                type: Type.STRING,
                description: "The ID of the target associated with the transaction if target is asset or liability"
            },
        },
        required: ["userId", "amount", "date", "description", "category", "source", "target"]
    }
}
]

export const functionCalls = {
    get_user_details: async ({ userId, fields=null }) => {
        let params = null;
    try {
        if (fields) 
        { 
            params = { fields: fields.join(',') };
        } 
        const response = await apiClient.get(`/users/${userId}`,{params:params});
        if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
        return { success: true, output: response.data };
    } catch (error) {
        console.error('Error fetching user details:', error.response ? error.response.data : error.message);
        return { success: false, error: error.response ? error.response.data : { message: error.message } };
    }
    },
    add_user_transaction : async ({userId, amount, date, description, category, source, target,source_id="",target_id=""}) => {
        try {
            const response = await apiClient.post(`/users/${userId}/transactions`, 
                {
                    amount: amount,
                    date: new Date(date).getTime(),
                    description: description,
                    category: category,
                    source: source,
                    source_id: source_id,
                    target: target,
                    target_id: target_id 
                }
            );
            if (response.status !== 201) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
            return { success: true, output: response.data };
        } catch (error) {
            console.error('Error posting transaction:', error.response ? error.response.data : error.message);
            return { success: false, error: error.response ? error.response.data : { message: error.message } };
        }
        
    }
}
