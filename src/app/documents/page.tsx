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
