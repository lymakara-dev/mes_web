"use client";

import { useApi } from "@/service/useApi";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Image,
  FileSpreadsheet,
  FileArchive,
  File,
} from "lucide-react";

export default function ResourcePage() {
  const { getDocuments } = useApi();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["Documents"],
    queryFn: getDocuments,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Loading documents...
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load documents 😢
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No documents available yet 📄
      </div>
    );

  // Utility to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Utility to choose icon by type
  const getFileIcon = (type: string) => {
    if (type.includes("pdf"))
      return <FileText size={28} className="text-red-500" />;
    if (type.includes("image"))
      return <Image size={28} className="text-green-500" />;
    if (type.includes("spreadsheet") || type.includes("excel"))
      return <FileSpreadsheet size={28} className="text-emerald-500" />;
    if (type.includes("zip") || type.includes("compressed"))
      return <FileArchive size={28} className="text-yellow-500" />;
    return <File size={28} className="text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
          📚 Learning Resources
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((doc: any) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200"
            >
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl">
                  {getFileIcon(doc.fileType)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {doc.title || "Untitled Document"}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {doc.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="mt-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    Type:
                  </span>{" "}
                  {doc.fileType}
                </p>
                <p>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    Size:
                  </span>{" "}
                  {formatFileSize(doc.fileSize)}
                </p>
                {/* <p>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    Uploaded By:
                  </span>{" "}
                  User #{doc.uploadedBy}
                </p> */}
                <p>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    Created:
                  </span>{" "}
                  {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Action Button */}
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                View / Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
