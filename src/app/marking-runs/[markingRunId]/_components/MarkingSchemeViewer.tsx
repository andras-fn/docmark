import { useEffect, useState } from "react";
import TestResultCard from "./TestResultCard";
import DocumentGroupsListViewer from "./DocumentGroupsListViewer";
import MarkingSchemeListViewer from "./MarkingSchemeListViewer";
import ResultsViewer from "./ResultsViewer";
import DocumentsListViewer from "./DocumentsListViewer";
import {
  DocumentGroup,
  DocumentGroupWithCounts,
} from "@/db/schemas/documentGroup";
import { MarkingSchemeWithCounts } from "@/db/schemas/markingScheme";

const MarkingSchemeViewer = ({
  markingRunData,
  markingRunId,
}: {
  markingRunData: any;
  markingRunId: string;
}) => {
  //console.log(markingRunData);
  // marking run state
  const [markingRunResults, setMarkingRunResults] = useState();
  const [markingRunResultsLoading, setMarkingRunResultsLoading] =
    useState(true);

  // error state
  const [error, setError] = useState<Error | undefined>();
  const [errorMessage, setErrorMessage] = useState<string>();

  // document group state
  const [documentGroups, setDocumentGroups] = useState([]);
  const [selectedDocumentGroup, setSelectedDocumentGroup] =
    useState<DocumentGroupWithCounts | null>();

  // marking scheme state
  const [markingSchemes, setMarkingSchemes] = useState([]);
  const [selectedMarkingScheme, setSelectedMarkingScheme] =
    useState<MarkingSchemeWithCounts | null>();

  // dopcuments state
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState();

  // fetch marking run results
  useEffect(() => {
    const fetchData = async () => {
      try {
        setMarkingRunResultsLoading(true);
        const response = await fetch(`/api/v1/marking-runs/${markingRunId}`);
        const data = await response.json();
        //console.log(data.data);

        // Process the response data here
        setMarkingRunResults(data.data);
        setMarkingRunResultsLoading(false);
      } catch (error) {
        // Handle error here
        setError(error as Error);
        setErrorMessage("Can't fetch Marking Run results");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full min-h-[calc(100%)] max-h-[calc(100%)]">
      {markingRunResultsLoading ? (
        <div className="p-2">Loading...</div>
      ) : (
        <div className="w-full flex min-h-[calc(100%)] max-h-[calc(100%)] divide-x divide-slate-500">
          <div className="w-64">
            <DocumentGroupsListViewer
              markingRunId={markingRunId}
              documentGroups={documentGroups}
              setDocumentGroups={
                setDocumentGroups as React.Dispatch<
                  React.SetStateAction<DocumentGroup[]>
                >
              }
              selectedDocumentGroup={selectedDocumentGroup as DocumentGroup}
              setSelectedDocumentGroup={setSelectedDocumentGroup}
            />
          </div>

          <div className="w-64">
            <MarkingSchemeListViewer
              markingRunId={markingRunId}
              markingSchemes={markingSchemes}
              setMarkingSchemes={setMarkingSchemes}
              selectedMarkingScheme={selectedMarkingScheme}
              setSelectedMarkingScheme={setSelectedMarkingScheme}
            />
          </div>

          <div className="w-64">
            {selectedDocumentGroup && selectedMarkingScheme ? (
              <DocumentsListViewer
                markingRunId={markingRunId}
                documents={documents}
                setDocuments={setDocuments}
                selectedDocument={selectedDocument}
                setSelectedDocument={setSelectedDocument}
                selectedDocumentGroup={selectedDocumentGroup}
                selectedMarkingScheme={selectedMarkingScheme}
              />
            ) : (
              <div className="p-2">
                Please select a Document Group and Marking Scheme
              </div>
            )}
          </div>

          <div className="flex-1">
            {selectedDocument ? (
              <ResultsViewer selectedDocument={selectedDocument} />
            ) : (
              <div className="p-2">Please select a Document</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default MarkingSchemeViewer;
