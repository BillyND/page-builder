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
  createdBy: mongoose.Types.ObjectId;
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

// Create a text index for search functionality
PageSchema.index({ title: "text", description: "text" });

// Check if the model exists before creating a new one
// This is important for Next.js hot reloading
export default mongoose.models.Page ||
  mongoose.model<IPage>("Page", PageSchema);
