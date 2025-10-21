"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, MoreVertical, Search, ChevronDown, Save, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { format } from "date-fns";
import { School, SchoolApi } from "@/hooks/learn/school-api"; // Assuming your API hook
import { ConfirmationModal } from "@/components/common/confirmation-modal";

// --- School Types/APIs (Assumed) ---
// We assume SchoolApi methods exist and return simple data arrays.
// For the Table, we'll implement pagination logic locally as the API wasn't shown
// to return a paginated response like { count: number, rows: School[] }.
interface IPaginatedSchools {
  count: number;
  rows: School[];
}

const schoolApi = SchoolApi();

// --- School Modal Component ---

interface SchoolModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (id: number | null, name: string, file?: File) => void;
  isLoading: boolean;
  initialData: School | null;
}

const SchoolModal = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  initialData,
}: SchoolModalProps) => {
  const isEditing = !!initialData;

  // Local form state
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        setName(initialData.name);
        setFile(null); // File must be re-uploaded to change
      } else {
        setName("");
        setFile(null);
      }
    }
  }, [isOpen, initialData, isEditing]);

  const handleSubmitInternal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      addToast({
        title: "Validation Error",
        description: "School Name is required.",
        color: "warning",
      });
      return;
    }
    if (!isEditing && !file) {
      addToast({
        title: "Validation Error",
        description: "School Logo Image is required for new schools.",
        color: "warning",
      });
      return;
    }

    onSubmit(initialData?.id || null, name, file || undefined);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {() => (
          <form onSubmit={handleSubmitInternal}>
            <ModalHeader>
              {isEditing ? "Edit School" : "Create New School"}
            </ModalHeader>
            <ModalBody>
              <Input
                label="School Name"
                placeholder="Enter school name"
                value={name}
                onValueChange={setName}
                isRequired
                autoFocus
              />
              <Input
                type="file"
                label={isEditing ? "Change Logo (Optional)" : "School Logo"}
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
                isRequired={!isEditing}
              />
              {isEditing && initialData?.logoUrl && (
                <p className="text-sm text-gray-500">
                  Current Logo:{" "}
                  <a
                    href={initialData.logoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 underline"
                  >
                    View
                  </a>
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onOpenChange}>
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isLoading}
                startContent={<Save size={16} />}
              >
                {isEditing ? "Update" : "Create"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

// --- Table Setup ---

const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "ID", uid: "id", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["name", "id", "actions"];

// ====================================================================
//                          SCHOOL MANAGEMENT PAGE
// ====================================================================

export default function SchoolManagementPage() {
  const queryClient = useQueryClient();

  // --- Table State ---
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<"all" | Set<React.Key>>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const debouncedFilterValue = useDebounce(filterValue, 500);

  // --- Modal State ---
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onOpenChange: onFormOpenChange,
  } = useDisclosure();
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();

  const [activeSchool, setActiveSchool] = useState<School | null>(null);

  const queryKey = ["schools"]; // Fetch all, then filter/paginate client-side

  // --- Data Fetching: Schools (Full list, then client-side pagination) ---
  const { data: schoolsData = [], isLoading } = useQuery<School[]>({
    queryKey: queryKey,
    queryFn: schoolApi.getAll,
  });

  // --- Mutations ---
  const { mutate: processSchool, isPending: isProcessing } = useMutation({
    mutationFn: ({
      id,
      name,
      file,
    }: {
      id: number | null;
      name: string;
      file?: File;
    }) => {
      if (id) {
        return schoolApi.update(id, name, file);
      }
      return schoolApi.create(name, file!);
    },
    onSuccess: (data, variables) => {
      addToast({
        title: "Success",
        description: `School ${variables.id ? "updated" : "created"}.`,
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      onFormOpenChange();
    },
    onError: (err: any) =>
      addToast({
        title: "Error",
        description: err.response?.data?.message || "Operation failed.",
        color: "danger",
      }),
  });

  const { mutate: deleteSchool, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => schoolApi.remove(id),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "School deleted.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      onConfirmOpenChange();
    },
    onError: (err: any) =>
      addToast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete school.",
        color: "danger",
      }),
  });

  // --- Handlers ---
  const handleOpenCreate = () => {
    setActiveSchool(null);
    onFormOpen();
  };
  const handleOpenEdit = (school: School) => {
    setActiveSchool(school);
    onFormOpen();
  };
  const handleOpenDelete = (school: School) => {
    setActiveSchool(school);
    onConfirmOpen();
  };

  const handleFormSubmit = (id: number | null, name: string, file?: File) => {
    processSchool({ id, name, file });
  };

  // --- Client-side Filtering, Sorting, and Pagination ---
  const filteredItems = useMemo(() => {
    let filteredSchools = [...schoolsData];

    if (debouncedFilterValue) {
      filteredSchools = filteredSchools.filter(
        (school) =>
          school.name
            .toLowerCase()
            .includes(debouncedFilterValue.toLowerCase()) ||
          school.id.toString().includes(debouncedFilterValue),
      );
    }
    return filteredSchools;
  }, [schoolsData, debouncedFilterValue]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof School] || "";
      const second = b[sortDescriptor.column as keyof School] || "";
      const cmp = String(first).localeCompare(String(second));

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const totalSchools = sortedItems.length;
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const schoolResponse: IPaginatedSchools = {
    count: totalSchools,
    rows: paginatedItems,
  };

  // --- Table Content Helpers ---

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

  const renderCell = useCallback((school: School, columnKey: React.Key) => {
    const cellValue = (school as any)[columnKey as any];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            {school.logoUrl && (
              <img
                src={school.logoUrl}
                alt={school.name}
                className="w-8 h-8 rounded-full object-cover border"
              />
            )}
            <span className="font-semibold">{school.name}</span>
          </div>
        );
      case "id":
        return <span className="text-sm text-gray-500">#{cellValue}</span>;
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MoreVertical />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="School Actions">
                <DropdownItem key="edit" onPress={() => handleOpenEdit(school)}>
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onPress={() => handleOpenDelete(school)}
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

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by school name or ID..."
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
            <Button
              color="primary"
              endContent={<Plus />}
              onPress={handleOpenCreate}
            >
              Add New School
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalSchools} schools
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
    totalSchools,
    rowsPerPage,
    handleOpenCreate,
  ]);

  const bottomContent = useMemo(() => {
    const totalPages = Math.ceil(totalSchools / rowsPerPage);
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
  }, [page, totalSchools, rowsPerPage]);

  return (
    <>
      <SchoolModal
        isOpen={isFormOpen}
        onOpenChange={onFormOpenChange}
        onSubmit={handleFormSubmit}
        isLoading={isProcessing}
        initialData={activeSchool}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        onConfirm={() => deleteSchool(activeSchool!.id)}
        isLoading={isDeleting}
        title="Delete School"
        message={`Are you sure you want to permanently delete the school "${activeSchool?.name}"? This action cannot be undone.`}
      />

      <main className="min-h-screen p-8 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">School Management</h1>
          <Table
            isHeaderSticky
            aria-label="School management table"
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
              emptyContent={"No schools found"}
              items={schoolResponse?.rows || []}
              isLoading={isLoading}
            >
              {(item: School) => (
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
