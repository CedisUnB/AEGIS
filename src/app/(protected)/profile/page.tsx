import { redirect } from "next/navigation";
import { getProfileUserAction } from "@/features/auth/actions";
import { ProfileCard } from "@/features/auth/components";

export default async function ProfilePage() {
  const result = await getProfileUserAction();

  if (!result.success) {
    redirect("/auth/login");
  }

  const user = {
    username: result.data.username,
    email: result.data.email,
    createdAt: result.data.createdAt
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-10">
      <div className="mb-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Meu Perfil
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Dados cadastrais da sua conta de estudante.
        </p>
      </div>

      <ProfileCard user={user} />
    </div>
  );
}