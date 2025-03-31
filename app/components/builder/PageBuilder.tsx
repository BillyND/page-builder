"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { FiSave, FiEye, FiArrowLeft } from "react-icons/fi";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import StyleEditor from "./StyleEditor";
import { PageElement, PageStructure, ElementType } from "./types";
import {
  createElementFromTemplate,
  elementTemplates,
} from "./elementTemplates";

interface PageBuilderProps {
  pageId: string;
  initialData?: {
    title: string;
    content: string;
  };
}

const PageBuilder: React.FC<PageBuilderProps> = ({ pageId, initialData }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"elements" | "layers" | "styles">(
    "elements"
  );
  const [elements, setElements] = useState<PageElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageTitle] = useState(initialData?.title || "");

  // Initialize elements from saved content if available
  useEffect(() => {
    if (initialData?.content) {
      try {
        const parsedContent = JSON.parse(initialData.content) as PageStructure;
        setElements(parsedContent.elements || []);
      } catch (err) {
        console.error("Error parsing page content:", err);
        setError("Failed to load page content");
      }
    }
  }, [initialData]);

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before drag starts
      },
    })
  );

  // Handle element selection
  const handleSelectElement = useCallback((id: string) => {
    setSelectedElementId(id);
    setActiveTab("styles");
  }, []);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const isTemplate = active.data.current?.isTemplate;

    if (isTemplate) {
      // If dragging a template, deselect any selected element
      setSelectedElementId(null);
    } else {
      // If dragging an existing element, select it
      setSelectedElementId(active.id as string);
    }
  };

  // Handle drag over
  const handleDragOver = () => {
    // Handle container drop logic if needed
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // If dropped over the canvas
    if (over && over.id === "canvas") {
      const isTemplate = active.data.current?.isTemplate;
      const type = active.data.current?.type;

      if (isTemplate && type) {
        // Find the template for this element type
        const template = elementTemplates.find((t) => t.type === type);
        if (template) {
          // Create a new element from the template
          const newElement = createElementFromTemplate(template);
          setElements((prev) => [...prev, newElement]);
          setSelectedElementId(newElement.id);
          setActiveTab("styles");
        }
      }
    }
  };

  // Handle element duplication
  const handleDuplicateElement = (id: string) => {
    const elementToDuplicate = elements.find((el) => el.id === id);
    if (!elementToDuplicate) return;

    const duplicatedElement = {
      ...JSON.parse(JSON.stringify(elementToDuplicate)),
      id: uuidv4(),
      name: `${elementToDuplicate.name} (Copy)`,
    };

    setElements((prev) => [...prev, duplicatedElement]);
    setSelectedElementId(duplicatedElement.id);
  };

  // Handle element deletion
  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  // Handle style changes
  const handleStyleChange = (property: string, value: string) => {
    if (!selectedElementId) return;

    setElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedElementId) {
          // Special case for spacer height
          if (el.type === ElementType.SPACER && property === "height") {
            return {
              ...el,
              height: value,
            };
          }

          // Regular style property
          return {
            ...el,
            styles: {
              ...el.styles,
              [property]: value,
            },
          };
        }
        return el;
      })
    );
  };

  // Save page content
  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const pageStructure: PageStructure = {
        elements,
      };

      const response = await fetch(`/api/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: JSON.stringify(pageStructure),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save page");
      }

      // Show success message or redirect
      console.log("Page saved successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Preview page
  const handlePreview = () => {
    console.log("Page ID:", pageId);
    window.open(`/pages/view/${pageId}`, "_blank");
  };

  // Go back to pages list
  const handleBack = () => {
    router.push("/pages");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">
              {pageTitle || "Page Builder"}
            </h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center"
            >
              <FiEye className="mr-2" /> Preview
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center"
            >
              <FiSave className="mr-2" /> {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            elements={elements}
            selectedElementId={selectedElementId}
            onSelectElement={handleSelectElement}
          />
          <Canvas
            elements={elements}
            selectedElementId={selectedElementId}
            onSelectElement={handleSelectElement}
            onDuplicateElement={handleDuplicateElement}
            onDeleteElement={handleDeleteElement}
          />
          {activeTab === "styles" && (
            <div className="w-80 border-l bg-white overflow-y-auto">
              <StyleEditor
                element={
                  selectedElementId
                    ? elements.find((el) => el.id === selectedElementId) || null
                    : null
                }
                onStyleChange={handleStyleChange}
              />
            </div>
          )}
        </DndContext>
      </div>
    </div>
  );
};

export default PageBuilder;
