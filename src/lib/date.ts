/**
 * Interpreta uma string de data "YYYY-MM-DD" como data local (meia-noite no fuso do usuário).
 * Evita o bug em que "2026-02-28" vira 27/02 ao ser interpretada como UTC.
 */
export function parseLocalDate(dateStr: string | null): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const part = dateStr.split("T")[0];
  const [y, m, d] = part.split("-").map(Number);
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
  return new Date(y, m - 1, d);
}
