import { GoogleGenAI } from '@google/genai';

const gemini_api_key = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: gemini_api_key });

export async function generateEmbedding(text) {
    try {
        const result = await ai.models.embedContent({
            model: process.env.EMBEDDING_MODEL, // Or another suitable Gemini embedding model
            contents: text,
            config: { outputDimensionality: 768 },
        });
        return result.embeddings;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }
}

export function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0; // Avoid division by zero
    }

    return dotProduct / (magnitudeA * magnitudeB);
}
