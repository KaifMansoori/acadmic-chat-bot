// ── State ──────────────────────────────────────────────────────────
let chatHistory = JSON.parse(localStorage.getItem("chat_history")) || [];
let isLoading = false;

// Load history on startup
window.onload = () => {
  if (chatHistory.length > 0) {
    // Clear initial welcome if there is history
    const container = document.getElementById("chat-messages");
    container.innerHTML = "";
    
    // Re-render history
    chatHistory.forEach(msg => {
      appendMessage(msg.role === "assistant" ? "bot" : "user", msg.content, false);
    });
    
    // Keep chips visible (removed hiding logic)
  }
};

// ── View Switching ─────────────────────────────────────────────────
function showView(viewName) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));

  document.getElementById("view-" + viewName).classList.add("active");
  event.currentTarget.classList.add("active");
}

// ── Chat Functions ─────────────────────────────────────────────────
function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}

function sendQuick(msg) {
  document.getElementById("user-input").value = msg;
  sendMessage();
}

function askTopic(msg) {
  // Switch to chat view and send
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
  document.getElementById("view-chat").classList.add("active");
  document.querySelector(".nav-btn").classList.add("active");

  document.getElementById("user-input").value = msg;
  sendMessage();
}

async function sendMessage() {
  if (isLoading) return;

  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  // Check if user wants to book appointment
  if (message.toLowerCase().includes("book appointment")) {
    appendMessage("user", message);
    appendMessage(
      "bot",
      '📅 Sure! Click on <strong>"Book Appointment"</strong> in the sidebar to schedule a meeting with your faculty advisor.'
    );
    input.value = "";
    input.style.height = "auto";
    return;
  }

  appendMessage("user", message);
  input.value = "";
  input.style.height = "auto";

  // Keep quick chips visible (removed hiding logic)

  // Show typing indicator
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
      appendMessage("bot", "⚠️ Error: " + data.error);
    } else {
      appendMessage("bot", data.reply);
      // Add to history
      chatHistory.push({ role: "user", content: message });
      chatHistory.push({ role: "assistant", content: data.reply });
      localStorage.setItem("chat_history", JSON.stringify(chatHistory));
    }
  } catch (err) {
    removeTyping(typingId);
    appendMessage("bot", "⚠️ Could not connect to server. Make sure the server is running.");
  }

  isLoading = false;
  document.getElementById("send-btn").disabled = false;
}

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
  
  // Extract suggested questions if any
  let mainText = text;
  let suggestions = [];
  
  if (role === "bot") {
    const parts = text.split("[SUGGESTED]:");
    mainText = parts[0].trim();
    if (parts.length > 1) {
      suggestions = parts.slice(1).map(s => s.trim().split("\n")[0]);
    }
  }

  bubble.innerHTML = formatText(mainText);
  contentDiv.appendChild(bubble);

  // Add suggested question chips
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

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n- /g, "<br>• ")
    .replace(/\n\d\. /g, (m) => "<br>" + m.trim() + " ")
    .replace(/\n/g, "<br>");
}

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
  document.getElementById("quick-chips").style.display = "flex";
}

// ── Appointment Booking ────────────────────────────────────────────
async function bookAppointment() {
  const name = document.getElementById("appt-name").value.trim();
  const email = document.getElementById("appt-email").value.trim();
  const date = document.getElementById("appt-date").value;
  const time = document.getElementById("appt-time").value;
  const reason = document.getElementById("appt-reason").value.trim();
  const statusEl = document.getElementById("appt-status");

  if (!name || !email || !date || !time || !reason) {
    statusEl.className = "appt-status error";
    statusEl.textContent = "⚠️ Please fill in all fields.";
    return;
  }

  try {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, date, time, reason }),
    });

    const data = await res.json();

    if (data.message) {
      statusEl.className = "appt-status success";
      statusEl.textContent = `✅ Appointment booked for ${date} at ${time}! Confirmation sent to ${email}.`;
      // Clear form
      ["appt-name", "appt-email", "appt-date", "appt-time", "appt-reason"].forEach(
        (id) => (document.getElementById(id).value = "")
      );
    } else {
      statusEl.className = "appt-status error";
      statusEl.textContent = "⚠️ " + (data.error || "Something went wrong.");
    }
  } catch (err) {
    statusEl.className = "appt-status error";
    statusEl.textContent = "⚠️ Could not connect to server.";
  }
}
