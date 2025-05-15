// src/components/MessageBubble.tsx
import { Message } from "../types";

function MessageBubble({ sender, content }: Message) {
  return (
    <div className={`message-bubble ${sender === "user" ? "user-bubble" : "ai-bubble"}`}>
      <div className="message-sender">{sender === "user" ? "You" : "Helix"}</div>
      <div className="message-content">{content}</div>
    </div>
  );
}

export default MessageBubble;
