import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const offers = await prisma.offer.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, include: { merchant: true } });
  return NextResponse.json(offers);
}
