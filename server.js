/**
 * MODULE: Backend Server Configuration
 * This file handles the Express server setup, API endpoints for the chatbot,
 * and integration with the Gemini AI model.
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// MODULE: Data Imports
// Importing the structured knowledge base for academic paths
const knowledgeBase = require("./knowledgeBase");

const app = express();

// MODULE: Middleware Setup
// Enabling CORS for cross-origin requests and JSON parsing for API bodies
app.use(cors());
app.use(express.json());
// Serving static frontend files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// MODULE: Temporary Data Storage
// Local storage for appointment data (in-memory)
let appointments = [];

// MODULE: Chatbot API Engine
// Endpoint to handle user messages and generate AI responses using Gemini API
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  // Process knowledge base into a context string for the AI model
  const kbString = Object.values(knowledgeBase.streams)
    .map(s => `${s.name} Paths: ${s.paths.map(p => `${p.title} (${p.courses.join(", ")})`).join("; ")}`)
    .join("\n");

  // SYSTEM_PROMPT: Defines the AI's persona, knowledge, and operational rules
  const SYSTEM_PROMPT = `You are an AI-powered Student Academic Advisor. 
Use this Stream-Course Knowledge Base:
${kbString}

RULES:
1. VALIDATION: If the user's message is irrelevant, ask them to clarify regarding academics/careers.
2. Ensure stream selection (Science, Commerce, Arts) is prioritized.
3. Provide career guidance based on the knowledge base.
4. Manage appointment booking conversationally.
5. Provide navigation chips using the format [SUGGESTED]: Topic.

Greet the student by name and guide them through their academic journey.`;

  // Constructing conversation history for context-aware responses
  const contents = [];
  if (history && history.length > 0) {
    for (const msg of history) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }
  }

  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  try {
    // API Call to Google Generative AI (Gemini)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Service unavailable. Please try again later." });
  }
});

// MODULE: Appointment Management API
// Endpoint to save new appointment details
app.post("/api/appointments", (req, res) => {
  const { name, email, date, time, reason } = req.body;

  if (!name || !email || !date || !time || !reason) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const appointment = {
    id: Date.now(),
    name,
    email,
    date,
    time,
    reason,
    createdAt: new Date().toISOString(),
  };

  appointments.push(appointment);
  res.json({ message: "Success", appointment });
});

// Endpoint to retrieve all booked appointments
app.get("/api/appointments", (req, res) => {
  res.json(appointments);
});

// MODULE: Server Initialization
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Academic Advisor Server active on port ${PORT}`);
  });
}

module.exports = app;

