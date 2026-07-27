import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const OPORTUNIDADES = [
  "Revisão de PIS/COFINS",
  "Produtos monofásicos",
  "Classificação fiscal (NCM)",
  "Segregação de receitas",
  "Reforma tributária",
];

function PainelFiscal() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-4 rounded-[2rem] bg-impulso-gold/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#07111f]/95 p-5 shadow-2xl sm:p-6">
        <p className="mb-4 text-sm font-medium text-white">Painel fiscal</p>

        <div className="grid gap-5 sm:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-impulso-gold">
              Oportunidades Identificadas
            </p>
            <ul className="space-y-2.5">
              {OPORTUNIDADES.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-200">
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-impulso-gold text-impulso-navy">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-3">
              <div
                className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                style={{
                  background:
                    "conic-gradient(#E5B14B 0 87%, rgba(255,255,255,0.12) 87% 100%)",
                }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#07111f] text-xs font-bold text-impulso-yellow">
                  87
                </div>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Índice de Oportunidade</p>
                <p className="text-lg font-extrabold text-white">
                  87<span className="text-sm text-slate-400">/100</span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-impulso-navy/80 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Oportunidade estimada
            </p>
            <p className="mt-1 text-3xl font-extrabold text-impulso-yellow">+70 mil</p>

            <div className="mt-5 flex h-24 items-end justify-between gap-2">
              {[
                { label: "Baixo", h: "40%" },
                { label: "Médio", h: "68%" },
                { label: "Alto", h: "100%" },
              ].map((bar) => (
                <div key={bar.label} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-20 w-full items-end rounded-md bg-white/5 px-1.5 pb-1">
                    <div
                      className="w-full rounded-sm bg-gradient-to-t from-impulso-gold to-impulso-yellow"
                      style={{ height: bar.h }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-5 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-slate-500">
          Estimativa preliminar baseada nas informações fornecidas. Confirmação
          mediante análise documental.
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-impulso-navy hero-grid text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 safe-px pb-14 pt-28 sm:pb-16 md:grid-cols-2 md:gap-12 md:px-6 md:pb-20 md:pt-32">
        <div className="space-y-6">
          <h1 className="text-balance text-[1.85rem] font-extrabold leading-[1.15] tracking-tight sm:text-4xl md:text-[2.75rem]">
            Descubra{" "}
            <span className="text-impulso-gold">oportunidades tributárias</span>{" "}
            escondidas na sua empresa
          </h1>
          <p className="max-w-md text-[15px] leading-relaxed text-slate-300 sm:text-base md:text-lg">
            Faça uma análise preliminar do seu CNPJ em menos de 1 minuto.
          </p>
          <Button asChild size="lg" className="w-full touch-target sm:w-auto">
            <a href="#diagnostico">Começar diagnóstico →</a>
          </Button>
        </div>

        <div className="w-full">
          <PainelFiscal />
        </div>
      </div>
    </section>
  );
}
