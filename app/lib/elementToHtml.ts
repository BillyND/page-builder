import { PageElement, ElementType } from "../components/builder/types";

/**
 * Converts a page element to HTML string
 * @param element The element to convert
 * @returns HTML string representation of the element
 */
export function elementToHtml(element: PageElement): string {
  // Convert styles object to inline CSS string
  const styleToString = (styles: Record<string, string>): string => {
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ");
  };

  switch (element.type) {
    case ElementType.HEADING: {
      const { level, content, styles } = element;
      return `<h${level} style="${styleToString(
        styles
      )}">${content}</h${level}>`;
    }

    case ElementType.TEXT: {
      const { content, styles } = element;
      return `<p style="${styleToString(styles)}">${content}</p>`;
    }

    case ElementType.IMAGE: {
      const { src, alt, styles } = element;
      return `<img src="${src}" alt="${alt}" style="${styleToString(
        styles
      )}" />`;
    }

    case ElementType.BUTTON: {
      const { content, link, styles } = element;
      return `<a href="${link || "#"}" style="${styleToString(
        styles
      )}" class="button">${content}</a>`;
    }

    case ElementType.CONTAINER: {
      const { children, layout, columns, styles } = element;
      let containerStyles = { ...styles };

      // Add layout-specific styles
      if (layout === "horizontal") {
        containerStyles = {
          ...containerStyles,
          display: "flex",
          flexDirection: "row",
        };
      } else if (layout === "grid") {
        containerStyles = {
          ...containerStyles,
          display: "grid",
          gridTemplateColumns: `repeat(${columns || 2}, 1fr)`,
        };
      } else {
        // Default to vertical layout
        containerStyles = {
          ...containerStyles,
          display: "flex",
          flexDirection: "column",
        };
      }

      // Recursively convert children to HTML
      const childrenHtml = children
        .map((child) => elementToHtml(child))
        .join("");

      return `<div style="${styleToString(
        containerStyles
      )}">${childrenHtml}</div>`;
    }

    case ElementType.FORM: {
      const { fields, submitLabel, action, method, styles } = element;

      // Generate form fields HTML
      const fieldsHtml = fields
        .map((field) => {
          const { id, type, label, placeholder, required, options } = field;
          let fieldHtml = "";

          // Label
          fieldHtml += `<label for="${id}" style="display: block; margin-bottom: 0.5rem;">${label}${
            required ? " *" : ""
          }</label>`;

          // Field input
          switch (type) {
            case "textarea":
              fieldHtml += `<textarea id="${id}" name="${id}" placeholder="${
                placeholder || ""
              }" ${
                required ? "required" : ""
              } style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;"></textarea>`;
              break;

            case "select":
              fieldHtml += `<select id="${id}" name="${id}" ${
                required ? "required" : ""
              } style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;">`;
              if (options) {
                fieldHtml += options
                  .map(
                    (option) =>
                      `<option value="${option.value}">${option.label}</option>`
                  )
                  .join("");
              }
              fieldHtml += `</select>`;
              break;

            case "checkbox":
              fieldHtml = `<div style="margin-bottom: 1rem;">
                <input type="checkbox" id="${id}" name="${id}" ${
                required ? "required" : ""
              } />
                <label for="${id}" style="display: inline-block; margin-left: 0.5rem;">${label}</label>
              </div>`;
              break;

            case "radio":
              fieldHtml = `<div style="margin-bottom: 1rem;">
                <p style="margin-bottom: 0.5rem;">${label}${
                required ? " *" : ""
              }</p>`;
              if (options) {
                options.forEach((option, index) => {
                  fieldHtml += `<div>
                    <input type="radio" id="${id}_${index}" name="${id}" value="${
                    option.value
                  }" ${index === 0 && required ? "required" : ""} />
                    <label for="${id}_${index}" style="display: inline-block; margin-left: 0.5rem;">${
                    option.label
                  }</label>
                  </div>`;
                });
              }
              fieldHtml += `</div>`;
              break;

            default:
              // Default to text input
              fieldHtml += `<input type="${type}" id="${id}" name="${id}" placeholder="${
                placeholder || ""
              }" ${
                required ? "required" : ""
              } style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;" />`;
          }

          return fieldHtml;
        })
        .join("");

      return `<form action="${action || ""}" method="${
        method || "POST"
      }" style="${styleToString(styles)}">
        ${fieldsHtml}
        <button type="submit" style="padding: 0.5rem 1rem; background-color: #3b82f6; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">${submitLabel}</button>
      </form>`;
    }

    case ElementType.VIDEO: {
      const { src, controls, autoplay, loop, muted, styles } = element;

      // Check if it's a YouTube or Vimeo embed
      if (src.includes("youtube.com") || src.includes("vimeo.com")) {
        return `<iframe src="${src}" style="${styleToString(
          styles
        )}" frameborder="0" allowfullscreen></iframe>`;
      }

      // Regular video
      return `<video src="${src}" ${controls ? "controls" : ""} ${
        autoplay ? "autoplay" : ""
      } ${loop ? "loop" : ""} ${muted ? "muted" : ""} style="${styleToString(
        styles
      )}"></video>`;
    }

    case ElementType.DIVIDER: {
      const { styles } = element;
      return `<hr style="${styleToString(styles)}" />`;
    }

    case ElementType.SPACER: {
      const { height, styles } = element;
      return `<div style="height: ${height}; ${styleToString(styles)}"></div>`;
    }

    default:
      return "";
  }
}

/**
 * Converts an array of page elements to a complete HTML document
 * @param elements Array of page elements
 * @returns Complete HTML document as a string
 */
export function elementsToHtml(elements: PageElement[]): string {
  const elementsHtml = elements
    .map((element) => elementToHtml(element))
    .join("");

  return `
    <div class="page-content">
      ${elementsHtml}
    </div>
  `;
}
