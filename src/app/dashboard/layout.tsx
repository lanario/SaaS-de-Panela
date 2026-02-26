import Link from "next/link";
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
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, #f0f4f8 0%, #fdf0eb 35%, #f4f6f3 70%, #e8f3fc 100%)",
      }}
    >
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 shadow-sm backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-serif text-lg font-semibold text-gray-800">
              🍳 Chá de Panela
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
