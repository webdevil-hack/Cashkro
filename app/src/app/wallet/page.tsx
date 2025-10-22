import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function WalletPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin?callbackUrl=/wallet");
  // @ts-expect-error id on user from session callback
  const userId: string = session.user.id;

  const [wallet, transactions] = await Promise.all([
    prisma.wallet.upsert({ where: { userId }, update: {}, create: { userId } }),
    prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { merchant: true, offer: true } }),
  ]);

  const currency = (n: number) => `₹${(n / 100).toFixed(2)}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">My Wallet</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="border rounded p-4"><div className="text-sm text-gray-600">Pending</div><div className="text-xl font-semibold">{currency(wallet.pending)}</div></div>
          <div className="border rounded p-4"><div className="text-sm text-gray-600">Confirmed</div><div className="text-xl font-semibold">{currency(wallet.confirmed)}</div></div>
          <div className="border rounded p-4"><div className="text-sm text-gray-600">Approved</div><div className="text-xl font-semibold">{currency(wallet.approved)}</div></div>
          <div className="border rounded p-4"><div className="text-sm text-gray-600">Paid</div><div className="text-xl font-semibold">{currency(wallet.paid)}</div></div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 border">Date</th>
                <th className="text-left p-2 border">Merchant</th>
                <th className="text-left p-2 border">Offer</th>
                <th className="text-left p-2 border">Order</th>
                <th className="text-left p-2 border">Cashback</th>
                <th className="text-left p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="p-2 border">{t.merchant.name}</td>
                  <td className="p-2 border">{t.offer?.title ?? "-"}</td>
                  <td className="p-2 border">{t.orderId ?? "-"}</td>
                  <td className="p-2 border">{currency(t.cashbackAmount)}</td>
                  <td className="p-2 border">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
