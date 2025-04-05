import React from "react";
import { ImageElement as ImageElementType } from "../../builder/types";

interface ImageElementProps {
  element: ImageElementType;
}

const ImageElement: React.FC<ImageElementProps> = ({ element }) => {
  const { src, alt, styles } = element;

  return (
    <div className="w-full overflow-hidden">
      <img
        src={src}
        alt={alt || "Image"}
        style={styles}
        className="max-w-full object-cover rounded"
      />
    </div>
  );
};

export default ImageElement;
