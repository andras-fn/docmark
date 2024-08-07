const MarkingRunViewer = ({ selectedMarkingRun }) => {
  return (
    <div className="h-full w-full">
      <div className="flex justify-between w-full border-b border-slate-500 items-center">
        {selectedMarkingRun ? (
          <h4 className="p-2 font-medium">{selectedMarkingRun?.name}</h4>
        ) : (
          <h4 className="p-2 font-medium">No Marking Run Selected</h4>
        )}
      </div>
      {selectedMarkingRun ? (
        <div className="grid grid-cols-3 grid-rows-2 gap-2 p-2 h-[calc(100%-41px)]">
          Run info goes here
        </div>
      ) : (
        <p className="p-2">No Marking Run Selected</p>
      )}
    </div>
  );
};
export default MarkingRunViewer;
