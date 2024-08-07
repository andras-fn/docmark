"use client";

import { useState } from "react";

const page = () => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [json, setJson] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const saveClickHandler = async () => {
    // Call your API here
    if (name === "") {
      setError(true);
      setErrorMessage("Please enter document name");
      return;
    }

    if (text === "") {
      setError(true);
      setErrorMessage("Please enter document text");
      return;
    }
    if (json === "") {
      setError(true);
      setErrorMessage("Please enter AI results");
      return;
    }

    if (!isValidJson(json)) {
      setError(true);
      setErrorMessage("Invalid JSON format");
      return;
    }

    function isValidJson(json: string): boolean {
      try {
        JSON.parse(json);
        return true;
      } catch (error) {
        return false;
      }
    }

    const document = {
      documentName: name,
      documentText: text,
      aiResults: json,
    };

    console.log("Document to save", document);

    try {
      // Make API call
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(document),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Document saved successfully", data);
        setSuccess(true);
        setError(false);
        setErrorMessage("");
        setName("");
        setText("");
        setJson("");
      }
    } catch (error) {
      console.error("Error saving document", error);
    }
  };
  return (
    <div className=" w-full flex flex-col text-black h-full">
      {success && (
        <div className="p-2 bg-green-500 text-white">
          Document saved successfully
        </div>
      )}
      {error && <div className="p-2 bg-red-500 text-white">{errorMessage}</div>}
      <div className="p-2">
        <p className="font-bold">Document Name</p>
        <input
          type="text"
          className="w-full border border-slate-500 p-2"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        />
      </div>
      <div className="grid grid-cols-2 w-full">
        <div className="p-2">
          <p className="font-bold">Document Text</p>
          <textarea
            name=""
            id="text"
            className="w-full border border-slate-500 p-2"
            rows={20}
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
          ></textarea>
        </div>
        <div className="p-2">
          <p className="font-bold">AI Results (JSON)</p>
          <textarea
            name=""
            id="json"
            className="w-full border border-slate-500 p-2"
            rows={20}
            onChange={(e) => {
              setJson(e.target.value);
            }}
            value={json}
          ></textarea>
        </div>
      </div>
      <div className="w-full flex px-2">
        <button
          className="p-2 border border-black rounded"
          onClick={saveClickHandler}
        >
          Save Document
        </button>
      </div>
    </div>
  );
};
export default page;
