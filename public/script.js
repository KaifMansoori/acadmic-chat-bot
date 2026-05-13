/**
 * MODULE: Frontend Logic & State Management
 * This file handles the UI interactions, chat message processing, 
 * and API communication for the Academic Advisor Chatbot.
 */

// MODULE: Application State
let chatHistory = JSON.parse(localStorage.getItem("chat_history")) || [];
let isLoading = false;

// Initializing the application and loading saved chat history
window.onload = () => {
  if (chatHistory.length > 0) {
    const container = document.getElementById("chat-messages");
    container.innerHTML = "";
    
    chatHistory.forEach(msg => {
      appendMessage(msg.role === "assistant" ? "bot" : "user", msg.content, false);
    });
  }
};

// MODULE: Navigation & View Switching
// Handles switching between Chat, Appointment, and Quick Topics views
function showView(viewName) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));

  document.getElementById("view-" + viewName).classList.add("active");
  event.currentTarget.classList.add("active");
}

// MODULE: Chat Input Processing
// Handles keyboard events (Enter key)
function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

// Automatically adjusts textarea height based on content
function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}

// Processes messages sent from quick chips or suggested chips
function sendQuick(msg) {
  document.getElementById("user-input").value = msg;
  sendMessage();
}

// Switches to chat view and triggers a message
function askTopic(msg) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
  document.getElementById("view-chat").classList.add("active");
  document.querySelector(".nav-btn").classList.add("active");

  document.getElementById("user-input").value = msg;
  sendMessage();
}

// MODULE: Chat Engine (API Integration)
// Orchestrates sending messages to the backend and handling responses
async function sendMessage() {
  if (isLoading) return;

  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  // Intercepting specific keywords for localized UI handling
  if (message.toLowerCase().includes("book appointment")) {
    appendMessage("user", message);
    appendMessage(
      "bot",
      '📅 Sure! Click on <strong>"Book Appointment"</strong> in the sidebar to schedule a meeting.'
    );
    input.value = "";
    input.style.height = "auto";
    return;
  }

  appendMessage("user", message);
  input.value = "";
  input.style.height = "auto";

  const typingId = showTyping();
  isLoading = true;
  document.getElementById("send-btn").disabled = true;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        history: chatHistory,
      }),
    });

    const data = await response.json();
    removeTyping(typingId);

    if (data.error) {
      appendMessage("bot", "⚠️ System Error: " + data.error);
    } else {
      appendMessage("bot", data.reply);
      chatHistory.push({ role: "user", content: message });
      chatHistory.push({ role: "assistant", content: data.reply });
      localStorage.setItem("chat_history", JSON.stringify(chatHistory));
    }
  } catch (err) {
    removeTyping(typingId);
    appendMessage("bot", "⚠️ Connection failed. Please check your internet.");
  }

  isLoading = false;
  document.getElementById("send-btn").disabled = false;
}

// MODULE: UI Rendering Components
// Appends messages to the chat interface and handles formatting
function appendMessage(role, text, saveToHistory = true) {
  const container = document.getElementById("chat-messages");

  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${role === "user" ? "user-message" : "bot-message"}`;

  const avatar = document.createElement("div");
  avatar.className = `avatar ${role === "user" ? "user-avatar" : "bot-avatar"}`;
  avatar.textContent = role === "user" ? "👤" : "🤖";

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  
  let mainText = text;
  let suggestions = [];
  
  // Parsing suggested response chips from the bot's reply
  if (role === "bot") {
    const parts = text.split("[SUGGESTED]:");
    mainText = parts[0].trim();
    if (parts.length > 1) {
      suggestions = parts.slice(1).map(s => s.trim().split("\n")[0]);
    }
  }

  bubble.innerHTML = formatText(mainText);
  contentDiv.appendChild(bubble);

  // Rendering suggestion chips
  if (suggestions.length > 0) {
    const suggestionsDiv = document.createElement("div");
    suggestionsDiv.className = "answer-suggestions";
    
    suggestions.forEach(q => {
      const chip = document.createElement("button");
      chip.className = "suggestion-chip";
      chip.textContent = q;
      chip.onclick = () => sendQuick(q);
      suggestionsDiv.appendChild(chip);
    });
    
    contentDiv.appendChild(suggestionsDiv);
  }

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(contentDiv);
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

// Formats markdown-like syntax into HTML
function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n- /g, "<br>• ")
    .replace(/\n\d\. /g, (m) => "<br>" + m.trim() + " ")
    .replace(/\n/g, "<br>");
}

// MODULE: Visual Indicators
// Shows a typing animation while the AI is processing
function showTyping() {
  const container = document.getElementById("chat-messages");
  const id = "typing-" + Date.now();

  const msgDiv = document.createElement("div");
  msgDiv.className = "message bot-message";
  msgDiv.id = id;

  const avatar = document.createElement("div");
  avatar.className = "avatar bot-avatar";
  avatar.textContent = "🤖";

  const bubble = document.createElement("div");
  bubble.className = "bubble typing-bubble";
  bubble.innerHTML = "<span></span><span></span><span></span>";

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;

  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// Resets the chat interface and history
function clearChat() {
  chatHistory = [];
  localStorage.removeItem("chat_history");
  const container = document.getElementById("chat-messages");
  container.innerHTML = `
    <div class="message bot-message">
      <div class="avatar bot-avatar">🤖</div>
      <div class="bubble">
        <p>Hello, What is your name ?</p>
      </div>
    </div>`;
}

