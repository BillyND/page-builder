import React from "react";
import { TextElement as TextElementType } from "../../builder/types";

interface TextElementProps {
  element: TextElementType;
}

const TextElement: React.FC<TextElementProps> = ({ element }) => {
  const { content, styles } = element;

  return (
    <p style={styles} className="text-base">
      {content}
    </p>
  );
};

export default TextElement;
