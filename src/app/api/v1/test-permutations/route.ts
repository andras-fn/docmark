import { eq, and, count } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import {
  markingRunPermutations,
  MarkingRunPermutations,
} from "@/db/schemas/markingRunPermutations";

export async function GET(
  request: Request,
  { params }: { params: { testPermutationId: string } }
) {
  try {
    // get the url params
    const url = new URL(request.url);
    const params = {
      markingRunId: url.searchParams.get("markingRunId"),
      offset: url.searchParams.get("offset"),
      limit: url.searchParams.get("limit"),
    };

    // validate the offset and limit
    const offsetAndLimitSchema = z.object({
      markingRunId: z.string().uuid().nullable().optional(),
      offset: z.coerce.number().min(0).max(100000),
      limit: z.coerce.number().min(0).max(100),
    });

    const validatedOffsetAndLimit = offsetAndLimitSchema.parse(params);

    //console.log(validatedOffsetAndLimit);

    // generate the drizzle query to fetch document groups
    const query = db
      .select()
      .from(markingRunPermutations)
      .orderBy(markingRunPermutations.createdAt)
      .offset(validatedOffsetAndLimit.offset)
      .limit(
        validatedOffsetAndLimit.limit > 0 ? validatedOffsetAndLimit.limit : 20
      );

    const countQuery = db
      .select({ count: count() })
      .from(markingRunPermutations);

    if (validatedOffsetAndLimit.markingRunId) {
      query.where(
        eq(
          markingRunPermutations.markingRunId,
          validatedOffsetAndLimit.markingRunId
        )
      );

      countQuery.where(
        eq(
          markingRunPermutations.markingRunId,
          validatedOffsetAndLimit.markingRunId
        )
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
    console.error(error);
    return Response.json({ status: 400, issues: error }, { status: 500 });
  }
}
