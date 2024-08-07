import Wrapper from "./_components/Wrapper";
import { s3Connections } from "@/db/schema";
import { db } from "@/db/client";

const page = async () => {
  const results = await db
    .select({
      id: s3Connections.id,
      name: s3Connections.name,
    })
    .from(s3Connections);
  console.log(results);

  return (
    <div className="p-2">
      <Wrapper intialS3Connections={results} />
    </div>
  );
};
export default page;
