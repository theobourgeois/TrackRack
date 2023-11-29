import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main>
      <Link
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        {session ? "Sign out" : "Sign in"}
      </Link>
    </main>
  );
}
