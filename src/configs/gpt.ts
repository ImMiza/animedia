import {OpenAI} from "openai";
import dotenv from "dotenv";

dotenv.config({ path: 'src/.env' });

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_GPT_TOKEN
});

export async function executePrompt(prompt: string, system: string) {
    try {
        const result = await openai.chat.completions.create({
            model: process.env.OPENAI_GPT_MODEL!,
            temperature : 0.2,
            response_format: {type: 'json_object'},
            messages: [
                {
                    role: 'system',
                    content: system
                },
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        const totalToken = result.usage?.total_tokens;
        const content = result.choices[0].message.content;
        return {
            totalToken,
            content
        };
    } catch (e) {
        throw new Error('' + e);
    }
}