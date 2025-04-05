import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
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
  FiLayers,
  FiMove,
} from "react-icons/fi";

// Map element types to icons
const elementIcons: Record<ElementType, React.ReactNode> = {
  [ElementType.HEADING]: <FiType size={18} />,
  [ElementType.TEXT]: <FiAlignLeft size={18} />,
  [ElementType.IMAGE]: <FiImage size={18} />,
  [ElementType.BUTTON]: <FiSquare size={18} />,
  [ElementType.CONTAINER]: <FiBox size={18} />,
  [ElementType.FORM]: <FiFileText size={18} />,
  [ElementType.VIDEO]: <FiVideo size={18} />,
  [ElementType.DIVIDER]: <FiMinus size={18} />,
  [ElementType.SPACER]: <FiArrowUp size={18} />,
};

// Draggable template element
interface DraggableTemplateProps {
  type: ElementType;
  name: string;
  isActive: boolean;
}

const DraggableTemplate: React.FC<DraggableTemplateProps> = ({
  type,
  name,
  isActive,
}) => {
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center p-3 mb-2 border rounded-md shadow-sm transition-all duration-200 ${
        isActive
          ? "bg-blue-50 border-blue-300"
          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
      }`}
    >
      <div className={`mr-3 ${isActive ? "text-blue-600" : "text-gray-500"}`}>
        {elementIcons[type]}
      </div>
      <span
        className={isActive ? "font-medium text-blue-700" : "text-gray-700"}
      >
        {name}
      </span>
    </div>
  );
};

// Sortable layer item
interface SortableLayerProps {
  element: PageElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const SortableLayer: React.FC<SortableLayerProps> = ({
  element,
  isSelected,
  onSelect,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `element-${element.id}`,
    data: {
      type: element.type,
      element: element,
      isTemplate: false,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`p-2.5 text-sm rounded-md transition-colors duration-200 border ${
        isSelected
          ? "bg-blue-100 border-blue-300 text-blue-800"
          : isDragging
          ? "bg-gray-100 border-gray-300"
          : "hover:bg-gray-100 border-transparent hover:border-gray-200"
      }`}
      onClick={() => onSelect(element.id)}
    >
      <div className="flex items-center">
        <div
          className="mr-2 cursor-move touch-none p-1 rounded hover:bg-gray-200"
          {...listeners}
        >
          <FiMove size={14} className="text-gray-500" />
        </div>
        <span className="mr-2 text-gray-600">
          {elementIcons[element.type as ElementType]}
        </span>
        <span className="truncate flex-1">{element.name}</span>
        {element.children?.length ? (
          <span className="ml-auto bg-gray-200 text-gray-700 px-1.5 py-0.5 text-xs rounded-full flex items-center">
            <FiLayers size={10} className="mr-1" />
            {element.children.length}
          </span>
        ) : null}
      </div>
    </div>
  );
};

interface SidebarProps {
  activeTab: "elements" | "layers" | "styles" | "settings";
  onTabChange: (tab: "elements" | "layers" | "styles" | "settings") => void;
  elements: PageElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  isDragging?: boolean;
  activeId?: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  elements,
  selectedElementId,
  onSelectElement,
  // isDragging is unused but kept in props for compatibility with PageBuilder
  activeId = null,
}) => {
  // Recursively render all elements and their children
  const renderElementHierarchy = (
    elements: PageElement[],
    depth: number = 0
  ) => {
    return (
      <div
        className={`space-y-1 ${
          depth > 0 ? "ml-4 mt-1 border-l border-gray-200 pl-2" : ""
        }`}
      >
        {elements.map((element) => (
          <React.Fragment key={element.id}>
            <SortableLayer
              element={element}
              isSelected={selectedElementId === element.id}
              onSelect={onSelectElement}
            />
            {element.children?.length && element.type === ElementType.CONTAINER
              ? renderElementHierarchy(element.children, depth + 1)
              : null}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="w-72 h-full bg-white border-r overflow-y-auto flex flex-col shadow-sm">
      {/* Tabs */}
      <div className="flex border-b sticky top-0 bg-white z-10">
        <button
          className={`flex-1 py-3.5 text-center font-medium transition-colors ${
            activeTab === "elements"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => onTabChange("elements")}
        >
          Elements
        </button>
        <button
          className={`flex-1 py-3.5 text-center font-medium transition-colors ${
            activeTab === "layers"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => onTabChange("layers")}
        >
          Layers
        </button>
        <button
          className={`flex-1 py-3.5 text-center font-medium transition-colors ${
            activeTab === "styles"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => onTabChange("styles")}
        >
          Styles
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === "elements" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">
                Add Elements
              </h3>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Drag &amp; Drop
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {elementTemplates.map((template) => (
                <DraggableTemplate
                  key={template.type}
                  type={template.type}
                  name={template.name}
                  isActive={activeId === `template-${template.type}`}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "layers" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">
                Page Structure
              </h3>
              {elements.length > 0 && (
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {elements.length} element{elements.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>

            {elements.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">
                  No elements added to the page yet.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Add elements from the Elements tab
                </p>
              </div>
            ) : (
              <div className="pb-4">{renderElementHierarchy(elements)}</div>
            )}
          </div>
        )}

        {activeTab === "styles" && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Element Styles
            </h3>
            {!selectedElementId ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">
                  Select an element to edit its styles.
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Use the panel on the right to edit styles.
              </p>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Page Settings
            </h3>
            <p className="text-sm text-gray-500">
              Configure your page settings using the panel on the right.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
