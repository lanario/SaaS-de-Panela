"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface AuthState {
  error?: string;
}

/**
 * Login com email e senha.
 */
export async function signIn(_prev: AuthState | null, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;
  const redirectTo = formData.get("redirectTo") as string | null;

  if (!email?.trim() || !password) {
    return { error: "Preencha email e senha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

  if (error) {
    return { error: error.message === "Invalid login credentials" ? "Email ou senha incorretos." : error.message };
  }

  redirect(redirectTo && redirectTo.startsWith("/dashboard") ? redirectTo : "/dashboard");
}

/**
 * Registro de nova conta com email e senha.
 */
export async function signUp(_prev: AuthState | null, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;
  const fullName = formData.get("fullName") as string | null;

  if (!email?.trim() || !password) {
    return { error: "Preencha email e senha." };
  }

  if (password.length < 6) {
    return { error: "A senha deve ter no mínimo 6 caracteres." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { full_name: fullName?.trim() ?? "" } },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

/**
 * Envia email de recuperação de senha.
 */
export async function resetPassword(_prev: AuthState | null, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string | null;

  if (!email?.trim()) {
    return { error: "Informe seu email." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/login`,
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}

/**
 * Logout (redireciona após limpar sessão).
 * Aceita FormData quando usada como action de formulário.
 */
export async function signOut(_formData?: FormData) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
