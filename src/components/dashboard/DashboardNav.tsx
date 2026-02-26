"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiLogOut, FiUser } from "react-icons/fi";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut } from "@/app/actions/auth";

interface DashboardNavProps {
  userEmail: string;
}

export function DashboardNav({ userEmail }: DashboardNavProps) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition focus:outline-none focus:ring-2 focus:ring-primary-300"
          aria-label="Abrir menu do usuário"
        >
          <FiUser className="text-lg" />
          <span className="max-w-[140px] truncate hidden sm:inline">{userEmail}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[180px] bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
          sideOffset={8}
          align="end"
        >
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs text-gray-500">Logado como</p>
            <p className="text-sm font-medium text-gray-800 truncate">{userEmail}</p>
          </div>
          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-100 hover:text-primary-600 focus:bg-primary-100 focus:outline-none"
            >
              <FiUser /> Meus eventos
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none"
            >
              <FiLogOut /> Sair
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
