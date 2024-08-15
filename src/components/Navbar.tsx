import Link from "next/link";
import {
  File,
  BookOpenCheck,
  Play,
  Settings,
  LogIn,
  LogOut,
} from "lucide-react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/auth/auth";

interface ActionResult {
  error: any;
}

const Navbar = async () => {
  const { session } = await validateRequest();

  async function logout(): Promise<ActionResult> {
    "use server";
    const { session } = await validateRequest();
    if (!session) {
      return {
        error: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return redirect("/login");
  }

  return (
    <div className="w-48 h-full flex flex-col bg-[#242424] text-white">
      <div className="w-full flex items-center p-2 gap-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 7.805 7.805"
          width="60"
          height="60"
        >
          <defs>
            <linearGradient
              id="b"
              x1="16.238"
              x2="16.238"
              y1="6.416"
              y2="31.996"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#FFD600"></stop>
              <stop offset="1" stopColor="#E74E0F"></stop>
            </linearGradient>
            <clipPath id="c">
              <use width="100%" height="100%" xlinkHref="#a"></use>
            </clipPath>
            <linearGradient
              id="d"
              x1="16.34"
              x2="16.34"
              y1="6.362"
              y2="32.042"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#FFD600"></stop>
              <stop offset="1" stopColor="#E74E0F"></stop>
            </linearGradient>
            <path id="a" d="M16.2 20l7 12H31L16.2 6.4 1.5 32h7.8l6.9-12"></path>
            <path id="e" d="M1.5 6.4h29.8v25.7H1.5z"></path>
          </defs>
          <g transform="translate(-.397 -1.38) scale(.26458)">
            <use width="100%" height="100%" fill="url(#b)" xlinkHref="#a"></use>
            <g className="st3" clipPath="url(#c)">
              <use
                width="100%"
                height="100%"
                fill="url(#d)"
                xlinkHref="#e"
              ></use>
            </g>
          </g>
        </svg>
        <Link
          href="/"
          className="p-2 text-xl font-bold cursor-pointer flex items-center gap-x-2"
        >
          DocMarkAI
        </Link>
      </div>
      <div className="flex flex-col justify-between h-full w-full">
        <div className="flex flex-col w-full">
          <Link
            href="/documents"
            className="p-2 hover:bg-neutral-700 text-lg cursor-pointer flex items-center gap-x-2"
          >
            <File /> Documents
          </Link>
          <Link
            href="/marking-criteria"
            className="p-2 hover:bg-neutral-700 text-lg cursor-pointer flex items-center gap-x-2"
          >
            <BookOpenCheck /> Marking Criteria
          </Link>
          <Link
            href="/marking-runs"
            className="p-2 hover:bg-neutral-700 text-lg cursor-pointer flex items-center gap-x-2"
          >
            <Play /> Marking Runs
          </Link>
        </div>
        <div className="w-full flex flex-col">
          <Link
            href="/config"
            className="p-2 hover:bg-neutral-700 text-lg cursor-pointer flex items-center gap-x-2"
          >
            <Settings /> Config
          </Link>
          {!session ? (
            <Link
              href="/login"
              className="p-2 hover:bg-neutral-700 text-lg cursor-pointer flex items-center gap-x-2"
            >
              <LogIn /> Login
            </Link>
          ) : (
            <form action={logout} className="w-full">
              <button className="p-2 hover:bg-neutral-700 text-lg cursor-pointer flex items-center gap-x-2 w-full">
                <LogOut /> Sign out
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default Navbar;
