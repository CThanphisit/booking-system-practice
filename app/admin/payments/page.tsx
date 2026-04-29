import Header from "@/app/components/admin/Header";
import PaymentsClient from "@/app/components/admin/payments/PaymentsClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getPayments() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}payment/admin/all`,
    {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    },
  );

  if (res.status === 401) redirect("/login");
  if (!res.ok) return [];

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default async function AdminPaymentsPage() {
  const payments = await getPayments();

  return (
    <>
      <Header
        title="Payments"
        subtitle="จัดการการชำระเงินและการคืนเงิน"
        showFilters={false}
      />
      <main className="flex-1 p-6 overflow-y-auto">
        <PaymentsClient initialPayments={payments} />
      </main>
    </>
  );
}
