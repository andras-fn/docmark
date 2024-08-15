import { validateRequest } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return (
    <>
      {user ? (
        <div className="w-full h-full">
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">Welcome to</h1>
              <h1 className="text-9xl font-bold ml-2 text-black">DocMarkAI</h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-2">
          Please sign in. You shouldn't have been able to get to this page
          without signing in...
        </div>
      )}
    </>
  );
}
