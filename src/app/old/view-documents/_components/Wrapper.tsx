"use client";
import { useState } from "react";

const Wrapper = ({ results }) => {
  const [selectedresult, setSelectedresult] = useState(null);
  return (
    <div className="w-full h-full flex text-black">
      <div className="border-r border-violet-800 h-full flex flex-col w-96">
        <div className="w-full flex flex-col items-center bg-violet-500 text-white">
          <h2 className="p-2">Documents</h2>
        </div>

        <div className="flex flex-col h-full divide-y divide-violet-800">
          {results.map((result) => (
            <button
              key={result.id}
              className="py-2 hover:bg-violet-300 w-full text-left"
              onClick={() => setSelectedresult(result)}
            >
              <p className="px-2">{result.documentName}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="w-full">
        {selectedresult && (
          <div className="grid grid-cols-2 w-full">
            <div className="p-2">
              <p className="font-bold">Document Text</p>
              <textarea
                name=""
                id="text"
                className="w-full border border-slate-500 p-2"
                rows={20}
                value={selectedresult.documentText}
                readOnly
              ></textarea>
            </div>
            <div className="p-2">
              <p className="font-bold">AI Results (JSON)</p>
              <textarea
                name=""
                id="json"
                className="w-full border border-slate-500 p-2"
                rows={20}
                value={selectedresult.aiResults}
                readOnly
              ></textarea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Wrapper;
