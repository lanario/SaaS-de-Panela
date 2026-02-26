import Link from "next/link";
import { resetPassword } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth/AuthForm";

export default function RecuperarSenhaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-primary-100">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-1">Recuperar senha</h1>
          <p className="text-sm text-gray-500 mb-6">
            Informe seu email e enviaremos um link para redefinir sua senha.
          </p>
          <AuthForm
            action={resetPassword}
            submitLabel="Enviar link"
            fields={[
              { name: "email", type: "email", label: "Email", placeholder: "seu@email.com" },
            ]}
            successMessage="Se o email existir, você receberá um link para redefinir a senha."
          />
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link href="/login" className="font-semibold text-primary-600 hover:underline">
              Voltar ao login
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
