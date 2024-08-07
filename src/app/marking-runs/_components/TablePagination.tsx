import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const TablePagination = () => {
  const currentPage = 1;

  const numberOfPages = 10;
  return (
    <div className="flex items-center gap-x-1 justify-center p-2">
      <button>
        <ChevronFirst />
      </button>
      <button>
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
      <button>
        <ChevronRight />
      </button>
      <button>
        <ChevronLast />
      </button>
    </div>
  );
};
export default TablePagination;
