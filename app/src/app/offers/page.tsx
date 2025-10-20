import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function OffersPage() {
  const offers = await prisma.offer.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: { merchant: true },
  });
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">All Offers</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {offers.map((o) => (
          <Link key={o.id} href={`/offers/${o.slug}`} className="border rounded p-4 hover:shadow-sm">
            <div className="font-medium">{o.title}</div>
            <div className="text-sm text-gray-600 mt-1">{o.merchant.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
