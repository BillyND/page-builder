// Element types
export enum ElementType {
  HEADING = "heading",
  TEXT = "text",
  IMAGE = "image",
  BUTTON = "button",
  CONTAINER = "container",
  FORM = "form",
  VIDEO = "video",
  DIVIDER = "divider",
  SPACER = "spacer",
}

// Base element interface
export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  styles: Record<string, string>;
  children?: PageElement[];
}

// Specific element interfaces
export interface HeadingElement extends BaseElement {
  type: ElementType.HEADING;
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface TextElement extends BaseElement {
  type: ElementType.TEXT;
  content: string;
}

export interface ImageElement extends BaseElement {
  type: ElementType.IMAGE;
  src: string;
  alt: string;
}

export interface ButtonElement extends BaseElement {
  type: ElementType.BUTTON;
  content: string;
  link?: string;
  variant?: "primary" | "secondary" | "outline" | "text";
}

export interface ContainerElement extends BaseElement {
  type: ElementType.CONTAINER;
  children: PageElement[];
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
}

export interface FormElement extends BaseElement {
  type: ElementType.FORM;
  fields: FormField[];
  submitLabel: string;
  action?: string;
  method?: "GET" | "POST";
}

export interface FormField {
  id: string;
  type:
    | "text"
    | "email"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
}

export interface VideoElement extends BaseElement {
  type: ElementType.VIDEO;
  src: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export interface DividerElement extends BaseElement {
  type: ElementType.DIVIDER;
}

export interface SpacerElement extends BaseElement {
  type: ElementType.SPACER;
  height: string;
}

// Union type for all element types
export type PageElement =
  | HeadingElement
  | TextElement
  | ImageElement
  | ButtonElement
  | ContainerElement
  | FormElement
  | VideoElement
  | DividerElement
  | SpacerElement;

// Page structure
export interface PageStructure {
  elements: PageElement[];
}

// Element template for sidebar
export interface ElementTemplate {
  type: ElementType;
  name: string;
  icon: string;
  defaultProps: Partial<PageElement>;
}
