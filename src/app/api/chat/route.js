import OpenAI from "openai";
import { openai } from "../../../server/openai";


export const POST = async (req) => {
    try {
        const { topic, difficulty } = await req.json();

        const openaiPrompt = `Create a JSON array of ${difficulty} level of difficulty 5 multiple-choice questions about '${topic}' suitable for a quiz. Each object in the array should include the question text, an array of options prefixed with 'A', 'B', 'C', and 'D', and the correct option index. Ensure the correct option is at the index specified in the 'correct_option_index' field.`

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