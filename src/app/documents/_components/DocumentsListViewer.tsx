import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CompactPagination from "@/components/CompactPagination";
import type { Document } from "@/db/schemas/document";

import type { DocumentGroup } from "@/db/schemas/documentGroup";

const DocumentsListViewer = ({
  selectedDocumentGroup,
  selectedDocument,
  setSelectedDocument,
}: {
  selectedDocumentGroup: DocumentGroup | null;
  selectedDocument: Document | null;
  setSelectedDocument: React.Dispatch<React.SetStateAction<Document | null>>;
}) => {
  const [documents, setDocuments] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResultCount, setTotalResultCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading state to true

        const response = await fetch(
          `/api/v1/documents?documentGroupId=${
            selectedDocumentGroup?.id
          }&limit=40&offset=${currentPage > 1 ? currentPage * 40 : 0}`
        );
        const data = await response.json();
        // console.log(data);
        setDocuments(data.data);
        setTotalResultCount(data.pagination.totalResultCount);
        // console.log(data.pagination.totalResultCount);
        // console.log(data.pagination.totalResultCount / 40);
        const pageCheck = parseInt(data.pagination.totalResultCount) / 40;
        if (pageCheck % 1 !== 0) {
          setNumberOfPages(parseInt(data.pagination.totalResultCount) / 40 + 1);
        } else {
          setNumberOfPages(parseInt(data.pagination.totalResultCount) / 40);
        }

        setIsLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loading state to false in case of error
      }
    };

    if (selectedDocumentGroup === null) {
      return;
    }
    fetchData();
  }, [currentPage, selectedDocumentGroup]);

  const documentClickHandler = (document: Document) => {
    setSelectedDocument(document);
  };

  return (
    <div className="w-full min-h-full h-full max-h-full">
      <div className="flex justify-between w-full p-2 font-medium border-b border-slate-500">
        <h4 className="">Documents</h4>
        <p>{totalResultCount}</p>
      </div>

      <ScrollArea className="max-h-[calc(100%-41px-44px)] min-h-[calc(100%-41px-44px)] h-[calc(100%-41px-44px)]">
        {selectedDocumentGroup === null ? (
          <div className="p-2">Document group not selected</div> // Render message when selectedDocumentGroup is null
        ) : isLoading ? (
          <div className="p-2">Loading...</div> // Render loading state
        ) : (
          documents.map((document: Document) => (
            <div key={document.id} className="w-full">
              <button
                className={`text-left text-sm p-2 w-full hover:bg-neutral-300 ${
                  selectedDocument && selectedDocument.id === document.id
                    ? "bg-neutral-200"
                    : ""
                }`}
                onClick={(e) => documentClickHandler(document)}
              >
                {document.documentName}
              </button>
            </div>
          ))
        )}
      </ScrollArea>
      <CompactPagination
        numberOfPages={numberOfPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default DocumentsListViewer;
