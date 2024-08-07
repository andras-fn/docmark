import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CompactPagination from "@/components/CompactPagination";
import type { DocumentGroup } from "@/db/schemas/documentGroup";

const DocumentGroupsListViewer = ({
  selectedDocumentGroup,
  setSelectedDocumentGroup,
}: {
  selectedDocumentGroup: DocumentGroup;
  setSelectedDocumentGroup: React.Dispatch<React.SetStateAction<DocumentGroup>>;
}) => {
  const [documentGroups, setDocumentGroups] = useState<DocumentGroup[]>([]);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalResultCount, setTotalResultCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading state to true
        const response = await fetch(
          `/api/v1/document-groups?limit=40&offset=${
            currentPage > 1 ? currentPage * 40 : 0
          }`
        );
        const data = await response.json();
        console.log(data);
        setDocumentGroups(data.data);
        setTotalResultCount(data.pagination.totalResultCount);
        console.log(data.pagination.totalResultCount);
        console.log(data.pagination.totalResultCount / 40);
        const pageCheck = parseInt(data.pagination.totalResultCount) / 40;
        if (pageCheck % 1 !== 0) {
          setNumberOfPages(parseInt(data.pagination.totalResultCount) / 40 + 1);
        } else {
          setNumberOfPages(parseInt(data.pagination.totalResultCount) / 40);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    };

    fetchData();
  }, [currentPage]);

  const documentGroupClickHandler = (documentGroup: DocumentGroup) => {
    setSelectedDocumentGroup(documentGroup);
  };

  return (
    <div className="w-96 min-h-full h-full max-h-full">
      <div className="flex justify-between w-full p-2 font-medium border-b border-slate-500">
        <h4 className="">Document Groups</h4> <p>{totalResultCount}</p>
      </div>
      <ScrollArea className="max-h-[calc(100%-41px-44px)] min-h-[calc(100%-41px-44px)] h-[calc(100%-41px-44px)]">
        {isLoading ? ( // Render loading state if isLoading is true
          <div className="p-2">Loading...</div>
        ) : (
          documentGroups &&
          documentGroups.map((group: DocumentGroup) => (
            <div key={group.id} className="w-full">
              <button
                className={`text-left text-sm p-2 w-full hover:bg-neutral-300 ${
                  selectedDocumentGroup && selectedDocumentGroup.id === group.id
                    ? "bg-neutral-200"
                    : ""
                }`}
                onClick={(e) => documentGroupClickHandler(group)}
              >
                {group.name}
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

export default DocumentGroupsListViewer;
