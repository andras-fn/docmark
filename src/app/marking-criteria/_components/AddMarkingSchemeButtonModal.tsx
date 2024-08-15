"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AddRemoveTestCriteria from "./AddRemoveTestCriteria";

const AddMarkingSchemeButtonModal = () => {
  // modal/dialog state
  const [open, setOpen] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [markingSchemeName, setMarkingSchemeName] = useState("");

  const [summary, setSummary] = useState("");
  const [keyDiagnosis, setKeyDiagnosis] = useState("");
  const [urgency, setUrgency] = useState("");
  const [anyNewMedication, setAnyNewMedication] = useState("");
  const [nextActions, setNextActions] = useState("");

  const [summaryCriteria, setSummaryCriteria] = useState([]);
  const [keyDiagnosisCriteria, setKeyDiagnosisCriteria] = useState([]);
  const [urgencyCriteria, setUrgencyCriteria] = useState([]);
  const [anyNewMedicationCriteria, setAnyNewMedicationCriteria] = useState([]);
  const [nextActionsCriteria, setNextActionsCriteria] = useState([]);

  // save button handler
  const saveButtonClickHandler = async () => {
    // check if it matches the document zod schema
    if (markingSchemeName === "") {
      setError(true);
      setErrorMessage("Marking Scheme Name is required");
      return;
    }

    try {
      const response = await fetch("/api/v1/marking-schemes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: markingSchemeName,
          testCriteria: [
            ...summaryCriteria.map((criteria) => ({
              testDescription: criteria,
              category: "summary",
            })),
            ...keyDiagnosisCriteria.map((criteria) => ({
              testDescription: criteria,
              category: "keyDiagnosis",
            })),
            ...urgencyCriteria.map((criteria) => ({
              testDescription: criteria,
              category: "urgency",
            })),
            ...anyNewMedicationCriteria.map((criteria) => ({
              testDescription: criteria,
              category: "anyNewMedication",
            })),
            ...nextActionsCriteria.map((criteria) => ({
              testDescription: criteria,
              category: "nextActions",
            })),
          ],
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      // handle response data
      setSuccess(true);
      setError(false);
      setErrorMessage("");

      // clear the form
      setMarkingSchemeName("");
      setSummary("");
      setKeyDiagnosis("");
      setUrgency("");
      setAnyNewMedication("");
      setNextActions("");
      setSummaryCriteria([]);
      setKeyDiagnosisCriteria([]);
      setUrgencyCriteria([]);
      setAnyNewMedicationCriteria([]);
      setNextActionsCriteria([]);
    } catch (error) {
      // handle error
      setError(true);
      setErrorMessage("Error creating document");
    }
  };

  const listOfCategories = [
    {
      name: "Summary",
      state: {
        criteria: [summaryCriteria, setSummaryCriteria],
        value: [summary, setSummary],
      },
    },
    {
      name: "Key Diagnosis",
      state: {
        criteria: [keyDiagnosisCriteria, setKeyDiagnosisCriteria],
        value: [keyDiagnosis, setKeyDiagnosis],
      },
    },
    {
      name: "Urgency",
      state: {
        criteria: [urgencyCriteria, setUrgencyCriteria],
        value: [urgency, setUrgency],
      },
    },
    {
      name: "Any New Medication",
      state: {
        criteria: [anyNewMedicationCriteria, setAnyNewMedicationCriteria],
        value: [anyNewMedication, setAnyNewMedication],
      },
    },
    {
      name: "Next Actions",
      state: {
        criteria: [nextActionsCriteria, setNextActionsCriteria],
        value: [nextActions, setNextActions],
      },
    },
  ];

  const modalChangeHandler = () => {
    // clear the form
    setMarkingSchemeName("");
    setSummary("");
    setKeyDiagnosis("");
    setUrgency("");
    setAnyNewMedication("");
    setNextActions("");
    setSummaryCriteria([]);
    setKeyDiagnosisCriteria([]);
    setUrgencyCriteria([]);
    setAnyNewMedicationCriteria([]);
    setNextActionsCriteria([]);

    // clear success
    setSuccess(false);

    // clear error
    setError(false);
    setErrorMessage("");

    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={modalChangeHandler}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Marking Scheme</Button>
      </DialogTrigger>
      <DialogContent className="w-1/2 max-w-1/2">
        <DialogHeader>
          <DialogTitle>Create a Marking Scheme</DialogTitle>
        </DialogHeader>

        <div className="">
          <ScrollArea className="max-h-[calc(100vh-200px)] min-h-[70vh] h-[70vh] p-2">
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                Marking Scheme Created Successfully
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {errorMessage}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div className="p-1">
                <Label htmlFor="name" className="text-left">
                  Marking Scheme Name
                </Label>
                <Input
                  id="name"
                  placeholder="Add a Document Name"
                  className="col-span-3 w-1/2"
                  onChange={(e) => setMarkingSchemeName(e.target.value)}
                  value={markingSchemeName}
                />
              </div>

              {listOfCategories.map((category, index) => (
                <AddRemoveTestCriteria
                  key={index}
                  categoryName={category.name}
                  criteriaValue={category.state.value[0] as string}
                  setCriteriaValue={
                    category.state.value[1] as (value: string) => void
                  }
                  criteriaArray={category.state.criteria[0] as string[]}
                  setCriteriaArray={
                    category.state.criteria[1] as (value: string[]) => void
                  }
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button onClick={saveButtonClickHandler}>Save Marking Scheme</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddMarkingSchemeButtonModal;
