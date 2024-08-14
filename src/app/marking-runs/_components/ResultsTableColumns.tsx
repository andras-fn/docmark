"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//   id: string;
//   amount: number;
//   status: "pending" | "processing" | "success" | "failed";
//   email: string;
// };

export const columns = [
  { accessorKey: "name", header: "Run Name" },
  {
    accessorKey: "createdAt",
    header: "Start Time",
    cell: ({ row }: { row: any }) => {
      return (
        <div className="">
          {row.original.createdAt &&
            row.original.createdAt.split("T")[1].split(".")[0]}{" "}
          - {row.original.createdAt && row.original.createdAt.split("T")[0]}
        </div>
      );
    },
  },
  {
    accessorKey: "completed",
    header: "Status",
    cell: ({ row }: { row: any }) => {
      return (
        <div className="">
          {row.original.completed ? "Completed" : "In Progress"}
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration (s)",
    cell: ({ row }: { row: any }) => {
      const timeDifference =
        row.original.completedTime &&
        new Date(row.original.completedTime).getTime() -
          new Date(row.original.createdAt).getTime();

      return (
        <div className="">
          {row.original.completedTime ? timeDifference / 1000 : "-"}
        </div>
      );
    },
  },

  { accessorKey: "numberOfTestCriteria", header: "Total Tests" },
  //   { accessorKey: "passedTests", header: "Passed Tests" },
  //   { accessorKey: "failedTests", header: "Failed Tests" },
  { accessorKey: "numberOfDocuments", header: "Documents" },
  { accessorKey: "numberOfMarkingSchemes", header: "Marking Schemes" },
];
