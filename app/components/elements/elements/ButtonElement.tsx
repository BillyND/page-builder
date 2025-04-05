import React from "react";
import { ButtonElement as ButtonElementType } from "../../builder/types";

interface ButtonElementProps {
  element: ButtonElementType;
}

const ButtonElement: React.FC<ButtonElementProps> = ({ element }) => {
  const { content, link, variant, styles } = element;

  // Generate button class based on variant
  const getButtonClasses = () => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded transition-colors duration-200";

    switch (variant) {
      case "primary":
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white`;
      case "secondary":
        return `${baseClasses} bg-purple-600 hover:bg-purple-700 text-white`;
      case "outline":
        return `${baseClasses} border-2 border-gray-300 hover:border-gray-400 text-gray-700`;
      case "text":
        return `${baseClasses} text-blue-600 hover:text-blue-700 underline hover:no-underline`;
      default:
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white`;
    }
  };

  // Button with or without a link
  const ButtonContent = () => (
    <button style={styles} className={getButtonClasses()}>
      {content}
    </button>
  );

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <ButtonContent />
    </a>
  ) : (
    <ButtonContent />
  );
};

export default ButtonElement;
