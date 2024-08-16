import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CompactPagination from "@/components/CompactPagination";
import type { DocumentGroupWithCounts } from "@/db/schemas/documentGroup";

const DocumentGroupsListViewer = ({
  markingRunId,
  documentGroups,
  setDocumentGroups,
  selectedDocumentGroup,
  setSelectedDocumentGroup,
  setSelectedDocument,
}: {
  markingRunId: string;
  documentGroups: DocumentGroupWithCounts[];
  setDocumentGroups: React.Dispatch<
    React.SetStateAction<DocumentGroupWithCounts[]>
  >;
  selectedDocumentGroup: DocumentGroupWithCounts | null;
  setSelectedDocumentGroup: React.Dispatch<
    React.SetStateAction<DocumentGroupWithCounts | null>
  >;
  setSelectedDocument: React.Dispatch<React.SetStateAction<any | null>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalResultCount, setTotalResultCount] = useState<number>(0);

  // fetch document groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/v1/marking-runs/${markingRunId}/document-groups`
        );
        const data = await response.json();
        // Process the response data here
        setDocumentGroups(data.data);
        setLoading(false);
      } catch (error) {
        // Handle error here
        setError(error as Error);
        setErrorMessage("Can't fetch Document Groups");
      }
    };

    fetchData();
  }, []);

  const documentGroupClickHandler = (
    documentGroup: DocumentGroupWithCounts
  ) => {
    console.log(documentGroup);
    // if a selectedDocumentGroup is selected then unselect it
    if (
      selectedDocumentGroup &&
      selectedDocumentGroup.id === documentGroup.id
    ) {
      setSelectedDocument(null);
      setSelectedDocumentGroup(null);
      return;
    }
    setSelectedDocument(null);
    setSelectedDocumentGroup(documentGroup);
  };

  return (
    <div className="w-full min-h-full h-full max-h-full">
      <div className="flex justify-between w-full p-2 font-medium border-b border-slate-500">
        <h4 className="">Document Groups</h4> <p>{documentGroups?.length}</p>
      </div>
      <ScrollArea className="max-h-[calc(100%-41px)] min-h-[calc(100%-41px)] h-[calc(100%-41px)]">
        {loading ? ( // Render loading state if isLoading is true
          <div className="p-2">Loading...</div>
        ) : (
          documentGroups &&
          documentGroups.map((group: DocumentGroupWithCounts) => (
            <div
              key={group.id}
              className={`m-2 border rounded border-slate-500 hover:outline-none hover:ring-2 hover:ring-slate-700 hover:border-transparent ${
                selectedDocumentGroup && selectedDocumentGroup.id === group.id
                  ? "outline-none ring-2 ring-slate-700 border-transparent "
                  : ""
              }`}
            >
              <button
                className="text-left text-sm w-full"
                onClick={(e) => documentGroupClickHandler(group)}
              >
                <div className="flex flex-col p-2">
                  <div className="text-sm font-bold">{group.name}</div>
                  <div className="flex justify-between">
                    <div className="flex gap-x-1">
                      <p className="font-semibold">Total:</p>
                      <p>{group.totalNumber}</p>
                    </div>
                    <div className="flex gap-x-1">
                      <p className="font-semibold">Pass:</p>
                      <p>{group.passNumber}</p>
                    </div>
                    <div className="flex gap-x-1">
                      <p className="font-semibold">Fail:</p>
                      <p>{group.failNumber}</p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default DocumentGroupsListViewer;
