import React, { useCallback, useState, useEffect } from "react";
import UnitInput from "./UnitInput";
import { debounce } from "@/app/lib/utils";

// Input group for style property
interface StyleInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "color" | "select" | "unit";
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  units?: ("px" | "%" | "em" | "rem" | "vh" | "vw")[];
}

const StyleInput: React.FC<StyleInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  options = [],
  min,
  max,
  step,
  units,
}) => {
  // Local state for color to prevent lag
  const [colorValue, setColorValue] = useState(value || "#ffffff");

  // Update local state when value prop changes
  useEffect(() => {
    if (type === "color") {
      setColorValue(value || "#ffffff");
    }
  }, [value, type]);

  // Create debounced onChange for performance
  const debouncedOnChange = useCallback(
    debounce((newValue: string) => {
      onChange(newValue);
    }, 100),
    [onChange]
  );

  // Handle immediate changes for most input types
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (type !== "color") {
        onChange(e.target.value);
      } else {
        // For color, update local state immediately but debounce the actual change
        setColorValue(e.target.value);
        debouncedOnChange(e.target.value);
      }
    },
    [onChange, type, debouncedOnChange]
  );

  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      {type === "select" ? (
        <select
          value={value}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "color" ? (
        <div className="flex">
          <div className="relative mr-2">
            <input
              type="color"
              value={colorValue}
              onChange={handleChange}
              className="w-10 h-8 border rounded-md cursor-pointer opacity-0 absolute inset-0 z-10"
            />
            <div
              style={{ backgroundColor: colorValue }}
              className="w-10 h-8 border rounded-md"
            />
          </div>
          <input
            type="text"
            value={colorValue}
            onChange={(e) => {
              setColorValue(e.target.value);
              debouncedOnChange(e.target.value);
            }}
            placeholder={placeholder}
            className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      ) : type === "unit" ? (
        <UnitInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          units={units}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}
    </div>
  );
};

export default StyleInput;
