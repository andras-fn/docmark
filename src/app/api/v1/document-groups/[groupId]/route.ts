import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  documentGroup,
  insertDocumentGroupSchema,
} from "@/db/schemas/documentGroup";

export async function GET(request: Request, { params }: { params: any }) {
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
