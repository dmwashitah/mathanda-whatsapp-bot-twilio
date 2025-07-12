
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { handleMessage } = require("./utils/messageHandler");

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ Mathanda WhatsApp Bot is running");
});

app.post("/", async (req, res) => {
  console.log("📩 NEW MESSAGE RECEIVED:", req.body);
  try {
    await handleMessage(req.body);
    res.status(200).send("Message received");
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).send("Internal server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
