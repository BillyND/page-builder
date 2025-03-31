import React from "react";
import { PageElement, ElementType } from "./types";

interface StyleEditorProps {
  element: PageElement | null;
  onStyleChange: (property: string, value: string) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({
  element,
  onStyleChange,
}) => {
  if (!element) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Select an element to edit its styles</p>
      </div>
    );
  }

  // Common style properties for all elements
  const commonStyles = (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Margin</label>
        <div className="grid grid-cols-4 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Top</label>
            <input
              type="text"
              value={element.styles.marginTop || ""}
              onChange={(e) => onStyleChange("marginTop", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="0px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Right</label>
            <input
              type="text"
              value={element.styles.marginRight || ""}
              onChange={(e) => onStyleChange("marginRight", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="0px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Bottom</label>
            <input
              type="text"
              value={element.styles.marginBottom || ""}
              onChange={(e) => onStyleChange("marginBottom", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="0px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Left</label>
            <input
              type="text"
              value={element.styles.marginLeft || ""}
              onChange={(e) => onStyleChange("marginLeft", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="0px"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Padding</label>
        <div className="grid grid-cols-4 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Top</label>
            <input
              type="text"
              value={element.styles.paddingTop || ""}
              onChange={(e) => onStyleChange("paddingTop", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="0px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Right</label>
            <input
              type="text"
              value={element.styles.paddingRight || ""}
              onChange={(e) => onStyleChange("paddingRight", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="0px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Bottom</label>
            <input
              type="text"
              value={element.styles.paddingBottom || ""}
              onChange={(e) => onStyleChange("paddingBottom", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="0px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Left</label>
            <input
              type="text"
              value={element.styles.paddingLeft || ""}
              onChange={(e) => onStyleChange("paddingLeft", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="0px"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Background</label>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Color</label>
            <div className="flex">
              <input
                type="color"
                value={element.styles.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  onStyleChange("backgroundColor", e.target.value)
                }
                className="w-10 h-8 border rounded-l"
              />
              <input
                type="text"
                value={element.styles.backgroundColor || ""}
                onChange={(e) =>
                  onStyleChange("backgroundColor", e.target.value)
                }
                className="flex-1 border-l-0 rounded-r px-2 py-1 text-sm"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Border</label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Width</label>
            <input
              type="text"
              value={element.styles.borderWidth || ""}
              onChange={(e) => onStyleChange("borderWidth", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="1px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Style</label>
            <select
              value={element.styles.borderStyle || ""}
              onChange={(e) => onStyleChange("borderStyle", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Color</label>
            <div className="flex">
              <input
                type="color"
                value={element.styles.borderColor || "#000000"}
                onChange={(e) => onStyleChange("borderColor", e.target.value)}
                className="w-10 h-8 border rounded-l"
              />
              <input
                type="text"
                value={element.styles.borderColor || ""}
                onChange={(e) => onStyleChange("borderColor", e.target.value)}
                className="flex-1 border-l-0 rounded-r px-2 py-1 text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Radius</label>
            <input
              type="text"
              value={element.styles.borderRadius || ""}
              onChange={(e) => onStyleChange("borderRadius", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="0px"
            />
          </div>
        </div>
      </div>
    </>
  );

  // Text-specific style properties
  const textStyles = (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Typography</label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Font Family
            </label>
            <select
              value={element.styles.fontFamily || ""}
              onChange={(e) => onStyleChange("fontFamily", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Font Size
            </label>
            <input
              type="text"
              value={element.styles.fontSize || ""}
              onChange={(e) => onStyleChange("fontSize", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="16px"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Weight</label>
            <select
              value={element.styles.fontWeight || ""}
              onChange={(e) => onStyleChange("fontWeight", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="lighter">Lighter</option>
              <option value="bolder">Bolder</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
              <option value="900">900</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Style</label>
            <select
              value={element.styles.fontStyle || ""}
              onChange={(e) => onStyleChange("fontStyle", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="normal">Normal</option>
              <option value="italic">Italic</option>
              <option value="oblique">Oblique</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Line Height
            </label>
            <input
              type="text"
              value={element.styles.lineHeight || ""}
              onChange={(e) => onStyleChange("lineHeight", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="1.5"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Color</label>
            <div className="flex">
              <input
                type="color"
                value={element.styles.color || "#000000"}
                onChange={(e) => onStyleChange("color", e.target.value)}
                className="w-10 h-8 border rounded-l"
              />
              <input
                type="text"
                value={element.styles.color || ""}
                onChange={(e) => onStyleChange("color", e.target.value)}
                className="flex-1 border-l-0 rounded-r px-2 py-1 text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Text Align
            </label>
            <select
              value={element.styles.textAlign || ""}
              onChange={(e) => onStyleChange("textAlign", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );

  // Element-specific style editors
  const renderElementSpecificStyles = () => {
    switch (element.type) {
      case ElementType.HEADING:
      case ElementType.TEXT:
      case ElementType.BUTTON:
        return textStyles;

      case ElementType.IMAGE:
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Image Properties
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Width
                </label>
                <input
                  type="text"
                  value={element.styles.width || ""}
                  onChange={(e) => onStyleChange("width", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="100%"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Height
                </label>
                <input
                  type="text"
                  value={element.styles.height || ""}
                  onChange={(e) => onStyleChange("height", e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="auto"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-xs text-gray-500 mb-1">
                Object Fit
              </label>
              <select
                value={element.styles.objectFit || ""}
                onChange={(e) => onStyleChange("objectFit", e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="fill">Fill</option>
                <option value="contain">Contain</option>
                <option value="cover">Cover</option>
                <option value="none">None</option>
                <option value="scale-down">Scale Down</option>
              </select>
            </div>
          </div>
        );

      case ElementType.SPACER:
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Spacer Height
            </label>
            <input
              type="text"
              value={element.height || ""}
              onChange={(e) => onStyleChange("height", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="32px"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 overflow-y-auto">
      <h3 className="text-lg font-medium mb-4">Edit {element.name} Styles</h3>

      {renderElementSpecificStyles()}
      {commonStyles}
    </div>
  );
};

export default StyleEditor;
