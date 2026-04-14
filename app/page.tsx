import { LoginHeader } from "@/components/gdes/login-header"
import { LoginForm } from "@/components/gdes/login-form"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px]">
        {/* Login Card */}
        <div className="bg-card rounded-xl shadow-lg p-6 sm:p-8 flex flex-col gap-8">
          <LoginHeader />
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
