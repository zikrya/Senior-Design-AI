import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "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", // Using environment variable for security
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("/chat", async (req,res) => {
    try {
        const {prompt} = req.body;

        // Adjusted the code as per new completion creation method
        const completion = await openai.completions.create({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 512, // Adjust parameter name from max_token to max_tokens
            temperature: 0,
            prompt: `Return a 3 question based on the ${prompt} topic asked`,
        });
        res.send(completion.choices[0].text); // Adjusted the response accessing method
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            console.error(error.status);  // Log error status
            console.error(error.message); // Log error message
            res.status(error.status).send(error.message); // Send error status and message as response
        } else {
            console.log(error); // Log other types of errors
            res.status(500).send('Internal Server Error'); // Send Internal Server Error for other types of errors
        }
    }
});

const PORT = 8020;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});



