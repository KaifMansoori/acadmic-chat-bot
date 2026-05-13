# 🎓 Academic Advisor — Full-Stack Student Portal

![Academic Advisor Banner](https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)

## 🌟 Overview
The **Academic Advisor Chatbot** is a sophisticated full-stack application designed to bridge the gap between students and academic guidance. Leveraging the power of **Google Gemini AI**, it provides personalized career counseling, course recommendations, and administrative support through an intuitive, modern interface.

This project was developed with a focus on **Module-Driven Architecture**, ensuring scalability, maintainability, and a premium user experience.

---

## 🛠️ Module-Wise Technical Architecture

### 🛡️ 1. Backend Engine (`server.js`)
The core server is built on **Node.js** and **Express.js**, acting as a robust middleware between the client and the AI ecosystem.
- **AI Integration**: Implements advanced prompt engineering with Google Gemini API to provide stream-specific guidance.
- **State Management**: Handles multi-turn conversation history to maintain context throughout the session.
- **RESTful APIs**: Provides dedicated endpoints for chat processing (`/api/chat`) and appointment management (`/api/appointments`).

### 📊 2. Intelligent Knowledge Base (`knowledgeBase.js`)
A curated dataset that powers the AI's decision-making process.
- **Science Stream**: Detailed paths for Engineering (B.Tech), Medical (MBBS), Research (Physics/Bio), and Data Science.
- **Commerce Stream**: Career tracks for Accounting (CA), Management (MBA), Banking, and Marketing.
- **Arts Stream**: Creative and legal paths including Design (B.Des), Law (LLB), Media, and Psychology.

### 🎨 3. Dynamic UI/UX (`public/index.html` & `style.css`)
A high-end frontend built with a **Glassmorphism Design System**.
- **Responsive Layout**: Fully optimized for Desktop, Tablet, and Mobile devices.
- **Visual Aesthetics**: Features dynamic background blobs, smooth CSS transitions, and a sleek dark-themed sidebar.
- **Accessibility**: Semantic HTML5 structure for better SEO and screen reader compatibility.

### ⚙️ 4. Frontend Controller (`public/script.js`)
The brain of the client-side application.
- **View Switching Logic**: Manages a Single Page Application (SPA) experience without page reloads.
- **Interaction Chips**: Features "Suggested Chips" that dynamically appear based on AI responses to guide user flow.
- **LocalStorage Persistence**: Saves chat history locally so students don't lose their progress on refresh.

---

## ✨ Key Features
- **🤖 Smart Advisor Chat**: Get instant answers to complex academic queries.
- **📅 Appointment Scheduler**: Seamless integration with faculty calendars via Calendly.
- **📚 Quick Resource Guide**: One-click access to curated modules for Placements, Internships, and Exam Prep.
- **📝 Real-time Formatting**: Support for bold text, lists, and chips in chat bubbles.
- **🔒 Secure Environment**: Environment variable protection for sensitive API keys.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Google Gemini API Key

### Installation
1. **Clone the Project**
   ```bash
   git clone https://github.com/KaifMansoori/acadmic-chat-bot.git
   cd acadmic-chat-bot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run Application**
   ```bash
   npm start
   ```
   *Access the portal at `http://localhost:3000`*

---

## 📂 Repository Structure
```bash
├── server.js              # Node/Express Backend
├── knowledgeBase.js       # Academic Data Module
├── package.json           # Dependency Manifest
├── .env                   # Configuration (Secret)
├── .gitignore             # Git Exclusions
└── public/                # Frontend Assets
    ├── index.html         # UI Structure
    ├── style.css          # Premium Styling
    └── script.js          # Interactive Logic
```

---
*Created with ❤️ for Academic Excellence.*
