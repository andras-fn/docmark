import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CompactPagination from "@/components/CompactPagination";

const MarkingRunListViewer = ({
  selectedMarkingRun,
  setSelectedMarkingRun,
}) => {
  const [markingRun, setMarkingRun] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResultCount, setTotalResultCount] = useState(0);

  useEffect(() => {
    console.log("use effect");
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading state to true
        console.log("starting fetch");
        const response = await fetch(
          `/api/v1/marking-schemes?&limit=40&offset=${
            currentPage > 1 ? (currentPage - 1) * 40 : 0
          }`
        );
        const data = await response.json();
        console.log(data);
        setMarkingRun(data.data);
        setTotalResultCount(data.pagination.totalResultCount);
        console.log(data.pagination.totalResultCount);
        console.log(data.pagination.totalResultCount / 40);
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

    fetchData();
  }, [currentPage]);

  const markingRunClickHandler = (run) => {
    console.log(run);
    setSelectedMarkingRun(run);
  };
  return (
    <div className="w-96 min-h-full h-full max-h-full">
      <div className="flex justify-between w-full p-2 font-medium border-b border-slate-500">
        <h4 className="">Marking Runs</h4>
        <p>{totalResultCount}</p>
      </div>

      <ScrollArea className="max-h-[calc(100%-41px-44px)] min-h-[calc(100%-41px-44px)] h-[calc(100%-41px-44px)]">
        {isLoading ? (
          <div className="p-2">Loading...</div>
        ) : (
          markingRun.map((markingRunSingle) => (
            <div key={markingRunSingle.id} className="w-full">
              <button
                className={`text-left text-sm p-2 w-full hover:bg-neutral-300 ${
                  selectedMarkingRun &&
                  selectedMarkingRun.id === markingRunSingle.id
                    ? "bg-neutral-200"
                    : ""
                }`}
                onClick={(e) => markingRunClickHandler(markingRunSingle)}
              >
                {markingRunSingle.name}
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
export default MarkingRunListViewer;
