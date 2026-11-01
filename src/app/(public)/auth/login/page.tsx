import { SignInForm } from "@/features/auth/components";

interface LoginPageProps {
  searchParams: Promise<{ reauth?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { reauth } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-2xl text-foreground font-semibold">
          Entre na sua conta
        </h1>
        
        <SignInForm />
        
        {reauth === "1" && (
          <div className="mb-4 w-full max-w-sm rounded-md bg-confirm p-4 text-sm font-medium text-white">
            Perfil atualizado com sucesso! Por segurança, faça login novamente com suas novas credenciais.
          </div>
        )}
      </div>
    </main>
  );
}