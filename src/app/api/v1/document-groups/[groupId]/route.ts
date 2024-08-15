import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import { documentGroup } from "@/db/schemas/documentGroup";
import { validateRequest } from "@/auth/auth";

export async function GET(request: Request, { params }: { params: any }) {
  const { user } = await validateRequest();
  if (!user) {
    return Response.json(
      { status: 401, issues: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const groupId = params.groupId;

    const [results] = await db
      .select()
      .from(documentGroup)
      .where(eq(documentGroup.id, groupId));

    return Response.json({ status: 200, data: results }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ status: 500, issues: [error] }, { status: 500 });
  }
}
