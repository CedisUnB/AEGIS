import { SignUpForm } from "@/features/auth/components";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col bg-surface px-4">
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-brand-primary sm:mt-10 sm:ml-6 sm:text-5xl">
        SAFE
      </h1>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">
            Crie sua conta
          </h2>

          <SignUpForm />
        </div>
      </div>
    </main>
  );
}