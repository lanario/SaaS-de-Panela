"use server";

/**
 * Gera o payload PIX Copia e Cola (BR Code) para QR Code estático.
 */
export async function generatePixPayload(params: {
  pixKey: string;
  receiverName: string;
  amount: number;
  description: string;
}): Promise<{ payload: string } | { error: string }> {
  const { pixKey, receiverName, amount, description } = params;

  if (!pixKey?.trim()) {
    return { error: "Chave PIX não configurada." };
  }

  try {
    const { PIX } = await import("gpix/dist");
    const pix = PIX.static()
      .setReceiverName(receiverName.slice(0, 25))
      .setReceiverCity("Brasil")
      .setKey(pixKey.trim())
      .setAmount(amount)
      .setDescription(description.slice(0, 72));

    const payload = pix.getBRCode();
    return { payload };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao gerar PIX.";
    return { error: message };
  }
}
