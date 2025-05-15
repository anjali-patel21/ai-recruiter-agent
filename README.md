# Helix - AI Recruitment Assistant

Helix is an AI-powered recruitment assistant that helps streamline the hiring process through intelligent sequence generation and management.

## Features

- AI-powered chat interface for recruitment assistance
- Sequence generation and management
- User authentication (login/signup)
- Editable sequence cards
- Real-time chat with AI assistant

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)
- npm (Node.js package manager)

## Project Structure

```
ai-recruiter-agent/
├── Backend/           # Flask backend server
│   ├── app.py
│   ├── db_config.py
│   ├── routes/
│   ├── services/
│   ├── db/
│   └── requirements.txt
└── Frontend/          # React frontend
    ├── src/
    ├── public/
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the Backend directory with the following variables:
   ```
   DATABASE_URL=your_database_url
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Start the backend server:
   ```bash
   python app.py
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Create an account or login with existing credentials
3. Start chatting with the AI assistant to generate recruitment sequences
4. Edit sequences using the edit button on each card
5. Use the chat interface to update or generate new sequences

## Environment Variables

### Backend (.env)
- `DATABASE_URL`: Your database connection string
- `OPENAI_API_KEY`: Your OpenAI API key

