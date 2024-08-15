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

import { useState } from "react";

const AddDocumentGroupButtonModal = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const saveButtonClickHandler = async () => {
    const inputValue = (document.getElementById("name") as HTMLInputElement)
      ?.value;
    if (inputValue) {
      try {
        const response = await fetch("/api/v1/document-groups", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: inputValue }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        // handle response data
        setSuccess(true);
      } catch (error) {
        // handle error
        setError(true);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Document Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Document Group</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              Document Group Created Successfully
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              Error Creating Document Group
            </div>
          )}
          <div className="flex flex-col gap-4">
            <Label htmlFor="name" className="text-left">
              Document Group Name
            </Label>
            <Input
              id="name"
              placeholder="Add a Document Group Name"
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") saveButtonClickHandler();
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={saveButtonClickHandler}>
            Save Document Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddDocumentGroupButtonModal;
