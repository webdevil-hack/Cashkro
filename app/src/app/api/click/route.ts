import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const offerSlug = searchParams.get("offer");
  const merchantSlug = searchParams.get("merchant");

  const session = await getServerSession(authOptions);
  const userId = ((): string | undefined => {
    if (session?.user && typeof session.user === "object" && "id" in session.user) {
      return (session.user as { id: string }).id;
    }
    return undefined;
  })();

  let merchantId: string | undefined;
  let offerId: string | undefined;
  let outboundUrl: string | undefined;

  if (offerSlug) {
    const offer = await prisma.offer.findUnique({ where: { slug: offerSlug }, include: { merchant: true } });
    if (!offer || !offer.merchant) return NextResponse.redirect(new URL("/", req.url));
    merchantId = offer.merchant.id;
    offerId = offer.id;
    outboundUrl = offer.affiliateUrl ?? offer.landingUrl ?? offer.merchant.websiteUrl ?? undefined;
  } else if (merchantSlug) {
    const merchant = await prisma.merchant.findUnique({ where: { slug: merchantSlug } });
    if (!merchant) return NextResponse.redirect(new URL("/", req.url));
    merchantId = merchant.id;
    outboundUrl = merchant.websiteUrl ?? undefined;
  } else {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const click = await prisma.click.create({
    data: {
      userId,
      merchantId: merchantId!,
      offerId,
      outboundUrl,
      ip: req.headers.get("x-forwarded-for") ?? undefined,
      userAgent: req.headers.get("user-agent") ?? undefined,
    },
  });

  const redirectUrl = outboundUrl ?? "/";
  const url = new URL(redirectUrl, req.url);
  url.searchParams.set("ck", click.id);
  return NextResponse.redirect(url);
}
