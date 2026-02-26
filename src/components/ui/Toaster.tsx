"use client";

import * as Toast from "@radix-ui/react-toast";
import { createContext, useCallback, useContext, useState } from "react";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "success" | "error" | "default";
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toast: (opts: ToastOptions) => {
        if (typeof window !== "undefined") {
          console.info("[Toast]", opts.title, opts.description ?? "");
        }
      },
    };
  }
  return ctx;
}

const variantStyles = {
  success: "bg-green-50 border-green-200 text-green-800 data-[state=open]:bg-green-50",
  error: "bg-red-50 border-red-200 text-red-800 data-[state=open]:bg-red-50",
  default: "bg-white border-gray-200 text-gray-800 data-[state=open]:bg-white",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ToastOptions>({ title: "" });

  const toast = useCallback((opts: ToastOptions) => {
    setOptions(opts);
    setOpen(true);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className={`rounded-xl border shadow-lg p-4 transition-all duration-200 ease-out ${variantStyles[options.variant ?? "default"]}`}
        >
          <Toast.Title className="font-semibold text-sm">{options.title}</Toast.Title>
          {options.description && (
            <Toast.Description className="text-xs mt-0.5 opacity-90">
              {options.description}
            </Toast.Description>
          )}
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 z-[100] flex max-w-[100vw] flex-col gap-2 p-4 outline-none" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
