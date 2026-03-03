"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { motion } from "framer-motion";

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
      {state?.error && (
        <motion.p
          className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2"
          role="alert"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {state.error}
        </motion.p>
      )}
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
      >
        <button
          type="submit"
          className="w-full bg-presentix-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-presentix-800 transition focus:outline-none focus:ring-2 focus:ring-presentix-400 focus:ring-offset-2 active:scale-[0.99]"
        >
          {submitLabel}
        </button>
      </motion.div>
    </form>
  );
}
