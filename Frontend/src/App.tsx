import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import ChatPanel from "./components/ChatPanel";
import WorkspacePanel from "./components/WorkspacePanel";
import { Message } from "./types";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sequences, setSequences] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // States for login/signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);


  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const endpoint = isLogin ? "/login" : "/signup";
    const data = { email, password };
  
    try {
      const response = await axios.post(`http://127.0.0.1:5000${endpoint}`, data);
      
      if (response.status === 200) {
        alert(`${isLogin ? "Login" : "Signup"} successful!`);
        setAuthToken("some-auth-token");
        setUsername(email.split('@')[0]);
      }
      if (response.status === 201) {
        setSuccessMessage("✅ Signup successful. Please login now!");
        setIsLogin(true);
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed. Please try again.");
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUsername("");
    setMessages([]);
    setSequences([]);
    setEmail("");          // clear email
    setPassword("");  
    setInput("");     // clear password
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", content: input }]);

    try {
      const tempIndex = messages.length + 1;

      // Preemptively show a loading message
      const loadingMessage = input.toLowerCase().includes("update") ? "Updating sequence..." : "Generating ...";
      setMessages((prev) => [...prev, { sender: "ai", content: loadingMessage }]);

      const response = await axios.post("http://127.0.0.1:5000/chat", {
        message: input,
        user_id: "user123",
        current_steps: sequences,
      });

      const { type, content, steps, status } = response.data;

      if (type === "sequence" && steps && Array.isArray(steps)) {
        setSequences(steps); // Update Workspace with sequence

        setMessages((prev) => {
          const updated = [...prev];
          updated[tempIndex] = { sender: "ai", content: status === "updated" ? "✅ Sequence updated successfully." : "✅ Sequence generated successfully." };
          return updated;
        });
      } 
      else if (type === "chat" && content) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[tempIndex] = { sender: "ai", content }; // Just normal conversation
          return updated;
        });
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { sender: "ai", content: "Something went wrong." }]);
    }

    setInput("");
  };

  const handleEditSequence = (index: number, newContent: string) => {
    const updatedSequences = [...sequences];
    updatedSequences[index] = newContent;
    setSequences(updatedSequences);
  };

  return (
    <div className="app-container">
      {/* If not authenticated, show only Auth Form */}
      {!authToken ? (
        <div className="auth-container">
          {successMessage && (
          <div
            style={{
              backgroundColor: "#D4EDDA",
              color: "#155724",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "14px",
              width: "320px",
              textAlign: "center",
              margin: "10px auto"
            }}
          >
            {successMessage}
          </div>
        )}
          <div className="auth-card">
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <form onSubmit={handleAuthSubmit} className="auth-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                style={{ marginBottom: "20px" }}
              />
              <button type="submit" className="auth-button">
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setSuccessMessage("");
              }}
              className="auth-switch"
            >
              {isLogin ? "New here? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      ) : (
        // If authenticated, show main app with navigation
        <>
          <nav className="top-nav">
            <div className="nav-left">
              <h1>Helix - AI Recruitment Assistant</h1>
            </div>
            <div className="nav-right">
              <span className="username">Welcome, {username}</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </nav>
          <div className="main-content">
            <ChatPanel
              messages={messages}
              input={input}
              onInputChange={setInput}
              onSend={handleSend}
              chatEndRef={chatEndRef}
            />
            <WorkspacePanel 
              sequences={sequences} 
              onEditSequence={handleEditSequence}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
