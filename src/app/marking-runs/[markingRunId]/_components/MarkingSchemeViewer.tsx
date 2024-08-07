const MarkingSchemeViewer = ({ markingSchemeData }) => {
  return (
    <div className="w-full">{JSON.stringify(markingSchemeData, null, 2)}</div>
  );
};
export default MarkingSchemeViewer;
