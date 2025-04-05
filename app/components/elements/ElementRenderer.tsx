import React from "react";
import { PageElement, ElementType } from "../builder/types";
import ElementControls from "./ElementControls";

// Element-specific renderers
import HeadingElement from "./elements/HeadingElement";
import TextElement from "./elements/TextElement";
import ImageElement from "./elements/ImageElement";
import ButtonElement from "./elements/ButtonElement";
import ContainerElement from "./elements/ContainerElement";
import DividerElement from "./elements/DividerElement";
import SpacerElement from "./elements/SpacerElement";
import VideoElement from "./elements/VideoElement";
import FormElement from "./elements/FormElement";

interface ElementRendererProps {
  element: PageElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  renderElement: (element: PageElement) => React.ReactNode;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  allowDrag?: boolean;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
  renderElement,
  isMaximized = false,
  onToggleMaximize,
  allowDrag = false,
}) => {
  // Handle click on the element
  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  // Common wrapper for all elements
  const renderElementWithWrapper = (children: React.ReactNode) => {
    return (
      <div
        className={`relative p-4 mb-4 group transition-all duration-200 ${
          isSelected
            ? "outline outline-2 outline-blue-500"
            : "hover:outline hover:outline-1 hover:outline-gray-300"
        }`}
        onClick={handleElementClick}
        data-element-id={element.id}
        data-element-type={element.type}
      >
        {isSelected && (
          <ElementControls
            id={element.id}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            allowDrag={allowDrag}
            onToggleMaximize={onToggleMaximize}
            isMaximized={isMaximized}
          />
        )}
        {children}
      </div>
    );
  };

  // Render the appropriate element based on its type
  switch (element.type) {
    case ElementType.HEADING:
      return renderElementWithWrapper(<HeadingElement element={element} />);

    case ElementType.TEXT:
      return renderElementWithWrapper(<TextElement element={element} />);

    case ElementType.IMAGE:
      return renderElementWithWrapper(<ImageElement element={element} />);

    case ElementType.BUTTON:
      return renderElementWithWrapper(<ButtonElement element={element} />);

    case ElementType.CONTAINER:
      return renderElementWithWrapper(
        <ContainerElement element={element} renderElement={renderElement} />
      );

    case ElementType.FORM:
      return renderElementWithWrapper(<FormElement element={element} />);

    case ElementType.VIDEO:
      return renderElementWithWrapper(<VideoElement element={element} />);

    case ElementType.DIVIDER:
      return renderElementWithWrapper(<DividerElement element={element} />);

    case ElementType.SPACER:
      return renderElementWithWrapper(<SpacerElement element={element} />);

    default:
      return renderElementWithWrapper(
        <div className="p-4 border border-gray-300 rounded">
          Unknown element type: {element.type}
        </div>
      );
  }
};

export default ElementRenderer;
