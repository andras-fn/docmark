import { Button } from "@/components/ui/button";
import type { Description } from "@/types/description";
import Trash2Icon from "@/components/icons/Trash2Icon";
import type { Description as DescriptionType } from "@/types/description";

interface DescriptionProps {
  description: Description;
  pluralValues: DescriptionType[];
  setPluralValues: React.Dispatch<React.SetStateAction<DescriptionType[]>>;
}

const Description = ({
  description,
  pluralValues,
  setPluralValues,
}: DescriptionProps) => {
  const handleDelete = () => {
    // Add your delete logic here
    // For example, you can remove the description from the pluralValues array
    const updatedPluralValues = pluralValues.filter(
      (value) => value.id !== description.id
    );
    setPluralValues(updatedPluralValues);
  };

  return (
    <div key={description.id} className="flex items-center justify-between">
      <p className="text-sm">{description.description}</p>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500"
          onClick={handleDelete}
        >
          <Trash2Icon className="w-4 h-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
};
export default Description;
