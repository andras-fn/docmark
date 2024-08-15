import { use, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { filterEvaluation } from "@/lib/filterEvaluation";

const DocumentsListViewer = ({
  markingRunId,
  documents,
  setDocuments,
  selectedDocument,
  setSelectedDocument,
  selectedDocumentGroup,
  selectedMarkingScheme,
}: {
  markingRunId: string;
  documents: any;
  setDocuments: React.Dispatch<React.SetStateAction<any>>;
  selectedDocument: any;
  setSelectedDocument: React.Dispatch<React.SetStateAction<any>>;
  selectedDocumentGroup: any;
  selectedMarkingScheme: any;
}) => {
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [error, setError] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    //console.log("documents use effect");
    //console.log(selectedMarkingScheme);
    const fetchData = async () => {
      try {
        setDocumentsLoading(true);
        const response = await fetch(
          `/api/v1/marking-runs/${markingRunId}/documents?markingSchemeId=${selectedMarkingScheme.id}&documentGroupId=${selectedDocumentGroup.id}`
        );
        const data = await response.json();
        //console.log(data.data);

        // Process the response data here
        setDocuments(data.data);
        setDocumentsLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setErrorMessage(error.message);
        setDocumentsLoading(false);
      }
    };

    fetchData();
  }, [selectedDocumentGroup, selectedMarkingScheme]);

  const documentClickHandler = (document) => {
    //console.log(document);
    setSelectedDocument(document);
  };

  const [filter, setFilter] = useState("");
  return (
    <div className="w-full min-h-full h-full max-h-full">
      <div className="flex justify-between w-full p-2 font-medium border-b border-slate-500">
        <h4 className="">Documents</h4>
        <p>{selectedMarkingScheme && documents && documents.length}</p>
      </div>
      {documentsLoading ? (
        <div className="p-2">Loading...</div>
      ) : (
        <>
          <div className="p-2 border-b border-slate-500">
            <input
              type="text"
              className="border border-black rounded p-1 w-full"
              placeholder="Filter..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <ScrollArea className="max-h-[calc(100%-51px-41px)] min-h-[calc(100%-51px-41px)] h-[calc(100%-51px-41px)]">
            {documents &&
              documents
                .filter((document) => {
                  if (filter === "") {
                    return true;
                  } else {
                    return document.documentName
                      .toLowerCase()
                      .includes(filter.toLowerCase());
                  }
                })
                .map((document) => (
                  <div
                    key={document.documentId}
                    className={`m-2 border rounded border-slate-500 hover:outline-none hover:ring-2 hover:ring-slate-700 hover:border-transparent ${
                      selectedDocument &&
                      selectedDocument.documentId === document.documentId
                        ? "outline-none ring-2 ring-slate-700 border-transparent "
                        : ""
                    }`}
                  >
                    <button
                      className="text-left text-sm w-full"
                      onClick={(e) => documentClickHandler(document)}
                    >
                      <div className="flex flex-col p-2">
                        <div className="text-sm  font-bold">
                          {document.documentName}
                        </div>
                        <div className="flex justify-between ">
                          <div className="flex gap-x-1">
                            <p className="font-semibold">Total:</p>
                            <p>
                              {filterEvaluation(
                                documents,
                                document.documentId,
                                "NONE"
                              )}
                            </p>
                          </div>
                          <div className="flex gap-x-1">
                            <p className="font-semibold">Pass:</p>
                            <p>
                              {filterEvaluation(
                                documents,
                                document.documentId,
                                "PASS"
                              )}
                            </p>
                          </div>
                          <div className="flex gap-x-1">
                            <p className="font-semibold">Fail:</p>
                            <p>
                              {filterEvaluation(
                                documents,
                                document.documentId,
                                "FAIL"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
          </ScrollArea>
        </>
      )}
    </div>
  );
};
export default DocumentsListViewer;
