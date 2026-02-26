"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

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
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            required={field.type !== "text"}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
            autoComplete={field.type === "password" ? "current-password" : field.name === "email" ? "email" : undefined}
          />
        </div>
      ))}
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2" role="alert">
          {state.error}
        </p>
      )}
      {showSuccess && (
        <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2" role="status">
          {successMessage}
        </p>
      )}
      <button
        type="submit"
        className="w-full bg-primary-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
      >
        {submitLabel}
      </button>
    </form>
  );
}
