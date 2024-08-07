import { useState } from "react"; // Ensure React is imported
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

const ComboBoxMultiSelect = ({
  dataArray,
  selectedData,
  setSelectedData,
  selectMessage,
  searchMessage,
  notFoundMessage,
  onSearchChange,
}) => {
  const [open, setOpen] = useState(false);

  const selectHandler = (value) => {
    console.log("select handler");
    // check if item is already in selectedData
    const itemIndex = selectedData.findIndex((item) => item.id === value);

    // if it is then remove it
    if (itemIndex !== -1) {
      setSelectedData([
        ...selectedData.slice(0, itemIndex),
        ...selectedData.slice(itemIndex + 1),
      ]);
    } else {
      // if it is not then add it
      setSelectedData([
        ...selectedData,
        dataArray.find((item) => item.id === value),
      ]);
    }
  };

  const handleOnSearchChange = useDebouncedCallback((e: string) => {
    if (e === "") {
      return;
    }

    if (onSearchChange) {
      onSearchChange(e);
    }
  }, 300);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedData.length > 0
            ? `${selectedData.length} items selected`
            : selectMessage}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={searchMessage}
            onValueChange={handleOnSearchChange}
          />
          <CommandEmpty>{notFoundMessage}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {dataArray &&
                dataArray.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => {
                      selectHandler(item.id);
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedData.find(
                          (selectedItem) => selectedItem.id === item.id
                        )
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {item.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBoxMultiSelect;
