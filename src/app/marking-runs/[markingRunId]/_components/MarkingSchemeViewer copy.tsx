import { useEffect, useState } from "react";
import TestResultCard from "./TestResultCard";

const MarkingSchemeViewer = ({ markingRunId }) => {
  const [markingRunResults, setMarkingRunResults] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/v1/marking-runs/${markingRunId}/results`
        );
        const data = await response.json();
        console.log("data");
        console.log(data.data);

        // Process the response data here
        setMarkingRunResults(data.data);
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
    <div className="w-full">
      {isLoading ? (
        <div className="p-2">Loading...</div>
      ) : (
        <div className="w-full">
          <div className="flex flex-col">
            {markingRunResults &&
              markingRunResults.map((markingScheme) => (
                <div className="">
                  <div className="flex justify-between items-center text-black p-2 font-semibold text-xl h-[56px]">
                    <p>Marking Scheme - {markingScheme.markingSchemeName}</p>
                    <div className="flex gap-x-4">
                      <p>Total:</p>
                      <p>Passed:</p>
                      <p>Failed:</p>
                    </div>
                  </div>
                  <div className="">
                    marking scheme - category - doccument group - document -
                    test
                  </div>
                  <div className="flex flex-col divide-y divide-slate-500 p-2">
                    {markingRunResults && (
                      <div className="flex flex-col divide-y divide-slate-500">
                        <div className=" border border-slate-500 rounded">
                          <div className="flex justify-between items-center text-black font-semibold text-l p-2 border-b border-slate-500">
                            <p>Summary</p>
                          </div>
                          <div className="flex flex-col divide-y divide-slate-500">
                            {Object.groupBymarkingScheme.categories.summary.map(
                              (test) => (
                                <TestResultCard test={test} />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default MarkingSchemeViewer;
