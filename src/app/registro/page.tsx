import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth/AuthForm";

export default function RegistroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-primary-100">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-1">Criar conta</h1>
          <p className="text-sm text-gray-500 mb-6">
            Crie sua conta para começar a usar o Chá de Panela.
          </p>
          <AuthForm
            action={signUp}
            submitLabel="Criar conta"
            fields={[
              { name: "fullName", type: "text", label: "Nome", placeholder: "Seu nome" },
              { name: "email", type: "email", label: "Email", placeholder: "seu@email.com" },
              { name: "password", type: "password", label: "Senha", placeholder: "Mín. 6 caracteres" },
            ]}
          />
          <p className="text-center text-sm text-gray-500 mt-4">
            Já tem conta?{" "}
            <Link href="/login" className="font-semibold text-primary-600 hover:underline">
              Entrar
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
