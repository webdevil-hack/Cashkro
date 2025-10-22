import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function StoreDetail({ params }: { params: { slug: string } }) {
  const store = await prisma.merchant.findUnique({
    where: { slug: params.slug },
    include: { offers: { where: { isActive: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!store) return notFound();
  return (
    <div>
      <h1 className="text-2xl font-semibold">{store.name}</h1>
      {store.description && <p className="text-gray-600 mt-1">{store.description}</p>}

      <h2 className="text-xl font-semibold mt-8 mb-4">Offers</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {store.offers.map((o) => (
          <div key={o.id} className="border rounded p-4">
            <div className="font-medium">{o.title}</div>
            <div className="text-sm text-gray-600 mt-1">
              {o.cashbackType === "PERCENT" ? `${(o.cashbackValue ?? 0) / 100}%` : `₹${(o.cashbackValue ?? 0) / 100}`}
            </div>
            <div className="mt-3 flex gap-2">
              <a href={`/api/click?offer=${o.slug}`} className="bg-black text-white px-3 py-2 rounded text-sm">Activate Cashback</a>
              <Link href={`/offers/${o.slug}`} className="px-3 py-2 rounded text-sm border">Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
