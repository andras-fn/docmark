"use client";

import { useState } from "react";

const Wrapper = ({ groupedByMarkingCriteria }) => {
  const [selectedMarkingCriteria, setSelectedMarkingCriteria] = useState(null);
  return (
    <div className="h-full text-black flex">
      <div className="border-r border-violet-800 h-full flex flex-col w-96">
        <div className="w-full flex flex-col items-center bg-violet-500 text-white">
          <h2 className="p-2">Marking Criteria</h2>
        </div>

        <div className="flex flex-col h-full divide-y divide-violet-800">
          {groupedByMarkingCriteria.map((markingCriteria) => (
            <button
              key={markingCriteria.markingCriteriaId}
              className="py-2 hover:bg-violet-300 w-full text-left"
              onClick={() => setSelectedMarkingCriteria(markingCriteria)}
            >
              <span className="px-2">
                {markingCriteria.markingCriteriaName}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="h-full w-96">
        {selectedMarkingCriteria && (
          <div className="flex flex-col w-full h-full divide-y divide-violet-800 border-b border-r border-violet-800">
            <div className="w-full">
              <p className="p-2 bg-violet-500 text-white w-full">Summary</p>
              <div className="divide-y divide-violet-800">
                {selectedMarkingCriteria.categories.summary.descriptions.map(
                  (description: string) => (
                    <p className="p-2" key={description.id}>
                      {description.description}
                    </p>
                  )
                )}
              </div>
            </div>
            <div className="">
              <p className="p-2 bg-violet-500 text-white">Next Actions</p>
              <div className="divide-y divide-violet-800">
                {selectedMarkingCriteria.categories.nextActions.descriptions.map(
                  (description: string) => (
                    <p className="p-2">{description.description}</p>
                  )
                )}
              </div>
            </div>
            <div className="">
              <p className="p-2 bg-violet-500 text-white">Key Diagnosis</p>
              <div className="divide-y divide-violet-800">
                {selectedMarkingCriteria.categories.keyDiagnosis.descriptions.map(
                  (description: string) => (
                    <p className="p-2">{description.description}</p>
                  )
                )}
              </div>
            </div>
            <div className="">
              <p className="p-2 bg-violet-500 text-white">Any New Medication</p>
              <div className="divide-y divide-violet-800">
                {selectedMarkingCriteria.categories.anyNewMedication.descriptions.map(
                  (description: string) => (
                    <p className="p-2">{description.description}</p>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Wrapper;
