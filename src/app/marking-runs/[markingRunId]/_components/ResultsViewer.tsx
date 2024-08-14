import TestResultCard from "./TestResultCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { filterEvaluation } from "@/lib/filterEvaluation";
import { useState } from "react";

const ResultsViewer = ({ selectedDocument }: { selectedDocument: any }) => {
  // Replace `any` with the actual type of selectedDocument if available
  const [filter, setFilter] = useState("");

  return (
    <div className="w-full min-h-full h-full max-h-full divide-y divide-slate-500">
      <div className="p-2 flex justify-between items-center">
        <input
          type="text"
          className="p-1 border border-slate-500 rounded"
          placeholder="Filter..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="flex gap-x-4">
          <div className="flex gap-x-1">
            <p className="font-semibold">Total:</p>
            <p>
              {filterEvaluation(
                [selectedDocument],
                selectedDocument.documentId,
                "NONE"
              )}
            </p>
          </div>
          <div className="flex gap-x-1">
            <p className="font-semibold">Pass:</p>
            <p>
              {filterEvaluation(
                [selectedDocument],
                selectedDocument.documentId,
                "PASS"
              )}
            </p>
          </div>
          <div className="flex gap-x-1">
            <p className="font-semibold">Fail:</p>
            <p>
              {filterEvaluation(
                [selectedDocument],
                selectedDocument.documentId,
                "FAIL"
              )}
            </p>
          </div>
        </div>
      </div>
      <ScrollArea className=" max-h-[calc(100%-55px)] min-h-[calc(100%-55px)] h-[calc(100%-55px)] p-2 ">
        <div className="flex flex-col gap-y-2">
          {/* make this section scrollable */}
          <div className="border rounded border-slate-500 divide-y divide-slate-500">
            <div className="px-2 py-1 font-bold">Summary</div>

            <div className="flex flex-col divide-y divide-slate-500">
              {selectedDocument.results
                .filter(
                  (result: { category: string }) =>
                    result.category === "summary"
                )
                .filter((result: { testDescription: string }) => {
                  if (filter === "") {
                    return true;
                  } else {
                    return result.testDescription
                      .toLowerCase()
                      .includes(filter.toLowerCase());
                  }
                })
                .map((test: any) => (
                  <TestResultCard test={test} />
                ))}
            </div>
          </div>
          <div className="border rounded border-slate-500 divide-y divide-slate-500">
            <div className="p-2 font-bold">Key Diagnosis</div>
            <div className="flex flex-col divide-y divide-slate-500">
              {selectedDocument.results
                .filter(
                  (result: { category: string }) =>
                    result.category === "keyDiagnosis"
                )
                .filter((result: { testDescription: string }) => {
                  if (filter === "") {
                    return true;
                  } else {
                    return result.testDescription
                      .toLowerCase()
                      .includes(filter.toLowerCase());
                  }
                })
                .map((test: any) => (
                  <TestResultCard test={test} />
                ))}
            </div>
          </div>
          <div className="border rounded border-slate-500 divide-y divide-slate-500">
            <div className="p-2 font-bold">Any New Medication</div>
            <div className="flex flex-col divide-y divide-slate-500">
              {selectedDocument.results
                .filter(
                  (result: { category: string }) =>
                    result.category === "anyNewMedication"
                )
                .filter((result: { testDescription: string }) => {
                  if (filter === "") {
                    return true;
                  } else {
                    return result.testDescription
                      .toLowerCase()
                      .includes(filter.toLowerCase());
                  }
                })
                .map((test: any) => (
                  <TestResultCard test={test} />
                ))}
            </div>
          </div>
          <div className="border rounded border-slate-500 divide-y divide-slate-500">
            <div className="p-2 font-bold">Urgency</div>
            <div className="flex flex-col divide-y divide-slate-500">
              {selectedDocument.results
                .filter(
                  (result: { category: string }) =>
                    result.category === "urgency"
                )
                .filter((result: { testDescription: string }) => {
                  if (filter === "") {
                    return true;
                  } else {
                    return result.testDescription
                      .toLowerCase()
                      .includes(filter.toLowerCase());
                  }
                })
                .map((test: any) => (
                  <TestResultCard test={test} />
                ))}
            </div>
          </div>
          <div className="border rounded border-slate-500 divide-y divide-slate-500">
            <div className="p-2 font-bold">Next Actions</div>
            <div className="flex flex-col divide-y divide-slate-500">
              {selectedDocument.results
                .filter(
                  (result: { category: string }) =>
                    result.category === "nextActions"
                )
                .filter((result: { testDescription: string }) => {
                  if (filter === "") {
                    return true;
                  } else {
                    return result.testDescription
                      .toLowerCase()
                      .includes(filter.toLowerCase());
                  }
                })
                .map((test: any) => (
                  <TestResultCard test={test} />
                ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
export default ResultsViewer;
