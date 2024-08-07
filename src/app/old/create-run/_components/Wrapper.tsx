"use client";

import { useState } from "react";

import Selector from "./Selector";

const Wrapper = ({ documents, markingCriteria }) => {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [selectedMarkingCriteria, setSelectedMarkingCriteria] = useState([]);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const saveHandler = async () => {
    console.log("Save Handler");

    // check if values have been selected
    if (
      selectedDocuments.length === 0 ||
      selectedMarkingCriteria.length === 0
    ) {
      setSuccess(false);
      setSuccessMessage("");
      setError(true);
      setErrorMessage("Please select documents and marking criteria");
      return;
    }

    if (runName === "") {
      setSuccess(false);
      setSuccessMessage("");
      setError(true);
      setErrorMessage("Please enter a run name");
      return;
    }

    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runName: runName,
          documents: selectedDocuments,
          markingCriteria: selectedMarkingCriteria,
        }),
      });

      if (response.ok) {
        const res = await response.json();
        console.log(res);
        console.log("Run created successfully");
        setRunName("");
        setSelectedDocuments([]);
        setSelectedMarkingCriteria([]);
        setError(false);
        setErrorMessage("");
        setSuccess(true);
        setSuccessMessage(`Run created successfully: ${await res.id}`);
        // Handle success case here
      } else {
        console.log("Failed to create run");
        // Handle error case here
        setSuccess(false);
        setSuccessMessage("");
        setError(true);
        setErrorMessage("Failed to create run");
      }
    } catch (error) {
      console.log("Error creating run", error);
      // Handle error case here
      setSuccess(false);
      setSuccessMessage("");
      setError(true);
      setErrorMessage("Failed to create run");
    }
  };

  const [runName, setRunName] = useState("");

  return (
    <div className="flex divide-x divide-violet-800 ">
      <Selector
        name="Documents"
        list={documents}
        selected={selectedDocuments}
        setSelected={setSelectedDocuments}
      />
      <Selector
        name="Marking Criteria"
        list={markingCriteria}
        selected={selectedMarkingCriteria}
        setSelected={setSelectedMarkingCriteria}
      />
      <div className="p-2 flex flex-col gap-y-2 w-96">
        {success && (
          <div className="p-2 bg-green-500 text-white">{successMessage}</div>
        )}
        {error && (
          <div className="p-2 bg-red-500 text-white">{errorMessage}</div>
        )}
        <div className="flex flex-col gap-y-2">
          <div className=" flex flex-col gap-y-1">
            <label className="font-semibold" htmlFor="runName">
              Run Name
            </label>
            <input
              name="runName"
              className="p-2 border border-black"
              value={runName}
              onChange={(e) => setRunName(e.target.value)}
            />
          </div>

          <div className="flex">
            <button
              className="p-2 border border-black rounded hover:bg-slate-300"
              onClick={saveHandler}
            >
              Create Run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Wrapper;
