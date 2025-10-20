import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const featured = await prisma.merchant.findMany({
    where: { isFeatured: true },
    orderBy: { name: "asc" },
    include: { offers: { where: { isActive: true }, take: 1 } },
  });

  const latestOffers = await prisma.offer.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: { merchant: true },
  });

  return (
    <div className="space-y-10">
      <section className="rounded-lg bg-gray-50 p-6">
        <h1 className="text-2xl font-semibold mb-2">Get cashback on your shopping</h1>
        <p className="text-gray-600">Browse stores and offers. Click through and shop to earn cashback.</p>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured stores</h2>
          <Link href="/stores" className="text-sm underline">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((m) => (
            <Link key={m.id} href={`/stores/${m.slug}`} className="border rounded p-4 hover:shadow-sm">
              <div className="font-medium">{m.name}</div>
              {m.offers[0] && (
                <div className="text-sm text-gray-600 mt-1">
                  Top offer: {m.offers[0].cashbackType === "PERCENT" ? `${(m.offers[0].cashbackValue ?? 0) / 100}%` : `₹${(m.offers[0].cashbackValue ?? 0) / 100}`}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold">Latest offers</h2>
          <Link href="/offers" className="text-sm underline">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {latestOffers.map((o) => (
            <Link key={o.id} href={`/offers/${o.slug}`} className="border rounded p-4 hover:shadow-sm">
              <div className="font-medium">{o.title}</div>
              <div className="text-sm text-gray-600 mt-1">{o.merchant.name}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
