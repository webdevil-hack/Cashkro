import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Categories</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <Link key={c.id} href={`/categories/${c.slug}`} className="border rounded p-4 hover:shadow-sm">
            <div className="font-medium">{c.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
