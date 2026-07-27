import Image from "next/image";
import Link from "next/link";
import { logoutAdminAction } from "@/app/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin-auth";
import { listAdminLeads } from "@/lib/admin-leads";
import { formatCnpj, formatPhone, formatBRL } from "@/lib/utils";
import { labelPotencial } from "@/lib/schemas";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function AdminPage() {
  await requireAdmin();
  const { leads, error } = await listAdminLeads();

  const qualificados = leads.filter((l) => l.status === "qualificado").length;
  const comContato = leads.filter((l) => l.nome && l.whatsapp).length;

  return (
    <main className="min-h-screen bg-impulso-navy text-white">
      <header className="border-b border-white/10 bg-impulso-deep/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Impulso Criativo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-extrabold tracking-wide text-impulso-yellow">
                Painel Admin
              </p>
              <p className="text-xs text-slate-400">Solicitações de análise</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Landing</Link>
            </Button>
            <form action={logoutAdminAction}>
              <Button type="submit" variant="secondary" size="sm">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Total
            </p>
            <p className="mt-1 text-3xl font-extrabold text-impulso-yellow">
              {leads.length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Com contato
            </p>
            <p className="mt-1 text-3xl font-extrabold text-white">
              {comContato}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Qualificados
            </p>
            <p className="mt-1 text-3xl font-extrabold text-impulso-success">
              {qualificados}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-soft">
          <div className="border-b border-slate-100 px-5 py-4">
            <h1 className="text-lg font-bold text-impulso-navy">
              Pessoas que solicitaram análise
            </h1>
            <p className="text-sm text-slate-500">
              Nome, contato (e-mail) e telefone (WhatsApp) capturados no funil.
            </p>
          </div>

          {leads.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              Nenhuma solicitação registrada ainda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Data</th>
                    <th className="px-5 py-3 font-semibold">Nome</th>
                    <th className="px-5 py-3 font-semibold">Contato</th>
                    <th className="px-5 py-3 font-semibold">Telefone</th>
                    <th className="px-5 py-3 font-semibold">Empresa</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Potencial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-impulso-deep">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80">
                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-5 py-4 font-medium">
                        {lead.nome || (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {lead.email ? (
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-impulso-navy hover:text-impulso-gold"
                          >
                            {lead.email}
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {lead.whatsapp ? (
                          <a
                            href={`https://api.whatsapp.com/send/?phone=${lead.whatsapp.replace(/\D/g, "")}&type=phone_number&app_absent=0`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-impulso-success hover:underline"
                          >
                            {formatPhone(lead.whatsapp)}
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="max-w-[14rem]">
                          <p className="truncate font-medium">
                            {lead.razao_social || "—"}
                          </p>
                          {lead.cnpj && (
                            <p className="text-xs text-slate-400">
                              {formatCnpj(lead.cnpj)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            lead.status === "qualificado"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {lead.potencial ? (
                          <div>
                            <p className="font-semibold text-impulso-navy">
                              {["BAIXO", "MEDIO", "ALTO", "MUITO_ALTO"].includes(
                                lead.potencial
                              )
                                ? labelPotencial(
                                    lead.potencial as
                                      | "BAIXO"
                                      | "MEDIO"
                                      | "ALTO"
                                      | "MUITO_ALTO"
                                  )
                                : lead.potencial}
                            </p>
                            {lead.faixa_min != null && (
                              <p className="text-xs text-slate-500">
                                {lead.potencial === "MUITO_ALTO" ||
                                Number(lead.faixa_max) <= Number(lead.faixa_min)
                                  ? `Superior a ${formatBRL(Number(lead.faixa_min))}`
                                  : `${formatBRL(Number(lead.faixa_min))} – ${formatBRL(Number(lead.faixa_max))}`}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
