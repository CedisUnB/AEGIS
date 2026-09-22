import Link from "next/link";
import { logoutAction } from "@/features/auth";

interface AppHeaderProps {
  user: {
    username?: string;
    email?: string;
    createdAt?: Date;
  }
}

export function AppHeader({ user }: AppHeaderProps) {
  const displayName = user.username || user.email?.split("@")[0] || "Estudante"

  return (
    <header className="flex items-center justify-between bg-brand-primary px-4 py-3">
      <Link href="/trails" className="text-xl font-bold tracking-tight text-white">
        SAFE
      </Link>

      <nav className="flex items-center space-x-4">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition"
          title="Ver meu perfil"
        >
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span>{displayName}</span>
        </Link>
      </nav>

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