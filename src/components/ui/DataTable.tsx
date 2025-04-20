import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  noDataMessage?: string;
  keyField: keyof T;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  noDataMessage = "No data available",
  keyField,
}: DataTableProps<T>) {
  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {noDataMessage}
              </TableCell>
            </TableRow>
          ) : (
            safeData.map((row) => (
              <TableRow key={String(row[keyField])}>
                {columns.map((column, index) => (
                  <TableCell key={index}>
                    {column.cell
                      ? column.cell(row)
                      : typeof column.accessorKey === "function"
                      ? column.accessorKey(row)
                      : String(row[column.accessorKey])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
