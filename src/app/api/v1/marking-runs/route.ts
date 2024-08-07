import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { markingRun, insertMarkingRunSchema } from "@/db/schemas/markingRun";
import {
  markingRunPermutations,
  MarkingRunPermutations,
} from "@/db/schemas/markingRunPermutations";
import { db } from "@/db/client";
import { count, eq, ilike, desc } from "drizzle-orm";
import { z } from "zod";

const sqsClient = new SQSClient({
  region: process.env.SQS_URL?.split(".")[1],
  endpoint: process.env.SQS_URL,
});

// GET - fetch marking runs
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

    // generate the drizzle query to fetch document groups
    const query = db
      .select()
      .from(markingRun)
      // .leftJoin(
      //   markingRunPermutations,
      //   eq(markingRun.id, markingRunPermutations.markingRunId)
      // )
      .orderBy(desc(markingRun.createdAt))
      .offset(validatedOffsetAndLimit.offset)
      .where(term ? ilike(markingRun.name, `%${term}%`) : undefined);

    if (validatedOffsetAndLimit.limit > 0) {
      query.limit(validatedOffsetAndLimit.limit);
    } else {
      query.limit(20);
    }

    const [results, totalResultCount] = await Promise.all([
      query,
      db
        .select({ count: count() })
        .from(markingRun)
        .where(term ? ilike(markingRun.name, `%${term}%`) : undefined),
    ]);

    console.log(results);

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
    return Response.json({ status: 400, issues: error }, { status: 500 });
  }
}

// POST - create marking run
export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    console.log(JSON.stringify(requestBody, null, 2));

    // validate inbound data
    if (!requestBody) {
      return Response.json(
        { status: 400, message: "Bad request, missing request body" },
        { status: 400 }
      );
    }

    try {
      insertMarkingRunSchema.parse(requestBody);
    } catch (error) {
      console.error(error);
      return Response.json(
        { status: 400, message: "Bad request, invalid request body" },
        { status: 400 }
      );
    }

    // save to db
    const [insertResult] = await db
      .insert(markingRun)
      .values(requestBody)
      .returning({ id: markingRun.id });

    console.log(JSON.stringify({ markingRunId: insertResult.id }));

    if (process.env.ENVIRONMENT === "test") {
      // send message to sqs
      const data = await sqsClient.send(
        new SendMessageCommand({
          QueueUrl: process.env.SQS_URL, // The URL of the SQS queue
          MessageBody: JSON.stringify({ markingRunId: insertResult.id }), // The message body
        })
      );

      console.log("Success, message sent. MessageID:", data.MessageId);
    }

    return Response.json(
      { status: 201, markingRunId: insertResult.id },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ status: 400, issues: error }, { status: 500 });
  }
}
