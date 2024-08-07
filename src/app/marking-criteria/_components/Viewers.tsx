"use client";

import { useState } from "react";
import MarkingSchemeListViewer from "./MarkingSchemeListViewer";
import MarkingSchemeViewer from "./MarkingSchemeViewer";

const Viewers = () => {
  const [selectedMarkingScheme, setSelectedMarkingScheme] = useState(null);

  return (
    <div className="flex w-full divide-x divide-slate-500 min-h-[calc(100%-56px)] max-h-[calc(100%-56px)]">
      <MarkingSchemeListViewer
        selectedMarkingScheme={selectedMarkingScheme}
        setSelectedMarkingScheme={setSelectedMarkingScheme}
      />
      <MarkingSchemeViewer selectedMarkingScheme={selectedMarkingScheme} />
    </div>
  );
};
export default Viewers;
