import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { s3Connections } from "@/db/schema";
import { encrypt } from "@/lib/encrypt";

export async function POST(request: Request) {
  try {
    const res = await request.json();

    // Save the marking criteria to the database
    console.log(res);

    const s3ConnectionId = randomUUID();

    const s3ConnectionResult = await db.insert(s3Connections).values({
      id: s3ConnectionId,
      name: res.name,
      endpoint: res.endpoint,
      port: res.port,
      useSSL: res.useSSL ? 1 : 0,
      accessKey: encrypt(res.accessKey),
      secretKey: encrypt(res.secretKey),
    });

    return Response.json(
      { id: s3ConnectionId, name: res.name },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ error_message: error }, { status: 500 });
  }
}
