import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import setupRoutes from "./setup/setup.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/install", setupRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Route to create a .env file (for demonstration)
app.get("/env", (req, res) => {
  const envContent = "DATABASE_URI=1231232123.2312";

  fs.writeFile("./.env", envContent, (err) => {
    if (err) {
      console.error("Error writing .env file:", err);
      res.status(500).send("Error creating .env file");
    } else {
      res.send(".env file created successfully");
    }
  });
});

// Middleware to check if the setup is completed
app.use((req, res, next) => {
  const lockFilePath = path.join(__dirname, "setup", "setup.lock");

  if (fs.existsSync(lockFilePath)) {
    const setupFilePath = path.join(__dirname, "setup", "setup.js");
    fs.unlinkSync(setupFilePath); // Delete setup.js file
    console.log("setup.js has been deleted.");
  }

  next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
