import { document, markingCriteria } from "@/db/schema";
import { db } from "@/db/client";
import Wrapper from "./_components/Wrapper";

const page = async () => {
  const documentResults = await db.select().from(document);
  const documentResultsClean = documentResults.map((result) => {
    return {
      id: result.id,
      name: result.documentName,
    };
  });

  const markingCriteriaResults = await db.select().from(markingCriteria);
  const markingCriteriaResultsClean = markingCriteriaResults.map((result) => {
    return {
      id: result.id,
      name: result.markingCriteriaName,
    };
  });

  return (
    <div className="text-black w-full h-full flex divide-x divide-violet-800">
      <Wrapper
        documents={documentResultsClean}
        markingCriteria={markingCriteriaResultsClean}
      />
    </div>
  );
};
export default page;
