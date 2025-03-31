import { v4 as uuidv4 } from "uuid";
import { ElementTemplate, ElementType, PageElement } from "./types";

// Default styles for elements
const defaultStyles: Record<string, Record<string, string>> = {
  heading: {
    color: "#000000",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    margin: "0 0 16px 0",
  },
  text: {
    color: "#333333",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "0 0 16px 0",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    margin: "0 0 16px 0",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    margin: "0 0 16px 0",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    margin: "0 0 16px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    margin: "0 0 16px 0",
  },
  video: {
    width: "100%",
    height: "auto",
    margin: "0 0 16px 0",
  },
  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "16px 0",
  },
  spacer: {
    width: "100%",
    margin: "0",
  },
};

// Element templates for the sidebar
export const elementTemplates: ElementTemplate[] = [
  {
    type: ElementType.HEADING,
    name: "Heading",
    icon: "heading",
    defaultProps: {
      id: uuidv4(),
      type: ElementType.HEADING,
      name: "Heading",
      content: "Heading Text",
      level: 2,
      styles: { ...defaultStyles.heading },
    },
  },
  {
    type: ElementType.TEXT,
    name: "Text",
    icon: "text",
    defaultProps: {
      id: uuidv4(),
      type: ElementType.TEXT,
      name: "Text",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.",
      styles: { ...defaultStyles.text },
    },
  },
  {
    type: ElementType.IMAGE,
    name: "Image",
    icon: "image",
    defaultProps: {
      id: uuidv4(),
      type: ElementType.IMAGE,
      name: "Image",
      src: "https://via.placeholder.com/800x400",
      alt: "Placeholder image",
      styles: { ...defaultStyles.image },
    },
  },
  {
    type: ElementType.BUTTON,
    name: "Button",
    icon: "button",
    defaultProps: {
      id: uuidv4(),
      type: ElementType.BUTTON,
      name: "Button",
      content: "Click Me",
      link: "#",
      variant: "primary",
      styles: { ...defaultStyles.button },
    },
  },
  {
    type: ElementType.CONTAINER,
    name: "Container",
    icon: "container",
    defaultProps: {
      id: uuidv4(),
      type: ElementType.CONTAINER,
      name: "Container",
      children: [],
      layout: "vertical",
      styles: { ...defaultStyles.container },
    },
  },
  {
    type: ElementType.FORM,
    name: "Form",
    icon: "form",
    defaultProps: {
      id: uuidv4(),
      type: ElementType.FORM,
      name: "Form",
      fields: [
        {
          id: uuidv4(),
          type: "text",
          label: "Name",
          placeholder: "Enter your name",
          required: true,
        },
        {
          id: uuidv4(),
          type: "email",
          label: "Email",
          placeholder: "Enter your email",
          required: true,
        },
        {
          id: uuidv4(),
          type: "textarea",
          label: "Message",
          placeholder: "Enter your message",
          required: true,
        },
      ],
      submitLabel: "Submit",
      method: "POST",
      styles: { ...defaultStyles.form },
    },
  },
  {
    type: ElementType.VIDEO,
    name: "Video",
    icon: "video",
    defaultProps: {
      id: uuidv4(),
      type: ElementType.VIDEO,
      name: "Video",
      src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      controls: true,
      styles: { ...defaultStyles.video },
    },
  },
  {
    type: ElementType.DIVIDER,
    name: "Divider",
    icon: "divider",
    defaultProps: {
      id: uuidv4(),
      type: ElementType.DIVIDER,
      name: "Divider",
      styles: { ...defaultStyles.divider },
    },
  },
  {
    type: ElementType.SPACER,
    name: "Spacer",
    icon: "spacer",
    defaultProps: {
      id: uuidv4(),
      type: ElementType.SPACER,
      name: "Spacer",
      height: "32px",
      styles: { ...defaultStyles.spacer },
    },
  },
];

// Helper function to create a new element from a template
export const createElementFromTemplate = (
  template: ElementTemplate
): PageElement => {
  return {
    ...template.defaultProps,
    id: uuidv4(), // Generate a new ID for each element
  } as PageElement;
};
