import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { PageElement, ElementType } from "./types";
import { FiTrash2, FiCopy } from "react-icons/fi";

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
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
    data: {
      accepts: Object.values(ElementType),
    },
  });

  // Render a specific element based on its type
  const renderElement = (element: PageElement) => {
    switch (element.type) {
      case ElementType.HEADING:
        return (
          <div
            key={element.id}
            className={`relative p-4 mb-4 ${
              selectedElementId === element.id
                ? "outline outline-2 outline-blue-500"
                : "hover:outline hover:outline-1 hover:outline-gray-300"
            }`}
            onClick={() => onSelectElement(element.id)}
            style={element.styles}
          >
            {selectedElementId === element.id && (
              <ElementControls
                id={element.id}
                onDuplicate={onDuplicateElement}
                onDelete={onDeleteElement}
              />
            )}
            {element.level === 1 && <h1>{element.content}</h1>}
            {element.level === 2 && <h2>{element.content}</h2>}
            {element.level === 3 && <h3>{element.content}</h3>}
            {element.level === 4 && <h4>{element.content}</h4>}
            {element.level === 5 && <h5>{element.content}</h5>}
            {element.level === 6 && <h6>{element.content}</h6>}
          </div>
        );

      case ElementType.TEXT:
        return (
          <div
            key={element.id}
            className={`relative p-4 mb-4 ${
              selectedElementId === element.id
                ? "outline outline-2 outline-blue-500"
                : "hover:outline hover:outline-1 hover:outline-gray-300"
            }`}
            onClick={() => onSelectElement(element.id)}
            style={element.styles}
          >
            {selectedElementId === element.id && (
              <ElementControls
                id={element.id}
                onDuplicate={onDuplicateElement}
                onDelete={onDeleteElement}
              />
            )}
            <p>{element.content}</p>
          </div>
        );

      case ElementType.IMAGE:
        return (
          <div
            key={element.id}
            className={`relative p-4 mb-4 ${
              selectedElementId === element.id
                ? "outline outline-2 outline-blue-500"
                : "hover:outline hover:outline-1 hover:outline-gray-300"
            }`}
            onClick={() => onSelectElement(element.id)}
          >
            {selectedElementId === element.id && (
              <ElementControls
                id={element.id}
                onDuplicate={onDuplicateElement}
                onDelete={onDeleteElement}
              />
            )}
            <img
              src={element.src}
              alt={element.alt}
              style={element.styles}
              className="max-w-full"
            />
          </div>
        );

      case ElementType.BUTTON:
        return (
          <div
            key={element.id}
            className={`relative p-4 mb-4 ${
              selectedElementId === element.id
                ? "outline outline-2 outline-blue-500"
                : "hover:outline hover:outline-1 hover:outline-gray-300"
            }`}
            onClick={() => onSelectElement(element.id)}
          >
            {selectedElementId === element.id && (
              <ElementControls
                id={element.id}
                onDuplicate={onDuplicateElement}
                onDelete={onDeleteElement}
              />
            )}
            <button style={element.styles}>{element.content}</button>
          </div>
        );

      case ElementType.CONTAINER:
        return (
          <div
            key={element.id}
            className={`relative p-4 mb-4 ${
              selectedElementId === element.id
                ? "outline outline-2 outline-blue-500"
                : "hover:outline hover:outline-1 hover:outline-gray-300"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement(element.id);
            }}
            style={element.styles}
          >
            {selectedElementId === element.id && (
              <ElementControls
                id={element.id}
                onDuplicate={onDuplicateElement}
                onDelete={onDeleteElement}
              />
            )}
            <div
              className={`${
                element.layout === "horizontal"
                  ? "flex flex-row"
                  : element.layout === "grid"
                  ? "grid"
                  : "flex flex-col"
              }`}
              style={
                element.layout === "grid"
                  ? {
                      gridTemplateColumns: `repeat(${
                        element.columns || 2
                      }, 1fr)`,
                    }
                  : {}
              }
            >
              {element.children?.map((child) => renderElement(child))}
            </div>
          </div>
        );

      case ElementType.DIVIDER:
        return (
          <div
            key={element.id}
            className={`relative p-4 mb-4 ${
              selectedElementId === element.id
                ? "outline outline-2 outline-blue-500"
                : "hover:outline hover:outline-1 hover:outline-gray-300"
            }`}
            onClick={() => onSelectElement(element.id)}
          >
            {selectedElementId === element.id && (
              <ElementControls
                id={element.id}
                onDuplicate={onDuplicateElement}
                onDelete={onDeleteElement}
              />
            )}
            <hr style={element.styles} />
          </div>
        );

      case ElementType.SPACER:
        return (
          <div
            key={element.id}
            className={`relative mb-4 ${
              selectedElementId === element.id
                ? "outline outline-2 outline-blue-500"
                : "hover:outline hover:outline-1 hover:outline-gray-300"
            }`}
            onClick={() => onSelectElement(element.id)}
            style={{ height: element.height, ...element.styles }}
          >
            {selectedElementId === element.id && (
              <ElementControls
                id={element.id}
                onDuplicate={onDuplicateElement}
                onDelete={onDeleteElement}
              />
            )}
          </div>
        );

      // Add more element types as needed

      default:
        return (
          <div
            key={element.id}
            className="p-4 mb-4 border border-gray-300 rounded"
          >
            Unknown element type: {element.type}
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 p-8 bg-gray-50 overflow-y-auto ${
        isOver ? "bg-blue-50" : ""
      }`}
    >
      <div className="max-w-4xl mx-auto bg-white min-h-[calc(100vh-200px)] shadow-sm p-8 rounded">
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-2">
              Drag and drop elements from the sidebar
            </p>
            <p className="text-gray-400 text-sm">
              or click an element to add it to the page
            </p>
          </div>
        ) : (
          elements.map((element) => renderElement(element))
        )}
      </div>
    </div>
  );
};

interface ElementControlsProps {
  id: string;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const ElementControls: React.FC<ElementControlsProps> = ({
  id,
  onDuplicate,
  onDelete,
}) => {
  return (
    <div className="absolute top-0 right-0 flex bg-white border border-gray-200 rounded shadow-sm z-10">
      <button
        className="p-1 hover:bg-gray-100"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate(id);
        }}
        title="Duplicate"
      >
        <FiCopy size={14} />
      </button>
      <button
        className="p-1 hover:bg-gray-100 text-red-500"
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

export default Canvas;
