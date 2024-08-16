"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

const ShowDocumentPromptsButtonModal = ({
  selectedDocument,
}: {
  selectedDocument: { systemPrompt: string; userPrompt: string };
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-8" variant="outline">
          View Prompts
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[calc(100%-50%)] min-h-[calc(85vh)] max-h-[calc(85vh)]">
        <DialogHeader>
          <DialogTitle>View System and User Prompts</DialogTitle>
        </DialogHeader>
        <div className="min-h-[calc(75vh)] max-h-[calc(75vh)] h-[calc(75vh)]border border-black flex flex-col items-center justify-between pb-4">
          <div className="flex flex-col gap-y-2 h-[calc(50%)]">
            <h1 className="font-semibold">System Prompt:</h1>
            <ScrollArea className="p-2 border border-slate-500 rounded">
              {selectedDocument.systemPrompt}
            </ScrollArea>
          </div>
          <div className="flex flex-col gap-y-2 h-[calc(50%)]">
            <h1 className="font-semibold">User Prompt:</h1>
            <ScrollArea className="p-2 border border-slate-500 rounded">
              {selectedDocument.userPrompt}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ShowDocumentPromptsButtonModal;
