"use server";

const FETCH_TIMEOUT_MS = 10_000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export interface FetchImageResult {
  imageUrl: string | null;
  error?: string;
}

/**
 * Busca a página do link e extrai a URL da primeira imagem encontrada
 * (og:image preferencialmente, senão a primeira <img> com src absoluto).
 */
export async function getImageFromProductUrl(productUrl: string): Promise<FetchImageResult> {
  const trimmed = productUrl?.trim();
  if (!trimmed) {
    return { imageUrl: null, error: "Informe o link do produto." };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { imageUrl: null, error: "URL inválida." };
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return { imageUrl: null, error: "Use um link HTTP ou HTTPS." };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(trimmed, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      redirect: "follow",
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { imageUrl: null, error: `Página retornou ${res.status}.` };
    }

    const html = await res.text();
    const baseUrl = res.url || trimmed;

    const ogImage = extractOgImage(html);
    if (ogImage) {
      const absolute = toAbsoluteUrl(ogImage, baseUrl);
      if (absolute) return { imageUrl: absolute };
    }

    const firstImg = extractFirstImageSrc(html);
    if (firstImg) {
      const absolute = toAbsoluteUrl(firstImg, baseUrl);
      if (absolute) return { imageUrl: absolute };
    }

    return { imageUrl: null, error: "Nenhuma imagem encontrada na página." };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        return { imageUrl: null, error: "Tempo esgotado ao acessar o link." };
      }
      return { imageUrl: null, error: err.message };
    }
    return { imageUrl: null, error: "Não foi possível acessar o link." };
  }
}

function extractOgImage(html: string): string | null {
  const ogRegex =
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i;
  let m = html.match(ogRegex);
  if (m) return m[1].trim();
  const contentFirst =
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i;
  m = html.match(contentFirst);
  return m ? m[1].trim() : null;
}

function extractFirstImageSrc(html: string): string | null {
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const m = html.match(imgRegex);
  if (!m) return null;
  const src = m[1].trim();
  if (src.startsWith("data:")) return null;
  return src;
}

function toAbsoluteUrl(href: string, baseUrl: string): string | null {
  try {
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return href;
    }
    if (href.startsWith("//")) {
      return new URL("https:" + href).href;
    }
    return new URL(href, baseUrl).href;
  } catch {
    return null;
  }
}
