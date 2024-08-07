import Viewers from "./_components/Viewers";
import AddMarkingSchemeButtonModal from "./_components/AddMarkingSchemeButtonModal";

const page = () => {
  return (
    <div className="p-2 h-screen max-h-screen">
      <div className="border border-slate-500 rounded flex flex-col divide-y divide-slate-500 max-h-full h-full">
        <div className="flex justify-between items-center text-black p-2 font-semibold text-xl">
          <p>View Marking Schemes</p>
          <div className="flex gap-x-2">
            <AddMarkingSchemeButtonModal />
          </div>
        </div>
        <Viewers />
      </div>
    </div>
  );
};
export default page;
