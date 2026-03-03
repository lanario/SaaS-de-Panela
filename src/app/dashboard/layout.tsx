import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-dots-pattern">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-md animate-fade-in">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <Image
              src="/presentix_logo.png"
              alt="Presentix"
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
            />
            <span className="font-serif text-lg font-semibold text-gray-800 group-hover:text-presentix-800 transition-colors">
              Presentix
            </span>
            <span className="text-xs text-gray-500 hidden sm:inline">Dashboard</span>
          </Link>
          <DashboardNav userEmail={user.email ?? ""} />
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
