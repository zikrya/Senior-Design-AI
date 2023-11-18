import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const openai = new OpenAI({
  apiKey: "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", // Using environment variable for security
});

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET;

app.post("/chat", async (req,res) => {
    try {
        const {prompt} = req.body;

        // Adjusted the code as per new completion creation method
        const completion = await openai.completions.create({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 512, // Adjust parameter name from max_token to max_tokens
            temperature: 0,
            prompt: `Create a JSON array of 5 multiple-choice questions about '${prompt}' suitable for a quiz. Each object in the array should include the question text, an array of options prefixed with 'A', 'B', 'C', and 'D', and the correct option index. Ensure the correct option is at the index specified in the 'correct_option_index' field.`,
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

    // First, check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

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


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // if no token found

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // invalid token
      req.user = user;
      next();
  });
};

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

      // Create a JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

      // Send the token back to the client
      res.json({ message: 'Login successful', token });

  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in user' });
  }
});
app.get('/protected-route', authenticateToken, (req, res) => {
  // Access user information from req.user
  res.json({ message: 'Access to protected data!' });
});

app.post('/logout', (req, res) => {
  // Clear the token on the client side
  res.clearCookie('token');

  // Send a response indicating successful logout
  res.json({ message: 'Logout successful' });
});

const PORT = 8020;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});


