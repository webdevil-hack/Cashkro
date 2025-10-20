import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">CashBack Clone</Link>
        <div className="flex items-center gap-4">
          <form action="/offers" method="get" className="hidden md:block">
            <input name="q" placeholder="Search stores or offers" className="border rounded px-3 py-1 text-sm w-64" />
          </form>
          <nav className="space-x-4 text-sm">
            <Link href="/stores" className="hover:underline">Stores</Link>
            <Link href="/categories" className="hover:underline">Categories</Link>
            <Link href="/wallet" className="hover:underline">My Wallet</Link>
            {session?.user ? (
              <Link href="/auth/signin" className="hover:underline">Account</Link>
            ) : (
              <Link href="/auth/signin" className="hover:underline">Sign in</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
