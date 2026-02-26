import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ConfirmarCompraClient } from "@/components/confirmar/ConfirmarCompraClient";

interface PageProps {
  params: { token: string };
}

export default async function ConfirmarCompraPage({ params }: PageProps) {
  const { token } = params;

  const supabase = await createClient();

  const { data: rows, error } = await supabase.rpc("get_purchase_by_token", {
    p_token: token,
  });

  if (error || !rows || (Array.isArray(rows) && rows.length === 0)) {
    notFound();
  }

  const purchase = Array.isArray(rows) ? rows[0] : rows;

  if (!purchase || purchase.status === "confirmado") {
    notFound();
  }

  const { data: item } = await supabase
    .from("gift_items")
    .select("name, price")
    .eq("id", purchase.gift_item_id)
    .single();

  return (
    <div className="min-h-screen bg-primary-100 flex items-center justify-center px-4">
      <ConfirmarCompraClient
        token={token}
        itemName={item?.name ?? "Presente"}
        amount={Number(purchase.amount)}
        buyerName={purchase.buyer_name ?? ""}
      />
    </div>
  );
}
