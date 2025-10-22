import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const merchants = await prisma.merchant.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(merchants);
}
