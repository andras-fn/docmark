"use client";

import MarkingSchemeViewer from "./MarkingSchemeViewer";

import { useEffect, useState } from "react";

const Viewer = ({ markingRunId }: { markingRunId: string }) => {
  const [data, setData] = useState<{ name: string } | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/marking-runs/${markingRunId}`);
        const data = await response.json();
        // console.log(data.data);
        // Process the response data here
        setData(data.data);
        setIsLoading(false);
      } catch (error) {
        // Handle error here
        setError(true);
        setErrorMessage(error as string);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="border border-slate-500 rounded flex flex-col divide-y divide-slate-500 max-h-full h-full">
      <div className="flex justify-between items-center text-black p-2 font-semibold text-xl h-[56px]">
        <p>Viewing Marking Run - {data && data.name}</p>
      </div>

      <div className="w-full flex flex-col divide-y divide-slate-500 max-h-[calc(100%-44px)] min-h-[calc(100%-44px)] h-[calc(100%-44px)]">
        {isLoading ? (
          <div className="p-2">Loading...</div>
        ) : (
          <>
            {/* <Banner data={data} /> */}
            <MarkingSchemeViewer markingRunId={markingRunId} />
          </>
        )}
      </div>
    </div>
  );
};
export default Viewer;
