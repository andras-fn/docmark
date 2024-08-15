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

import { useState, useEffect } from "react";
import ComboBoxMultiSelect from "./ComboBoxMultiSelect";

const CreateMarkingRunButtonModal = () => {
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [documentGroups, setDocumentGroups] = useState([]);
  const [markingSchemes, setMarkingSchemes] = useState([]);

  const [markingRunName, setMarkingRunName] = useState("");
  const [selectedDocumentGroups, setSelectedDocumentGroups] = useState<
    { id: string }[]
  >([]);
  const [selectedMarkingSchemes, setSelectedMarkingSchemes] = useState<
    { id: string; testCriteria: any[] }[]
  >([]);

  const [numberOfDocuments, setNumberOfDocuments] = useState(0);

  // modal/dialog state
  const [open, setOpen] = useState(false);

  // fetch document group data
  useEffect(() => {
    const fetchDocumentGroups = async () => {
      try {
        // TODO set this to descending order
        const response = await fetch("/api/v1/document-groups");
        const data = await response.json();
        // handle document group data
        setDocumentGroups(data.data);
        setSelectedDocumentGroups([]);
      } catch (error) {
        // handle error
        setError(true);
        setErrorMessage("Error fetching document groups");
      }
    };

    fetchDocumentGroups();
  }, [open]);

  // fetch marking scheme data
  useEffect(() => {
    const fetchMarkingSchemes = async () => {
      try {
        // TODO set this to descending order
        const response = await fetch("/api/v1/marking-schemes");
        const data = await response.json();
        // handle marking scheme data
        setMarkingSchemes(data.data);
        setSelectedMarkingSchemes([]);
      } catch (error) {
        // handle error
        setError(true);
        setErrorMessage("Error fetching marking schemes");
      }
    };

    fetchMarkingSchemes();
  }, [open]);

  // fetch documents when selected document groups changes
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // loop over the document groups and fetch the documents
        const documentPromises = selectedDocumentGroups.map((group) => {
          return fetch(
            `/api/v1/documents?documentGroupId=${group.id}&limit=2000`
          );
        });

        const documentResponses = await Promise.all(documentPromises);

        const documentDataPromises = documentResponses.map((response) =>
          response.json()
        );

        const documentData = await Promise.all(documentDataPromises);

        // calculate number of documents
        const totalDocuments = documentData.reduce(
          (total, current) => total + current.data.length,
          0
        );

        setNumberOfDocuments(totalDocuments);
      } catch (error) {
        // handle error
        setError(true);
        setErrorMessage("Error fetching document groups");
      }
    };

    fetchDocuments();
  }, [selectedDocumentGroups]);

  // save button handler
  const saveButtonClickHandler = async () => {
    try {
      // validate the form
      if (markingRunName === "") {
        setError(true);
        setErrorMessage("Please enter a marking run name");
        return;
      }

      if (selectedDocumentGroups.length === 0) {
        setError(true);
        setErrorMessage("Please select at least one document group");
        return;
      }

      if (selectedMarkingSchemes.length === 0) {
        setError(true);
        setErrorMessage("Please select at least one marking scheme");
        return;
      }

      //console.log("Creating marking run");

      const markingRunData = {
        name: markingRunName,
        numberOfDocumentGroups: selectedDocumentGroups.length,
        numberOfDocuments: numberOfDocuments,
        numberOfMarkingSchemes: selectedMarkingSchemes.length,
        numberOfTestCriteria: selectedMarkingSchemes
          .map((scheme) => scheme.testCriteria.length)
          .reduce((total, current) => total + current, 0),
        documentGroups: selectedDocumentGroups.map((group) => group.id),
        markingSchemes: selectedMarkingSchemes.map((scheme) => scheme.id),
      };

      //console.log(JSON.stringify(markingRunData, null, 2));

      // create the marking run
      const response = await fetch("/api/v1/marking-runs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...markingRunData }),
      });
      const data = await response.json();

      //console.log(data);

      // check the response
      if (data.status !== 201) {
        setError(true);
        setErrorMessage("Error creating Marking Run");
        return;
      }

      // handle response data
      setSuccess(true);
      setSuccessMessage(
        `Marking Run Created Successfully: ${data.markingRunId}`
      );
      setError(false);
      setErrorMessage("");

      // clear the form
      setMarkingRunName("");
      setSelectedDocumentGroups([]);
      setSelectedMarkingSchemes([]);
    } catch (error) {
      // handle error
      setSuccess(false);
      setSuccessMessage("");
      setError(true);
      setErrorMessage("Error creating Marking Run");
    }
  };

  const markingRunNameChangeHandler = (event: any) => {
    setMarkingRunName(event.target.value);
  };

  const onDocumentGroupSearchChange = async (value: string) => {
    // fetch data based on search value
    //console.log(value);
    try {
      const response = await fetch(`/api/v1/document-groups?search=${value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      //console.log(data);

      setDocumentGroups(data.data);
    } catch (error) {
      // handle error
      console.log(error);
    }
  };

  const onMarkingSchemeSearchChange = async (value: string) => {
    // fetch data based on search value

    try {
      const response = await fetch(`/api/v1/marking-schemes?search=${value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      //console.log(data);

      setMarkingSchemes(data.data);
    } catch (error) {
      // handle error
      //console.log(error);
    }
  };

  const modalChangeHandler = () => {
    // clear the form
    setMarkingRunName("");
    setSelectedDocumentGroups([]);
    setSelectedMarkingSchemes([]);

    // clear success
    setSuccess(false);
    setSuccessMessage("");

    // clear error
    setError(false);
    setErrorMessage("");

    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={modalChangeHandler}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Marking Run</Button>
      </DialogTrigger>
      <DialogContent className="w-1/3 max-w-1/3">
        <DialogHeader>
          <DialogTitle>Create a Marking Run</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {errorMessage}
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex gap-x-4">
              <div className="flex flex-col gap-y-1">
                <Label htmlFor="name">Marking Run Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={markingRunName}
                  onChange={(e) => markingRunNameChangeHandler(e)}
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <Label htmlFor="documentGroup">Document Groups</Label>
                <ComboBoxMultiSelect
                  dataArray={documentGroups}
                  selectedData={selectedDocumentGroups}
                  setSelectedData={setSelectedDocumentGroups}
                  selectMessage="Select Document Groups"
                  searchMessage="Search Document Groups"
                  notFoundMessage="No Document Groups Found"
                  onSearchChange={onDocumentGroupSearchChange}
                />
              </div>

              <div className="flex flex-col gap-y-1">
                <Label>Marking Schemes</Label>
                <ComboBoxMultiSelect
                  dataArray={markingSchemes}
                  selectedData={selectedMarkingSchemes}
                  setSelectedData={setSelectedMarkingSchemes}
                  selectMessage="Select Marking Schemes"
                  searchMessage="Search Marking Schemes"
                  notFoundMessage="No Marking Schemes Found"
                  onSearchChange={onMarkingSchemeSearchChange}
                />
              </div>
            </div>
            <div className="w-full">
              <div className=" flex gap-x-2">
                <p className="font-semibold">
                  Number of selected Document Groups:
                </p>
                <p>{selectedDocumentGroups.length}</p>
              </div>
              <div className=" flex gap-x-2">
                <p className="font-semibold">
                  Number of Documents in the Document Groups:
                </p>
                <p>{numberOfDocuments}</p>
              </div>
              <div className=" flex gap-x-2">
                <p className="font-semibold">
                  Number of selected Marking Schemes:
                </p>
                <p>{selectedMarkingSchemes.length}</p>
              </div>
              <div className=" flex gap-x-2">
                <p className="font-semibold">
                  Number of generated test permutations:
                </p>
                <p>{numberOfDocuments * selectedMarkingSchemes.length}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={saveButtonClickHandler}>
            Create Marking Run
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CreateMarkingRunButtonModal;
