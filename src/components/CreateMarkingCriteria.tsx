/**
 * v0 by Vercel.
 * @see https://v0.dev/t/MfNpZbDVVnt
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Category from "@/components/Category";

import { useState } from "react";
import { Description } from "@/types/description";

import { MarkingCriteria } from "@/types/markingCriteria";

export default function CreateMarkingCriteria() {
  const [markingCriteriaName, setMarkingCriteriaName] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [nextAction, setNextAction] = useState<string>("");
  const [keyDiagnosis, setKeyDiagnosis] = useState<string>("");
  const [newMedication, setNewMedication] = useState<string>("");

  const [summaries, setSummaries] = useState<Description[]>([]);
  const [nextActions, setNextActions] = useState<Description[]>([]);
  const [keyDiagnosiss, setKeyDiagnosiss] = useState<Description[]>([]);
  const [newMedications, setNewMedications] = useState<Description[]>([]);

  const [success, setSuccess] = useState<boolean>(false);

  const saveMarkingCriteria = async () => {
    // Call your API here
    const markingCriteria: MarkingCriteria = {
      name: markingCriteriaName,
      summary: summaries,
      nextActions: nextActions,
      keyDiagnosis: keyDiagnosiss,
      anyNewMedication: newMedications,
    };

    try {
      // Make API call
      const response = await fetch("/api/marking-criteria", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(markingCriteria),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Marking criteria saved successfully", data);
        // show something in the ui on success
        setSuccess(true);
        setMarkingCriteriaName("");
        setSummary("");
        setNextAction("");
        setKeyDiagnosis("");
        setNewMedication("");
        setSummaries([]);
        setNextActions([]);
        setKeyDiagnosiss([]);
        setNewMedications([]);
      } else {
        console.error("Failed to save marking criteria");
      }
    } catch (error) {
      console.error("An error occurred while saving marking criteria", error);
    }
  };

  return (
    <div className="w-full p-2  text-black">
      <div className="grid gap-8">
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
            <strong className="font-bold">Success!</strong> Marking criteria
            saved successfully.
          </div>
        )}

        <div className="grid gap-6 w-1/2">
          <div className="grid ">
            <h2 className="font-semibold">Marking Criteria Name</h2>
            <input
              placeholder="Enter a name for the Marking Criteria"
              className="flex-1 w-96 border border-slate-500 rounded-none p-2"
              onChange={(e: any) => setMarkingCriteriaName(e.target.value)}
              value={markingCriteriaName}
            />
          </div>
          <Category
            categoryName={"Summary"}
            singularValue={summary}
            setSingularValue={setSummary}
            pluralValues={summaries}
            setPluralValues={setSummaries}
          />
          <Category
            categoryName={"Next Actions"}
            singularValue={nextAction}
            setSingularValue={setNextAction}
            pluralValues={nextActions}
            setPluralValues={setNextActions}
          />
          <Category
            categoryName={"Key Diagnosis"}
            singularValue={keyDiagnosis}
            setSingularValue={setKeyDiagnosis}
            pluralValues={keyDiagnosiss}
            setPluralValues={setKeyDiagnosiss}
          />
          <Category
            categoryName={"Any New Medication"}
            singularValue={newMedication}
            setSingularValue={setNewMedication}
            pluralValues={newMedications}
            setPluralValues={setNewMedications}
          />
        </div>
        <div className="flex justify-start">
          <Button
            className="bg-primary text-primary-foreground"
            onClick={saveMarkingCriteria}
          >
            Save Marking Criteria
          </Button>
        </div>
      </div>
    </div>
  );
}
