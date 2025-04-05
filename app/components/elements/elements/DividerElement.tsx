import React from "react";
import { DividerElement as DividerElementType } from "../../builder/types";

interface DividerElementProps {
  element: DividerElementType;
}

const DividerElement: React.FC<DividerElementProps> = ({ element }) => {
  const { styles } = element;

  // Default styles for divider if not specified
  const defaultStyles = {
    height: "1px",
    backgroundColor: "#e5e7eb",
    width: "100%",
    ...styles,
  };

  return (
    <div className="py-2 w-full">
      <hr style={defaultStyles} />
    </div>
  );
};

export default DividerElement;
