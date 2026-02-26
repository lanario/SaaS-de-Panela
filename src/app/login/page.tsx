import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-primary-100">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-1">Entrar</h1>
          <p className="text-sm text-gray-500 mb-6">
            Acesse sua conta para gerenciar suas listas.
          </p>
          <AuthForm
            action={signIn}
            submitLabel="Entrar"
            fields={[
              { name: "email", type: "email", label: "Email", placeholder: "seu@email.com" },
              { name: "password", type: "password", label: "Senha", placeholder: "••••••••" },
            ]}
            searchParams={searchParams}
            redirectToParam="redirectTo"
          />
          <p className="text-center text-sm text-gray-500 mt-4">
            Não tem conta?{" "}
            <Link href="/registro" className="font-semibold text-primary-600 hover:underline">
              Criar conta
            </Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            <Link href="/recuperar-senha" className="text-primary-600 hover:underline">
              Esqueci minha senha
            </Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          <Link href="/" className="hover:text-primary-500">
            ← Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  );
}
