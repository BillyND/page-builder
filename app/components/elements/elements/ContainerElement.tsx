import React from "react";
import {
  ContainerElement as ContainerElementType,
  PageElement,
} from "../../builder/types";

interface ContainerElementProps {
  element: ContainerElementType;
  renderElement: (element: PageElement) => React.ReactNode;
}

const ContainerElement: React.FC<ContainerElementProps> = ({
  element,
  renderElement,
}) => {
  const { children, layout, columns, styles } = element;

  // Generate grid columns style
  const getGridStyle = () => {
    if (layout === "grid" && columns) {
      return {
        ...styles,
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "16px",
      };
    }
    return styles;
  };

  // Container class based on layout
  const getContainerClass = () => {
    switch (layout) {
      case "horizontal":
        return "flex flex-row gap-4 flex-wrap";
      case "grid":
        return "grid gap-4";
      case "vertical":
      default:
        return "flex flex-col gap-4";
    }
  };

  return (
    <div style={getGridStyle()} className={getContainerClass()}>
      {children?.map((childElement) => renderElement(childElement))}
    </div>
  );
};

export default ContainerElement;
