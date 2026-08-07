"use client";

import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";

interface AlertasProps {
  loading: boolean;

  produtosBaixoEstoque: {
    nome: string;
    estoque: number;
  }[];
}

export default function Alertas({
  loading,
  produtosBaixoEstoque,
}: AlertasProps) {
  const [
    mostrarAlertas,
    setMostrarAlertas,
  ] = useState(false);

  const produtosSemEstoque =
    produtosBaixoEstoque.filter(
      (produto) =>
        produto.estoque === 0
    ).length;

  const produtosParaRepor =
    produtosBaixoEstoque.filter(
      (produto) =>
        produto.estoque > 0 &&
        produto.estoque <= 5
    ).length;

  function obterSituacao(
    estoque: number
  ) {
    if (estoque === 0) {
      return {
        texto: "Crítico",
        descricao:
          "Produto sem estoque disponível.",
        cor: "text-red-400",
        badge:
          "border-red-500/30 bg-red-500/10 text-red-400",
      };
    }

    return {
      texto: "Atenção",
      descricao:
        "Estoque abaixo do mínimo recomendado.",
      cor: "text-orange-400",
      badge:
        "border-orange-500/30 bg-orange-500/10 text-orange-400",
    };
  }

  return (
    <section className="mt-14">
      {/* CABEÇALHO */}

      <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
        ALERTAS
      </h2>

      {/* PLANILHA PRINCIPAL */}

      <div className="mt-8 overflow-hidden rounded-xl border border-[#343434]">
        {/* CABEÇALHO DA PLANILHA */}

        <div className="grid grid-cols-[1fr_180px_150px] bg-[#222222] text-xs font-bold uppercase tracking-[0.12em] text-[#C8A95B]">
          <div className="border-r border-[#343434] px-4 py-3">
            Indicador
          </div>

          <div className="border-r border-[#343434] px-4 py-3 text-right">
            Quantidade
          </div>

          <div className="px-4 py-3 text-center">
            Situação
          </div>
        </div>

        {/* LINHA EXPANSÍVEL */}

        <div className="border-t border-[#343434]">
          <button
            type="button"
            onClick={() =>
              setMostrarAlertas(
                !mostrarAlertas
              )
            }
            className="grid w-full grid-cols-[1fr_180px_150px] bg-[#141414] text-left transition-colors hover:bg-[#1b1b1b]"
          >
            <div className="flex items-center gap-2 border-r border-[#343434] px-4 py-4">
              {mostrarAlertas ? (
                <ChevronDown
                  size={18}
                  className="shrink-0 text-[#C8A95B]"
                />
              ) : (
                <ChevronRight
                  size={18}
                  className="shrink-0 text-[#C8A95B]"
                />
              )}

              <div className="flex items-center gap-3">
                <AlertTriangle
                  size={18}
                  className={
                    produtosBaixoEstoque.length >
                    0
                      ? "text-orange-400"
                      : "text-green-400"
                  }
                />

                <span className="font-semibold text-white">
                  Alertas de estoque
                </span>
              </div>
            </div>

            <div className="border-r border-[#343434] px-4 py-4 text-right font-bold text-orange-400">
              {loading
                ? "--"
                : produtosBaixoEstoque.length}
            </div>

            <div
              className={`px-4 py-4 text-center text-sm font-semibold ${
                loading
                  ? "text-[#F3E8D7]/50"
                  : produtosBaixoEstoque.length ===
                      0
                    ? "text-green-400"
                    : produtosSemEstoque >
                        0
                      ? "text-red-400"
                      : "text-orange-400"
              }`}
            >
              {loading
                ? "--"
                : produtosBaixoEstoque.length ===
                    0
                  ? "Normal"
                  : produtosSemEstoque >
                      0
                    ? "Crítico"
                    : "Atenção"}
            </div>
          </button>

          {/* CONTEÚDO EXPANDIDO */}

          {mostrarAlertas && (
            <div className="border-t border-[#343434] bg-[#0f0f0f] p-4">
              {loading ? (
                <div className="p-6 text-center text-[#F3E8D7]/60">
                  Carregando...
                </div>
              ) : produtosBaixoEstoque.length ===
                0 ? (
                /* SEM ALERTAS */

                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
                  <p className="font-bold text-green-400">
                    ✓ Estoque dentro dos
                    parâmetros
                  </p>

                  <p className="mt-1 text-sm text-[#F3E8D7]/55">
                    Nenhum produto exige
                    reposição neste momento.
                  </p>
                </div>
              ) : (
                <>
                  {/* RESUMO DOS ALERTAS */}

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#343434] bg-[#151515] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#F3E8D7]/50">
                        Total de alertas
                      </p>

                      <p className="mt-2 text-2xl font-black text-[#C8A95B]">
                        {
                          produtosBaixoEstoque.length
                        }
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#343434] bg-[#151515] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#F3E8D7]/50">
                        Para repor
                      </p>

                      <p className="mt-2 text-2xl font-black text-orange-400">
                        {
                          produtosParaRepor
                        }
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#343434] bg-[#151515] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#F3E8D7]/50">
                        Sem estoque
                      </p>

                      <p className="mt-2 text-2xl font-black text-red-400">
                        {
                          produtosSemEstoque
                        }
                      </p>
                    </div>
                  </div>

                  {/* TABELA */}

                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[700px] border-collapse text-sm">
                      <thead>
                        <tr className="bg-[#222222]">
                          <th className="w-16 border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                            #
                          </th>

                          <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                            Produto
                          </th>

                          <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                            Estoque
                          </th>

                          <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                            Situação
                          </th>

                          <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                            Observação
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {produtosBaixoEstoque.map(
                          (
                            produto,
                            index
                          ) => {
                            const situacao =
                              obterSituacao(
                                produto.estoque
                              );

                            return (
                              <tr
                                key={`${produto.nome}-${index}`}
                                className={
                                  index %
                                    2 ===
                                  0
                                    ? "bg-[#121212]"
                                    : "bg-[#171717]"
                                }
                              >
                                <td className="border border-[#343434] px-4 py-3 text-center text-[#F3E8D7]/40">
                                  {index +
                                    1}
                                </td>

                                <td className="border border-[#343434] px-4 py-3 font-semibold text-white">
                                  {
                                    produto.nome
                                  }
                                </td>

                                <td
                                  className={`border border-[#343434] px-4 py-3 text-center text-lg font-black ${situacao.cor}`}
                                >
                                  {
                                    produto.estoque
                                  }
                                </td>

                                <td className="border border-[#343434] px-4 py-3 text-center">
                                  <span
                                    className={`inline-flex rounded-md border px-3 py-1 text-xs font-bold ${situacao.badge}`}
                                  >
                                    {
                                      situacao.texto
                                    }
                                  </span>
                                </td>

                                <td className="border border-[#343434] px-4 py-3 text-[#F3E8D7]/60">
                                  {
                                    situacao.descricao
                                  }
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>

                      <tfoot>
                        <tr className="bg-[#202020]">
                          <td
                            colSpan={2}
                            className="border border-[#343434] px-4 py-3 text-right font-bold text-white"
                          >
                            TOTAL DE
                            ALERTAS
                          </td>

                          <td className="border border-[#343434] px-4 py-3 text-center text-base font-black text-[#C8A95B]">
                            {
                              produtosBaixoEstoque.length
                            }
                          </td>

                          <td
                            colSpan={2}
                            className="border border-[#343434] px-4 py-3 text-center text-xs font-semibold text-[#F3E8D7]/60"
                          >
                            Produtos que
                            exigem atenção
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}