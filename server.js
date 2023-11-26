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
  apiKey: "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",
});

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET;

app.post("/chat", async (req,res) => {
    try {
      const { topic, difficulty } = req.body;

      const openaiPrompt = `Create a JSON array of ${difficulty} level of difficulty 5 multiple-choice questions about '${topic}' suitable for a quiz. Each object in the array should include the question text, an array of options prefixed with 'A', 'B', 'C', and 'D', and the correct option index. Ensure the correct option is at the index specified in the 'correct_option_index' field.`

        // Adjusted the code as per new completion creation method
        const completion = await openai.completions.create({
            model: "text-davinci-003",
            max_tokens: 512, // Adjust parameter name from max_token to max_tokens
            temperature: 0,
            prompt: openaiPrompt,
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
    const { email, firstName, lastName, college, password } = req.body;

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
        firstName,
        lastName,
        college,
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
  console.log("Auth Header:", authHeader);
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

app.post('/save-questions', authenticateToken, async (req, res) => {
  try {
    const { questions, topic } = req.body; // Extract topic from the request body
    const userId = req.user.userId;

    await Promise.all(questions.map(async (question) => {
      await prisma.userQuestions.create({
        data: {
          userId: userId,
          questionText: question.question_text,
          options: question.options,
          correctOptionIndex: question.correct_option_index,
          selectedOptionIndex: question.selectedOptionIndex,
          isCorrect: question.isCorrect,
          topic: topic // Include the topic in each userQuestions record
        }
      });
    }));

    res.status(200).json({ message: 'Questions saved successfully' });
  } catch (error) {
    console.error('Error saving questions:', error);
    res.status(500).json({ message: 'Error saving questions', error: error.message });
  }
});
// Endpoint to fetch user-specific questions
app.get('/user-questions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const userQuestions = await prisma.userQuestions.findMany({
      where: {
        userId
      }
    });

    res.status(200).json(userQuestions);
  } catch (error) {
    console.error('Error fetching user questions:', error);
    res.status(500).json({ message: 'Error fetching user questions' });
  }
});
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const userProfile = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});
app.get('/topics-to-review', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const topicsWithWrongAnswers = await prisma.userQuestions.groupBy({
      by: ['topic'],
      where: {
        userId: userId,
        isCorrect: false,
      },
      _count: {
        id: true,
      },
      having: {
        id: {
          _count: {
            gte: 3
          }
        }
      },
    });

    res.json(topicsWithWrongAnswers.map(topic => topic.topic));
  } catch (error) {
    console.error('Error fetching topics to review:', error);
    res.status(500).json({ message: 'Error fetching topics to review' });
  }
});
const PORT = 8020;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});


