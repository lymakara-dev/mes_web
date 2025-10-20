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
  Chip,
  Tooltip, // Added Tooltip for long reasons
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Search, ChevronDown, Check, X } from "lucide-react"; // Updated icons
import apiService from "@/service/api";
import { useDebounce } from "@/hooks/useDebounce";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { format } from "date-fns";

// --- New Types based on your Report API response ---
// NOTE: You should place these in your '@/types/type.ts' file
export interface IReport {
  id: number;
  userId: number;
  questionId: number;
  reason: string;
  createdAt: string;
  updatedAt: string;
}
export interface IPaginatedReports {
  count: number;
  rows: IReport[];
}
// ----------------------------------------------------

const columns = [
  { name: "REPORT ID", uid: "id", sortable: true },
  { name: "QUESTION ID", uid: "questionId", sortable: true },
  { name: "USER ID", uid: "userId" },
  { name: "REASON", uid: "reason" },
  { name: "REPORTED AT", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "questionId",
  "reason",
  "createdAt",
  "actions",
];

export default function ReportManagementPage() {
  const queryClient = useQueryClient();

  // --- State ---
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

  // --- Modal State ---
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();

  const [activeReport, setActiveReport] = useState<IReport | null>(null);
  const [actionType, setActionType] = useState<"resolve" | "dismiss" | null>(
    null,
  );

  const queryKey = [
    "reports",
    page,
    rowsPerPage,
    debouncedFilterValue,
    sortDescriptor,
  ];

  // --- Data Fetching ---
  const { data: reportsResponse, isLoading } = useQuery<IPaginatedReports>({
    queryKey: queryKey,
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(rowsPerPage),
        sortBy: sortDescriptor.column,
        sortOrder: sortDescriptor.direction === "ascending" ? "asc" : "desc",
      });
      // Assuming search filter applies to the 'reason' or other default fields
      if (debouncedFilterValue) params.set("search", debouncedFilterValue);

      // FIX: Updated API endpoint for reports
      const res = await apiService.get(`/reports?${params.toString()}`);

      console.log("report data", res.data);
      return res.data; // Expecting { count: number, rows: IReport[] }
    },
  });

  // --- Mutations: Resolve/Dismiss (assuming DELETE is used for resolution/dismissal) ---
  const { mutate: processReport, isPending: isProcessing } = useMutation({
    // Assuming reports are deleted/resolved via a simple DELETE endpoint
    mutationFn: () => apiService.delete(`/reports/${activeReport?.id}`),
    onSuccess: () => {
      addToast({
        title: "Success",
        description: `Report ${actionType === "resolve" ? "resolved" : "dismissed"}.`,
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey });
      onConfirmOpenChange();
    },
    onError: (err: any) =>
      addToast({
        title: "Error",
        description: err.response?.data?.message || `Failed to process report.`,
        color: "danger",
      }),
  });

  // --- Handlers ---
  const handleOpenProcess = (report: IReport, type: "resolve" | "dismiss") => {
    setActiveReport(report);
    setActionType(type);
    onConfirmOpen();
  };

  const handleConfirmAction = () => {
    processReport();
  };

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

  const renderCell = useCallback((report: IReport, columnKey: React.Key) => {
    const cellValue = (report as any)[columnKey as any];
    switch (columnKey) {
      case "reason":
        // Show reason, use Chip and Tooltip if it's too long
        const reasonText = String(cellValue);
        const displayReason =
          reasonText.length > 30
            ? `${reasonText.substring(0, 30)}...`
            : reasonText;
        return (
          <Tooltip content={reasonText}>
            <Chip size="sm" variant="flat">
              {displayReason}
            </Chip>
          </Tooltip>
        );
      case "id":
      case "questionId":
      case "userId":
        return <span className="text-sm font-medium">{cellValue}</span>;
      case "createdAt":
        return (
          <span className="text-sm text-gray-500">
            {format(new Date(cellValue), "dd MMM yyyy, HH:mm")}
          </span>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MoreVertical />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Report Actions">
                <DropdownItem
                  key="resolve"
                  startContent={<Check size={16} />}
                  onPress={() => handleOpenProcess(report, "resolve")}
                >
                  Mark as Resolved
                </DropdownItem>
                <DropdownItem
                  key="dismiss"
                  className="text-danger"
                  color="danger"
                  startContent={<X size={16} />}
                  onPress={() => handleOpenProcess(report, "dismiss")}
                >
                  Dismiss Report
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
    // FIX: Use 'count' from API response and calculate totalPages
    const totalReports = reportsResponse?.count || 0;

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by reason, ID..."
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
            {/* Removed "Add New" and "Bulk Upload" buttons */}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalReports} reports
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
    reportsResponse?.count,
    rowsPerPage,
  ]);

  const bottomContent = useMemo(() => {
    // FIX: Calculate totalPages from count and rowsPerPage
    const totalReports = reportsResponse?.count || 0;
    const totalPages = Math.ceil(totalReports / rowsPerPage);

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
  }, [page, reportsResponse?.count, rowsPerPage]);

  const confirmationTitle =
    actionType === "resolve" ? "Resolve Report" : "Dismiss Report";
  const confirmationMessage = activeReport
    ? `Are you sure you want to ${actionType} report #${activeReport.id} for question ID ${activeReport.questionId}? This action will remove it from the list.`
    : "";

  return (
    <>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        onConfirm={handleConfirmAction}
        isLoading={isProcessing}
        title={confirmationTitle}
        message={confirmationMessage}
      />

      <main className="min-h-screen p-8 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">Report Management</h1>
          <Table
            isHeaderSticky
            aria-label="Report management table"
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
              emptyContent={"No reports found"}
              // FIX: Use 'rows' from API response
              items={reportsResponse?.rows || []}
              isLoading={isLoading}
            >
              {(item: IReport) => (
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
