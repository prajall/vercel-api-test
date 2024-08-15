const express = require("express");
require("dotenv").config();

app.use(express.json());
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
