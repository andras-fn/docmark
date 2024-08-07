"use client";

import { useState } from "react";

const Wrapper = ({ runs }) => {
  const [selectedRun, setSelectedRun] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedMarkingCriteria, setSelectedMarkingCriteria] = useState(null);

  // when a run is selected, fetch the documents and marking criteria for it and then add them as part of the selectedRun state
  const runClickHandler = async (clickedRun) => {
    setSelectedMarkingCriteria(null);
    setSelectedDocument(null);
    setSelectedRun(runs.find((run) => run.runId === clickedRun.runId));
  };

  const documentClickHandler = async (document) => {
    setSelectedMarkingCriteria(null);
    setSelectedDocument(document);
  };

  return (
    <div className="min-h-full max-h-fit text-black flex w-full">
      <div className="border-r border-violet-800 min-h-full flex flex-col min-w-96">
        <div className="w-full flex flex-col items-center bg-violet-500 text-white border-b border-violet-800">
          <h2 className="p-2">Runs</h2>
        </div>

        <div className="flex flex-col h-full divide-y divide-violet-800">
          {runs.map((run) => (
            <button
              key={run.runId}
              className={`p-2 hover:bg-violet-500 hover:text-white w-full text-left ${
                selectedRun && selectedRun.runId === run.id
                  ? "bg-violet-300"
                  : ""
              }`}
              onClick={() => runClickHandler(run)}
            >
              <div className="flex justify-between">
                <p className="flex items-center">{run.runName}</p>
                <div className="">
                  <p>{run.createdAt.split(" ")[1]}</p>
                  <p>{run.createdAt.split(" ")[0]}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="border-r border-violet-800 min-h-full flex flex-col min-w-96">
        <div className="w-full flex flex-col items-center bg-violet-500 text-white  border-b border-violet-800">
          <h2 className="p-2">Documents</h2>
        </div>

        <div className="flex flex-col h-full divide-y divide-violet-800">
          {selectedRun &&
            selectedRun.documents.map((document) => (
              <button
                key={document.documentId}
                className={`p-2 hover:bg-violet-500 hover:text-white  w-full text-left ${
                  selectedDocument &&
                  selectedDocument.documentId === document.documentId
                    ? "bg-violet-300"
                    : ""
                }`}
                onClick={() => documentClickHandler(document)}
              >
                <div className="flex justify-between">
                  <p>{document.documentName}</p>
                  <p className="font-semibold">
                    {document.markingCriteria.reduce(
                      (accumulator: number, currentObject) => {
                        return (
                          accumulator +
                          parseInt(currentObject.overallResult.overallScore)
                        );
                      },
                      0
                    )}
                    /
                    {document.markingCriteria.reduce(
                      (accumulator: number, currentObject) => {
                        return (
                          accumulator +
                          parseInt(
                            currentObject.overallResult.totalPossibleScore
                          )
                        );
                      },
                      0
                    )}
                  </p>
                </div>
              </button>
            ))}
        </div>
      </div>
      <div className="border-r border-violet-800 min-h-full flex flex-col min-w-96">
        <div className="w-full flex flex-col items-center bg-violet-500 text-white  border-b border-violet-800">
          <h2 className="p-2">Marking Criteria</h2>
        </div>

        <div className="flex flex-col h-full divide-y divide-violet-800">
          {selectedDocument &&
            selectedDocument.markingCriteria.map((markingCriteria) => (
              <button
                key={markingCriteria.markingCriteriaId}
                className={`p-2 hover:bg-violet-500 hover:text-white w-full text-left ${
                  selectedMarkingCriteria &&
                  selectedMarkingCriteria.markingCriteriaId ===
                    markingCriteria.markingCriteriaId
                    ? "bg-violet-300"
                    : ""
                }`}
                onClick={() => setSelectedMarkingCriteria(markingCriteria)}
              >
                <div className="flex justify-between">
                  <p>{markingCriteria.markingCriteriaName}</p>
                  <p className="font-semibold">
                    {markingCriteria.overallResult.overallScore}/
                    {markingCriteria.overallResult.totalPossibleScore}
                  </p>
                </div>
              </button>
            ))}
        </div>
      </div>
      <div className="border-r border-violet-800 min-h-full w-full flex flex-col">
        <div className="w-full flex flex-col items-center bg-violet-500 text-white  border-b border-violet-800">
          <h2 className="p-2">Test Results</h2>
        </div>

        <div className="flex flex-col h-full divide-y divide-violet-800">
          {selectedMarkingCriteria && (
            <div className="">
              <div className="w-full">
                <p className="p-2 bg-violet-400 text-white w-full">
                  Overall Score
                </p>
                <div className="divide-y divide-violet-800">
                  <div className="p-2">
                    <div className="flex flex-col">
                      <p className="font-bold">Score</p>
                      <p>
                        {selectedMarkingCriteria.overallResult.overallScore}/
                        {
                          selectedMarkingCriteria.overallResult
                            .totalPossibleScore
                        }
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold">Comment</p>
                      <p>{selectedMarkingCriteria.overallResult.comment}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <p className="p-2 bg-violet-400 text-white w-full">Summary</p>
                <div className="divide-y divide-violet-800">
                  {selectedMarkingCriteria.results.summary.map(
                    (description: string) => (
                      <div className="p-2" key={description.descriptionId}>
                        <div className="flex flex-col">
                          <p className="font-bold">Test Description</p>
                          <p>{description.description}</p>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold">Evaluation</p>
                          <p>{description.evaluation}</p>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold">Comment</p>
                          <p>{description.comment}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="">
                <p className="p-2 bg-violet-400 text-white">Next Actions</p>
                <div className="divide-y divide-violet-800">
                  {selectedMarkingCriteria.results.nextActions.map(
                    (description: string) => (
                      <div className="p-2" key={description.descriptionId}>
                        <div className="flex flex-col">
                          <p className="font-bold">Test Description</p>
                          <p>{description.description}</p>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold">Evaluation</p>
                          <p>{description.evaluation}</p>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold">Comment</p>
                          <p>{description.comment}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="">
                <p className="p-2 bg-violet-400 text-white">Key Diagnosis</p>
                <div className="divide-y divide-violet-800">
                  {selectedMarkingCriteria.results.keyDiagnosis.map(
                    (description: string) => (
                      <div className="p-2" key={description.descriptionId}>
                        <div className="flex flex-col">
                          <p className="font-bold">Test Description</p>
                          <p>{description.description}</p>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold">Evaluation</p>
                          <p>{description.evaluation}</p>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold">Comment</p>
                          <p>{description.comment}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="">
                <p className="p-2 bg-violet-400 text-white">
                  Any New Medication
                </p>
                <div className="divide-y divide-violet-800">
                  {selectedMarkingCriteria.results.anyNewMedication.map(
                    (description: string) => (
                      <div className="p-2" key={description.descriptionId}>
                        <div className="flex flex-col">
                          <p className="font-bold">Test Description</p>
                          <p>{description.description}</p>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold">Evaluation</p>
                          <p>{description.evaluation}</p>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold">Comment</p>
                          <p>{description.comment}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Wrapper;
