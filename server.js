import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';


const openai = new OpenAI({
  apiKey: "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", // Using environment variable for security
});

const app = express();
const prisma = new PrismaClient();

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
            prompt: `Create 2 multiple-choice question about '${prompt}' suitable for a quiz. Format the response every time the same way and in a JSON list, including the question text, an array of options prefixed with 'A', 'B', 'C', and 'D', and the index of the correct option. The correct option should be the first in the array.`,
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

const saltRounds = 10;

app.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save the new user in the database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'User created!', userId: user.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Here, you'd return a session token or JWT token
      // For simplicity, let's just return a success message
      res.json({ message: 'Login successful', userId: user.id });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in user' });
    }
  });

const PORT = 8020;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});



