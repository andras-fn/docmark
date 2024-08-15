"use client";

import { useState } from "react";
import MarkingSchemeListViewer from "./MarkingSchemeListViewer";
import MarkingSchemeViewer from "./MarkingSchemeViewer";
import { ExtendedMarkingScheme } from "@/db/schemas/markingScheme";

const Viewers = () => {
  const [selectedMarkingScheme, setSelectedMarkingScheme] =
    useState<ExtendedMarkingScheme | null>(null);

  return (
    <div className="flex w-full divide-x divide-slate-500 min-h-[calc(100%-56px)] max-h-[calc(100%-56px)]">
      <div className="w-96">
        <MarkingSchemeListViewer
          selectedMarkingScheme={selectedMarkingScheme}
          setSelectedMarkingScheme={setSelectedMarkingScheme}
        />
      </div>

      <MarkingSchemeViewer selectedMarkingScheme={selectedMarkingScheme} />
    </div>
  );
};
export default Viewers;
