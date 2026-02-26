/**
 * Tipos do banco de dados (Supabase)
 */

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  owner_id: string;
  title: string;
  slug: string;
  event_date: string | null;
  pix_key: string | null;
  pix_key_type: "cpf" | "email" | "phone" | "random" | null;
  created_at: string;
  updated_at: string;
}

/** Estatísticas agregadas por evento (presentes e valor arrecadado). */
export interface EventStats {
  totalItems: number;
  boughtCount: number;
  totalRaised: number;
}

export type EventWithStats = Event & EventStats;

export interface EventInsert {
  owner_id: string;
  title: string;
  slug: string;
  event_date?: string | null;
  pix_key?: string | null;
  pix_key_type?: Event["pix_key_type"];
}

export interface EventUpdate {
  title?: string;
  slug?: string;
  event_date?: string | null;
  pix_key?: string | null;
  pix_key_type?: Event["pix_key_type"];
}

export type GiftItemStatus = "disponivel" | "reservado" | "comprado";

export interface GiftItem {
  id: string;
  event_id: string;
  name: string;
  product_url: string;
  price: number;
  category: string;
  image_url: string | null;
  status: GiftItemStatus;
  sort_order: number;
  buyer_name: string | null;
  created_at: string;
  updated_at: string;
}

export const GIFT_CATEGORIES = [
  "Cozinha",
  "Eletrodomésticos",
  "Mesa Posta",
  "Cama/Banho",
] as const;

export interface EventCategory {
  id: string;
  event_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface Purchase {
  id: string;
  gift_item_id: string;
  buyer_user_id: string | null;
  buyer_name: string | null;
  payment_type: "link" | "pix";
  status: "pendente" | "confirmado";
  amount: number;
  confirm_token: string | null;
  confirmed_at: string | null;
  created_at: string;
}

export const STATUS_CONFIG: Record<
  GiftItemStatus,
  { label: string; color: string; dot: string }
> = {
  disponivel: { label: "Disponível", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  reservado: { label: "Reservado", color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  comprado: { label: "Comprado ✓", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
};
