import { useState } from "react";
import { WorkspaceCardProps } from "../types";

function WorkspaceCard({ stepNumber, content, onEdit }: WorkspaceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };

  return (
    <div className="workspace-card">
      <div className="workspace-step-title">
        Step {stepNumber}:
      </div>
      {isEditing ? (
        <div className="workspace-step-content">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="edit-textarea"
          />
          <div className="edit-buttons">
            <button onClick={handleSave} className="save-button">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="workspace-step-content">
          {content}
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

export default WorkspaceCard;
