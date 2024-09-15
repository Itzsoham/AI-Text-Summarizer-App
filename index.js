const express = require('express');
require("dotenv").config(); // Load environment variables from .env

const app = express();
const port = 3001;

const summarizeText = require("./summarize.js");

// Parses JSON bodies (as sent by API clients)
app.use(express.json());

// Serves static files from the 'public' directory
app.use(express.static("public"));

// Handle POST requests to the '/summarize' endpoint

app.post("/summarize", (req, res) => {
  const text = req.body.text_to_summarize;

  summarizeText(text)
    .then((summary) => {
      // Ensure you're returning the response as JSON
      res.json({ summary }); // Respond with a JSON object
    })
    .catch((error) => {
      console.error(error.message);
      res.status(500).json({ error: "Failed to summarize text" }); // Error handling with JSON response
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
