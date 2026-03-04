/**
 * Gera um identificador curto único (8 caracteres 0-9a-z) para uso em URLs.
 * Diferencia eventos com mesmo slug (ex.: dois casais "Marcelle e Pedro").
 */
export function generateShortId(): string {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 8; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let s = "";
  for (let i = 0; i < 8; i++) {
    s += chars[bytes[i]! % 36];
  }
  return s;
}
