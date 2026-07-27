import Image from "next/image";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-impulso-navy hero-grid text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Impulso Criativo"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="text-left leading-none">
              <p className="text-sm font-extrabold tracking-wide text-impulso-yellow">
                IMPULSO
              </p>
              <p className="text-[11px] tracking-[0.22em] text-white">
                CRIATIVO
              </p>
            </div>
          </Link>
          <h1 className="mt-8 text-2xl font-extrabold">Painel Admin</h1>
          <p className="mt-2 text-sm text-slate-300">
            Acesse para ver quem solicitou análise tributária.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
          <AdminLoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-impulso-gold">
            ← Voltar para a landing
          </Link>
        </p>
      </div>
    </main>
  );
}
