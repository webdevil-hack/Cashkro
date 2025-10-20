import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoryDetail({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) return notFound();
  const stores = await prisma.merchant.findMany({ where: { categoryId: category.id }, orderBy: { name: "asc" } });
  const offers = await prisma.offer.findMany({ where: { categoryId: category.id, isActive: true }, orderBy: { createdAt: "desc" }, include: { merchant: true } });
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">{category.name}</h1>
      </div>
      <section>
        <h2 className="text-xl font-semibold mb-4">Stores</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stores.map((m) => (
            <Link key={m.id} href={`/stores/${m.slug}`} className="border rounded p-4 hover:shadow-sm">
              <div className="font-medium">{m.name}</div>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Offers</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {offers.map((o) => (
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
