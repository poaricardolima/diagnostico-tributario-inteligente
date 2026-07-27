/** Contatos e redes oficiais — Impulso Criativo */

export const WHATSAPP_PHONE = "5551989099973";

export const WHATSAPP_DEFAULT_TEXT =
  "Gostaria conhecer a Impulso Criativo";

export function getWhatsAppUrl(customText?: string): string {
  const fromEnv = process.env.NEXT_PUBLIC_WHATSAPP_URL;
  const text = encodeURIComponent(customText ?? WHATSAPP_DEFAULT_TEXT);

  if (fromEnv) {
    try {
      const url = new URL(fromEnv);
      url.searchParams.set("text", customText ?? WHATSAPP_DEFAULT_TEXT);
      return url.toString();
    } catch {
      // fallback abaixo
    }
  }

  return `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${text}&type=phone_number&app_absent=0`;
}

export const SOCIAL = {
  instagram: "https://www.instagram.com/impulso_criativo/",
  facebook: "https://www.facebook.com/impulsocriativo",
  get whatsapp() {
    return getWhatsAppUrl();
  },
} as const;
