import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Description from "@/components/Description";
import PlusIcon from "@/components/icons/PlusIcon";
import type { Description as DescriptionType } from "@/types/description";

interface CategoryProps {
  categoryName: string;
  singularValue: string;
  setSingularValue: React.Dispatch<React.SetStateAction<string>>;
  pluralValues: DescriptionType[];
  setPluralValues: React.Dispatch<React.SetStateAction<DescriptionType[]>>;
}

const Category: React.FC<CategoryProps> = ({
  categoryName,
  singularValue,
  setSingularValue,
  pluralValues,
  setPluralValues,
}) => {
  const handleAddDescription = (
    description: string,
    setState: React.Dispatch<React.SetStateAction<DescriptionType[]>>,
    clearState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (description.trim() === "") {
      // Set error state for this field
      // Example: setErrorState(true);
    } else {
      // Proceed with adding the description
      const newDescription: DescriptionType = {
        id: Date.now(),
        description: description,
      };
      setState((prevState) => [...prevState, newDescription]);
      clearState("");
    }
  };

  return (
    <div className="grid">
      <h2 className="font-semibold">{categoryName}</h2>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <input
            placeholder="Add description"
            className="flex-1 w-96 border border-slate-500 rounded-none p-2"
            onChange={(e) => setSingularValue(e.target.value)}
            value={singularValue}
          />
          <Button
            variant="ghost"
            size="icon"
            className="ml-4"
            onClick={() =>
              handleAddDescription(
                singularValue,
                setPluralValues,
                setSingularValue
              )
            }
          >
            <PlusIcon className="w-5 h-5" />
            <span className="sr-only">Add</span>
          </Button>
        </div>
        <div className="grid gap-2 border-l-2 border-muted pl-4">
          {pluralValues.map((description: DescriptionType) => (
            <Description
              key={description.id}
              description={description}
              pluralValues={pluralValues}
              setPluralValues={setPluralValues}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Category;
