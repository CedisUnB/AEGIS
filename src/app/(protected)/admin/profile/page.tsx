import { getAdminProfileAction } from "@/features/auth/actions";
import { ProfileCard } from "@/features/auth/components";

export default async function AdminProfilePage() {
  const result = await getAdminProfileAction();

  if (!result.success) {
    if (result.statusCode === 401) {
      throw new Error("401: Acesso não autorizado");
    }

    if (result.statusCode === 403) {
      throw new Error("403: Acesso não autorizado");
    }

    throw new Error(result.error);
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 bg-surface min-h-screen">
      <div className="mb-6 w-full max-w-lg">
        <div className="flex items-center gap-2">
          <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300 uppercase">
            Painel Administrativo
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
          Conta de Administrador
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Visualização dos dados cadastrais e permissões de acesso da conta.
        </p>
      </div>

      <ProfileCard initialUser={result.data} />
    </div>
  );
}