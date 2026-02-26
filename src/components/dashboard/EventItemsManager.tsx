"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { FiPlus, FiTrash2, FiEdit2, FiDollarSign, FiTag } from "react-icons/fi";
import { GiftFormModal } from "./GiftFormModal";
import { AddCategoryModal } from "./AddCategoryModal";
import { EventStatsSummary } from "./EventStatsSummary";
import { EventCharts } from "./EventCharts";
import { useToast } from "@/components/ui/Toaster";
import { STATUS_CONFIG, GIFT_CATEGORIES } from "@/types/database";
import { updateGiftItemStatus, deleteGiftItem } from "@/app/actions/gift-items";
import { confirmPixPurchase } from "@/app/actions/purchases";
import type { Event, EventCategory, GiftItem } from "@/types/database";

interface PendingPixPurchase {
  id: string;
  gift_item_id: string;
  item_name: string;
  buyer_name: string | null;
  amount: number;
  created_at: string;
}

interface EventStats {
  totalValue: number;
  compradoValue: number;
  totalItems: number;
  compradoCount: number;
  disponivelCount: number;
}

interface EventItemsManagerProps {
  event: Event;
  eventCategories: EventCategory[];
  items: GiftItem[];
  stats: EventStats;
  pendingPixPurchases: PendingPixPurchase[];
}

const STATUS_FILTER_OPTIONS = [
  { value: "todos", label: "Todos" },
  { value: "disponivel", label: "Disponível" },
  { value: "reservado", label: "Reservado" },
  { value: "comprado", label: "Comprado" },
];

export function EventItemsManager({ event, eventCategories, items, stats, pendingPixPurchases }: EventItemsManagerProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [editItem, setEditItem] = useState<GiftItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterCategory, setFilterCategory] = useState<string>("todos");
  const { toast } = useToast();
  const router = useRouter();

  function handleAddSuccess() {
    toast({ title: "Presente adicionado!", variant: "success" });
    router.refresh();
  }

  function handleEditSuccess() {
    toast({ title: "Presente atualizado!", variant: "success" });
    setEditItem(null);
    router.refresh();
  }

  function handlePixConfirmed() {
    toast({ title: "PIX confirmado!", variant: "success" });
    router.refresh();
  }

  function handleStatusUpdated() {
    toast({ title: "Status atualizado.", variant: "success" });
    router.refresh();
  }

  function handleItemDeleted() {
    toast({ title: "Presente excluído.", variant: "default" });
    router.refresh();
  }

  function handleCategoryAdded() {
    toast({ title: "Categoria adicionada!", variant: "success" });
    router.refresh();
  }

  const categoryNamesFromEvent = eventCategories.map((c) => c.name);
  const categoryOptions = [
    "todos",
    ...Array.from(
      new Set([...categoryNamesFromEvent, ...items.map((i) => i.category)].filter(Boolean))
    ).sort(),
  ];
  const suggestedCategories = Array.from(
    new Set([...GIFT_CATEGORIES, ...categoryNamesFromEvent, ...items.map((i) => i.category)])
  ).filter(Boolean).sort();

  const filteredItems = items.filter((item) => {
    const matchStatus =
      filterStatus === "todos" || item.status === filterStatus;
    const matchCategory =
      filterCategory === "todos" || item.category === filterCategory;
    return matchStatus && matchCategory;
  });

  return (
    <div>
      <EventStatsSummary
        totalValue={stats.totalValue}
        compradoValue={stats.compradoValue}
        totalItems={stats.totalItems}
        compradoCount={stats.compradoCount}
        disponivelCount={stats.disponivelCount}
      />
      <EventCharts items={items} />
      {pendingPixPurchases.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <FiDollarSign /> Pagamentos PIX pendentes
          </h3>
          <ul className="space-y-2">
            {pendingPixPurchases.map((p) => (
              <PixPurchaseRow
                key={p.id}
                purchase={p}
                eventId={event.id}
                onConfirmed={handlePixConfirmed}
              />
            ))}
          </ul>
        </div>
      )}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setAddCategoryOpen(true)}
            className="inline-flex items-center gap-2 h-10 px-3 rounded-xl text-sm font-semibold border border-primary-300 text-primary-600 bg-white hover:bg-primary-50 transition-colors"
            aria-label="Adicionar categoria"
          >
            <FiTag className="text-sm" /> Adicionar categoria
          </button>
          <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
            <Select.Trigger
              className="inline-flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm min-w-[130px] focus:outline-none focus:ring-2 focus:ring-primary-300"
              aria-label="Filtrar por status"
            >
              <Select.Value placeholder="Status" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <Select.Item
                    key={opt.value}
                    value={opt.value}
                    className="px-3 py-2 text-sm cursor-pointer focus:bg-primary-100 focus:outline-none data-[highlighted]:bg-primary-100"
                  >
                    <Select.ItemText>{opt.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <Select.Root value={filterCategory} onValueChange={setFilterCategory}>
            <Select.Trigger
              className="inline-flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary-300"
              aria-label="Filtrar por categoria"
            >
              <Select.Value placeholder="Categoria" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <Select.Item
                  value="todos"
                  className="px-3 py-2 text-sm cursor-pointer focus:bg-primary-100 focus:outline-none data-[highlighted]:bg-primary-100"
                >
                  <Select.ItemText>Todos</Select.ItemText>
                </Select.Item>
                {categoryOptions
                  .filter((v) => v !== "todos")
                  .map((cat) => (
                    <Select.Item
                      key={cat}
                      value={cat}
                      className="px-3 py-2 text-sm cursor-pointer focus:bg-primary-100 focus:outline-none data-[highlighted]:bg-primary-100"
                    >
                      <Select.ItemText>{cat}</Select.ItemText>
                    </Select.Item>
                  ))}
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 text-sm bg-green-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition"
          aria-label="Adicionar presente à lista"
        >
          <FiPlus /> Adicionar presente
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="pb-3 pr-4 pt-4 pl-4">Produto</th>
                <th className="pb-3 pr-4">Valor</th>
                <th className="pb-3 pr-4">Categoria</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Comprador</th>
                <th className="pb-3 pr-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-sm">
                    {items.length === 0
                      ? "Nenhum presente adicionado. Clique em \"Adicionar presente\" para começar."
                      : "Nenhum item corresponde aos filtros."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    eventId={event.id}
                    onStatusUpdated={handleStatusUpdated}
                    onDeleted={handleItemDeleted}
                    onEdit={setEditItem}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GiftFormModal
        event={event}
        item={editItem}
        suggestedCategories={suggestedCategories}
        open={addOpen || editItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setAddOpen(false);
            setEditItem(null);
          }
        }}
        onSuccess={editItem ? handleEditSuccess : handleAddSuccess}
      />
      <AddCategoryModal
        eventId={event.id}
        open={addCategoryOpen}
        onOpenChange={setAddCategoryOpen}
        onSuccess={handleCategoryAdded}
      />
    </div>
  );
}

interface PixPurchaseRowProps {
  purchase: PendingPixPurchase;
  eventId: string;
  onConfirmed?: () => void;
}

function PixPurchaseRow({ purchase, eventId, onConfirmed }: PixPurchaseRowProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  async function handleConfirm() {
    setIsConfirming(true);
    try {
      await confirmPixPurchase(purchase.id, eventId);
      onConfirmed?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-amber-100 last:border-0">
      <div>
        <p className="font-medium text-gray-800 text-sm">{purchase.item_name}</p>
        <p className="text-xs text-gray-500">
          {purchase.buyer_name ?? "—"} • R$ {purchase.amount.toFixed(2)}
        </p>
      </div>
      <button
        type="button"
        onClick={handleConfirm}
        disabled={isConfirming}
        className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
      >
        {isConfirming ? "Confirmando…" : "Confirmar PIX"}
      </button>
    </li>
  );
}

interface ItemRowProps {
  item: GiftItem;
  eventId: string;
  onStatusUpdated?: () => void;
  onDeleted?: () => void;
  onEdit?: (item: GiftItem) => void;
}

function ItemRow({ item, eventId, onStatusUpdated, onDeleted, onEdit }: ItemRowProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [status, setStatus] = useState(item.status);
  const [buyerName, setBuyerName] = useState(item.buyer_name ?? "");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setStatus(item.status);
    setBuyerName(item.buyer_name ?? "");
  }, [item.status, item.buyer_name]);

  const config = STATUS_CONFIG[item.status];
  const price = Number(item.price);

  async function handleStatusChange(
    newStatus: "disponivel" | "reservado" | "comprado",
    buyer?: string
  ) {
    setIsUpdating(true);
    try {
      await updateGiftItemStatus(
        item.id,
        eventId,
        newStatus,
        newStatus === "comprado" ? (buyer ?? buyerName) : null
      );
      setStatus(newStatus);
      onStatusUpdated?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    setIsUpdating(true);
    try {
      await deleteGiftItem(item.id, eventId);
      setDeleteOpen(false);
      onDeleted?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <>
      <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition">
        <td className="py-3 pr-4 pl-4 font-medium text-gray-700 max-w-[200px] truncate">
          <a
            href={item.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-600"
          >
            {item.name}
          </a>
        </td>
        <td className="py-3 pr-4 text-gray-600">R$ {price.toFixed(2)}</td>
        <td className="py-3 pr-4 text-gray-600">{item.category}</td>
        <td className="py-3 pr-4">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                disabled={isUpdating}
                className={`text-xs px-2 py-1 rounded-full font-semibold ${config.color}`}
              >
                {config.label}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[140px] bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
                sideOffset={4}
                align="start"
              >
                <DropdownMenu.Item asChild>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("disponivel")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    Disponível
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("reservado")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    Reservado
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("comprado")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    Comprado ✓
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </td>
        <td className="py-3 pr-4">
          {status === "comprado" ? (
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              onBlur={() => {
                if (buyerName !== (item.buyer_name ?? "")) {
                  handleStatusChange("comprado", buyerName);
                }
              }}
              placeholder="Nome do comprador"
              className="w-full max-w-[120px] text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-300"
            />
          ) : (
            <span className="text-gray-400 text-xs">—</span>
          )}
        </td>
        <td className="py-3 pr-4">
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(item)}
                disabled={isUpdating}
                className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition disabled:opacity-50"
                aria-label="Editar presente"
              >
                <FiEdit2 className="text-sm" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              disabled={isUpdating}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
              aria-label="Excluir"
            >
              <FiTrash2 className="text-sm" />
            </button>
          </div>
        </td>
      </tr>

      <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
            <Dialog.Title className="text-lg font-bold text-gray-800 mb-2">
              Excluir presente?
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-4">
              O item &quot;{item.name}&quot; será removido da lista.
            </Dialog.Description>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                disabled={isUpdating}
                className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isUpdating}
                className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
              >
                {isUpdating ? "Excluindo…" : "Excluir"}
              </button>
            </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
