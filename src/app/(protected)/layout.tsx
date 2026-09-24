// src/app/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/core/security";
import { AppHeader } from "@/components/layout/AppHeader";

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
      <AppHeader user={session}/>
      {children}
    </>
  );
}