import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import { s3Connections } from "@/db/schema";
import { encrypt } from "@/lib/encrypt";
import { randomUUID } from "crypto";

export async function GET(request: Request, { params }) {
  try {
    const paramId = params.id;

    // check if valid uuid
    if (!paramId) {
      return Response.json({ error_message: "Invalid ID" }, { status: 400 });
    }

    const results = await db
      .select({
        id: s3Connections.id,
        name: s3Connections.name,
        endpoint: s3Connections.endpoint,
        port: s3Connections.port,
        useSSL: s3Connections.useSSL,
      })
      .from(s3Connections)
      .where(eq(s3Connections.id, paramId));

    return Response.json({ data: results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error_message: error }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }) {
  try {
    const res = await request.json();

    const paramId = params.id;

    // check if valid uuid
    if (!paramId) {
      return Response.json({ error_message: "Invalid ID" }, { status: 400 });
    }

    // Save the marking criteria to the database
    console.log(res);

    const s3ConnectionId = randomUUID();

    const newData = {
      name: res.name,
      endpoint: res.endpoint,
      port: res.port,
      useSSL: res.useSSL ? 1 : 0,
    };

    if (res.accessKey !== "●●●●●●●●●●●●●●●") {
      newData.accessKey = encrypt(res.accessKey);
    }

    if (res.secretKey !== "●●●●●●●●●●●●●●●") {
      newData.secretKey = encrypt(res.secretKey);
    }

    const s3ConnectionResult = await db
      .update(s3Connections)
      .set(newData)
      .where(eq(s3Connections.id, paramId))
      .returning({ id: s3ConnectionId.id, name: s3ConnectionId.name });

    return Response.json(
      { id: s3ConnectionId, name: res.name },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ error_message: error }, { status: 500 });
  }
}
