import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function StoresPage() {
  const stores = await prisma.merchant.findMany({
    orderBy: { name: "asc" },
    include: { offers: { where: { isActive: true }, take: 1 } },
  });
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Stores</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stores.map((m) => (
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
    </div>
  );
}
