import { getProfileUserAction } from "@/features/auth/actions";
import { ProfileCard } from "@/features/auth/components";

export default async function ProfilePage() {
  const result = await getProfileUserAction();

  if (!result.success) {
    throw new Error("401: Acesso não autorizado");
  }

  return (
    <main className="flex flex-col items-center justify-center px-4 py-10 bg-surface min-h-screen">
      <div className="mb-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Meu Perfil
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Visualize ou atualize os seus dados cadastrais.
        </p>
      </div>

      <ProfileCard initialUser={result.data} />
    </main>
  );
}