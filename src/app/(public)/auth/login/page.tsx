import { SignInForm } from "@/features/auth/components";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-2xl font-semibold">
          Entre na sua conta
        </h1>
        <SignInForm />
      </div>
    </main>
  );
}
