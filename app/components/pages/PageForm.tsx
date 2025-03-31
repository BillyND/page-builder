"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSave, FiX } from "react-icons/fi";

interface PageFormProps {
  initialData?: {
    title: string;
    description: string;
    slug: string;
    metaTags: {
      title: string;
      description: string;
      keywords: string;
    };
    status: "draft" | "published";
  };
  isEditing?: boolean;
  pageId?: string;
}

const PageForm: React.FC<PageFormProps> = ({
  initialData,
  isEditing = false,
  pageId,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    slug: initialData?.slug || "",
    metaTags: {
      title: initialData?.metaTags?.title || "",
      description: initialData?.metaTags?.description || "",
      keywords: initialData?.metaTags?.keywords || "",
    },
    status: initialData?.status || "draft",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Handle nested fields (metaTags)
      const [parent, child] = name.split(".");
      if (parent === "metaTags") {
        setFormData((prev) => ({
          ...prev,
          metaTags: {
            ...prev.metaTags,
            [child]: value,
          },
        }));
      }
    } else {
      // Handle top-level fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Generate slug if not provided
      if (!formData.slug) {
        formData.slug = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }

      const url = isEditing ? `/api/pages/${pageId}` : "/api/pages";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save page");
      }

      const data = await response.json();

      setSuccess("Page saved successfully!");

      // Redirect to page builder if creating a new page
      if (!isEditing) {
        router.push(`/pages/builder/${data._id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/pages");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Page" : "Create New Page"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Page Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter page title"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter page description"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-medium mb-1">
            URL Slug <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">/view/</span>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="page-url-slug"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to auto-generate from title
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Meta Tags</h3>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="metaTags.title"
                className="block text-sm font-medium mb-1"
              >
                Meta Title
              </label>
              <input
                type="text"
                id="metaTags.title"
                name="metaTags.title"
                value={formData.metaTags.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Meta title (defaults to page title if empty)"
              />
            </div>
            <div>
              <label
                htmlFor="metaTags.description"
                className="block text-sm font-medium mb-1"
              >
                Meta Description
              </label>
              <textarea
                id="metaTags.description"
                name="metaTags.description"
                value={formData.metaTags.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Meta description for search engines"
              />
            </div>
            <div>
              <label
                htmlFor="metaTags.keywords"
                className="block text-sm font-medium mb-1"
              >
                Keywords
              </label>
              <input
                type="text"
                id="metaTags.keywords"
                name="metaTags.keywords"
                value={formData.metaTags.keywords}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Comma-separated keywords"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center"
            disabled={loading}
          >
            <FiX className="mr-2" /> Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center hover:bg-blue-600"
            disabled={loading}
          >
            <FiSave className="mr-2" /> {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageForm;
