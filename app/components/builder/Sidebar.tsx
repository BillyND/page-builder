import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { elementTemplates } from "./elementTemplates";
import { ElementType, PageElement } from "./types";
import {
  FiType,
  FiAlignLeft,
  FiImage,
  FiSquare,
  FiBox,
  FiFileText,
  FiVideo,
  FiMinus,
  FiArrowUp,
} from "react-icons/fi";

// Map element types to icons
const elementIcons: Record<ElementType, React.ReactNode> = {
  [ElementType.HEADING]: <FiType size={20} />,
  [ElementType.TEXT]: <FiAlignLeft size={20} />,
  [ElementType.IMAGE]: <FiImage size={20} />,
  [ElementType.BUTTON]: <FiSquare size={20} />,
  [ElementType.CONTAINER]: <FiBox size={20} />,
  [ElementType.FORM]: <FiFileText size={20} />,
  [ElementType.VIDEO]: <FiVideo size={20} />,
  [ElementType.DIVIDER]: <FiMinus size={20} />,
  [ElementType.SPACER]: <FiArrowUp size={20} />,
};

interface DraggableElementProps {
  type: ElementType;
  name: string;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ type, name }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `template-${type}`,
      data: {
        type,
        isTemplate: true,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center p-3 mb-2 bg-white border rounded shadow-sm hover:bg-gray-50 transition-colors"
    >
      <div className="mr-3 text-gray-600">{elementIcons[type]}</div>
      <span>{name}</span>
    </div>
  );
};

interface SidebarProps {
  activeTab: "elements" | "layers" | "styles";
  onTabChange: (tab: "elements" | "layers" | "styles") => void;
  elements: PageElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  elements,
  selectedElementId,
  onSelectElement,
}) => {
  return (
    <div className="w-64 h-full bg-gray-100 border-r overflow-y-auto">
      {/* Tabs */}
      <div className="flex border-b bg-white">
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === "elements"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => onTabChange("elements")}
        >
          Elements
        </button>
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === "layers"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => onTabChange("layers")}
        >
          Layers
        </button>
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === "styles"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => onTabChange("styles")}
        >
          Styles
        </button>
      </div>

      <div className="p-4">
        {activeTab === "elements" && (
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">
              Drag elements to the canvas
            </h3>
            <div className="space-y-2">
              {elementTemplates.map((template) => (
                <DraggableElement
                  key={template.type}
                  type={template.type}
                  name={template.name}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "layers" && (
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">
              Page Structure
            </h3>
            {elements.length === 0 ? (
              <p className="text-sm text-gray-500">
                No elements added to the page yet.
              </p>
            ) : (
              <div className="space-y-1">
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={`p-2 text-sm rounded cursor-pointer ${
                      selectedElementId === element.id
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => onSelectElement(element.id)}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">
                        {elementIcons[element.type as ElementType]}
                      </span>
                      <span>{element.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "styles" && selectedElementId && (
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">
              Element Styles
            </h3>
            <p className="text-sm text-gray-500">
              Select an element to edit its styles.
            </p>
            {/* Style editor will be implemented separately */}
          </div>
        )}

        {activeTab === "styles" && !selectedElementId && (
          <div>
            <p className="text-sm text-gray-500">
              Select an element to edit its styles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
