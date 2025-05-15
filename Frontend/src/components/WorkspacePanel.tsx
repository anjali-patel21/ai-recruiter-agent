import { WorkspacePanelProps } from "../types";
import WorkspaceCard from "./WorkspaceCard";

function WorkspacePanel({ sequences, onEditSequence }: WorkspacePanelProps) {
  return (
    <div className="workspace-panel">
      <div className="workspace-header">
        <h2>Workspace (Sequences)</h2>
      </div>

      <div className="workspace-cards-scrollable">
        {sequences.length > 0 ? (
          sequences.map((seq, index) => (
            <WorkspaceCard 
              key={index} 
              stepNumber={index + 1} 
              content={seq}
              onEdit={(newContent) => onEditSequence(index, newContent)}
            />
          ))
        ) : (
          <div className="workspace-placeholder">
            No sequence generated yet. ✨
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkspacePanel;
