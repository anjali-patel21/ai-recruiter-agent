// src/components/ChatPanel.tsx
import MessageBubble from "./MessageBubble";
import { ChatPanelProps } from "../types";

function ChatPanel({ messages, input, onInputChange, onSend, chatEndRef }: ChatPanelProps) {
  return (
    <div className="chat-panel">
      {/* Fixed Header */}
      <div className="chat-header">
        <h2>Chat Interface</h2>
      </div>

      {/* Scrollable Messages */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <MessageBubble key={index} sender={msg.sender} content={msg.content} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={onSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatPanel;
