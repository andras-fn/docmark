import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CompactPagination from "@/components/CompactPagination";
import type { DocumentGroup } from "@/db/schemas/documentGroup";

const DocumentGroupsListViewer = ({
  isLoading,
  documentGroups,
  selectedDocumentGroup,
  setSelectedDocumentGroup,
}: {
  isLoading: boolean;
  documentGroups: DocumentGroup[];
  selectedDocumentGroup: DocumentGroup;
  setSelectedDocumentGroup: React.Dispatch<React.SetStateAction<DocumentGroup>>;
}) => {
  const [totalResultCount, setTotalResultCount] = useState<number>(0);

  const documentGroupClickHandler = (documentGroup: DocumentGroup) => {
    console.log(documentGroup);
    setSelectedDocumentGroup(documentGroup);
  };

  return (
    <div className="w-full min-h-full h-full max-h-full">
      <div className="flex justify-between w-full p-2 font-medium border-b border-slate-500">
        <h4 className="">Document Groups</h4> <p>{documentGroups.length}</p>
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
    </div>
  );
};

export default DocumentGroupsListViewer;
