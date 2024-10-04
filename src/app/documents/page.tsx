// context bar imports
import AddDocumentButtonModal from "./_components/AddDocumentButtonModal";
import AddDocumentGroupButtonModal from "./_components/AddDocumentGroupButtonModal";
import BulkUploadDocumentsButtonModal from "./_components/BulkUploadDocumentsButtonModal";
import BulkUploadProgressButtonModal from "./_components/BulkUploadProgressButtonModal";

// main area imports
import Viewers from "./_components/Viewers";

import { validateRequest } from "@/auth/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return (
    <div className="p-2 h-screen max-h-screen">
      <div className="border border-slate-500 rounded flex flex-col divide-y divide-slate-500 max-h-full h-full">
        <div className="flex justify-between items-center text-black p-2 font-semibold text-xl">
          <p>View Documents</p>
          <div className="flex gap-x-2">
            {/* these need a parent client component that handles all their state. that way when one of them is clicked the fetch request to get the data for that modal can be fired, the data can be loaded into the state and the modals will show the latest data. we can probably do this by passing the open modal state to the useffect in each of the modals*/}
            <AddDocumentGroupButtonModal />
            <AddDocumentButtonModal />
            <BulkUploadDocumentsButtonModal />
            <BulkUploadProgressButtonModal />
          </div>
        </div>
        <Viewers />
      </div>
    </div>
  );
};
export default page;
