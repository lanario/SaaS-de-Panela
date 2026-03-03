import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth/AuthForm";
import { LoginScreen } from "@/components/auth/LoginScreen";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string };
}) {
  return (
    <LoginScreen
      title="Entrar"
      description="Acesse sua conta para gerenciar suas listas."
      footer={
        <>
          <p className="text-center text-sm text-gray-500">
            Não tem conta?{" "}
            <Link href="/registro" className="font-semibold text-presentix-700 hover:underline">
              Criar conta
            </Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            <Link href="/recuperar-senha" className="text-presentix-700 hover:underline">
              Esqueci minha senha
            </Link>
          </p>
        </>
      }
      backLink={
        <Link href="/" className="hover:text-presentix-700 transition-colors">
          ← Voltar ao início
        </Link>
      }
    >
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
    </LoginScreen>
  );
}
