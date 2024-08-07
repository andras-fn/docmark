"use client";

const Selector = ({ name, list, selected, setSelected }) => {
  const handleSelect = (e, item) => {
    // check if it's in the selected list

    const index = selected.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );
    if (index > -1) {
      // remove it
      setSelected(
        selected.filter((selectedItem) => selectedItem.id !== item.id)
      );
      return;
    }
    // add it

    setSelected([...selected, item]);
  };

  return (
    <div className="w-96 flex flex-col divide-y divide-violet-800">
      <div className="bg-violet-500 p-2 flex justify-between text-white">
        <p>{name}</p> <p>{selected.length} Selected</p>
      </div>
      <div className="flex flex-col divide-y divide-violet-800">
        {list.map((item, index) => (
          <button
            key={item.id}
            className={`p-2 hover:bg-violet-300 ${
              selected.some((selectedItem) => selectedItem.id === item.id)
                ? "bg-violet-300"
                : ""
            } ${
              index === list.length - 1 ? "!border-b border-violet-800" : ""
            }`}
            onClick={(e) => handleSelect(e, item)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};
export default Selector;
