import { Suspense } from "react";
import { Beneficios } from "@/components/beneficios";
import { DiagnosticoFunil } from "@/components/diagnostico/funil";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ProvaSocial } from "@/components/prova-social";

export default function HomePage() {
  return (
    <main className="bg-impulso-navy">
      <Header />
      <Hero />
      <Beneficios />
      <ProvaSocial />
      <Suspense
        fallback={
          <section className="bg-slate-50 py-16 text-center text-slate-500">
            Carregando diagnóstico...
          </section>
        }
      >
        <DiagnosticoFunil />
      </Suspense>
      <div id="contato">
        <Footer />
      </div>
    </main>
  );
}
