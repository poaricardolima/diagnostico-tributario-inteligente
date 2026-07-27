import { Clock3, DollarSign, ShieldCheck } from "lucide-react";

const BENEFICIOS = [
  {
    n: "01",
    title: "Gratuito",
    text: "Diagnóstico 100% gratuito para sua empresa, sem compromisso inicial.",
    Icon: DollarSign,
  },
  {
    n: "02",
    title: "Rápido",
    text: "Resultado preliminar em menos de 1 minuto, direto no navegador.",
    Icon: Clock3,
  },
  {
    n: "03",
    title: "Seguro",
    text: "Seus dados tratados com confidencialidade e conformidade com a LGPD.",
    Icon: ShieldCheck,
  },
];

export function Beneficios() {
  return (
    <section
      id="beneficios"
      className="scroll-mt-24 border-t border-white/5 bg-impulso-navy pb-6 pt-2 text-white"
    >
      <div className="mx-auto grid max-w-6xl gap-4 safe-px md:grid-cols-3 md:px-6">
        {BENEFICIOS.map(({ n, title, text, Icon }) => (
          <article
            key={n}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-impulso-gold/15 shadow-[0_0_24px_rgba(229,177,75,0.35)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-impulso-gold text-impulso-navy">
                <Icon className="h-4 w-4" strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="mt-2 pr-8 text-sm leading-relaxed text-slate-400">
              {text}
            </p>
            <span className="absolute bottom-3 right-4 text-3xl font-extrabold text-white/10">
              {n}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
