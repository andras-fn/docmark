import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkingSchemeWithCounts } from "@/db/schemas/markingScheme";

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
  selectedMarkingScheme: MarkingSchemeWithCounts | null;
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
        //console.log(data.data);

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

  const markingSchemeClickHandler = (scheme: { id: any }) => {
    //console.log(scheme);
    // if a selectedMarkingScheme is selected then unselect it
    if (selectedMarkingScheme && selectedMarkingScheme.id === scheme.id) {
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
          markingSchemes.map((markingSchemeSingle: MarkingSchemeWithCounts) => (
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
                onClick={(e) => markingSchemeClickHandler(markingSchemeSingle)}
              >
                <div className="flex flex-col p-2">
                  <div className="text-sm font-bold">
                    {markingSchemeSingle.name}
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-x-1">
                      <p className="font-semibold">Total:</p>
                      <p>{markingSchemeSingle.totalNumber}</p>
                    </div>
                    <div className="flex gap-x-1">
                      <p className="font-semibold">Pass:</p>
                      <p>{markingSchemeSingle.passNumber}</p>
                    </div>
                    <div className="flex gap-x-1">
                      <p className="font-semibold">Fail:</p>
                      <p>{markingSchemeSingle.failNumber}</p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
      </ScrollArea>
    </div>
  );
};
export default MarkingSchemeListViewer;
