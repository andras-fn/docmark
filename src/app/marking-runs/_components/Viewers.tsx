"use client";

import { useState, useEffect } from "react";

import ResultsTable from "./ResultsTable";

import { columns } from "./ResultsTableColumns";
import TablePagination from "./TablePagination";

const Viewers = () => {
  const [markingRuns, setMarkingRuns] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // fetch data from the marking-runs api
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/v1/marking-runs");
        const data = await response.json();
        //console.log(data.data);
        setMarkingRuns(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching marking runs:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-between gap-y-2 w-full min-h-[calc(100%-56px)] max-h-[calc(100%-56px)] divide-y divide-slate-500">
      {isLoading ? (
        <div className="p-2">Loading...</div>
      ) : (
        <>
          <ResultsTable data={markingRuns} columns={columns} />
          <TablePagination />
        </>
      )}
    </div>
  );
};
export default Viewers;
