import Viewer from "./_components/Viewer";
import { validateRequest } from "@/auth/auth";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: any }) => {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const { markingRunId } = params;
  return (
    <div className="p-2 h-screen max-h-screen">
      <Viewer markingRunId={markingRunId} />
    </div>
  );
};
export default page;
