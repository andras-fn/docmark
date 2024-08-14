import { NextRequest, NextResponse } from "next/server";
import { lucia, validateRequest } from "@/auth/auth";

export async function GET(request: NextRequest) {
  const { user, session } = await validateRequest();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  const url = request.nextUrl.clone();
  url.pathname = "/";
  const response = NextResponse.redirect(url);
  response.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return response;
}
