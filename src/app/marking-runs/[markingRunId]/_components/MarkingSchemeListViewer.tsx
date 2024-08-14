import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CompactPagination from "@/components/CompactPagination";

const MarkingSchemeListViewer = ({
  markingRunId,
  markingSchemes,
  setMarkingSchemes,
  selectedMarkingScheme,
  setSelectedMarkingScheme,
}: {
  markingRunId: string;
  markingSchemes: any;
  setMarkingSchemes: React.Dispatch<React.SetStateAction<any>>;
  selectedMarkingScheme: any;
  setSelectedMarkingScheme: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<String | null>(null);
  const [totalResultCount, setTotalResultCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/v1/marking-runs/${markingRunId}/marking-schemes`
        );
        const data = await response.json();
        console.log(data.data);

        // Process the response data here
        setMarkingSchemes(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setErrorMessage("Can't fetch Marking Schemes");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const markingSchemeClickHandler = (scheme: { markingSchemeId: any }) => {
    console.log(scheme);
    // if a selectedMarkingScheme is selected then unselect it
    if (
      selectedMarkingScheme &&
      selectedMarkingScheme.markingSchemeId === scheme.markingSchemeId
    ) {
      setSelectedMarkingScheme(null);
      return;
    }
    setSelectedMarkingScheme(scheme);
  };

  return (
    <div className="w-full min-h-full h-full max-h-full">
      <div className="flex justify-between w-full p-2 font-medium border-b border-slate-500">
        <h4 className="">Marking Schemes</h4>
        <p>{markingSchemes && markingSchemes.length}</p>
      </div>

      <ScrollArea className="max-h-[calc(100%-41px)] min-h-[calc(100%-41px)] h-[calc(100%-41px)]">
        {markingSchemes &&
          markingSchemes.map(
            (markingSchemeSingle: {
              id: string;
              name: string;
              markingSchemeId: any;
              markingSchemeName?: any;
            }) => (
              <div
                key={markingSchemeSingle.id}
                className={`m-2 border rounded border-slate-500 hover:outline-none hover:ring-2 hover:ring-slate-700 hover:border-transparent ${
                  selectedMarkingScheme &&
                  selectedMarkingScheme.id === markingSchemeSingle.id
                    ? "outline-none ring-2 ring-slate-700 border-transparent "
                    : ""
                }`}
              >
                <button
                  className="text-left text-sm w-full"
                  onClick={(e) =>
                    markingSchemeClickHandler(markingSchemeSingle)
                  }
                >
                  <div className="flex flex-col">
                    <div className="text-sm p-2 font-bold">
                      {markingSchemeSingle.name}
                    </div>
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
            )
          )}
      </ScrollArea>
    </div>
  );
};
export default MarkingSchemeListViewer;
