// src/app/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/core/security";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}