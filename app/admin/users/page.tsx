import Header from "@/app/components/admin/Header";
import { AdminUser } from "@/app/components/admin/users/UserFormModal";
import UsersClient from "@/app/components/admin/users/UsersClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// async function getUsers(): Promise<AdminUser[]> {
//   const cookieStore = await cookies();
//   const cookieHeader = cookieStore
//     .getAll()
//     .map((c) => `${c.name}=${c.value}`)
//     .join("; ");

//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
//     headers: { cookie: cookieHeader },
//     cache: "no-store",
//   });

//   if (res.status === 401) redirect("/login");
//   if (!res.ok) return [];

//   const data = await res.json();
//   console.log("data", data);
//   return Array.isArray(data) ? data : [];
// }

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  // const users = await getUsers();
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users`, {
  //   headers: { cookie: cookieHeader },
  //   cache: "no-store",
  // });
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/proxy/users`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (res.status === 401) redirect("/login");
  if (!res.ok) return [];

  const users = await res.json();

  return (
    <>
      <Header
        title="Users"
        subtitle={`ผู้ใช้ทั้งหมด ${users.length} คน`}
        showFilters={false}
      />
      <main className="flex-1 p-6 overflow-y-auto">
        <UsersClient users={users} />
      </main>
    </>
  );
}
