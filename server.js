const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const knowledgeBase = require("./knowledgeBase");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Appointment storage (in-memory, resets on server restart)
let appointments = [];

// ── Gemini Chat API ───────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  // Convert KB to a readable string for Gemini
  const kbString = Object.values(knowledgeBase.streams)
    .map(s => `${s.name} Paths: ${s.paths.map(p => `${p.title} (${p.courses.join(", ")})`).join("; ")}`)
    .join("\n");

  const SYSTEM_PROMPT = `You are an AI-powered Student Academic Advisor. 
Use this Stream-Course Knowledge Base:
${kbString}

RULES:
1. VALIDATION: If the user's message is gibberish, nonsense, or completely irrelevant, politely ask them to clarify or ask a question related to their academics/careers.
2. If the user hasn't chosen a stream (Science, Commerce, Arts), ask them to pick one.
3. Once they pick a stream, suggest 3-4 specific career paths from the knowledge base.
4. APPOINTMENT BOOKING: If a student wants to book an appointment, ask for their Name, Email, Preferred Date, Time, and Reason. Collect these details conversationally. Once they provide everything, confirm the booking and say: "Thank you! Your appointment has been booked successfully. [CONFIRMED]"
5. SUGGESTIONS: Always end EVERY response with 2-4 [SUGGESTED] chips to guide the user.

If the student has NOT introduced themselves, respond with ONLY: "Hello, What is your name ?"
Once they give their name, greet them and ask: "Which stream are you interested in: Science, Commerce, or Arts?".
Immediately provide these as options:
[SUGGESTED]: Science
[SUGGESTED]: Commerce
[SUGGESTED]: Arts
[SUGGESTED]: Book Appointment

Format for suggestions: [SUGGESTED]: Topic`;

  // Build conversation history for Gemini
  const contents = [];

  // Add history
  if (history && history.length > 0) {
    for (const msg of history) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }
  }

  // Add current message
  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  try {
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
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// ─── Appointment Booking API ───────────────────────────────────────
app.post("/api/appointments", (req, res) => {
  const { name, email, date, time, reason } = req.body;

  if (!name || !email || !date || !time || !reason) {
    return res.status(400).json({ error: "All fields are required." });
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
  res.json({ message: "Appointment booked successfully!", appointment });
});

app.get("/api/appointments", (req, res) => {
  res.json(appointments);
});

// ─── Start Server ──────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
