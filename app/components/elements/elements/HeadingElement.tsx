import React from "react";
import { HeadingElement as HeadingElementType } from "../../builder/types";

interface HeadingElementProps {
  element: HeadingElementType;
}

const HeadingElement: React.FC<HeadingElementProps> = ({ element }) => {
  const { content, level, styles } = element;

  switch (level) {
    case 1:
      return (
        <h1 style={styles} className="font-bold text-3xl">
          {content}
        </h1>
      );
    case 2:
      return (
        <h2 style={styles} className="font-bold text-2xl">
          {content}
        </h2>
      );
    case 3:
      return (
        <h3 style={styles} className="font-bold text-xl">
          {content}
        </h3>
      );
    case 4:
      return (
        <h4 style={styles} className="font-bold text-lg">
          {content}
        </h4>
      );
    case 5:
      return (
        <h5 style={styles} className="font-bold text-base">
          {content}
        </h5>
      );
    case 6:
      return (
        <h6 style={styles} className="font-bold text-sm">
          {content}
        </h6>
      );
    default:
      return (
        <h2 style={styles} className="font-bold text-2xl">
          {content}
        </h2>
      );
  }
};

export default HeadingElement;
