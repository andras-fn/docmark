const TestResultCard = ({ test }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center text-black p-2 font-medium">
        <p>{test.testDescription}</p>
      </div>

      <div className="flex items-center text-black p-2 gap-x-2">
        <p
          className={`font-semibold ${
            test.evaluation === "PASS" ? "text-green-600" : "text-red-600"
          }`}
        >
          {test.evaluation}
        </p>
        <p>-</p>
        <p>{test.comment}</p>
      </div>
    </div>
  );
};
export default TestResultCard;
