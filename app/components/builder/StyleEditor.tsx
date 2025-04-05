import React, { useState, useCallback, useEffect } from "react";
import { PageElement, ElementType } from "./types";
import {
  FiChevronDown,
  FiChevronRight,
  FiX,
  FiRotateCcw,
  FiRotateCw,
} from "react-icons/fi";
import StyleInput from "./styleComponents/StyleInput";

interface StyleEditorProps {
  element: PageElement | null;
  onStyleChange: (property: string, value: string) => void;
}

interface StyleHistoryState {
  past: Record<string, string>[];
  present: Record<string, string>;
  future: Record<string, string>[];
}

// Style control panel component for collapsible sections
interface StylePanelProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const StylePanel: React.FC<StylePanelProps> = ({
  title,
  defaultOpen = false,
  children,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <button
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2 text-gray-500">{icon}</span>}
          <h3 className="font-medium text-gray-700">{title}</h3>
        </div>
        {isOpen ? (
          <FiChevronDown className="text-gray-500" />
        ) : (
          <FiChevronRight className="text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 bg-white">{children}</div>
      )}
    </div>
  );
};

// Four-value input grid for margin, padding, etc.
interface FourValueInputProps {
  label: string;
  values: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  onChange: (
    position: "top" | "right" | "bottom" | "left",
    value: string
  ) => void;
  placeholder?: string;
}

// Tailwind class selector component
interface TailwindClassSelectorProps {
  label: string;
  category: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string; preview?: string }[];
}

const FourValueInput: React.FC<FourValueInputProps> = ({
  label,
  values,
  onChange,
  placeholder = "0px",
}) => {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-4 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Top</label>
          <StyleInput
            label=""
            type="unit"
            value={values.top || ""}
            onChange={(value) => onChange("top", value)}
            placeholder={placeholder}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Right</label>
          <StyleInput
            label=""
            type="unit"
            value={values.right || ""}
            onChange={(value) => onChange("right", value)}
            placeholder={placeholder}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Bottom</label>
          <StyleInput
            label=""
            type="unit"
            value={values.bottom || ""}
            onChange={(value) => onChange("bottom", value)}
            placeholder={placeholder}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Left</label>
          <StyleInput
            label=""
            type="unit"
            value={values.left || ""}
            onChange={(value) => onChange("left", value)}
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
};

// Quick style presets
interface StylePresetProps {
  element: PageElement;
  onApplyPreset: (styles: Record<string, string | undefined>) => void;
}

const StylePresets: React.FC<StylePresetProps> = ({
  element,
  onApplyPreset,
}) => {
  const presets = {
    typography: [
      {
        name: "Heading 1",
        styles: {
          fontSize: "2.5rem",
          fontWeight: "700",
          lineHeight: "1.2",
          color: "#111827",
          "tw-text": "text-4xl font-bold",
        },
      },
      {
        name: "Heading 2",
        styles: {
          fontSize: "2rem",
          fontWeight: "600",
          lineHeight: "1.25",
          color: "#1F2937",
          "tw-text": "text-3xl font-semibold",
        },
      },
      {
        name: "Body Text",
        styles: {
          fontSize: "1rem",
          fontWeight: "400",
          lineHeight: "1.5",
          color: "#374151",
          "tw-text": "text-base font-normal",
        },
      },
      {
        name: "Caption",
        styles: {
          fontSize: "0.875rem",
          fontWeight: "400",
          lineHeight: "1.25",
          color: "#6B7280",
          "tw-text": "text-sm font-normal text-gray-500",
        },
      },
    ],
    buttons: [
      {
        name: "Primary Button",
        styles: {
          backgroundColor: "#3B82F6",
          color: "#FFFFFF",
          fontWeight: "500",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.375rem",
          border: "none",
          "tw-button":
            "bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600",
        },
      },
      {
        name: "Secondary Button",
        styles: {
          backgroundColor: "#6B7280",
          color: "#FFFFFF",
          fontWeight: "500",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.375rem",
          border: "none",
          "tw-button":
            "bg-gray-500 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-600",
        },
      },
      {
        name: "Outline Button",
        styles: {
          backgroundColor: "transparent",
          color: "#3B82F6",
          fontWeight: "500",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.375rem",
          border: "1px solid #3B82F6",
          "tw-button":
            "bg-transparent text-blue-500 font-medium py-2 px-4 rounded-md border border-blue-500 hover:bg-blue-50",
        },
      },
    ],
    containers: [
      {
        name: "Card",
        styles: {
          backgroundColor: "#FFFFFF",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          "tw-container": "bg-white p-6 rounded-lg shadow-md",
        },
      },
      {
        name: "Well",
        styles: {
          backgroundColor: "#F9FAFB",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          border: "1px solid #E5E7EB",
          "tw-container": "bg-gray-50 p-6 rounded-lg border border-gray-200",
        },
      },
    ],
  };

  // Determine which presets to show based on element type
  const getPresetsByElementType = () => {
    switch (element.type) {
      case ElementType.HEADING:
      case ElementType.TEXT:
        return presets.typography;
      case ElementType.BUTTON:
        return presets.buttons;
      case ElementType.CONTAINER:
        return presets.containers;
      default:
        return [];
    }
  };

  const availablePresets = getPresetsByElementType();

  if (availablePresets.length === 0) {
    return null;
  }

  return (
    <StylePanel
      title="Quick Styles"
      defaultOpen={true}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3H3v9h9V3z" />
          <path d="M20 3h-5v9h5V3z" />
          <path d="M20 15h-9v7h9v-7z" />
          <path d="M8 15H3v7h5v-7z" />
        </svg>
      }
    >
      <div className="grid grid-cols-1 gap-2">
        {availablePresets.map((preset, index) => (
          <button
            key={index}
            className="text-left px-3 py-2 border border-gray-200 hover:border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors shadow-sm"
            onClick={() => onApplyPreset(preset.styles)}
          >
            <span className="block text-sm font-medium">{preset.name}</span>
          </button>
        ))}
      </div>
    </StylePanel>
  );
};

const StyleEditor: React.FC<StyleEditorProps> = ({
  element,
  onStyleChange,
}) => {
  // History for undo/redo operations
  const [styleHistory, setStyleHistory] = useState<StyleHistoryState>({
    past: [],
    present: {},
    future: [],
  });

  // Track if we're applying a history state to prevent recording
  const [applyingHistory, setApplyingHistory] = useState(false);

  // Flag for tailwind mode
  const [tailwindMode, setTailwindMode] = useState(true);

  // Initialize style history when element changes
  useEffect(() => {
    if (element && !applyingHistory) {
      setStyleHistory({
        past: [],
        present: { ...element.styles },
        future: [],
      });
    }
  }, [element]);

  // Memoize the change handlers to improve performance
  const handleMarginChange = useCallback(
    (position: "top" | "right" | "bottom" | "left", value: string) => {
      const property = `margin${
        position.charAt(0).toUpperCase() + position.slice(1)
      }`;

      if (!applyingHistory && element) {
        // Record history
        setStyleHistory((prev) => ({
          past: [...prev.past, prev.present],
          present: { ...prev.present, [property]: value },
          future: [],
        }));
      }

      onStyleChange(property, value);
    },
    [onStyleChange, element, applyingHistory]
  );

  const handlePaddingChange = useCallback(
    (position: "top" | "right" | "bottom" | "left", value: string) => {
      const property = `padding${
        position.charAt(0).toUpperCase() + position.slice(1)
      }`;

      if (!applyingHistory && element) {
        // Record history
        setStyleHistory((prev) => ({
          past: [...prev.past, prev.present],
          present: { ...prev.present, [property]: value },
          future: [],
        }));
      }

      onStyleChange(property, value);
    },
    [onStyleChange, element, applyingHistory]
  );

  const handleApplyPreset = useCallback(
    (styles: Record<string, string | undefined>) => {
      if (!element) return;

      if (!applyingHistory) {
        // Record history - record only one history entry for all changes
        setStyleHistory((prev) => ({
          past: [...prev.past, prev.present],
          present: {
            ...prev.present,
            ...Object.fromEntries(
              Object.entries(styles)
                .filter(([, v]) => v !== undefined)
                .map(([k, v]) => [k, v as string])
            ),
          },
          future: [],
        }));
      }

      // Apply all preset styles
      Object.entries(styles).forEach(([property, value]) => {
        if (value !== undefined) {
          onStyleChange(property, value);
        }
      });
    },
    [onStyleChange, element, applyingHistory]
  );

  if (!element) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <FiX className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 text-center">
          Select an element to edit its styles
        </p>
      </div>
    );
  }

  // Get dimensions section for certain element types
  const renderDimensions = () => {
    if (
      [
        ElementType.IMAGE,
        ElementType.CONTAINER,
        ElementType.DIVIDER,
        ElementType.BUTTON,
      ].includes(element.type)
    ) {
      return (
        <StylePanel title="Dimensions" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-3">
            <StyleInput
              label="Width"
              type="unit"
              value={element.styles.width || ""}
              onChange={(value) => onStyleChange("width", value)}
              placeholder="auto"
            />
            <StyleInput
              label="Height"
              type="unit"
              value={
                element.type === ElementType.SPACER
                  ? element.height || ""
                  : element.styles.height || ""
              }
              onChange={(value) =>
                element.type === ElementType.SPACER
                  ? onStyleChange("height", value)
                  : onStyleChange("height", value)
              }
              placeholder="auto"
            />
            {element.type === ElementType.CONTAINER && (
              <>
                <StyleInput
                  label="Min Width"
                  type="unit"
                  value={element.styles.minWidth || ""}
                  onChange={(value) => onStyleChange("minWidth", value)}
                  placeholder="0"
                />
                <StyleInput
                  label="Min Height"
                  type="unit"
                  value={element.styles.minHeight || ""}
                  onChange={(value) => onStyleChange("minHeight", value)}
                  placeholder="0"
                />
                <StyleInput
                  label="Max Width"
                  type="unit"
                  value={element.styles.maxWidth || ""}
                  onChange={(value) => onStyleChange("maxWidth", value)}
                  placeholder="none"
                />
                <StyleInput
                  label="Max Height"
                  type="unit"
                  value={element.styles.maxHeight || ""}
                  onChange={(value) => onStyleChange("maxHeight", value)}
                  placeholder="none"
                />
              </>
            )}
          </div>
        </StylePanel>
      );
    }
    return null;
  };

  // Get background section
  const renderBackground = () => {
    return (
      <StylePanel title="Background" defaultOpen={false}>
        <StyleInput
          label="Color"
          type="color"
          value={element.styles.backgroundColor || ""}
          onChange={(value) => onStyleChange("backgroundColor", value)}
          placeholder="#ffffff"
        />
        <StyleInput
          label="Opacity"
          type="number"
          value={element.styles.opacity || ""}
          onChange={(value) => onStyleChange("opacity", value)}
          placeholder="1"
          min={0}
          max={1}
          step={0.1}
        />
      </StylePanel>
    );
  };

  // Text styles for text-based elements
  const renderTypography = () => {
    if (
      [ElementType.HEADING, ElementType.TEXT, ElementType.BUTTON].includes(
        element.type
      )
    ) {
      return (
        <StylePanel title="Typography" defaultOpen={true}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <StyleInput
              label="Font Family"
              type="select"
              value={element.styles.fontFamily || ""}
              onChange={(value) => onStyleChange("fontFamily", value)}
              options={[
                {
                  label: "System UI",
                  value:
                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                },
                { label: "Sans Serif", value: "Arial, sans-serif" },
                { label: "Serif", value: "'Times New Roman', serif" },
                { label: "Monospace", value: "'Courier New', monospace" },
                { label: "Georgia", value: "Georgia, serif" },
                { label: "Verdana", value: "Verdana, sans-serif" },
                { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
              ]}
            />
            <StyleInput
              label="Font Size"
              type="unit"
              value={element.styles.fontSize || ""}
              onChange={(value) => onStyleChange("fontSize", value)}
              placeholder="16px"
              units={["px", "em", "rem", "%"]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <StyleInput
              label="Font Weight"
              type="select"
              value={element.styles.fontWeight || ""}
              onChange={(value) => onStyleChange("fontWeight", value)}
              options={[
                { label: "Normal (400)", value: "400" },
                { label: "Medium (500)", value: "500" },
                { label: "Semi Bold (600)", value: "600" },
                { label: "Bold (700)", value: "700" },
                { label: "Extra Bold (800)", value: "800" },
                { label: "Black (900)", value: "900" },
              ]}
            />
            <StyleInput
              label="Line Height"
              type="text"
              value={element.styles.lineHeight || ""}
              onChange={(value) => onStyleChange("lineHeight", value)}
              placeholder="1.5"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StyleInput
              label="Color"
              type="color"
              value={element.styles.color || ""}
              onChange={(value) => onStyleChange("color", value)}
              placeholder="#000000"
            />
            <StyleInput
              label="Text Align"
              type="select"
              value={element.styles.textAlign || ""}
              onChange={(value) => onStyleChange("textAlign", value)}
              options={[
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
                { label: "Justify", value: "justify" },
              ]}
            />
          </div>
        </StylePanel>
      );
    }
    return null;
  };

  // Container layout options for container elements
  const renderContainerLayout = () => {
    if (element.type === ElementType.CONTAINER) {
      return (
        <StylePanel title="Layout" defaultOpen={true}>
          <StyleInput
            label="Display"
            type="select"
            value={element.styles.display || ""}
            onChange={(value) => onStyleChange("display", value)}
            options={[
              { label: "Block", value: "block" },
              { label: "Flex", value: "flex" },
              { label: "Grid", value: "grid" },
              { label: "Inline Block", value: "inline-block" },
            ]}
          />
          {element.styles.display === "flex" && (
            <>
              <StyleInput
                label="Flex Direction"
                type="select"
                value={element.styles.flexDirection || ""}
                onChange={(value) => onStyleChange("flexDirection", value)}
                options={[
                  { label: "Row", value: "row" },
                  { label: "Column", value: "column" },
                  { label: "Row Reverse", value: "row-reverse" },
                  { label: "Column Reverse", value: "column-reverse" },
                ]}
              />
              <StyleInput
                label="Justify Content"
                type="select"
                value={element.styles.justifyContent || ""}
                onChange={(value) => onStyleChange("justifyContent", value)}
                options={[
                  { label: "Start", value: "flex-start" },
                  { label: "Center", value: "center" },
                  { label: "End", value: "flex-end" },
                  { label: "Space Between", value: "space-between" },
                  { label: "Space Around", value: "space-around" },
                  { label: "Space Evenly", value: "space-evenly" },
                ]}
              />
              <StyleInput
                label="Align Items"
                type="select"
                value={element.styles.alignItems || ""}
                onChange={(value) => onStyleChange("alignItems", value)}
                options={[
                  { label: "Start", value: "flex-start" },
                  { label: "Center", value: "center" },
                  { label: "End", value: "flex-end" },
                  { label: "Stretch", value: "stretch" },
                  { label: "Baseline", value: "baseline" },
                ]}
              />
              <StyleInput
                label="Gap"
                type="unit"
                value={element.styles.gap || ""}
                onChange={(value) => onStyleChange("gap", value)}
                placeholder="0"
              />
            </>
          )}
          {element.styles.display === "grid" && (
            <>
              <StyleInput
                label="Grid Template Columns"
                type="text"
                value={element.styles.gridTemplateColumns || ""}
                onChange={(value) =>
                  onStyleChange("gridTemplateColumns", value)
                }
                placeholder="repeat(2, 1fr)"
              />
              <StyleInput
                label="Grid Template Rows"
                type="text"
                value={element.styles.gridTemplateRows || ""}
                onChange={(value) => onStyleChange("gridTemplateRows", value)}
                placeholder="auto"
              />
              <StyleInput
                label="Grid Gap"
                type="unit"
                value={element.styles.gap || ""}
                onChange={(value) => onStyleChange("gap", value)}
                placeholder="0"
              />
            </>
          )}
        </StylePanel>
      );
    }
    return null;
  };

  // Media specific options
  const renderMediaOptions = () => {
    if (element.type === ElementType.IMAGE) {
      return (
        <StylePanel title="Image Options" defaultOpen={true}>
          <StyleInput
            label="Object Fit"
            type="select"
            value={element.styles.objectFit || ""}
            onChange={(value) => onStyleChange("objectFit", value)}
            options={[
              { label: "Fill", value: "fill" },
              { label: "Contain", value: "contain" },
              { label: "Cover", value: "cover" },
              { label: "None", value: "none" },
              { label: "Scale Down", value: "scale-down" },
            ]}
          />
          <StyleInput
            label="Border Radius"
            type="unit"
            value={element.styles.borderRadius || ""}
            onChange={(value) => onStyleChange("borderRadius", value)}
            placeholder="0px"
          />
        </StylePanel>
      );
    }

    if (element.type === ElementType.VIDEO) {
      return (
        <StylePanel title="Video Options" defaultOpen={true}>
          <div className="flex flex-col">
            <label className="flex items-center text-sm text-gray-700 mb-2">
              <input
                type="checkbox"
                checked={element.controls}
                onChange={() => {
                  // This is a placeholder - you'll need to handle this in the parent component
                  // This would require modifying the onStyleChange to handle non-style properties
                }}
                className="mr-2 h-4 w-4"
              />
              Show Controls
            </label>
            <label className="flex items-center text-sm text-gray-700 mb-2">
              <input
                type="checkbox"
                checked={element.autoplay}
                onChange={() => {
                  // This is a placeholder
                }}
                className="mr-2 h-4 w-4"
              />
              Autoplay
            </label>
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={element.loop}
                onChange={() => {
                  // This is a placeholder
                }}
                className="mr-2 h-4 w-4"
              />
              Loop
            </label>
          </div>
        </StylePanel>
      );
    }

    return null;
  };

  // Spacing controls (margin & padding)
  const renderSpacing = () => {
    return (
      <StylePanel title="Spacing" defaultOpen={false}>
        <FourValueInput
          label="Margin"
          values={{
            top: element.styles.marginTop || "",
            right: element.styles.marginRight || "",
            bottom: element.styles.marginBottom || "",
            left: element.styles.marginLeft || "",
          }}
          onChange={handleMarginChange}
          placeholder="0px"
        />
        <FourValueInput
          label="Padding"
          values={{
            top: element.styles.paddingTop || "",
            right: element.styles.paddingRight || "",
            bottom: element.styles.paddingBottom || "",
            left: element.styles.paddingLeft || "",
          }}
          onChange={handlePaddingChange}
          placeholder="0px"
        />
      </StylePanel>
    );
  };

  // Border controls
  const renderBorder = () => {
    return (
      <StylePanel title="Border" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <StyleInput
            label="Width"
            type="unit"
            value={element.styles.borderWidth || ""}
            onChange={(value) => onStyleChange("borderWidth", value)}
            placeholder="0px"
            units={["px", "em", "rem"]}
          />
          <StyleInput
            label="Style"
            type="select"
            value={element.styles.borderStyle || ""}
            onChange={(value) => onStyleChange("borderStyle", value)}
            options={[
              { label: "None", value: "none" },
              { label: "Solid", value: "solid" },
              { label: "Dashed", value: "dashed" },
              { label: "Dotted", value: "dotted" },
              { label: "Double", value: "double" },
            ]}
          />
          <StyleInput
            label="Color"
            type="color"
            value={element.styles.borderColor || ""}
            onChange={(value) => onStyleChange("borderColor", value)}
            placeholder="#000000"
          />
          <StyleInput
            label="Radius"
            type="unit"
            value={element.styles.borderRadius || ""}
            onChange={(value) => onStyleChange("borderRadius", value)}
            placeholder="0px"
            units={["px", "%", "em", "rem"]}
          />
        </div>
      </StylePanel>
    );
  };

  return (
    <div className="p-4 overflow-y-auto max-h-full">
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {element.name}
        </h2>
        <p className="text-sm text-gray-500">
          {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Element
        </p>
      </div>

      <StylePresets element={element} onApplyPreset={handleApplyPreset} />
      {renderTypography()}
      {renderContainerLayout()}
      {renderDimensions()}
      {renderSpacing()}
      {renderBackground()}
      {renderBorder()}
      {renderMediaOptions()}
    </div>
  );
};

export default StyleEditor;
