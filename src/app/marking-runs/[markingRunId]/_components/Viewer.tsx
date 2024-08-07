"use client";

import Banner from "./Banner";
import MarkingSchemeViewer from "./MarkingSchemeViewer";

import { useEffect, useState } from "react";

const Viewer = ({ markingRunId }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState();
  const [errorMessage, setErrorMessage] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/marking-runs/${markingRunId}`);
        const data = await response.json();
        console.log(data.data);
        // Process the response data here
        setData(data.data);
        setIsLoading(false);
      } catch (error) {
        // Handle error here
        setError(error);
        setErrorMessage(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="border border-slate-500 rounded flex flex-col divide-y divide-slate-500 max-h-full h-full">
      <div className="flex justify-between items-center text-black p-2 font-semibold text-xl h-[56px]">
        <p>Viewing Marking Run - {data && data.name}</p>
      </div>
      <div className="w-full">
        <div className="w-full flex flex-col divide-y divide-slate-500">
          <Banner data={data} />
          <MarkingSchemeViewer markingSchemeData={data} />
        </div>
      </div>
    </div>
  );
};
export default Viewer;
