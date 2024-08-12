import test from "node:test";
import TestResultCard from "./TestResultCard";

const ResultsViewer = () => {
  const testTests = [
    {
      testDescription: "Test 1",
      evaluation: "PASS",
      comment: "Test 1 comment",
      numberTotal: 20,
      numberPassed: 10,
      numberFailed: 10,
    },
    {
      testDescription: "Test 2",
      evaluation: "FAIL",
      comment: "Test 2 comment",
    },
    {
      testDescription: "Test 3",
      evaluation: "PASS",
      comment: "Test 3 comment",
    },
    {
      testDescription: "Test 4",
      evaluation: "FAIL",
      comment: "Test 4 comment",
    },
  ];
  return (
    <div className="flex flex-col gap-y-2 w-full p-2 h-full">
      {/* make this section scrollable */}
      <div className="border rounded border-slate-500 divide-y divide-slate-500">
        <div className="p-2">Summary</div>

        <div className="flex flex-col divide-y divide-slate-500">
          {testTests.map((test) => (
            <TestResultCard test={test} />
          ))}
        </div>
      </div>
      <div className="border rounded border-slate-500 divide-y divide-slate-500">
        <div className="p-2">Key Diagnosis</div>
        <div className="p-2">Key Diagnosis results go here</div>
      </div>
      <div className="border rounded border-slate-500 divide-y divide-slate-500">
        <div className="p-2">Any New Medication</div>
        <div className="p-2">Any New Medication results go here</div>
      </div>
      <div className="border rounded border-slate-500 divide-y divide-slate-500">
        <div className="p-2">Urgency</div>
        <div className="p-2">Urgency results go here</div>
      </div>
      <div className="border rounded border-slate-500 divide-y divide-slate-500">
        <div className="p-2">Next Actions</div>
        <div className="p-2">Next Actions results go here</div>
      </div>
    </div>
  );
};
export default ResultsViewer;
