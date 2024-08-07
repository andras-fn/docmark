import { document } from "@/db/schema";
import { db } from "@/db/client";
import Wrapper from "./_components/Wrapper";

const page = async () => {
  const results = await db.select().from(document);

  console.log(results);

  return (
    <div className="h-full w-full">
      <Wrapper results={results} />
    </div>
  );
};
export default page;
