import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CompactPagination from "@/components/CompactPagination";
import type { DocumentGroup } from "@/db/schemas/documentGroup";

const DocumentGroupsListViewer = ({
  markingRunId,
  documentGroups,
  setDocumentGroups,
  selectedDocumentGroup,
  setSelectedDocumentGroup,
}: {
  markingRunId: string;
  documentGroups: DocumentGroup[];
  setDocumentGroups: React.Dispatch<React.SetStateAction<DocumentGroup[]>>;
  selectedDocumentGroup: DocumentGroup | null;
  setSelectedDocumentGroup: React.Dispatch<
    React.SetStateAction<DocumentGroup | null>
  >;
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

  const documentGroupClickHandler = (documentGroup: DocumentGroup) => {
    console.log(documentGroup);
    // if a selectedDocumentGroup is selected then unselect it
    if (
      selectedDocumentGroup &&
      selectedDocumentGroup.id === documentGroup.id
    ) {
      setSelectedDocumentGroup(null);
      return;
    }
    setSelectedDocumentGroup(documentGroup);
  };

  return (
    <div className="w-full min-h-full h-full max-h-full">
      <div className="flex justify-between w-full p-2 font-medium border-b border-slate-500">
        <h4 className="">Document Groups</h4> <p>{documentGroups.length}</p>
      </div>
      <ScrollArea className="max-h-[calc(100%-41px)] min-h-[calc(100%-41px)] h-[calc(100%-41px)]">
        {loading ? ( // Render loading state if isLoading is true
          <div className="p-2">Loading...</div>
        ) : (
          documentGroups &&
          documentGroups.map((group: DocumentGroup) => (
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
                <div className="flex flex-col">
                  <div className="text-sm p-2 font-bold">{group.name}</div>
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-1 px-2 border-b border-r border-gray-200 bg-gray-50 text-left text-sm"></th>
                        <th className="py-1 px-2 border-b border-gray-200 bg-gray-50 text-left text-sm">
                          Documents
                        </th>
                        <th className="py-1 px-2 border-b border-gray-200 bg-gray-50 text-left text-sm">
                          Tests
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1 px-2 border-r border-gray-200 text-sm bg-gray-50 font-bold">
                          Total
                        </td>
                        <td className="py-1 px-2 border-gray-200">500</td>
                        <td className="py-1 px-2 border-gray-200">2000</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2 border-r border-gray-200 text-sm bg-gray-50 font-bold">
                          Pass
                        </td>
                        <td className="py-1 px-2 border-gray-200">400</td>
                        <td className="py-1 px-2 border-gray-200">1500</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2 border-r border-gray-200 text-sm bg-gray-50 font-bold">
                          Fail
                        </td>
                        <td className="py-1 px-2 border-gray-200">100</td>
                        <td className="py-1 px-2 border-gray-200">500</td>
                      </tr>
                    </tbody>
                  </table>
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
