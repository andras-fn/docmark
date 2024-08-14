// GET - get all document groups

import { db } from "@/db/client";
import { count, ilike } from "drizzle-orm";
import { z } from "zod";
import {
  documentGroup,
  insertDocumentGroupSchema,
} from "@/db/schemas/documentGroup";

import { validateRequest } from "@/auth/auth";

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
      offset: url.searchParams.get("offset"),
      limit: url.searchParams.get("limit"),
    };

    // validate the offset and limit
    const offsetAndLimitSchema = z.object({
      offset: z.coerce.number().min(0).max(100000),
      limit: z.coerce.number().min(0).max(100),
    });

    const validatedOffsetAndLimit = offsetAndLimitSchema.parse(params);

    // check for a search parameter
    const search = url.searchParams.get("search");

    // check it's a string using zod
    const searchSchema = z.string().nullable();

    // validate the search parameter
    const term = searchSchema.parse(search);

    // generate the drizzle query to fetch document groups
    const query = db
      .select({
        id: documentGroup.id,
        name: documentGroup.name,
        createdAt: documentGroup.createdAt,
        updatedAt: documentGroup.updatedAt,
      })
      .from(documentGroup)
      .orderBy(documentGroup.createdAt)
      .offset(validatedOffsetAndLimit.offset)
      .where(term ? ilike(documentGroup.name, `%${term}%`) : undefined);

    if (validatedOffsetAndLimit.limit > 0) {
      query.limit(validatedOffsetAndLimit.limit);
    } else {
      query.limit(20);
    }

    const [results, totalResultCount] = await Promise.all([
      query,
      db
        .select({ count: count() })
        .from(documentGroup)
        .where(term ? ilike(documentGroup.name, `%${term}%`) : undefined),
    ]);

    //console.log(results);

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
    return Response.json({ status: 400, issues: error }, { status: 500 });
  }
}

// POST - create a document group
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
    //console.log("---", requestBody);

    const parsedDocumentGroup = insertDocumentGroupSchema.parse(requestBody);

    const [insertResult] = await db
      .insert(documentGroup)
      .values(parsedDocumentGroup)
      .returning({ id: documentGroup.id });

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
