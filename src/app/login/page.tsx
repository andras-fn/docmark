import { Github } from "lucide-react";
import Link from "next/link";
import { validateRequest } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col items-center h-full pt-20">
      <div className="p-10 border border-slate-500 rounded flex flex-col gap-y-4">
        <h1 className="text-center font-bold text-xl">Sign into DocMarkAI</h1>

        <Link
          href="/api/v1/auth/login/github"
          className="p-2 bg-[#24292e] hover:bg-[#4c5156] text-lg cursor-pointer flex items-center gap-x-2 text-white rounded"
        >
          <Github /> Sign in with GitHub
        </Link>
      </div>
    </div>
  );
}
