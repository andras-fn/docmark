// GET - get all document groups

import { db } from "@/db/client";
import { count, ilike } from "drizzle-orm";
import { z } from "zod";
import {
  documentGroup,
  insertDocumentGroupSchema,
} from "@/db/schemas/documentGroup";
import {
  S3Client,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  _Object,
} from "@aws-sdk/client-s3";

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
      accessKey: url.searchParams.get("accessKey"),
      secretKey: url.searchParams.get("secretKey"),
      region: url.searchParams.get("region"),
      bucketName: url.searchParams.get("bucketName"),
      folder: url.searchParams.get("folder"),
      offset: url.searchParams.get("offset"),
      limit: url.searchParams.get("limit"),
    };

    // send request to s3 bucket
    export const fetchObjects = async (bucket: string) => {
      const objects: _Object[] = [];

      async function fetchObjectsWithPagination(
        bucket: string,
        continuationToken?: ListObjectsV2CommandInput["ContinuationToken"]
      ): Promise<void> {
        const s3 = new S3Client({ region: "YOUR_S3_BUCKET_REGION" });

        const result = await s3.send(
          new ListObjectsV2Command({
            Bucket: bucket,
            ContinuationToken: continuationToken,
          })
        );

        objects.push(...(result.Contents || []));

        if (result.NextContinuationToken) {
          return fetchObjectsWithPagination(
            bucket,
            result.NextContinuationToken
          );
        }

        return;
      }

      await fetchObjectsWithPagination(bucket);

      return objects;
    };

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
