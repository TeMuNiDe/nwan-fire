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
            name: {
                type: Type.STRING,
                description: "The name of the transaction (e.g., 'Salary', 'Rent', 'Shopping', etc.)"
            },
            amount: {
                type: Type.NUMBER,
                description: "The amount of the transaction"
            },
            date: {
                type: Type.STRING,
                format: "date-time",
                description: "The date of the transaction in YYYY-MM-DD format"
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
            originalMessage: {
                type: Type.STRING,
                description: "The original transaction message from the user that prompted this transaction."
            }
        },
        required: ["userId", "name", "amount", "date", "description", "category", "source", "target", "originalMessage"]
    }
},
{  name: "classify_transaction",
    description: "Classify an incoming transaction message and extract details into a JSON object.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            message: {
                type: Type.STRING,
                description: "The raw transaction message from the user."
            },
            userId: {
                type: Type.STRING,
                description: "The ID of the user for whom the transaction is being classified."
            }
        },
        required: ["message", "userId"]
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
    add_user_transaction : async ({userId,name,amount, date, description, category, source, target,source_id="",target_id="", originalMessage}) => {
        const transaction = {
                    user: userId,
                    amount: amount,
                    name: name,
                    date: new Date(date).getTime(),
                    description: description,
                    category: category,
                    source: source,
                    source_id: source_id,
                    target: target,
                    target_id: target_id 
                }
        try {
            const response = await apiClient.post(`/users/${userId}/transactions`,transaction)
            if (response.status !== 201) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
            return { success: true, output: { transaction: transaction, originalMessage: originalMessage } };
        } catch (error) {
            console.error('Error posting transaction:', error.response ? error.response.data : error.message);
            return { success: false, error: error.response ? error.response.data : { message: error.message } };
        }
        
    },
    get_user_assets: async ({ userId, fields=null }) => {
        let params = null;
        try {
            if (fields) { 
                params = { fields: fields.join(',') };
            } 
            const response = await apiClient.get(`/users/${userId}/assets`,{params:params});
            if (response.status !== 200) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
            return { success: true, output: response.data };
        } catch (error) {
            console.error('Error fetching user assets:', error.response ? error.response.data : error.message);
            return { success: false, error: error.response ? error.response.data : { message: error.message } };
        }
    },
    get_user_liabilities: async ({ userId, fields=null }) => {
        let params = null;
        try {
            if (fields) { 
                params = { fields: fields.join(',') };
            } 
            const response = await apiClient.get(`/users/${userId}/liabilities`,{params:params});
            if (response.status !== 200) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
            return { success: true, output: response.data };
        } catch (error) {
            console.error('Error fetching user liabilities:', error.response ? error.response.data : error.message);
            return { success: false, error: error.response ? error.response.data : { message: error.message } };
        }
    },
    get_user_transactions: async ({ userId, fields=null }) => {
        let params = null;
        try {
            if (fields) { 
                params = { fields: fields.join(',') };
            } 
            const response = await apiClient.get(`/users/${userId}/transactions`,{params:params});
            if (response.status !== 200) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
            return { success: true, output: response.data };
        } catch (error) {
            console.error('Error fetching user transactions:', error.response ? error.response.data : error.message);
            return { success: false, error: error.response ? error.response.data : { message: error.message } };
        }
    },
    get_user_transactions_by_date: async ({ userId, startDate, endDate }) => {
       let start_date = new Date(startDate);
        let end_date = new Date(endDate);
        try {
            const response = await apiClient.post(`/users/${userId}/transactions/query-by-date`, {
                start_date: start_date.getTime(),
                 end_date: end_date.getTime()
            });
            if (response.status !== 200) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
            return { success: true, output: response.data };
        } catch (error) {
            console.error('Error fetching user transactions by date:', error.response ? error.response.data : error.message);
            return { success: false, error: error.response ? error.response.data : { message: error.message } };
        }
    },
    classify_transaction: async ({ message, userId, userAssets, userLiabilities, transactionMappings, model }) => {
        const { GoogleGenAI } = await import('@google/genai');
        const gemini_api_key = process.env.GEMINI_API_KEY;
        const gemini_model = model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const ai = new GoogleGenAI({ apiKey: gemini_api_key });

        const systemInstruction = `You are a transaction classification agent. Your goal is to extract transaction details from a user's message and format them into a JSON object.
                                   You must adhere to the following JSON schema for the transaction object:
                                   ${JSON.stringify(schemas.properties.classified_transaction, null, 2)}
                                   Populate as many fields as possible from the user's message. If a field cannot be determined with good accuracy, leave it as an empty string or null, depending on its type.
                                   The 'user' field should always be '${userId}'. 
                                   The 'description' field should be a brief description of the transaction containing ALL the information from the user's message.
                                   The 'date_string' field should date string in YYYY-MM-DD format. If not specified, leave empty.
                                   YOU MUST ASSUME THE DATES IN USERS MESSAGE ARE ALWAYS IN DD-MM-YYYY OR DD/MM/YYYY OR DD/MM FORMAT. and treat them as such. ie. 09-07-2025 MUST BE UNDERSTOOD AS 9th Of July, 2025. KEEP THIS IN MIND WHILE DETERMINING 'date' FIELD
                                   The 'amount' field should be a number.
                                   The 'source' and 'target' fields must be one of: "income", "expense", "asset", "liability".
                                   Here is additional context about the user's financial data to help with classification:
                                   User Assets: ${userAssets}
                                   User Liabilities: ${userLiabilities}
                                   Past Transaction Mappings (original message to classified transaction): ${transactionMappings}
                                   The 'source_id' and 'target_id' fields are only required if 'source' or 'target' is 'asset' or 'liability' respectively.
                                   THE SOURCE_ID AND TARGET_ID MUST BE MATCHING WITH _ID FIELD OF THE ASSET OR LIABILITY Objects ASSOCIATED WITH THE TRANSACTION, IF APPLICABLE.  
                                   Analyze the user's message and the provided context to accurately classify the transaction.
                                   Return only the JSON object. Do not include any other text or explanation.`;
        try {
            const result = await ai.models.generateContent({
                model: gemini_model,
                contents: [{ role: "user", parts: [{ text: message }] }],
                config:{
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schemas.properties.classified_transaction
                }
            });

            const responseText = result.text;
            const classifiedTransaction = JSON.parse(responseText);

            // Ensure date is a timestamp
            if (classifiedTransaction.date && typeof classifiedTransaction.date === 'string') {
                classifiedTransaction.date = new Date(classifiedTransaction.date).getTime();
            } else if (!classifiedTransaction.date) {
                classifiedTransaction.date = Date.now();
            }

            // Ensure amount is a number
            if (classifiedTransaction.amount && typeof classifiedTransaction.amount === 'string') {
                classifiedTransaction.amount = parseFloat(classifiedTransaction.amount);
            }

            // Ensure user ID is set
            classifiedTransaction.user = userId;

            return { success: true, output: classifiedTransaction };
        } catch (error) {
            console.error('Error classifying transaction:', error.message);
            return { success: false, error: error.message };
        }
    }
}
