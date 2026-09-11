import { SignUpForm } from "@/features/auth/components";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Crie sua conta
        </h1>
        <SignUpForm />
      </div>
    </main>
  );
}