# Academic Advisor Chatbot — Student Portal

An intelligent, AI-powered academic advisory system designed to assist students in exploring career paths, selecting courses based on their streams (Science, Commerce, Arts), and scheduling appointments with faculty advisors.

## 🚀 Key Modules & Features

### 1. **AI Advisory Engine (Backend)**
- **Core Technology**: Integrated with Google Gemini AI (Generative Language API).
- **Functionality**: Processes natural language queries and provides context-aware guidance using a curated academic knowledge base.
- **Context Management**: Maintains conversation history for seamless multi-turn dialogues.

### 2. **Structured Knowledge Base**
- **Data Source**: A comprehensive JSON-based module (`knowledgeBase.js`) containing details on:
  - **Science**: Engineering, Medical, Research, Data Science.
  - **Commerce**: Accounting, Management, Banking, Marketing.
  - **Arts**: Design, Law, Media, Psychology.
- **Purpose**: Ensures the AI provides accurate and specific course recommendations.

### 3. **Dynamic Frontend Interface**
- **Single Page Application (SPA)**: Built with Vanilla JS for high performance.
- **Responsive Design**: Modern UI with glassmorphism effects and fluid animations.
- **Interaction Modules**:
  - **Advisor Chat**: Real-time interaction with the AI.
  - **Quick Guide**: Predefined modules for common student queries (Placements, Internships, Study Tips).
  - **Appointments**: Integrated scheduling system using Calendly API.

### 4. **Appointment Management**
- **System**: A dedicated API endpoint (`/api/appointments`) to handle and store meeting requests.
- **Integration**: Real-time validation and confirmation feedback for students.

## 🛠️ Technology Stack
- **Frontend**: HTML5, CSS3 (Custom Variables & Animations), JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **AI Integration**: Google Gemini API.
- **Utilities**: Dotenv (Environment Variables), CORS, Path.

## 📁 Project Structure
```text
├── server.js            # Main backend engine & API routes
├── knowledgeBase.js     # Structured academic data module
├── public/
│   ├── index.html       # Primary UI structure
│   ├── style.css        # Custom design system & animations
│   └── script.js        # Frontend logic & API communication
├── .env                 # Environment configurations (API Keys)
└── package.json         # Project dependencies
```

## ⚙️ Installation & Setup
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a `.env` file and add your `GEMINI_API_KEY`.
4. Start the server: `node server.js`.
5. Open `http://localhost:3000` in your browser.

---
*Developed as a portfolio project to demonstrate AI integration, full-stack development, and UI/UX design.*
