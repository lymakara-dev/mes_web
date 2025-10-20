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
  Chip,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, MoreVertical, Search, ChevronDown, Save } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { format } from "date-fns";
import { Subject, SubjectApi } from "@/hooks/learn/subject-api";
import { School, SchoolApi } from "@/hooks/learn/school-api";
import { ConfirmationModal } from "@/components/common/confirmation-modal";

// --- Subject & School Types/APIs (Assumed) ---
interface IPaginatedSubjects {
  count: number;
  rows: Subject[];
}

// NOTE: These are assumed API hooks and may need adjustment based on your environment
const subjectApi = SubjectApi();
const schoolApi = SchoolApi();

// --- Subject Modal Component (Inserted from Section 1) ---

interface SubjectModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (
    id: number | null,
    name: string,
    schoolId: number,
    file?: File,
  ) => void;
  isLoading: boolean;
  initialData: Subject | null;
  schools: School[]; // Pass school data to the modal
}

// PASTE THE FIXED SubjectModal COMPONENT CODE HERE (from Section 1)
const SubjectModal = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  initialData,
  schools,
}: SubjectModalProps) => {
  const isEditing = !!initialData;

  // Local form state
  const [name, setName] = useState("");
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        setName(initialData.name);
        setSchoolId(initialData.schoolId);
        setFile(null);
      } else {
        setName("");
        // Set a default school if available, otherwise null
        setSchoolId(schools.length > 0 ? schools[0].id : null);
        setFile(null);
      }
    }
  }, [isOpen, initialData, isEditing, schools]);

  const handleSubmitInternal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || schoolId === null) {
      addToast({
        title: "Validation Error",
        description: "Name and School are required.",
        color: "warning",
      });
      return;
    }
    if (!isEditing && !file) {
      addToast({
        title: "Validation Error",
        description: "Subject Image is required for new subjects.",
        color: "warning",
      });
      return;
    }

    onSubmit(initialData?.id || null, name, schoolId, file || undefined);
  };

  const hasSchools = schools && schools.length > 0;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {() => (
          // FIX #1: onMouseDown for robust modal dismissal prevention
          <form
            onSubmit={handleSubmitInternal}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              {isEditing ? "Edit Subject" : "Create New Subject"}
            </ModalHeader>
            <ModalBody>
              <Input
                label="Subject Name"
                placeholder="Enter subject name"
                value={name}
                onValueChange={setName}
                isRequired
                autoFocus
              />

              {/* FIX #2: Conditional rendering for school data availability */}
              {hasSchools ? (
                <Select
                  label="School"
                  placeholder="Select school"
                  selectedKeys={
                    schoolId !== null
                      ? new Set([schoolId.toString()])
                      : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const firstKey = Array.from(keys)[0];
                    setSchoolId(firstKey ? Number(firstKey) : null);
                  }}
                  isRequired
                >
                  {schools.map((school) => (
                    // FIX #3: Explicitly binding key as a string
                    <SelectItem key={school.id.toString()}>
                      {school.name}
                    </SelectItem>
                  ))}
                </Select>
              ) : (
                <div className="text-center p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-500">
                    Loading schools or school list is empty.
                  </p>
                </div>
              )}

              <Input
                type="file"
                label={isEditing ? "Change Image (Optional)" : "Subject Image"}
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
                isRequired={!isEditing}
              />
              {isEditing && initialData?.logoUrl && (
                <p className="text-sm text-gray-500">
                  Current Image:{" "}
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
  { name: "SCHOOL", uid: "schoolName" },
  { name: "ID", uid: "id", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["name", "schoolName", "actions"];

// ====================================================================
//                          SUBJECT MANAGEMENT PAGE
// ====================================================================

export default function SubjectManagementPage() {
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

  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);

  // --- Data Fetching: Schools (All for Select) ---
  const { data: schools = [], isLoading: isLoadingSchools } = useQuery<
    School[]
  >({
    queryKey: ["schools"],
    queryFn: schoolApi.getAll,
    staleTime: 1000 * 60 * 5, // Cache school list for 5 minutes
  });

  // --- Data Fetching: Subjects (Full list, then client-side pagination) ---
  const { data: subjectsData = [], isLoading } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: subjectApi.getAll,
  });

  // --- Mutations (Create/Update/Delete) ---
  const { mutate: processSubject, isPending: isProcessing } = useMutation({
    mutationFn: ({
      id,
      name,
      schoolId,
      file,
    }: {
      id: number | null;
      name: string;
      schoolId: number;
      file?: File;
    }) => {
      if (id) {
        return subjectApi.update(id, name, schoolId, file);
      }
      return subjectApi.create(name, schoolId, file!);
    },
    onSuccess: (data, variables) => {
      addToast({
        title: "Success",
        description: `Subject ${variables.id ? "updated" : "created"}.`,
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      onFormOpenChange();
    },
    onError: (err: any) =>
      addToast({
        title: "Error",
        description: err.response?.data?.message || "Operation failed.",
        color: "danger",
      }),
  });

  const { mutate: deleteSubject, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => subjectApi.remove(id),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: "Subject deleted.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      onConfirmOpenChange();
    },
    onError: (err: any) =>
      addToast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete subject.",
        color: "danger",
      }),
  });

  // --- Handlers ---
  const handleOpenCreate = () => {
    setActiveSubject(null);
    onFormOpen();
  };
  const handleOpenEdit = (subject: Subject) => {
    setActiveSubject(subject);
    onFormOpen();
  };
  const handleOpenDelete = (subject: Subject) => {
    setActiveSubject(subject);
    onConfirmOpen();
  };

  const handleFormSubmit = (
    id: number | null,
    name: string,
    schoolId: number,
    file?: File,
  ) => {
    processSubject({ id, name, schoolId, file });
  };

  // --- Client-side Filtering, Sorting, and Pagination ---
  const filteredItems = useMemo(() => {
    let filteredSubjects = [...subjectsData];

    if (debouncedFilterValue) {
      filteredSubjects = filteredSubjects.filter(
        (subject) =>
          subject.name
            .toLowerCase()
            .includes(debouncedFilterValue.toLowerCase()) ||
          subject.id.toString().includes(debouncedFilterValue),
      );
    }
    return filteredSubjects;
  }, [subjectsData, debouncedFilterValue]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Subject] || "";
      const second = b[sortDescriptor.column as keyof Subject] || "";
      const cmp = String(first).localeCompare(String(second));

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const totalSubjects = sortedItems.length;
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const subjectResponse: IPaginatedSubjects = {
    count: totalSubjects,
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

  const renderCell = useCallback(
    (subject: Subject, columnKey: React.Key) => {
      const school = schools.find((s) => s.id === subject.schoolId);

      switch (columnKey) {
        case "name":
          return (
            <div className="flex items-center gap-3">
              {subject.logoUrl && (
                <img
                  src={subject.logoUrl}
                  alt={subject.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="font-semibold">{subject.name}</span>
            </div>
          );
        case "schoolName":
          return (
            <Chip size="sm" variant="flat">
              {school?.name || "Unknown School"}
            </Chip>
          );
        case "id":
          return <span className="text-sm text-gray-500">#{subject.id}</span>;
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <MoreVertical />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Subject Actions">
                  <DropdownItem
                    key="edit"
                    onPress={() => handleOpenEdit(subject)}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onPress={() => handleOpenDelete(subject)}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return null;
      }
    },
    [schools],
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by subject name or ID..."
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
              Add New Subject
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalSubjects} subjects
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
    totalSubjects,
    rowsPerPage,
    handleOpenCreate,
  ]);

  const bottomContent = useMemo(() => {
    const totalPages = Math.ceil(totalSubjects / rowsPerPage);
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
  }, [page, totalSubjects, rowsPerPage]);

  return (
    <>
      <SubjectModal
        isOpen={isFormOpen}
        onOpenChange={onFormOpenChange}
        onSubmit={handleFormSubmit}
        isLoading={isProcessing}
        initialData={activeSubject}
        schools={schools}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        onConfirm={() => deleteSubject(activeSubject!.id)}
        isLoading={isDeleting}
        title="Delete Subject"
        message={`Are you sure you want to permanently delete the subject "${activeSubject?.name}"?`}
      />

      <main className="min-h-screen p-8 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">Subject Management</h1>
          <Table
            isHeaderSticky
            aria-label="Subject management table"
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
              emptyContent={"No subjects found"}
              items={subjectResponse?.rows || []}
              isLoading={isLoading || isLoadingSchools}
            >
              {(item: Subject) => (
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
