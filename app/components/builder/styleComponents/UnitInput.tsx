import React, { useState, useCallback, useEffect, useRef } from "react";

type Unit = "px" | "%" | "em" | "rem" | "vh" | "vw";

interface UnitInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  units?: Unit[];
}

const UnitInput: React.FC<UnitInputProps> = ({
  value,
  onChange,
  placeholder = "0",
  min,
  max,
  step = 1,
  units = ["px", "%", "em", "rem", "vh", "vw"],
}) => {
  // Parse the initial value to separate number and unit
  const parseValue = (val: string): [number | "", Unit] => {
    if (!val) return ["", "px"];

    // Try to extract number and unit
    const match = val.match(/^([-+]?\d*\.?\d*)(.*)$/);
    if (match && match[1]) {
      const numPart = match[1];
      let unitPart = match[2] as Unit;

      // If unit is not in our list, default to px
      if (!unitPart || !units.includes(unitPart as Unit)) {
        unitPart = "px";
      }

      return [numPart === "" ? "" : parseFloat(numPart), unitPart];
    }

    return ["", "px"];
  };

  const [parsedValue, setParsedValue] = useState<[number | "", Unit]>(
    parseValue(value)
  );
  const [localValue, setLocalValue] = useState<string>(
    parsedValue[0].toString()
  );
  const [unit, setUnit] = useState<Unit>(parsedValue[1]);

  // Update local state when prop value changes
  useEffect(() => {
    const [num, unitPart] = parseValue(value);
    setParsedValue([num, unitPart]);
    setLocalValue(num === "" ? "" : num.toString());
    setUnit(unitPart);
  }, [value]);

  // Using debounced callback for onChange
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced onChange handler
  const debouncedOnChange = useCallback(
    (newValue: string, newUnit: Unit) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (newValue === "") {
          onChange("");
        } else {
          onChange(`${newValue}${newUnit}`);
        }
      }, 300);
    },
    [onChange]
  );

  // Handle numeric input change
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Allow empty input or numeric values
    if (newValue === "" || /^[-+]?\d*\.?\d*$/.test(newValue)) {
      setLocalValue(newValue);
      const numValue = newValue === "" ? "" : parseFloat(newValue);
      setParsedValue([numValue, unit]);
      debouncedOnChange(newValue, unit);
    }
  };

  // Handle unit selection change
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as Unit;
    setUnit(newUnit);
    setParsedValue([parsedValue[0], newUnit]);

    if (localValue !== "") {
      debouncedOnChange(localValue, newUnit);
    }
  };

  return (
    <div className="flex">
      <input
        type="text"
        value={localValue}
        onChange={handleValueChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full border border-r-0 border-gray-300 rounded-l-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <select
        value={unit}
        onChange={handleUnitChange}
        className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {units.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UnitInput;
