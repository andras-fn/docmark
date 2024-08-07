const Banner = ({ data }) => {
  return (
    <div className="w-full flex items-center p-2 gap-x-8">
      <div className="flex flex-col">
        <div className="text-lg font-semibold">Document Groups</div>
        <div className="text-sm text-gray-500">
          {data && data.numberOfDocumentGroups}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-lg font-semibold">Documents</div>
        <div className="text-sm text-gray-500">
          {data && data.numberOfDocuments}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-lg font-semibold">Marking Schemes</div>
        <div className="text-sm text-gray-500">
          {data && data.numberOfMarkingSchemes}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-lg font-semibold">Test Criteria</div>
        <div className="text-sm text-gray-500">
          {data && data.numberOfTestCriteria}
        </div>
      </div>
    </div>
  );
};
export default Banner;
