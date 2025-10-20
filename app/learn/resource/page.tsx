"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Image,
  FileSpreadsheet,
  FileArchive,
  File,
  Download,
  Search,
} from "lucide-react";
import { Button, Input, Pagination, addToast } from "@heroui/react";
import { useDebounce } from "@/hooks/useDebounce";
import { format } from "date-fns";

// --- API and Types (Assuming these are available via import) ---
import { Document as Doc, DocumentApi } from "@/hooks/learn/document-api";

// DTO based on backend response: { count: number, rows: Doc[] }
export interface IPaginatedDocuments {
  count: number;
  rows: Doc[];
}

const documentApi = DocumentApi();

// =======================================================
// ⭐ Resource Page Component (Card Display for Users)
// =======================================================
export default function ResourcePage() {
  // --- Pagination/Filter State (simplified for client use) ---
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage] = useState(12); // Fixed row size for the grid display
  const [sortDescriptor] = useState({
    // Default sort order
    column: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const debouncedFilterValue = useDebounce(filterValue, 500);

  // Dynamic Query Key
  const queryKey = useMemo(
    () => [
      "documents-client",
      page,
      rowsPerPage,
      debouncedFilterValue,
      sortDescriptor,
    ],
    [page, rowsPerPage, debouncedFilterValue, sortDescriptor],
  );

  // --- Data Fetching (useQuery) ---
  const {
    data: documentsResponse,
    isLoading,
    isError,
  } = useQuery<IPaginatedDocuments>({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(rowsPerPage),
          sortBy: sortDescriptor.column,
          sortOrder: sortDescriptor.direction === "ascending" ? "asc" : "desc",
        });
        if (debouncedFilterValue) params.set("search", debouncedFilterValue);

        const queryString = `?${params.toString()}`;
        const res = await documentApi.getDocuments(queryString);

        return res as IPaginatedDocuments;
      } catch (error) {
        addToast({ title: "Failed to load documents", color: "danger" });
        throw error;
      }
    },
  });

  const documents = documentsResponse?.rows || [];
  const totalDocuments = documentsResponse?.count || 0;
  const totalPages = Math.ceil(totalDocuments / rowsPerPage);

  // --- Utilities ---
  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string | undefined) => {
    if (!type) return <File size={28} className="text-gray-500" />;

    const lowerType = type.toLowerCase();

    if (lowerType.includes("pdf"))
      return <FileText size={28} className="text-red-600" />;
    if (lowerType.includes("image"))
      return <Image size={28} className="text-green-600" />;
    if (lowerType.includes("spreadsheet") || lowerType.includes("excel"))
      return <FileSpreadsheet size={28} className="text-emerald-600" />;
    if (lowerType.includes("zip") || lowerType.includes("compressed"))
      return <FileArchive size={28} className="text-yellow-600" />;
    return <File size={28} className="text-blue-600" />;
  };

  // --- Render Logic (using the same loading/error checks as the admin page) ---

  if (isLoading)
    return (
      <div className="min-h-screen p-8 flex justify-center items-center">
        <span className="text-lg text-gray-600 dark:text-gray-300">
          Loading resources...
        </span>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen p-8 flex justify-center items-center text-red-500">
        <p>❌ Error loading documents. Please try again.</p>
      </div>
    );

  const handleSearchChange = (value?: string) => {
    setFilterValue(value || "");
    setPage(1);
  };

  return (
    <div className="min-h-screen p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          📚 Available Resources
        </h1>

        {/* Search Bar */}
        <div className="mb-8 max-w-lg">
          <Input
            isClearable
            placeholder="Search documents by title or description..."
            startContent={<Search size={20} />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={handleSearchChange}
          />
        </div>

        {/* Empty State */}
        {documents.length === 0 && (
          <div className="flex justify-center items-center h-64 flex-col text-gray-500">
            <File size={48} className="mb-4" />
            <p className="text-xl">No documents match your search.</p>
          </div>
        )}

        {/* Document Card Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {documents.map((doc: Doc) => (
            <div
              key={doc.id}
              className="group flex flex-col justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl"
            >
              {/* File Icon & Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 p-3 rounded-xl border border-gray-300 dark:border-gray-600">
                  {getFileIcon(doc.fileType)}
                </div>
                <div className="flex-grow">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                    {doc.title || "Untitled"}
                  </h2>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 min-h-[40px] line-clamp-2">
                {doc.description || "No description provided."}
              </p>

              {/* Meta Info */}
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Type:
                  </span>
                  <span className="truncate ml-2">{doc.fileType || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Size:
                  </span>
                  <span>{formatFileSize(doc.fileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Date:
                  </span>
                  <span>{format(new Date(doc.createdAt), "dd MMM yyyy")}</span>
                </div>
              </div>

              {/* Action Button */}
              {doc.fileUrl ? (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full"
                >
                  <Button
                    color="primary"
                    variant="shadow"
                    className="w-full"
                    startContent={<Download size={18} />}
                  >
                    Download
                  </Button>
                </a>
              ) : (
                <Button disabled className="mt-6 w-full">
                  File Not Available
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Pagination at the bottom */}
        {totalDocuments > rowsPerPage && (
          <div className="py-8 px-2 flex justify-center items-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={totalPages || 1}
              onChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
