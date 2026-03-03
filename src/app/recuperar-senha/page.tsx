import Link from "next/link";
import { resetPassword } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth/AuthForm";
import { LoginScreen } from "@/components/auth/LoginScreen";

export default function RecuperarSenhaPage() {
  return (
    <LoginScreen
      title="Recuperar senha"
      description="Informe seu email e enviaremos um link para redefinir sua senha."
      footer={
        <p className="text-center text-sm text-gray-500">
          <Link href="/login" className="font-semibold text-presentix-700 hover:underline">
            Voltar ao login
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
        action={resetPassword}
        submitLabel="Enviar link"
        fields={[
          { name: "email", type: "email", label: "Email", placeholder: "seu@email.com" },
        ]}
        successMessage="Se o email existir, você receberá um link para redefinir a senha."
      />
    </LoginScreen>
  );
}
