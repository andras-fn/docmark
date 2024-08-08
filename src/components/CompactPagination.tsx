import { ChevronLeft, ChevronRight } from "lucide-react";
type CompactPaginationProps = {
  numberOfPages: number;
  currentPage: number | null;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const CompactPagination: React.FC<CompactPaginationProps> = ({
  numberOfPages,
  currentPage,
  setCurrentPage,
}) => {
  const enterKeyHandler = () => {
    if (currentPage !== null) {
      const pageInput = (
        document?.getElementById("page-input") as HTMLInputElement
      )?.value;
      setCurrentPage(parseInt(pageInput));
    }
  };

  const previousButtonHandler = () => {
    if (currentPage !== null) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextButtonHandler = () => {
    if (currentPage !== null) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="w-full flex items-center gap-x-1 justify-center text-sm p-1 border-t border-slate-500">
      <button
        className="p-1 border border-black rounded disabled:opacity-50"
        onClick={previousButtonHandler}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </button>
      <input
        id="page-input"
        className="w-8 p-1 border border-slate-500 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        type="number"
        defaultValue={currentPage !== null ? currentPage.toString() : ""}
        max={numberOfPages.toString()}
        // tweak this so that it only accepts numbers
        onKeyDown={(e) => {
          if (e.key === "Enter") enterKeyHandler();
        }}
        disabled={numberOfPages === 0}
      />
      <p> of {numberOfPages.toFixed()}</p>
      <button
        className="p-1 border border-black rounded disabled:opacity-50"
        onClick={nextButtonHandler}
        disabled={currentPage === numberOfPages || numberOfPages === 0}
      >
        <ChevronRight />
      </button>
    </div>
  );
};
export default CompactPagination;
