"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { LEGAL_DOCS, type LegalDocId } from "@/lib/legal-content";
import { getWhatsAppUrl, SOCIAL } from "@/lib/site";

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.37 1.41-3.68 3.57-3.68 1.03 0 2.12.18 2.12.18v2.33h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.91h-2.22V22c4.78-.75 8.44-4.91 8.44-9.93z" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  );
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.33.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.9 11.9 0 0 0 5.75 1.46h.01c6.55 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.44-8.43zM12.06 21.15h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.74.98 1-3.64-.24-.37a9.84 9.84 0 0 1-1.51-5.24c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.89a9.8 9.8 0 0 1 2.88 6.96c0 5.44-4.43 9.85-9.86 9.85zm5.41-7.39c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
    </svg>
  );
}

function LegalModal({
  docId,
  open,
  onClose,
}: {
  docId: LegalDocId | null;
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const doc = docId ? LEGAL_DOCS[docId] : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !doc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-impulso-navy/70 backdrop-blur-sm"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[88dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-impulso-deep p-5 shadow-2xl safe-pb sm:rounded-2xl sm:p-6 md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4 sm:top-4 sm:h-9 sm:w-9"
          aria-label={`Fechar ${doc.title}`}
        >
          <X className="h-5 w-5" />
        </button>

        <h2
          id={titleId}
          className="pr-12 text-lg font-extrabold text-impulso-yellow sm:text-xl md:text-2xl"
        >
          {doc.title}
        </h2>

        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-300 sm:mt-5 sm:text-base">
          {doc.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const whatsappUrl = getWhatsAppUrl();
  const [openDoc, setOpenDoc] = useState<LegalDocId | null>(null);

  return (
    <>
      <footer className="bg-impulso-navy text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-10 safe-px py-12 sm:py-14 md:grid-cols-3 md:px-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Impulso Criativo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="leading-none">
                <p className="text-sm font-extrabold tracking-wide text-impulso-yellow">
                  IMPULSO
                </p>
                <p className="text-[11px] tracking-[0.22em] text-white">
                  CRIATIVO
                </p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              Estratégias, consultoria e automação com IA para impulsionar o
              crescimento da sua empresa.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[#25D366] transition hover:bg-white/10"
              >
                <IconWhatsApp className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10 hover:text-impulso-gold"
              >
                <IconInstagram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10 hover:text-impulso-gold"
              >
                <IconFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">
              Links rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#diagnostico" className="hover:text-impulso-gold">
                  Diagnóstico
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setOpenDoc("sobre")}
                  className="hover:text-impulso-gold"
                >
                  Sobre
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setOpenDoc("termos")}
                  className="hover:text-impulso-gold"
                >
                  Termos de Uso
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setOpenDoc("privacidade")}
                  className="hover:text-impulso-gold"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <a
                  href="https://impulsocriativo.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-impulso-gold"
                >
                  Site institucional
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={whatsappUrl}
                  className="hover:text-impulso-gold"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp — (51) 98909-9973
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@impulsocriativo.com"
                  className="hover:text-impulso-gold"
                >
                  contato@impulsocriativo.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500 safe-pb">
          © {year} Impulso Criativo. Todos os direitos reservados.
        </div>
      </footer>

      <LegalModal
        docId={openDoc}
        open={openDoc !== null}
        onClose={() => setOpenDoc(null)}
      />
    </>
  );
}
