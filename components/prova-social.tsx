const EMPRESAS = [
  "Porto Verde",
  "Leoval",
  "Delícias",
  "Flexbor",
  "15 Industrial",
];

export function ProvaSocial() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-24 border-t border-white/5 bg-impulso-navy py-12 text-white sm:py-14"
    >
      <div className="mx-auto max-w-6xl safe-px text-center md:px-6">
        <p className="text-sm text-slate-400 sm:text-base">
          Empresas de todo o Brasil utilizam nossa metodologia.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
          {EMPRESAS.map((nome) => (
            <span
              key={nome}
              className="text-sm font-semibold tracking-wide text-white/45 sm:text-base"
            >
              {nome}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
