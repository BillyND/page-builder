import React from "react";
import { SpacerElement as SpacerElementType } from "../../builder/types";

interface SpacerElementProps {
  element: SpacerElementType;
}

const SpacerElement: React.FC<SpacerElementProps> = ({ element }) => {
  const { height, styles } = element;

  return (
    <div
      style={{
        height: height || "32px",
        width: "100%",
        ...styles,
      }}
      className="w-full bg-transparent"
      aria-hidden="true"
    />
  );
};

export default SpacerElement;
