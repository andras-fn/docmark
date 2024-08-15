const TestResultCard = ({
  test,
}: {
  test: {
    evaluation: string;
    testDescription: string;
    comment: string;
  };
}) => {
  return (
    <div className="flex flex-col px-2 py-1">
      <div className="flex gap-x-1 items-center text-black font-medium">
        <p
          className={`font-semibold ${
            test.evaluation === "PASS" ? "text-green-600" : "text-red-600"
          }`}
        >
          {test.evaluation}
        </p>
        <p>-</p>
        <p>{test.testDescription}</p>
      </div>

      <div className="flex items-center text-black gap-x-2">
        <p className="text-sm">{test.comment}</p>
      </div>
    </div>
  );
};
export default TestResultCard;
