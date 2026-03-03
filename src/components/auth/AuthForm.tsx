"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiAlertCircle, FiLoader } from "react-icons/fi";

export interface AuthFormField {
  name: string;
  type: "text" | "email" | "password";
  label: string;
  placeholder: string;
}

interface AuthFormProps {
  action: (prev: { error?: string } | null, formData: FormData) => Promise<{ error?: string }>;
  submitLabel: string;
  fields: AuthFormField[];
  searchParams?: { redirectTo?: string } | Promise<{ redirectTo?: string }>;
  redirectToParam?: string;
  successMessage?: string;
}

const fieldItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Texto exibido no botão durante o envio (ex: "Entrando...", "Criando conta..."). */
const loadingLabels: Record<string, string> = {
  Entrar: "Entrando...",
  "Criar conta": "Criando conta...",
  "Enviar link": "Enviando...",
};

/**
 * Botão de submit que usa useFormStatus para mostrar estado de loading.
 * Deve ser usado apenas dentro do <form> do AuthForm.
 */
function AuthFormSubmitButton({ submitLabel }: { submitLabel: string }) {
  const { pending } = useFormStatus();
  const loadingText = loadingLabels[submitLabel] ?? `${submitLabel}...`;
  const isPill = submitLabel === "Entrar";

  if (isPill) {
    return (
      <span className="gradient-beam-wrap gradient-beam-pill block w-full">
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-presentix-700 text-white py-3 px-6 rounded-full text-sm font-semibold hover:bg-presentix-800 transition-colors focus:outline-none focus:ring-2 focus:ring-presentix-400 focus:ring-offset-2 active:scale-[0.99] disabled:opacity-90 disabled:pointer-events-none flex items-center justify-center gap-2 min-h-[44px]"
        >
          {pending ? (
            <>
              <FiLoader className="text-lg animate-spin shrink-0" aria-hidden />
              <span className="inline-flex items-baseline gap-0.5">
                {loadingText.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.08,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </>
          ) : (
            submitLabel
          )}
        </button>
      </span>
    );
  }

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-presentix-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-presentix-800 transition focus:outline-none focus:ring-2 focus:ring-presentix-400 focus:ring-offset-2 active:scale-[0.99] disabled:opacity-90 disabled:pointer-events-none flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <FiLoader className="text-lg animate-spin shrink-0" aria-hidden />
          <span>{loadingText}</span>
        </>
      ) : (
        submitLabel
      )}
    </button>
  );
}

export function AuthForm({
  action,
  submitLabel,
  fields,
  searchParams,
  redirectToParam,
  successMessage,
}: AuthFormProps) {
  const [state, formAction] = useFormState(action, null);
  const [redirectTo, setRedirectTo] = useState<string>("");

  useEffect(() => {
    if (!searchParams || !redirectToParam) return;
    const extract = (params: { redirectTo?: string }) => {
      const value = params[redirectToParam as keyof typeof params];
      if (typeof value === "string") setRedirectTo(value);
    };
    if (searchParams instanceof Promise) {
      searchParams.then(extract);
    } else {
      extract(searchParams);
    }
  }, [searchParams, redirectToParam]);

  const showSuccess = successMessage && state && !state.error;
  const reduceMotion = useReducedMotion();

  return (
    <form action={formAction} className="space-y-4">
      {redirectToParam && redirectTo && (
        <input type="hidden" name={redirectToParam} value={redirectTo} readOnly />
      )}
      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
        }}
      >
        {fields.map((field) => (
          <motion.div key={field.name} variants={fieldItem}>
            <label htmlFor={field.name} className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              required={field.type !== "text"}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-presentix-300 focus:border-transparent transition-shadow duration-200 focus:shadow-md focus:shadow-presentix-200/30"
              autoComplete={field.type === "password" ? "current-password" : field.name === "email" ? "email" : undefined}
            />
          </motion.div>
        ))}
      </motion.div>
      <AnimatePresence mode="wait">
        {state?.error && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: -8, x: 0 }}
            animate={{
              opacity: 1,
              y: 0,
              x: reduceMotion ? 0 : [0, -6, 6, -4, 4, 0],
            }}
            exit={{ opacity: 0, y: -4 }}
            transition={{
              opacity: { duration: 0.25 },
              y: { duration: 0.25 },
              x: { duration: reduceMotion ? 0 : 0.5, ease: "easeOut" },
            }}
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 shadow-sm shadow-red-100/50"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <FiAlertCircle className="text-lg" aria-hidden />
            </span>
            <p className="text-sm font-medium text-red-800 leading-snug pt-0.5">
              {state.error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {showSuccess && (
        <motion.p
          className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2"
          role="status"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {successMessage}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 + fields.length * 0.1, duration: 0.4 }}
        className={submitLabel === "Entrar" ? "w-full" : undefined}
      >
        <AuthFormSubmitButton submitLabel={submitLabel} />
      </motion.div>
    </form>
  );
}
