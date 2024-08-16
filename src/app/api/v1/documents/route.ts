import { db } from "@/db/client";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { document, insertDocumentSchema } from "@/db/schemas/document";

import { validateRequest } from "@/auth/auth";

// GET - get all documents

export async function GET(request: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return Response.json(
      { status: 401, issues: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    // get the url params
    const url = new URL(request.url);
    const params = {
      documentGroupId: url.searchParams.get("documentGroupId"),
      offset: url.searchParams.get("offset"),
      limit: url.searchParams.get("limit"),
    };

    // validate the offset and limit
    const offsetAndLimitSchema = z.object({
      documentGroupId: z.string().uuid().nullable().optional(),
      offset: z.coerce.number().min(0).max(100000),
      limit: z.coerce.number().min(0).max(10000),
    });

    const validatedOffsetAndLimit = offsetAndLimitSchema.parse(params);

    //console.log(validatedOffsetAndLimit);

    // generate the drizzle query to fetch document groups
    const query = db
      .select({
        id: document.id,
        documentGroupId: document.documentGroupId,
        documentName: document.documentName,
        documentText: document.documentText,
        aiResults: document.aiResults,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
        userPrompt: document.userPrompt,
        systemPrompt: document.systemPrompt,
      })
      .from(document)
      .orderBy(document.createdAt)
      .offset(validatedOffsetAndLimit.offset)
      .limit(
        validatedOffsetAndLimit.limit > 0 ? validatedOffsetAndLimit.limit : 20
      );

    if (validatedOffsetAndLimit.documentGroupId) {
      query.where(
        eq(document.documentGroupId, validatedOffsetAndLimit.documentGroupId)
      );
    }

    const countQuery = db.select({ count: count() }).from(document);

    if (validatedOffsetAndLimit.documentGroupId) {
      countQuery.where(
        eq(document.documentGroupId, validatedOffsetAndLimit.documentGroupId)
      );
    }

    const [results, totalResultCount] = await Promise.all([query, countQuery]);

    return Response.json(
      {
        data: results,
        pagination: {
          offset: validatedOffsetAndLimit.offset,
          limit:
            validatedOffsetAndLimit.limit === 0
              ? 20
              : validatedOffsetAndLimit.limit,
          totalResultCount: totalResultCount[0].count,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ status: 500, issues: error }, { status: 500 });
  }
}

// POST - create a document
export async function POST(request: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return Response.json(
      { status: 401, issues: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const requestBody = await request.json();

    const parsedDocument = insertDocumentSchema.parse(requestBody);

    const [insertResult] = await db
      .insert(document)
      .values(parsedDocument)
      .returning({ id: document.id });

    return Response.json({ id: insertResult.id }, { status: 201 });
  } catch (error: any) {
    console.log(JSON.stringify({ error: error.toString() }, null, 2));
    if (
      error.toString().includes("SyntaxError: Unexpected end of JSON input")
    ) {
      return Response.json(
        {
          status: 400,
          issues: [
            {
              code: "invalid_type",
              expected: "json",
              received: "none",
              path: ["body"],
              message: "Invalid JSON input. Please provide a valid JSON input.",
            },
          ],
        },
        { status: 400 }
      );
    }

    if (error instanceof z.ZodError) {
      return Response.json({ status: 400, issues: error }, { status: 400 });
    }

    return Response.json(
      { status: 400, issues: [error.toString()] },
      { status: 400 }
    );
  }
}
