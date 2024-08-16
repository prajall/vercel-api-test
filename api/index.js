const express = require("express");
const axios = require("axios");
require("dotenv").config();
const fs = require("fs");

const app = express();
app.use(express.json());

const VERCEL_API_URL = "https://api.vercel.com/v9/projects";
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || "your-vercel-token-here";
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || "your-project-id-here";

// Endpoint to add an environment variable to Vercel
app.post("/add-env", async (req, res) => {
  const { key, value } = req.body;

  try {
    const response = await axios.post(
      `${VERCEL_API_URL}/${PROJECT_ID}/env`,
      {
        key: key,
        value: value,
        target: ["production", "preview", "development"],
        type: "plain",
      },
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    res
      .status(200)
      .json({ message: `Environment variable ${key} added successfully.` });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message });
  }
});

// Basic route to verify the app is running
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Route to create a .env file
app.get("/env", (req, res) => {
  const envContent = "DATABASE_URI=1231232123.2312";

  // Ensure the callback is passed to handle the result of writeFile
  fs.writeFile("./.env", envContent, (err) => {
    if (err) {
      console.error("Error writing .env file:", err);
      res.status(500).send("Error creating .env file");
    } else {
      res.send(".env file created successfully");
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
