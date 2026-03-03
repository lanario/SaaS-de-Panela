import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth/AuthForm";
import { LoginScreen } from "@/components/auth/LoginScreen";

export default function RegistroPage() {
  return (
    <LoginScreen
      title="Criar conta"
      description="Crie sua conta para começar a usar o Presentix."
      footer={
        <p className="text-center text-sm text-gray-500">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-presentix-700 hover:underline">
            Entrar
          </Link>
        </p>
      }
      backLink={
        <Link href="/" className="hover:text-presentix-700 transition-colors">
          ← Voltar ao início
        </Link>
      }
    >
      <AuthForm
        action={signUp}
        submitLabel="Criar conta"
        fields={[
          { name: "fullName", type: "text", label: "Nome", placeholder: "Seu nome" },
          { name: "email", type: "email", label: "Email", placeholder: "seu@email.com" },
          { name: "password", type: "password", label: "Senha", placeholder: "Mín. 6 caracteres" },
        ]}
      />
    </LoginScreen>
  );
}
