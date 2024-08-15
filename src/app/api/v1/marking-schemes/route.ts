import { db } from "@/db/client";
import { count, asc, ilike, eq } from "drizzle-orm";
import { z } from "zod";
import {
  markingScheme,
  insertMarkingSchemeSchema,
  type MarkingScheme,
} from "@/db/schemas/markingScheme";
import {
  testCriteria,
  insertTestCriteriaSchema,
  type TestCriteria,
} from "@/db/schemas/testCriteria";
import { reduceMarkingSchemeResults } from "@/lib/reduceMarkingSchemeResults";

export async function GET(request: Request) {
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

    const query = db
      .select({
        markingScheme: markingScheme,
        testCriteria: testCriteria,
      })
      .from(markingScheme)
      .leftJoin(
        testCriteria,
        eq(markingScheme.id, testCriteria.markingSchemeId)
      )
      .limit(
        validatedOffsetAndLimit.limit > 0 ? validatedOffsetAndLimit.limit : 20
      )
      .offset(validatedOffsetAndLimit.offset)
      .orderBy(asc(markingScheme.createdAt));

    if (term) {
      query.where(ilike(markingScheme.name, `%${term}%`));
    }
    //console.log("ttt");

    const queryResults = await query;
    //console.log(queryResults);

    const countQuery = db
      .select({ count: count() })
      .from(markingScheme)
      .where(term ? ilike(markingScheme.name, `%${term}%`) : undefined);

    const [results, totalResultCount] = await Promise.all([query, countQuery]);

    const result: MarkingScheme[] = await reduceMarkingSchemeResults(
      queryResults.map((item) => {
        return {
          markingScheme: {
            id: item.markingScheme.id,
            name: item.markingScheme.name,
            createdAt: item.markingScheme.createdAt,
            updatedAt: item.markingScheme.updatedAt,
          },
          testCriteria: item.testCriteria
            ? {
                testDescription: item.testCriteria.testDescription,
                category: item.testCriteria.category,
                testCriteriaId: item.testCriteria.id,
              }
            : null,
        };
      })
    );

    console.log(result);

    return Response.json(
      {
        data: result,
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
  try {
    const requestBody = await request.json();

    console.log(requestBody);

    const parsedMarkingScheme = insertMarkingSchemeSchema.parse({
      name: requestBody.name,
    });

    const parsedTestCriteria: TestCriteria[] = requestBody.testCriteria.map(
      (criteria: any) => {
        return insertTestCriteriaSchema
          .pick({ testDescription: true, category: true })
          .parse(criteria);
      }
    );

    const markingSchemeId: string = await db.transaction(async (tx) => {
      const [returnedMarkingschemeId] = await tx
        .insert(markingScheme)
        .values(parsedMarkingScheme)
        .returning({ id: markingScheme.id });

      await tx.insert(testCriteria).values(
        parsedTestCriteria.map((criteria) => {
          return { ...criteria, markingSchemeId: returnedMarkingschemeId.id };
        })
      );

      return returnedMarkingschemeId.id;
    });

    return Response.json({ id: await markingSchemeId }, { status: 201 });
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
