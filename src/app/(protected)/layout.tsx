// src/app/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/core/security";
import { logoutAction } from "@/features/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <header className="flex justify-end border-b px-4 py-3">
        <form action={logoutAction}>
          <button type="submit" className="rounded-md border px-3 py-2 text-sm">
            Sair
          </button>
        </form>
      </header>
      {children}
    </>
  );
}