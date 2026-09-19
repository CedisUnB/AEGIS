import Link from "next/link";
import { logoutAction } from "@/features/auth";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between bg-brand-primary px-4 py-3">
      <Link href="/trails" className="text-xl font-bold tracking-tight text-white">
        SAFE
      </Link>

      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-md bg-white px-3 py-2 text-sm font-medium text-brand-primary transition hover:opacity-90"
        >
          Sair
        </button>
      </form>
    </header>
  );
}