import mongoose from "mongoose";

export interface IPage extends mongoose.Document {
  title: string;
  description?: string;
  slug: string;
  metaTags?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  content: string; // JSON content with page elements
  contentHtml?: string; // Generated HTML content
  status: "draft" | "published";
  createdBy: string;
}

const PageSchema = new mongoose.Schema<IPage>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a slug"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    metaTags: {
      title: String,
      description: String,
      keywords: String,
    },
    content: {
      type: String,
      default: "",
    },
    contentHtml: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    createdBy: {
      type: String,
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

// Add text index for search functionality
PageSchema.index({ title: 'text', description: 'text' });

const Page = mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);

export default Page;
