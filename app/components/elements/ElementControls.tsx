import React from "react";
import {
  FiTrash2,
  FiCopy,
  FiMove,
  FiMaximize,
  FiMinimize,
} from "react-icons/fi";

interface ElementControlsProps {
  id: string;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  allowDrag?: boolean;
  onToggleMaximize?: () => void;
  isMaximized?: boolean;
}

const ElementControls: React.FC<ElementControlsProps> = ({
  id,
  onDuplicate,
  onDelete,
  allowDrag = false,
  onToggleMaximize,
  isMaximized = false,
}) => {
  return (
    <div className="absolute top-2 right-2 flex bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md shadow-sm z-10 opacity-95 transition-opacity group-hover:opacity-100">
      {allowDrag && (
        <button
          className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors rounded-l-md cursor-move"
          title="Drag to reorder"
          data-drag-handle
        >
          <FiMove size={14} />
        </button>
      )}

      {onToggleMaximize && (
        <button
          className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMaximize();
          }}
          title={isMaximized ? "Minimize" : "Maximize"}
        >
          {isMaximized ? <FiMinimize size={14} /> : <FiMaximize size={14} />}
        </button>
      )}

      <button
        className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate(id);
        }}
        title="Duplicate"
      >
        <FiCopy size={14} />
      </button>

      <button
        className="p-1.5 hover:bg-gray-100 text-red-500 transition-colors rounded-r-md"
        onClick={(e) => {
          e.stopPropagation();
          if (confirm("Are you sure you want to delete this element?")) {
            onDelete(id);
          }
        }}
        title="Delete"
      >
        <FiTrash2 size={14} />
      </button>
    </div>
  );
};

export default ElementControls;
