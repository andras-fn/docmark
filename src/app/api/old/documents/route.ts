import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { document } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const res = await request.json();

    // Save the marking criteria to the database
    console.log(res);

    const documentId = randomUUID();

    const documentResult = await db.insert(document).values({
      id: documentId,
      documentName: res.documentName,
      documentText: res.documentText,
      aiResults: res.aiResults,
    });

    return Response.json({ id: documentId }, { status: 201 });
  } catch (error) {
    return Response.json({ error_message: error }, { status: 500 });
  }
}
