import React from "react";
import { FormElement as FormElementType, FormField } from "../../builder/types";

interface FormElementProps {
  element: FormElementType;
}

const FormElement: React.FC<FormElementProps> = ({ element }) => {
  const { fields, submitLabel, action, method, styles } = element;

  // Render a form field based on its type
  const renderField = (field: FormField) => {
    const { id, type, label, placeholder, required, options } = field;

    const labelElement = (
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );

    switch (type) {
      case "text":
      case "email":
      case "number":
        return (
          <div key={id} className="mb-4">
            {labelElement}
            <input
              type={type}
              id={id}
              name={id}
              placeholder={placeholder}
              required={required}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case "textarea":
        return (
          <div key={id} className="mb-4">
            {labelElement}
            <textarea
              id={id}
              name={id}
              placeholder={placeholder}
              required={required}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case "select":
        return (
          <div key={id} className="mb-4">
            {labelElement}
            <select
              id={id}
              name={id}
              required={required}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{placeholder || "Select an option"}</option>
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "checkbox":
        return (
          <div key={id} className="mb-4 flex items-start">
            <div className="flex items-center h-5">
              <input
                id={id}
                name={id}
                type="checkbox"
                required={required}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={id} className="font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
          </div>
        );

      case "radio":
        return (
          <div key={id} className="mb-4">
            <fieldset>
              <legend className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </legend>
              <div className="mt-2 space-y-2">
                {options?.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      id={`${id}-${option.value}`}
                      name={id}
                      type="radio"
                      value={option.value}
                      required={required}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`${id}-${option.value}`}
                      className="ml-3 text-sm font-medium text-gray-700"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form
      action={action || "#"}
      method={method || "POST"}
      className="space-y-4"
      style={styles}
    >
      {fields.map(renderField)}

      <div className="pt-2">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {submitLabel || "Submit"}
        </button>
      </div>
    </form>
  );
};

export default FormElement;
