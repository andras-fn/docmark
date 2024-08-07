"use client";

import { useState, useEffect } from "react";

import ResultsTable from "./ResultsTable";

import { columns } from "./ResultsTableColumns";
import TablePagination from "./TablePagination";

const Viewers = () => {
  const [markingRuns, setMarkingRuns] = useState([
    // {
    //   runId: "1",
    //   runName: "Run 1",
    //   startTime: "2021-09-01T00:00:00Z",
    //   status: "completed",
    //   duration: 1000,
    //   totalTests: 100,
    //   passedTests: 90,
    //   failedTests: 10,
    // },
    // {
    //   runId: "2",
    //   runName: "Run 2",
    //   startTime: "2021-09-02T00:00:00Z",
    //   status: "completed",
    //   duration: 2000,
    //   totalTests: 200,
    //   passedTests: 180,
    //   failedTests: 20,
    // },
  ]);

  useEffect(() => {
    // fetch data from the marking-runs api
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v1/marking-runs");
        const data = await response.json();
        console.log(data.data);
        setMarkingRuns(data.data);
      } catch (error) {
        console.error("Error fetching marking runs:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-between gap-y-2 w-full min-h-[calc(100%-56px)] max-h-[calc(100%-56px)] divide-y divide-slate-500">
      <ResultsTable data={markingRuns} columns={columns} />
      <TablePagination />
    </div>
  );
};
export default Viewers;
