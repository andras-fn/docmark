import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import ShowDocumentPromptsButtonModal from "./ShowDocumentPromptsButtonModal";

const DocumentViewer = ({ selectedDocument }: { selectedDocument: any }) => {
  return (
    <div className="h-full w-full">
      <div className="flex justify-between w-full border-b border-slate-500 items-center">
        {selectedDocument ? (
          <div className="flex items-center justify-between w-full px-2">
            <h4 className="py-2 font-medium">
              {selectedDocument?.documentName}
            </h4>
            {/* <div className="flex gap-x-2 items-center pr-2">
              <Label htmlFor="prompt-id">Prompt ID:</Label>
              <p id="prompt-id">1234567</p>
            </div> */}
            <ShowDocumentPromptsButtonModal
              selectedDocument={selectedDocument}
            />
          </div>
        ) : (
          <h4 className="p-2 font-medium">No Document Selected</h4>
        )}
      </div>
      <div className="flex flex-col gap-y-4 p-2 h-[calc(100%-41px)]">
        {selectedDocument ? (
          <>
            <div className="flex flex-col gap-y-2 h-[calc(50%-0.5rem)]">
              <Label htmlFor="document-text">Document Text:</Label>

              <ScrollArea
                id="document-text"
                className="h-full rounded-md border border-gray-400 p-4"
              >
                {selectedDocument?.documentText}
              </ScrollArea>
            </div>
            <div className="flex flex-col gap-y-2 h-[calc(50%-0.5rem)]">
              <Label htmlFor="ai-results">AI Results:</Label>
              <ScrollArea
                id="ai-results"
                className="h-full  rounded-md border border-gray-400 p-4"
              >
                {JSON.stringify(selectedDocument?.aiResults, null, 2)}
              </ScrollArea>
            </div>
          </>
        ) : (
          <p>No Document Selected</p>
        )}
      </div>
    </div>
  );
};
export default DocumentViewer;
