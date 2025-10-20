import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function OfferDetail({ params }: { params: { slug: string } }) {
  const offer = await prisma.offer.findUnique({
    where: { slug: params.slug },
    include: { merchant: true },
  });
  if (!offer) return notFound();
  return (
    <div>
      <h1 className="text-2xl font-semibold">{offer.title}</h1>
      <p className="text-gray-600 mt-1">{offer.merchant.name}</p>
      {offer.description && <p className="mt-4">{offer.description}</p>}
      {offer.terms && (
        <div className="mt-4">
          <h3 className="font-medium">Terms & Conditions</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{offer.terms}</p>
        </div>
      )}
      <a href={`/api/click?offer=${offer.slug}`} className="inline-block mt-6 bg-black text-white px-4 py-2 rounded">Activate Cashback</a>
    </div>
  );
}
