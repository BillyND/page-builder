import { PageElement, ElementType } from "../components/builder/types";

/**
 * Converts a page element to HTML string
 * @param element The element to convert
 * @returns HTML string representation of the element
 */
export function elementToHtml(element: PageElement): string {
  // Extract Tailwind classes and inline styles from element.styles
  const getTailwindAndStyles = (styles: Record<string, string>) => {
    const tailwindClasses: string[] = [];
    const inlineStyles: Record<string, string> = {};

    Object.entries(styles).forEach(([key, value]) => {
      // Check if it's a Tailwind class (starting with "tw-")
      if (key.startsWith("tw-")) {
        tailwindClasses.push(value);
      } else {
        inlineStyles[key] = value;
      }
    });

    return {
      classes: tailwindClasses.join(" "),
      styles: inlineStyles,
    };
  };

  // Convert styles object to inline CSS string
  const styleToString = (styles: Record<string, string>): string => {
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ");
  };

  switch (element.type) {
    case ElementType.HEADING: {
      const { level, content, styles } = element;
      const { classes, styles: inlineStyles } = getTailwindAndStyles(styles);
      return `<h${level} class="${classes}" style="${styleToString(
        inlineStyles
      )}">${content}</h${level}>`;
    }

    case ElementType.TEXT: {
      const { content, styles } = element;
      const { classes, styles: inlineStyles } = getTailwindAndStyles(styles);
      return `<p class="${classes}" style="${styleToString(
        inlineStyles
      )}">${content}</p>`;
    }

    case ElementType.IMAGE: {
      const { src, alt, styles } = element;
      const { classes, styles: inlineStyles } = getTailwindAndStyles(styles);
      return `<img src="${src}" alt="${alt}" class="${classes}" style="${styleToString(
        inlineStyles
      )}" />`;
    }

    case ElementType.BUTTON: {
      const { content, link, styles } = element;
      const { classes, styles: inlineStyles } = getTailwindAndStyles(styles);
      return `<a href="${
        link || "#"
      }" class="${classes} button" style="${styleToString(
        inlineStyles
      )}">${content}</a>`;
    }

    case ElementType.CONTAINER: {
      const { children, layout, columns, styles } = element;
      const containerStyles = { ...styles };
      const layoutClasses = [];

      // Add layout-specific styles or Tailwind classes
      if (layout === "horizontal") {
        layoutClasses.push("flex flex-row");
      } else if (layout === "grid") {
        layoutClasses.push(`grid grid-cols-${columns || 2}`);
      } else {
        // Default to vertical layout
        layoutClasses.push("flex flex-col");
      }

      // Recursively convert children to HTML
      const childrenHtml = children
        .map((child) => elementToHtml(child))
        .join("");

      const { classes, styles: inlineStyles } =
        getTailwindAndStyles(containerStyles);
      const combinedClasses = `${classes} ${layoutClasses.join(" ")}`.trim();

      return `<div class="${combinedClasses}" style="${styleToString(
        inlineStyles
      )}">${childrenHtml}</div>`;
    }

    case ElementType.FORM: {
      const { fields, submitLabel, action, method, styles } = element;
      const { classes, styles: inlineStyles } = getTailwindAndStyles(styles);

      // Generate form fields HTML with Tailwind classes
      const fieldsHtml = fields
        .map((field) => {
          const { id, type, label, placeholder, required, options } = field;
          let fieldHtml = "";

          // Label with Tailwind
          fieldHtml += `<label for="${id}" class="block mb-2 text-sm font-medium">${label}${
            required ? " *" : ""
          }</label>`;

          // Field input with Tailwind
          switch (type) {
            case "textarea":
              fieldHtml += `<textarea id="${id}" name="${id}" placeholder="${
                placeholder || ""
              }" ${
                required ? "required" : ""
              } class="w-full p-2 mb-4 border rounded-md"></textarea>`;
              break;

            case "select":
              fieldHtml += `<select id="${id}" name="${id}" ${
                required ? "required" : ""
              } class="w-full p-2 mb-4 border rounded-md">`;
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
              fieldHtml = `<div class="mb-4">
                <input type="checkbox" id="${id}" name="${id}" ${
                required ? "required" : ""
              } class="mr-2" />
                <label for="${id}" class="inline-block">${label}</label>
              </div>`;
              break;

            case "radio":
              fieldHtml = `<div class="mb-4">
                <p class="mb-2">${label}${required ? " *" : ""}</p>`;
              if (options) {
                options.forEach((option, index) => {
                  fieldHtml += `<div class="flex items-center mb-1">
                    <input type="radio" id="${id}_${index}" name="${id}" value="${
                    option.value
                  }" ${
                    index === 0 && required ? "required" : ""
                  } class="mr-2" />
                    <label for="${id}_${index}" class="inline-block">${
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
              } class="w-full p-2 mb-4 border rounded-md" />`;
          }

          return fieldHtml;
        })
        .join("");

      return `<form action="${action || ""}" method="${
        method || "POST"
      }" class="${classes}" style="${styleToString(inlineStyles)}">
        ${fieldsHtml}
        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">${submitLabel}</button>
      </form>`;
    }

    case ElementType.VIDEO: {
      const { src, controls, autoplay, loop, muted, styles } = element;
      const { classes, styles: inlineStyles } = getTailwindAndStyles(styles);

      // Check if it's a YouTube or Vimeo embed
      if (src.includes("youtube.com") || src.includes("vimeo.com")) {
        return `<iframe src="${src}" class="${classes}" style="${styleToString(
          inlineStyles
        )}" frameborder="0" allowfullscreen></iframe>`;
      }

      // Regular video
      return `<video src="${src}" ${controls ? "controls" : ""} ${
        autoplay ? "autoplay" : ""
      } ${loop ? "loop" : ""} ${
        muted ? "muted" : ""
      } class="${classes}" style="${styleToString(inlineStyles)}"></video>`;
    }

    case ElementType.DIVIDER: {
      const { styles } = element;
      const { classes, styles: inlineStyles } = getTailwindAndStyles(styles);
      return `<hr class="${classes}" style="${styleToString(inlineStyles)}" />`;
    }

    case ElementType.SPACER: {
      const { height, styles } = element;
      const { classes, styles: inlineStyles } = getTailwindAndStyles(styles);
      return `<div class="${classes}" style="height: ${height}; ${styleToString(
        inlineStyles
      )}"></div>`;
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
    <div class="page-content max-w-7xl mx-auto">
      ${elementsHtml}
    </div>
  `;
}
