import { db } from "@/db/client";
import { z } from "zod";
import { validateRequest } from "@/auth/auth";
import { documentGroup } from "@/db/schemas/documentGroup";
import { bulkUploadData } from "@/db/schemas/bulkUploadData";
import { count, desc, eq } from "drizzle-orm";

// POST - create a document group
export async function GET(request: Request) {
  // const { user } = await validateRequest();
  // if (!user) {
  //   return Response.json(
  //     { status: 401, issues: "Unauthorized" },
  //     { status: 401 }
  //   );
  // }
  try {
    console.log("getting url params");
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

    // get a list of things in the bulkDataTable

    const query = db
      .select({
        id: bulkUploadData.id,
        createdAt: bulkUploadData.createdAt,
        documentGroupName: documentGroup.name,
        bucket: bulkUploadData.bucket,
        region: bulkUploadData.region,
        folder: bulkUploadData.folder,
        numberOfFiles: bulkUploadData.numberOfFiles,
        status: bulkUploadData.status,
      })
      .from(bulkUploadData)
      .leftJoin(
        documentGroup,
        eq(bulkUploadData.documentGroupId, documentGroup.id)
      )
      .orderBy(desc(bulkUploadData.createdAt))
      .offset(validatedOffsetAndLimit.offset);

    if (validatedOffsetAndLimit.limit > 0) {
      query.limit(validatedOffsetAndLimit.limit);
    } else {
      query.limit(20);
    }

    const [results, totalResultCount] = await Promise.all([
      query,
      db.select({ count: count() }).from(bulkUploadData),
    ]);

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
