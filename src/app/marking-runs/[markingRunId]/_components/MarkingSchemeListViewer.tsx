import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CompactPagination from "@/components/CompactPagination";

const MarkingSchemeListViewer = ({
  markingSchemes,
  selectedMarkingScheme,
  setSelectedMarkingScheme,
}) => {
  const markingSchemeClickHandler = (scheme) => {
    console.log(scheme);
    setSelectedMarkingScheme(scheme);
  };
  return (
    <div className="w-full min-h-full h-full max-h-full">
      <div className="flex justify-between w-full p-2 font-medium border-b border-slate-500">
        <h4 className="">Marking Schemes</h4>
        <p>{markingSchemes && markingSchemes.length}</p>
      </div>

      <ScrollArea className="max-h-[calc(100%-41px-44px)] min-h-[calc(100%-41px-44px)] h-[calc(100%-41px-44px)]">
        {markingSchemes &&
          markingSchemes.map((markingSchemeSingle) => (
            <div key={markingSchemeSingle.markingSchemeId} className="w-full">
              <button
                className={`text-left text-sm p-2 w-full hover:bg-neutral-300 ${
                  selectedMarkingScheme &&
                  selectedMarkingScheme.markingSchemeId ===
                    markingSchemeSingle.markingSchemeId
                    ? "bg-neutral-200"
                    : ""
                }`}
                onClick={(e) => markingSchemeClickHandler(markingSchemeSingle)}
              >
                {markingSchemeSingle.markingSchemeName}
              </button>
            </div>
          ))}
      </ScrollArea>
    </div>
  );
};
export default MarkingSchemeListViewer;
