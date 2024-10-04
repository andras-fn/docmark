import { db } from "@/db/client";
import { z } from "zod";
import { encrypt } from "@/lib/encrypt";
import { validateRequest } from "@/auth/auth";
import {
  documentGroup,
  insertDocumentGroupSchema,
} from "@/db/schemas/documentGroup";
import { bulkUploadData } from "@/db/schemas/bulkUploadData";

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
    console.log("Request body", requestBody);

    // validate the request body
    const bodySchema = z.object({
      name: z.string().min(1),
      accessKey: z.string().nullable().optional(),
      secretKey: z.string().nullable().optional(),
      region: z.string().min(1),
      bucketName: z.string().min(1),
      folder: z.string().nullable().optional(),
      numberOfFiles: z.number(),
    });

    const parsedBody = bodySchema.parse(requestBody);
    console.log("Parsed body", parsedBody);

    // encrypt the data
    const encryptedAccessKey = parsedBody.accessKey
      ? encrypt(parsedBody.accessKey)
      : null;

    const encryptedSecretKey = parsedBody.secretKey
      ? encrypt(parsedBody.secretKey)
      : null;

    // insert document group
    const parsedDocumentGroup = insertDocumentGroupSchema.parse({
      name: requestBody.name,
    });

    const [insertResult] = await db
      .insert(documentGroup)
      .values(parsedDocumentGroup)
      .returning({ id: documentGroup.id });

    // insert bulk upload data
    const bulkUploadDataPayload = {
      documentGroupId: insertResult.id,
      bucket: parsedBody.bucketName,
      region: parsedBody.region,
      accessKey: encryptedAccessKey?.encryptedData,
      secretKey: encryptedSecretKey?.encryptedData,
      folder: parsedBody.folder,
      accessKeyIv: encryptedAccessKey?.iv,
      secretKeyIv: encryptedSecretKey?.iv,
      numberOfFiles: parsedBody.numberOfFiles,
    };

    const bulkUploadDataResult = await db
      .insert(bulkUploadData)
      .values(bulkUploadDataPayload)
      .returning({ id: bulkUploadData.id });

    // create message in queue

    console.log("Bulk upload data inserted", bulkUploadDataResult);

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
