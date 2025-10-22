import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ merchants: [], offers: [] });

  const [merchants, offers] = await Promise.all([
    prisma.merchant.findMany({ where: { name: { contains: q } }, take: 10 }),
    prisma.offer.findMany({ where: { title: { contains: q } }, take: 10, include: { merchant: true } }),
  ]);
  return NextResponse.json({ merchants, offers });
}
