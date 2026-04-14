import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-light tracking-tight text-foreground">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">brianure.com</p>
        </header>
        <LoginForm />
      </div>
    </main>
  );
}
