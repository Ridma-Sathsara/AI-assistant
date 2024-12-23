require('dotenv').config();  // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Use the PORT from .env or fallback to 5000 if not specified
const PORT = process.env.PORT || 5000;

app.use(cors());  // Allow cross-origin requests
app.use(bodyParser.json());  // Parse incoming JSON requests

// Initialize Google Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);  // Using API key from .env
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });  // Specify the model version

// Define the /chat endpoint to handle chat messages
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // Use Google Gemini API to generate a response
    const result = await model.generateContent(message);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while communicating with Gemini AI.' });
  }
});

// Start the Express server on the port specified in .env or 5000 by default
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
