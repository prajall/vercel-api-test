import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const VERCEL_API_URL = "https://api.vercel.com/v9/projects";
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || "your-vercel-token-here";
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || "your-project-id-here";

const addENV = async (key, value) => {
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
    return true;
  } catch (error) {
    // console.log(error.message ? error.message : error);
    console.log(error);
  }
};

router.post("/", async (req, res) => {
  const { dbUri, apiToken } = req.body;

  try {
    if (!dbUri || !apiToken) {
      return res.status(400).send("dbUri and apiToken are required");
    }

    const response1 = await addENV("DATABASE_URI", dbUri);
    const response2 = await addENV("API_TOKEN", apiToken);

    if (response1 && response2) {
      res
        .status(200)
        .json({ message: "Environment Variables Set Successfully" });
    } else {
      res.status(500).send("Failed to set environment variables.");
    }
  } catch (error) {
    res.status(500).send("Error during setup: " + error.message);
  }
});

export default router;
