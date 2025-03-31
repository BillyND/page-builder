"use client";

interface AuthInputProps {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
  helpText?: string;
  rightElement?: React.ReactNode;
}

export default function AuthInput({
  id,
  type,
  value,
  onChange,
  label,
  placeholder,
  required = false,
  minLength,
  helpText,
  rightElement,
}: AuthInputProps) {
  return (
    <div>
      <div className={`${rightElement ? "flex justify-between" : ""} mb-2`}>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
        {rightElement}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="auth-input"
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
      {helpText && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
}
