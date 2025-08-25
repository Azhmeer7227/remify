import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// 🔑 Replace with your Gemini API key
if (!API_KEY) {
  console.error("❌ Missing API_KEY in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// ✅ Use a valid Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Create a single chat session with memory
// Create a single chat session with memory
// Create a single chat session with memory
// Create a single chat session with memory
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Your name is Remify. Reply like a natural person would, without writing your name in front of every message."
        }
      ],
    },
    {
      role: "model",
      parts: [{ text: "Got it! I'll reply as Remify, naturally." }],
    },
  ],
});






app.use(bodyParser.json());

// Static files (frontend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Chat endpoint
// Chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const result = await chat.sendMessage(userMessage);

    let botReply =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Sorry, I couldn’t generate a reply.";

    // 🚨 Remove leading "Remify:" if the model adds it
    botReply = botReply.replace(/^Remify:\s*/i, "");

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
