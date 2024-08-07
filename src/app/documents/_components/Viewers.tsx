"use client";

import DocumentGroupsListViewer from "./DocumentGroupsListViewer";
import DocumentsListViewer from "./DocumentsListViewer";
import DocumentViewer from "./DocumentViewer";
import type { DocumentGroup } from "@/db/schemas/documentGroup";

import { useState } from "react";

const Viewers = () => {
  const [selectedDocumentGroup, setSelectedDocumentGroup] =
    useState<DocumentGroup | null>(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  return (
    <div className="flex w-full divide-x divide-slate-500 min-h-[calc(100%-56px)] max-h-[calc(100%-56px)]">
      <DocumentGroupsListViewer
        selectedDocumentGroup={selectedDocumentGroup}
        setSelectedDocumentGroup={setSelectedDocumentGroup}
      />
      <DocumentsListViewer
        selectedDocumentGroup={selectedDocumentGroup}
        selectedDocument={selectedDocument}
        setSelectedDocument={setSelectedDocument}
      />
      <DocumentViewer selectedDocument={selectedDocument} />
    </div>
  );
};
export default Viewers;
