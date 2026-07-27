import { describe, expect, it } from "vitest";
import { calcularOportunidades } from "./index";
import type { QuizRespostas } from "@/lib/schemas";

describe("calcularOportunidades (score 0–100)", () => {
  it("MEI baixo faturamento → BAIXO (0–30) e faixa 30–50 mil", () => {
    const r = calcularOportunidades({
      regime: "mei",
      faturamentoMensal: "ate_50k",
      vendeProdutos: false,
      qtdItens: "nenhum",
      revisaoRecente: "sim",
    });
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(30);
    expect(r.potencial).toBe("BAIXO");
    expect(r.estimativaTexto).toBe("R$ 30.000 a R$ 50.000");
    expect(r.faixaMin).toBe(30_000);
    expect(r.faixaMax).toBe(50_000);
  });

  it("perfil intermediário tende a MÉDIO", () => {
    const r = calcularOportunidades({
      regime: "simples_nacional",
      faturamentoMensal: "200k_500k",
      vendeProdutos: true,
      qtdItens: "51_200",
      revisaoRecente: "nao_sei",
    });
    expect(r.score).toBeGreaterThanOrEqual(31);
    expect(["MEDIO", "ALTO", "MUITO_ALTO"]).toContain(r.potencial);
  });

  it("Lucro Real + alto faturamento + sem revisão → ALTO ou MUITO_ALTO", () => {
    const r = calcularOportunidades(
      {
        regime: "lucro_real",
        faturamentoMensal: "acima_1m",
        vendeProdutos: true,
        qtdItens: "acima_1000",
        revisaoRecente: "nao",
      },
      {
        cnaeDescricao: "Comércio varejista de mercadorias em geral",
        cnaePrincipal: "4711",
        uf: "SP",
      }
    );
    expect(r.score).toBeGreaterThanOrEqual(61);
    expect(["ALTO", "MUITO_ALTO"]).toContain(r.potencial);
    expect(r.oportunidades.length).toBeGreaterThan(0);
  });

  it("MUITO_ALTO exibe superior a R$ 120.000", () => {
    // força cenário máximo
    const r = calcularOportunidades(
      {
        regime: "lucro_real",
        faturamentoMensal: "acima_1m",
        vendeProdutos: true,
        qtdItens: "acima_1000",
        revisaoRecente: "nao",
      },
      {
        cnaeDescricao: "Indústria de bebidas",
        cnaePrincipal: "1111",
        uf: "PR",
      }
    );
    if (r.potencial === "MUITO_ALTO") {
      expect(r.estimativaTexto).toBe("Superior a R$ 120.000");
      expect(r.faixaMax).toBeNull();
      expect(r.score).toBeGreaterThanOrEqual(86);
    } else {
      expect(r.potencial).toBe("ALTO");
      expect(r.estimativaTexto).toBe("R$ 80.000 a R$ 120.000");
    }
  });

  it("é determinístico e independente de IA", () => {
    const input: QuizRespostas = {
      regime: "lucro_presumido",
      faturamentoMensal: "500k_1m",
      vendeProdutos: true,
      qtdItens: "201_1000",
      revisaoRecente: "nao",
    };
    expect(calcularOportunidades(input)).toEqual(calcularOportunidades(input));
  });

  it("score nunca ultrapassa 100", () => {
    const r = calcularOportunidades(
      {
        regime: "lucro_real",
        faturamentoMensal: "acima_1m",
        vendeProdutos: true,
        qtdItens: "acima_1000",
        revisaoRecente: "nao",
      },
      { cnaeDescricao: "Comércio varejista", cnaePrincipal: "1", uf: "SP" }
    );
    expect(r.score).toBeLessThanOrEqual(100);
  });
});
