"use client";

import { ToastProvider } from "@/components/ui/Toaster";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
