"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  useDisclosure,
  addToast,
  Card,
  Modal, // Import Modal for the new UX
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  Trash2,
  Edit,
  Search,
  ChevronDown,
  Plus,
  MoreVertical,
} from "lucide-react";
import {
  Document as Doc,
  DocumentApi,
  CreateDocumentDto,
  UpdateDocumentDto,
} from "@/hooks/learn/document-api";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { useDebounce } from "@/hooks/useDebounce";
import { format } from "date-fns";

// --- API and Constants ---
const documentApi = DocumentApi();

// DTO based on backend response: { count: number, rows: Doc[] }
export interface IPaginatedDocuments {
  count: number;
  rows: Doc[];
}

const columns = [
  { name: "TITLE", uid: "title", sortable: true },
  { name: "DESCRIPTION", uid: "description" },
  { name: "SIZE (KB)", uid: "fileSize", sortable: true },
  { name: "UPLOADED BY", uid: "uploadedBy" },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["title", "fileSize", "createdAt", "actions"];

// =======================================================
// ⭐ FIXED: Document Form Modal Component
// =======================================================
interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Doc | null;
  queryKey: (string | number | { column: string; direction: string })[];
}

const DocumentFormModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  initialData,
  queryKey,
}) => {
  const queryClient = useQueryClient();

  const isEditing = !!initialData;

  // --- Form State ---
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [file, setFile] = useState<File | null>(null);
  // ⭐ NEW STATE: Used to completely reset the file input element
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  React.useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens, based on initialData
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
      setFile(null);
      // ⭐ FIX 1: Reset the input key to force re-render/clear the browser's file selection
      setFileInputKey(Date.now());
    }
  }, [isOpen, initialData]);

  // --- Mutations (useMutation logic is fine, no changes needed) ---
  const { mutate: saveDocument, isPending: isSaving } = useMutation({
    mutationFn: ({
      id,
      title,
      description,
      file,
    }: {
      id: number | null;
      title: string;
      description: string;
      file?: File;
    }) => {
      // ... (mutation logic remains the same)
      const dto: UpdateDocumentDto = { title, description };
      if (id) {
        return documentApi.updateDocument(id, dto, file);
      }
      const createDto: CreateDocumentDto = { title, description };
      return documentApi.createDocument(createDto, file);
    },
    onSuccess: (_, variables) => {
      addToast({
        title: "Success",
        description: `Document ${variables.id ? "updated" : "created"}.`,
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey });
      onClose();
    },
    onError: (err: any) => {
      addToast({
        title: "Failed to save document",
        description: err.message || "An unknown error occurred.",
        color: "danger",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      addToast({ title: "Title is required", color: "warning" });
      return;
    }

    saveDocument({
      id: initialData?.id || null,
      title,
      description,
      file: file || undefined,
    });
  };

  const fileInputLabel = useMemo(() => {
    if (file) {
      return `Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    }
    if (isEditing && initialData?.fileUrl) {
      const urlParts = initialData.fileUrl.split("/");
      const fileName = urlParts.pop() || initialData.title;
      return `Current File: ${fileName}. Choose a new file to replace it.`;
    }
    return isEditing ? "Change File (Optional)" : "Choose a file to upload.";
  }, [file, isEditing, initialData]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              {isEditing ? "Edit Document" : "Create New Document"}
            </ModalHeader>
            <ModalBody>
              <Input
                label="Title"
                placeholder="Enter document title"
                value={title}
                onValueChange={setTitle}
                isRequired
                autoFocus
              />
              <Input
                label="Description (Optional)"
                placeholder="Brief description of the document"
                value={description}
                onValueChange={setDescription}
              />

              {/* ⭐ FIX 2: Added the key to force input reset */}
              <Input
                key={fileInputKey}
                type="file"
                label={fileInputLabel}
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                type="button"
                isDisabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isSaving}
                startContent={<Save size={18} />}
              >
                {isEditing ? "Update Document" : "Upload Document"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

// =======================================================
// ⭐ Main Component
// =======================================================
export default function DocumentManagementPage() {
  const queryClient = useQueryClient();

  // --- Table State (Controls) ---
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<"all" | Set<React.Key>>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const debouncedFilterValue = useDebounce(filterValue, 500);

  // --- Modal State (UPDATED) ---
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onOpenChange: onFormOpenChange,
  } = useDisclosure(); // New disclosure for the form modal
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();

  const [selectedDocument, setSelectedDocument] = useState<Doc | null>(null);
  const [deleteDocumentId, setDeleteDocumentId] = useState<number | null>(null);

  // Dynamic Query Key
  const queryKey = useMemo(
    () => [
      "documents",
      page,
      rowsPerPage,
      debouncedFilterValue,
      sortDescriptor,
    ],
    [page, rowsPerPage, debouncedFilterValue, sortDescriptor],
  );

  // --- Data Fetching (useQuery) ---
  const { data: documentsResponse, isLoading } = useQuery<IPaginatedDocuments>({
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

  // --- Handlers (UPDATED) ---
  const handleOpenCreate = () => {
    setSelectedDocument(null); // Clear selection for create mode
    onFormOpen();
  };

  const handleEdit = (doc: Doc) => {
    setSelectedDocument(doc);
    onFormOpen(); // Open the modal
  };

  const handleOpenDelete = (docId: number) => {
    setDeleteDocumentId(docId);
    onConfirmOpen();
  };

  // --- Delete Mutation (Re-used from previous code) ---
  const { mutate: deleteDocument, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => documentApi.deleteDocument(id),
    onSuccess: () => {
      addToast({ title: "Document deleted", color: "success" });
      queryClient.invalidateQueries({ queryKey });
      onConfirmOpenChange();
      setDeleteDocumentId(null);
    },
    onError: (err: any) => {
      addToast({
        title: "Failed to delete document",
        description: err.message || "An unknown error occurred.",
        color: "danger",
      });
    },
  });

  const handleDeleteConfirm = () => {
    if (deleteDocumentId !== null) {
      deleteDocument(deleteDocumentId);
    }
  };

  // --- Table Content Helpers (No change needed here) ---
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((col) =>
      Array.from(visibleColumns).includes(col.uid),
    );
  }, [visibleColumns]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
    setPage(1);
  }, []);

  const renderCell = useCallback((doc: Doc, columnKey: React.Key) => {
    const cellValue = (doc as any)[columnKey as any];
    // ... (renderCell logic remains the same, using handleEdit) ...
    switch (columnKey) {
      case "title":
        return (
          <div className="flex flex-col">
            <span className="font-semibold">{doc.title}</span>
            {doc.fileUrl && (
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 text-xs hover:underline"
              >
                View File ({doc.fileType})
              </a>
            )}
          </div>
        );
      case "description":
        return (
          <span className="text-sm text-gray-500 line-clamp-2">
            {doc.description || "-"}
          </span>
        );
      case "fileSize":
        return <span>{((doc.fileSize || 0) / 1024).toFixed(2)}</span>;
      case "createdAt":
        return (
          <span className="text-sm text-gray-500">
            {format(new Date(cellValue), "dd MMM yyyy")}
          </span>
        );
      case "uploadedBy":
        return <span>ID: {doc.uploadedBy}</span>;
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MoreVertical />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Document Actions">
                <DropdownItem
                  key="edit"
                  onPress={() => handleEdit(doc)} // Calls handler to open modal
                  startContent={<Edit size={16} />}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onPress={() => handleOpenDelete(doc.id)}
                  startContent={<Trash2 size={16} />}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  // --- Top Content (UPDATED button action) ---
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by title or description..."
            startContent={<Search />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDown />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns as any}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid}>{column.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* ⭐ UPDATED: Button opens the modal */}
            <Button
              color="primary"
              endContent={<Plus />}
              onPress={handleOpenCreate}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalDocuments} documents
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none"
              onChange={onRowsPerPageChange}
              defaultValue={rowsPerPage}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    onSearchChange,
    totalDocuments,
    rowsPerPage,
  ]);

  // --- Bottom Content (Pagination) ---
  const bottomContent = useMemo(() => {
    const totalPages = Math.ceil(totalDocuments / rowsPerPage);

    return (
      <div className="py-2 px-2 flex justify-center items-center">
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
    );
  }, [page, totalDocuments, rowsPerPage]);

  return (
    <>
      {/* ⭐ NEW: Document Form Modal */}
      <DocumentFormModal
        isOpen={isFormOpen}
        onClose={onFormOpenChange}
        initialData={selectedDocument}
        queryKey={queryKey}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Document"
        message={`Are you sure you want to permanently delete the document: **${documents.find((d: any) => d.id === deleteDocumentId)?.title || "this document"}**? This action cannot be undone.`}
      />

      <main className="min-h-screen p-8 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">Document Management</h1>

          {/* ⭐ REMOVED: The Card containing the form is gone from the main page body */}

          {/* Document Table */}
          <Table
            isHeaderSticky
            aria-label="Document management table"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            sortDescriptor={sortDescriptor as any}
            topContent={topContent}
            topContentPlacement="outside"
            onSortChange={setSortDescriptor as any}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={"No documents found"}
              items={documents}
              isLoading={isLoading}
            >
              {(item: Doc) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  );
}
