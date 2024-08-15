import { github, lucia } from "@/auth/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { db } from "@/db/client";
import { userTable } from "@/db/schemas/auth";
import { eq } from "drizzle-orm";

export async function GET(request: Request): Promise<Response> {
  //console.log("in the callback");
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  //console.log("about to try");

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    // check if user exists
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.githubId, githubUser.id));

    //console.log(existingUser);

    if (existingUser.length > 0) {
      const session = await lucia.createSession(existingUser[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    // check if user is in allowed list
    const allowedUsersOriginal =
      process.env.ALLOWED_GITHUB_IDS?.split(",") ?? [];
    const allowedUsers = allowedUsersOriginal.map((id) => parseInt(id));
    console.log(allowedUsers);
    console.log(githubUser.id);
    if (!allowedUsers.includes(parseInt(githubUser.id))) {
      return new Response(null, {
        status: 403,
      });
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    // Replace this with your own DB client.

    const dbPayload = {
      id: userId,
      githubId: githubUser.id,
      username: githubUser.login,
    };

    //console.log(dbPayload);

    await db.insert(userTable).values(dbPayload);

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.log(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      console.log(e);
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface GitHubUser {
  id: string;
  login: string;
}
