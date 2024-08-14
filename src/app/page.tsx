import { validateRequest } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return (
    <>
      <h1>Hi, {JSON.stringify(user)}!</h1>
      <p>Your user ID is {user.id}.</p>
      <form>
        <button>Sign out</button>
      </form>
    </>
  );
}
