import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { PageElement } from "./types";
import ElementRenderer from "../elements/ElementRenderer";

interface CanvasProps {
  elements: PageElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  elements,
  selectedElementId,
  onSelectElement,
  onDuplicateElement,
  onDeleteElement,
}) => {
  // State for maximized elements
  const [maximizedElementId, setMaximizedElementId] = useState<string | null>(
    null
  );

  // Configure droppable area
  const { setNodeRef, isOver, active } = useDroppable({
    id: "canvas",
    data: {
      accepts: ["element-template", "element"], // Accept both templates and elements
    },
  });

  // Toggle element maximized state
  const handleToggleMaximize = (id: string) => {
    setMaximizedElementId(maximizedElementId === id ? null : id);
  };

  // Recursive function to render elements
  const renderElement = (element: PageElement): React.ReactNode => {
    const isMaximized = maximizedElementId === element.id;

    return (
      <ElementRenderer
        key={element.id}
        element={element}
        isSelected={selectedElementId === element.id}
        onSelect={onSelectElement}
        onDuplicate={onDuplicateElement}
        onDelete={onDeleteElement}
        renderElement={renderElement} // Pass down for container elements
        isMaximized={isMaximized}
        onToggleMaximize={
          // Only allow maximize for top-level elements
          elements.some((e) => e.id === element.id)
            ? () => handleToggleMaximize(element.id)
            : undefined
        }
        allowDrag={true}
      />
    );
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 p-4 lg:p-8 overflow-y-auto transition-colors duration-200 ${
        isOver ? "bg-blue-50 bg-opacity-70" : "bg-gray-50"
      } ${active ? "ring-2 ring-blue-400 ring-inset" : ""}`}
      data-testid="canvas-area"
    >
      <div
        className={`max-w-4xl mx-auto bg-white shadow-md rounded-lg min-h-[calc(100vh-200px)] p-6 lg:p-8 transition-all duration-300 ${
          maximizedElementId ? "shadow-xl" : "shadow-sm"
        }`}
      >
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="flex flex-col items-center space-y-2 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Your page is empty</p>
              <p className="text-gray-400 text-sm">
                Drag and drop elements from the sidebar to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">{elements.map(renderElement)}</div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
