import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AddRemoveTestCriteria = ({
  categoryName,
  criteriaValue,
  setCriteriaValue,
  criteriaArray,
  setCriteriaArray,
}: {
  categoryName: string;
  criteriaValue: string;
  setCriteriaValue: (value: string) => void;
  criteriaArray: string[];
  setCriteriaArray: (value: string[]) => void;
}) => {
  return (
    <div className="p-1">
      <Label htmlFor="name" className="text-left">
        {categoryName}
      </Label>
      <div className="flex gap-x-2 mb-2">
        <Input
          placeholder={`Add a Test Description for the ${categoryName}`}
          className="col-span-3"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (criteriaValue.length > 0) {
                setCriteriaArray([
                  criteriaValue,
                  ...criteriaArray.toReversed(),
                ]);
                setCriteriaValue("");
              } else {
                alert("Please enter a value");
              }
            }
          }}
          onChange={(e) => setCriteriaValue(e.target.value)}
          value={criteriaValue}
        />
        <Button
          onClick={(e) => {
            setCriteriaArray([...criteriaArray, criteriaValue]);
            setCriteriaValue("");
          }}
        >
          Add
        </Button>
      </div>
      <div className="flex flex-col w-full border border-gray-300 rounded divide-y">
        {criteriaArray.length === 0 ? (
          <p className="text-gray-300 p-2">No Test Descriptions</p>
        ) : (
          criteriaArray &&
          criteriaArray.map((criteria: string, index: number) => (
            <div
              key={index}
              className="flex gap-x-2 justify-between items-center p-2"
            >
              <p>{criteria}</p>
              <Button
                onClick={(e) => {
                  console.log(criteriaArray);
                  setCriteriaArray([...criteriaArray.toSpliced(index, 1)]);
                }}
                className="bg-red-500 hover:bg-red-700"
              >
                Remove
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default AddRemoveTestCriteria;
