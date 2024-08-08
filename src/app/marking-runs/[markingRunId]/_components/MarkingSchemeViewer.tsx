import { useEffect, useState } from "react";
import TestResultCard from "./TestResultCard";
import DocumentGroupsListViewer from "./DocumentGroupsListViewer";
import MarkingSchemeListViewer from "./MarkingSchemeListViewer";
import ResultsViewer from "./ResultsViewer";

const MarkingSchemeViewer = ({ markingRunData, markingRunId }) => {
  console.log(markingRunData);
  const [markingRunResults, setMarkingRunResults] = useState();
  const [documentGroupsLoading, setDocumentGroupsLoading] = useState(true);
  const [markingRunResultsLoading, setMarkingRunResultsLoading] =
    useState(true);

  const [error, setError] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const [selectedDocumentGroup, setSelectedDocumentGroup] = useState();
  const [selectedMarkingScheme, setSelectedMarkingScheme] = useState();

  const [documentGroups, setDocumentGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setMarkingRunResultsLoading(true);
        const response = await fetch(
          `/api/v1/marking-runs/${markingRunId}/results`
        );
        const data = await response.json();
        console.log(data.data);

        // Process the response data here
        setMarkingRunResults(data.data);
        setMarkingRunResultsLoading(false);
      } catch (error) {
        // Handle error here
        setError(error);
        setErrorMessage(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDocumentGroupsLoading(true);
        const documentGroupPromises = markingRunData.documentGroups.map(
          (group) => {
            return fetch(`/api/v1/document-groups/${group}`);
          }
        );

        const documentGroupResponses = await Promise.all(documentGroupPromises);

        const documentGroupData = await Promise.all(
          documentGroupResponses.map((response) => response.json())
        );

        const documentGroupDataMapped = documentGroupData.map((group) => {
          return group.data;
        });
        // Process the response data here
        setDocumentGroups(documentGroupDataMapped);
        setDocumentGroupsLoading(false);
      } catch (error) {
        // Handle error here
        setError(error);
        setErrorMessage(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full">
      {markingRunResultsLoading ? (
        <div className="p-2">Loading...</div>
      ) : (
        <div className="flex h-full w-full">
          <div className="grid grid-rows-2 w-64 min-h-[calc(100%)] max-h-[calc(100%)] border-r border-slate-500 divide-y divide-slate-500">
            <div className="">
              <DocumentGroupsListViewer
                isLoading={documentGroupsLoading}
                documentGroups={documentGroups}
                selectedDocumentGroup={selectedDocumentGroup}
                setSelectedDocumentGroup={setSelectedDocumentGroup}
              />
            </div>

            <div className="">
              <MarkingSchemeListViewer
                markingSchemes={markingRunResults}
                selectedMarkingScheme={selectedMarkingScheme}
                setSelectedMarkingScheme={setSelectedMarkingScheme}
              />
            </div>
          </div>
          <div className="w-full">
            {selectedDocumentGroup && selectedMarkingScheme ? (
              <ResultsViewer />
            ) : (
              <div className="p-2">
                Please selected a Document Group and Marking Scheme
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default MarkingSchemeViewer;
