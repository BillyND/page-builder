"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  FiSave,
  FiEye,
  FiArrowLeft,
  FiSettings,
  FiRotateCcw,
  FiRotateCw,
  FiCheck,
  FiX,
} from "react-icons/fi";
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
  const [activeTab, setActiveTab] = useState<
    "elements" | "layers" | "styles" | "settings"
  >("elements");
  const [elements, setElements] = useState<PageElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageTitle, setPageTitle] = useState(initialData?.title || "");
  const [pageSlug, setPageSlug] = useState("");
  const [pageMetaTitle, setPageMetaTitle] = useState("");
  const [pageMetaDescription, setPageMetaDescription] = useState("");
  const [pageStatus, setPageStatus] = useState("draft");
  const [draggedElement, setDraggedElement] = useState<PageElement | null>(
    null
  );

  // Fetch page data when page loads
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch(`/api/pages/${pageId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch page data");
        }
        const pageData = await response.json();

        // Set page settings
        setPageTitle(pageData.title || "");
        setPageSlug(pageData.slug || "");
        setPageMetaTitle(pageData.metaTags?.title || "");
        setPageMetaDescription(pageData.metaTags?.description || "");
        setPageStatus(pageData.status || "draft");

        // Set page content
        if (pageData.content) {
          try {
            const parsedContent = JSON.parse(pageData.content) as PageStructure;
            setElements(parsedContent.elements || []);
          } catch (err) {
            console.error("Error parsing page content:", err);
            setError("Failed to load page content");
          }
        }
      } catch (err) {
        console.error("Error fetching page data:", err);
        setError("Failed to load page data");
      }
    };

    fetchPageData();
  }, [pageId]);

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle element selection
  const handleSelectElement = useCallback((id: string) => {
    setSelectedElementId(id);
    setActiveTab("styles");
  }, []);

  // Find element by ID recursively
  const findElementById = useCallback(
    (id: string, elementsArray = elements): PageElement | null => {
      for (const element of elementsArray) {
        if (element.id === id) {
          return element;
        }
        if (element.children?.length) {
          const found = findElementById(id, element.children);
          if (found) return found;
        }
      }
      return null;
    },
    [elements]
  );

  // Update element in the tree
  const updateElementInTree = useCallback(
    (
      elementsArray: PageElement[],
      id: string,
      updater: (element: PageElement) => PageElement
    ): PageElement[] => {
      return elementsArray.map((element) => {
        if (element.id === id) {
          return updater(element);
        }
        if (element.children?.length) {
          return {
            ...element,
            children: updateElementInTree(element.children, id, updater),
          };
        }
        return element;
      });
    },
    []
  );

  // Remove element from the tree
  const removeElementFromTree = useCallback(
    (elementsArray: PageElement[], id: string): PageElement[] => {
      const filtered = elementsArray.filter((element) => element.id !== id);
      return filtered.map((element) => {
        if (element.children?.length) {
          return {
            ...element,
            children: removeElementFromTree(element.children, id),
          };
        }
        return element;
      });
    },
    []
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setIsDragging(true);

    // If dragging an existing element, select it
    if (typeof active.id === "string" && active.id.startsWith("element-")) {
      const elementId = active.id.replace("element-", "");
      const element = findElementById(elementId);
      setDraggedElement(element);
      setSelectedElementId(elementId);
    } else if (active.id.toString().startsWith("template-")) {
      // If dragging a template
      const type = active.id.toString().replace("template-", "");
      const template = elementTemplates.find((t) => t.type === type);
      if (template) {
        // Create a temporary element for preview
        const tempElement = createElementFromTemplate(template);
        setDraggedElement(tempElement);
      }
      // Deselect any selected element
      setSelectedElementId(null);
    }
  };

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle dropping into container
    if (over.id !== "canvas" && over.id !== active.id) {
      const overId = over.id as string;
      const activeId = active.id as string;

      // Check if over item is a container
      const overElementId = overId.startsWith("element-")
        ? overId.replace("element-", "")
        : overId;

      const overElement = findElementById(overElementId);

      if (overElement?.type === ElementType.CONTAINER) {
        // Handle template drop
        if (activeId.startsWith("template-")) {
          const type = activeId.replace("template-", "");
          const template = elementTemplates.find((t) => t.type === type);

          if (template) {
            const newElement = createElementFromTemplate(template);

            // Update the container to include the new element
            setElements((prev) =>
              updateElementInTree(prev, overElement.id, (container) => ({
                ...container,
                children: [...(container.children || []), newElement],
              }))
            );

            setSelectedElementId(newElement.id);
            setActiveTab("styles");
          }
        }
        // Handle existing element drop
        else if (activeId.startsWith("element-")) {
          const elementId = activeId.replace("element-", "");
          const draggedElement = findElementById(elementId);

          if (draggedElement) {
            // Remove the element from its current position
            setElements((prev) => removeElementFromTree(prev, elementId));

            // Add it to the container
            setElements((prev) =>
              updateElementInTree(prev, overElement.id, (container) => ({
                ...container,
                children: [...(container.children || []), draggedElement],
              }))
            );
          }
        }
      }
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    setActiveId(null);
    setDraggedElement(null);

    if (!over) return;

    // If dropped over the canvas
    if (over.id === "canvas") {
      const activeId = active.id as string;

      // Handle template drop
      if (activeId.startsWith("template-")) {
        const type = activeId.replace("template-", "");
        const template = elementTemplates.find((t) => t.type === type);

        if (template) {
          // Create a new element from the template
          const newElement = createElementFromTemplate(template);
          setElements((prev) => [...prev, newElement]);
          setSelectedElementId(newElement.id);
          setActiveTab("styles");
        }
      }
      // Handle reordering elements
      else if (active.id !== over.id && activeId.startsWith("element-")) {
        const elementId = activeId.replace("element-", "");

        setElements((prev) => {
          const oldIndex = prev.findIndex((el) => el.id === elementId);
          const newIndex = prev.length; // Default to end of list

          return arrayMove(prev, oldIndex, newIndex);
        });
      }
    }
    // If dropped over another element (for sorting)
    else if (active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;

      if (activeId.startsWith("element-") && overId.startsWith("element-")) {
        const activeElementId = activeId.replace("element-", "");
        const overElementId = overId.replace("element-", "");

        // If these are both top-level elements, reorder them
        setElements((prev) => {
          const oldIndex = prev.findIndex((el) => el.id === activeElementId);
          const newIndex = prev.findIndex((el) => el.id === overElementId);

          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(prev, oldIndex, newIndex);
          }

          return prev;
        });
      }
    }
  };

  // Handle element duplication
  const handleDuplicateElement = (id: string) => {
    const elementToDuplicate = findElementById(id);
    if (!elementToDuplicate) return;

    const duplicatedElement = {
      ...JSON.parse(JSON.stringify(elementToDuplicate)),
      id: uuidv4(),
      name: `${elementToDuplicate.name} (Copy)`,
    };

    // Find if this is a top-level element or a child
    const isTopLevel = elements.some((el) => el.id === id);

    if (isTopLevel) {
      // Add to top level
      setElements((prev) => [...prev, duplicatedElement]);
    } else {
      // Find the parent container and add to its children
      for (const element of elements) {
        if (element.children?.some((child) => child.id === id)) {
          setElements((prev) =>
            updateElementInTree(prev, element.id, (container) => ({
              ...container,
              children: [...(container.children || []), duplicatedElement],
            }))
          );
          break;
        }
      }
    }

    setSelectedElementId(duplicatedElement.id);
  };

  // Handle element deletion
  const handleDeleteElement = (id: string) => {
    setElements((prev) => removeElementFromTree(prev, id));

    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  // Handle style changes with debounce
  const handleStyleChange = useCallback(
    (property: string, value: string) => {
      if (!selectedElementId) return;

      setElements((prev) =>
        updateElementInTree(prev, selectedElementId, (element) => {
          // Special case for spacer height
          if (element.type === ElementType.SPACER && property === "height") {
            return {
              ...element,
              height: value,
            };
          }

          // Regular style property
          return {
            ...element,
            styles: {
              ...element.styles,
              [property]: value,
            },
          };
        })
      );
    },
    [selectedElementId, updateElementInTree]
  );

  // Save page content and settings
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
          title: pageTitle,
          slug: pageSlug,
          metaTags: {
            title: pageMetaTitle,
            description: pageMetaDescription,
          },
          status: pageStatus,
          content: JSON.stringify(pageStructure),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save page");
      }

      // Show success notification or feedback
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
    window.open(`/pages/view/${pageSlug || pageId}`, "_blank");
  };

  // Handle publishing page
  const handlePublish = async () => {
    setPageStatus("published");
    // Save immediately after status change
    await handleSave();
  };

  // Handle unpublishing page
  const handleUnpublish = async () => {
    setPageStatus("draft");
    // Save immediately after status change
    await handleSave();
  };

  // Go back to pages list
  const handleBack = () => {
    router.push("/pages");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1"
              aria-label="Go back"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold truncate max-w-md">
              {pageTitle || "Page Builder"}
            </h1>
          </div>
          <div className="flex space-x-3">
            <div className="flex space-x-2 mr-4">
              <button
                onClick={() => {
                  // Implement undo functionality here
                  console.log("Undo clicked");
                }}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Undo"
                title="Undo"
              >
                <FiRotateCcw size={18} />
              </button>
              <button
                onClick={() => {
                  // Implement redo functionality here
                  console.log("Redo clicked");
                }}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Redo"
                title="Redo"
              >
                <FiRotateCw size={18} />
              </button>
            </div>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-2 ${
                activeTab === "settings"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } rounded-md flex items-center transition-colors shadow-sm`}
              aria-label="Page settings"
            >
              <FiSettings className="mr-1" size={16} /> Settings
            </button>
            <button
              onClick={handlePreview}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center transition-colors shadow-sm"
              aria-label="Preview page"
            >
              <FiEye className="mr-1" size={16} /> Preview
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center transition-colors shadow-sm ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              aria-label="Save page"
            >
              <FiSave className="mr-2" size={16} />
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-2 rounded-md">
          <p className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          <SortableContext
            items={elements.map((e) => `element-${e.id}`)}
            strategy={verticalListSortingStrategy}
          >
            <Sidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              elements={elements}
              selectedElementId={selectedElementId}
              onSelectElement={handleSelectElement}
              isDragging={isDragging}
              activeId={activeId}
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
                      ? findElementById(selectedElementId)
                      : null
                  }
                  onStyleChange={handleStyleChange}
                />
              </div>
            )}
            {activeTab === "settings" && (
              <div className="w-80 border-l bg-white overflow-y-auto">
                <div className="p-4">
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                      Page Settings
                    </h2>
                    <p className="text-sm text-gray-500">
                      Configure page properties
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className="flex space-x-2">
                      <button
                        className={`px-3 py-2 ${
                          pageStatus === "published"
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-800"
                        } rounded-md flex items-center`}
                        onClick={handlePublish}
                      >
                        <FiCheck className="mr-1" size={14} />
                        Publish
                      </button>
                      <button
                        className={`px-3 py-2 ${
                          pageStatus === "draft"
                            ? "bg-gray-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        } rounded-md flex items-center`}
                        onClick={handleUnpublish}
                      >
                        <FiX className="mr-1" size={14} />
                        Unpublish
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="page-url-slug"
                      value={pageSlug}
                      onChange={(e) => setPageSlug(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Will be accessible at /pages/view/[slug]
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Page Title"
                      value={pageMetaTitle}
                      onChange={(e) => setPageMetaTitle(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Brief description for search engines"
                      value={pageMetaDescription}
                      onChange={(e) => setPageMetaDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </SortableContext>

          {/* Drag overlay for drag preview */}
          <DragOverlay>
            {draggedElement && (
              <div className="opacity-70 pointer-events-none border-2 border-dashed border-blue-400 bg-blue-50 p-4 rounded">
                <div className="text-sm text-blue-600 font-medium">
                  {draggedElement.name}
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default PageBuilder;
