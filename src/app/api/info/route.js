import OpenAI from "openai";
import { openai } from "../../../server/openai";


export const POST = async (req) => {
    try {
        const { topic, difficulty } = await req.json();

        const openaiPrompt = `Please give a detailed explanations on the CS topic ${help}, and provide examples`

        const completion = await openai.completions.create({
            model: "text-davinci-003",
            max_tokens: 512,
            temperature: 0,
            prompt: openaiPrompt,
        });
        return new Response(completion.choices[0].text);
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            console.error(error.status);
            console.error(error.message);
            return new Response(error.message, { status: error.status });
        } else {
            console.log(error);
            return new Response("Internal Server Error :)", { status: 500 });
        }
    }
}