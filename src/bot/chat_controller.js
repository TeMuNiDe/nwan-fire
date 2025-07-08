import express from 'express';
import { GoogleGenAI, Type} from '@google/genai';
import { functionDeclarations,functionCalls } from './api_tools.js';
import logger from "../utils/logger.js"; // Import the logger utility
import ConversationDb from '../models/ConversationDb.js';
import Conversation from '../models/Conversation.js';

const chatRouter = express.Router();
const conversationDb = new ConversationDb();

export default () => {
      // Request logging middleware

        chatRouter.use((req, res, next) => {
            const { method, originalUrl, body, query } = req;
            logger.log(`Request: ${method} ${originalUrl}`);
            if (Object.keys(body).length > 0) {
                logger.log(`  Body: ${JSON.stringify(body)}`);
            }
            if (Object.keys(query).length > 0) {
                logger.log(`  Query Parameters: ${JSON.stringify(query)}`);
            }

            // Response logging
            const originalSend = res.send;
            const originalJson = res.json;

            res.send = function (data) {
                logger.log(`Response for ${method} ${originalUrl}: ${data}`);
                originalSend.apply(res, arguments);
            };

            res.json = function (data) {
                logger.log(`Response for ${method} ${originalUrl}: ${JSON.stringify(data)}`);
                originalJson.apply(res, arguments);
            };

            next();
        });

    chatRouter.post('/', async (req, res) => {
        const { message, userId, userName, conversationId: incomingConversationId } = req.body; 
        const gemini_model = process.env.GEMINI_MODEL;
        const gemini_api_key = process.env.GEMINI_API_KEY;

        let conversation;
        let currentConversationId = incomingConversationId;
        let conversationContents = [];

        const userMessage = { role: "user", parts: [{ text: message }] };

        if (!incomingConversationId) {
            conversation = new Conversation({
                user: userId,
                contents: [userMessage],
                timestamp: Date.now()
            });
            await conversationDb.postConversation(conversation);
            currentConversationId = conversation.getId();
            logger.log(`New conversation started for user ${userId} with DB-generated ID: ${currentConversationId}`);
        } else {
            conversation = await conversationDb.getUserConversation(userId, currentConversationId);
            if (!conversation) {
                logger.error(`Incoming conversation ID ${incomingConversationId} not found for user ${userId}. Starting new conversation.`);
                conversation = new Conversation({
                    user: userId,
                    contents: [userMessage],
                    timestamp: Date.now()
                });
                await conversationDb.postConversation(conversation);
                currentConversationId = conversation.getId();
            } else {
                conversation.addMessage(userMessage.role, userMessage.parts);
                logger.log(`Continuing conversation for user ${userId} with ID: ${currentConversationId}`);
            }
        }

        conversationContents = conversation.getContents();

        const config = {
            systemInstruction:`You are a chat bot. You are designed to assist users by providing information and answering questions.
                                You can call functions to retrieve information that is not known to you.
                                use ${userId} for userId and ${userName} for userName if required.
                                Example: user details such as name, assets, liabilities, and transactions. Once you have sufficient information,
                                you should provide a Consistent and Accurate response to the user.
                                If you do not have sufficient information, you should ask the user for more information. 
                                If the function call fails or returns an error, you should inform the user that you are unable to retrieve the information at this time and tell them the error message.
                                You should not ask the user to provide any information that you already have.`,
            tools: [{
                functionDeclarations: functionDeclarations
            }]
        };

        const ai = new GoogleGenAI({ apiKey:gemini_api_key });
        
        try {
            let response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: conversationContents,
                config: config 
            });

            while (response.functionCalls && response.functionCalls.length > 0) {
                let functionResponses = [];               
                for await (const functionCall of response.functionCalls) {
                    let function_output = ""
                    try {
                       function_output = await functionCalls[functionCall.name](functionCall.args);
                       if (!function_output.success) {
                            throw new Error(`Function call failed: ${function_output.error}`);
                        }
                       } catch (error) {
                        function_output = {output: null, error: error.message};
                    }
                    const functionResponse = {
                        name: functionCall.name,
                        response: function_output,
                    };
                    functionResponses.push({role:"user", parts: [{ functionResponse: functionResponse }]});
                };
                const modelContent = response.candidates[0].content;
                conversation.addMessage(modelContent.role, modelContent.parts);
                functionResponses.forEach(functionResponse => {
                    conversation.addMessage(functionResponse.role, functionResponse.parts);
                });
                await conversationDb.putConversation(currentConversationId, conversation);
                conversationContents = conversation.getContents();
                response = await ai.models.generateContent({model: "gemini-2.5-flash",contents: conversationContents,config: config});   
            } 
            const modelContent = response.candidates[0].content;
            conversation.addMessage(modelContent.role, modelContent.parts);
            conversationContents = conversation.getContents(); // Re-fetch updated contents
            await conversationDb.putConversation(currentConversationId, conversation);
            const frontendContents = conversationContents.filter(item=>{
                return item.parts[0].text!=undefined;
            }).map(item => {
                const text = item.parts
                    .filter(part => part.text)
                    .map(part => part.text)
                    .join('');
                return { role: item.role, text: text };
            });

            res.status(200).json({ conversationId: currentConversationId, contents: frontendContents });
        } catch (error) {
            console.error(`Error generating content or saving conversation: ${error.message}`);
            res.status(500).json({ error: "Failed to get AI response or save conversation." });
        }
    });
    return chatRouter;
};
