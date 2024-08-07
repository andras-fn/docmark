import { markingCriteria, category, description } from "@/db/schema";
import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import Wrapper from "./_components/Wrapper";
import { groupByMarkingCriteria } from "../utils/groupMarkingCriteria";

const page = async () => {
  const results = await db
    .select()
    .from(markingCriteria)
    .leftJoin(category, eq(markingCriteria.id, category.markingCriteriaId))
    .leftJoin(description, eq(category.id, description.categoryId));

  const groupedByMarkingCriteria = groupByMarkingCriteria(results);

  return (
    <div className="h-full w-full border-l border-violet-800">
      <Wrapper groupedByMarkingCriteria={groupedByMarkingCriteria} />
    </div>
  );
};
export default page;
