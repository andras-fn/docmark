"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState, useEffect } from "react";

import type { Document } from "@/db/schemas/document";
import { z } from "zod";

const AddDocumentButtonModal = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [documentGroups, setDocumentGroups] = useState<
    { id: string; name: string }[]
  >([]);

  const [documentName, setDocumentName] = useState("");
  const [selectedDocumentGroup, setSelectedDocumentGroup] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [aiResults, setAiResults] = useState("");

  // fetch document group data
  useEffect(() => {
    const fetchDocumentGroups = async () => {
      try {
        const response = await fetch("/api/v1/document-groups");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        // handle document group data
        setDocumentGroups(data.data);
      } catch (error) {
        // handle error
        setError(true);
        setErrorMessage("Error fetching document groups");
      }
    };

    fetchDocumentGroups();
  }, []);

  // save button handler
  const saveButtonClickHandler = async () => {
    const inputName = documentName;
    const inputDocumentGroup = selectedDocumentGroup;
    const inputDocumentText = documentText;
    const inputAiResults = aiResults;

    console.log(
      inputName,
      inputDocumentGroup,
      inputDocumentText,
      inputAiResults
    );

    // check if it matches the document zod schema
    if (inputName === "") {
      setError(true);
      setErrorMessage("Document Name is required");
      return;
    }

    if (inputDocumentGroup === "") {
      setError(true);
      setErrorMessage("Document Group is required");
      return;
    }

    if (inputDocumentText === "") {
      setError(true);
      setErrorMessage("Document Text is required");
      return;
    }

    if (inputAiResults === "") {
      setError(true);
      setErrorMessage("AI Results is required");
      return;
    }

    try {
      const response = await fetch("/api/v1/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentName: inputName,
          documentGroupId: inputDocumentGroup,
          documentText: inputDocumentText,
          aiResults: inputAiResults,
        }),
      });
      const data = await response.json();
      // handle response data
      setSuccess(true);
      setError(false);
      setErrorMessage("");

      // clear the form
      setDocumentName("");
      setSelectedDocumentGroup("");
      setDocumentText("");
      setAiResults("");
    } catch (error) {
      // handle error
      setError(true);
      setErrorMessage("Error creating document");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Document</Button>
      </DialogTrigger>
      <DialogContent className="w-1/2 max-w-1/2">
        <DialogHeader>
          <DialogTitle>Add Document</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              Document Created Successfully
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {errorMessage}
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="">
              <Label htmlFor="name" className="text-left">
                Document Name
              </Label>
              <Input
                id="name"
                placeholder="Add a Document Name"
                className="col-span-3 w-1/2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveButtonClickHandler();
                }}
                onChange={(e) => setDocumentName(e.target.value)}
                value={documentName}
              />
            </div>
            <div className="">
              <Label htmlFor="name" className="text-left">
                Document Group Name
              </Label>
              <Select
                onValueChange={setSelectedDocumentGroup}
                value={selectedDocumentGroup}
              >
                <SelectTrigger className="w-1/2">
                  <SelectValue placeholder="Document Group Name" />
                </SelectTrigger>
                <SelectContent>
                  {documentGroups && documentGroups.length > 0 ? (
                    documentGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-groups">
                      No Document Groups
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="">
              <Label htmlFor="name" className="text-left">
                Document Text
              </Label>
              <Textarea
                id="document-text"
                placeholder="Add the Document Text"
                className="col-span-3"
                rows={8}
                onChange={(e) => setDocumentText(e.target.value)}
                value={documentText}
              />
            </div>
            <div className="">
              <Label htmlFor="name" className="text-left">
                AI Results
              </Label>
              <Textarea
                id="ai-results"
                placeholder="Add the AI Results"
                className="col-span-3"
                rows={8}
                onChange={(e) => setAiResults(e.target.value)}
                value={aiResults}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={saveButtonClickHandler}>
            Save Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddDocumentButtonModal;
