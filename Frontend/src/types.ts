export interface Message {
    sender: "user" | "ai";
    content: string;
  }
  
  export interface ChatPanelProps {
    messages: Message[];
    input: string;
    onInputChange: (value: string) => void;
    onSend: () => void;
    chatEndRef: React.RefObject<HTMLDivElement>;
  }
  
  export interface WorkspacePanelProps {
    sequences: string[];
    onEditSequence: (index: number, newContent: string) => void;
  }
  
  export interface MessageBubbleProps {
    sender: "user" | "ai";
    content: string;
  }
  
  export interface WorkspaceCardProps {
    stepNumber: number;
    content: string;
    onEdit: (newContent: string) => void;
  }
  