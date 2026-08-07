"use client";

import {
  ChevronDown,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

interface Movimentacao {
  id: number;
  tipo: string;
  produto: string;
  quantidade: number;
  motivo: string;
  created_at: string;
}

interface MovimentacoesProps {
  loading: boolean;
  movimentacoes: Movimentacao[];
}

export default function Movimentacoes({
  loading,
  movimentacoes,
}: MovimentacoesProps) {
  const [
    mostrarMovimentacoes,
    setMostrarMovimentacoes,
  ] = useState(false);

  const [
    dataInicial,
    setDataInicial,
  ] = useState("");

  const [
    dataFinal,
    setDataFinal,
  ] = useState("");

  const [
    tipoSelecionado,
    setTipoSelecionado,
  ] = useState("TODOS");

  const [
    buscaProduto,
    setBuscaProduto,
  ] = useState("");

  const [
    motivoSelecionado,
    setMotivoSelecionado,
  ] = useState("TODOS");

  function normalizar(texto: string) {
    return String(texto ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function obterDataLocal(data: string) {
    const valor = new Date(data);

    return new Date(
      valor.getFullYear(),
      valor.getMonth(),
      valor.getDate()
    );
  }

  /*
    TIPOS FIXOS

    ENTRADA e SAÍDA aparecem sempre no filtro,
    mesmo quando ainda não existem registros
    daquele tipo no histórico.
  */

  const tiposDisponiveis = [
    "ENTRADA",
    "SAÍDA",
  ];

  /*
    MOTIVOS DINÂMICOS

    Os motivos continuam sendo montados
    conforme os registros existentes.
  */

  const motivosDisponiveis =
    useMemo(() => {
      return Array.from(
        new Set(
          movimentacoes
            .map((mov) =>
              String(
                mov.motivo ?? ""
              ).trim()
            )
            .filter(Boolean)
        )
      ).sort((a, b) =>
        a.localeCompare(
          b,
          "pt-BR"
        )
      );
    }, [movimentacoes]);

  /*
    FILTRAGEM
  */

  const movimentacoesFiltradas =
    useMemo(() => {
      return movimentacoes.filter(
        (mov) => {
          /* PRODUTO */

          const correspondeProduto =
            !buscaProduto.trim() ||
            normalizar(
              mov.produto
            ).includes(
              normalizar(
                buscaProduto
              )
            );

          /* TIPO */

          const correspondeTipo =
            tipoSelecionado ===
              "TODOS" ||
            normalizar(
              mov.tipo
            ) ===
              normalizar(
                tipoSelecionado
              );

          /* MOTIVO */

          const correspondeMotivo =
            motivoSelecionado ===
              "TODOS" ||
            normalizar(
              mov.motivo
            ) ===
              normalizar(
                motivoSelecionado
              );

          /* DATA */

          const dataMovimentacao =
            obterDataLocal(
              mov.created_at
            );

          let correspondeDataInicial =
            true;

          let correspondeDataFinal =
            true;

          if (dataInicial) {
            const [
              ano,
              mes,
              dia,
            ] = dataInicial
              .split("-")
              .map(Number);

            const inicio = new Date(
              ano,
              mes - 1,
              dia
            );

            correspondeDataInicial =
              dataMovimentacao >=
              inicio;
          }

          if (dataFinal) {
            const [
              ano,
              mes,
              dia,
            ] = dataFinal
              .split("-")
              .map(Number);

            const fim = new Date(
              ano,
              mes - 1,
              dia
            );

            correspondeDataFinal =
              dataMovimentacao <=
              fim;
          }

          return (
            correspondeProduto &&
            correspondeTipo &&
            correspondeMotivo &&
            correspondeDataInicial &&
            correspondeDataFinal
          );
        }
      );
    }, [
      movimentacoes,
      buscaProduto,
      tipoSelecionado,
      motivoSelecionado,
      dataInicial,
      dataFinal,
    ]);

  /*
    FILTROS ATIVOS
  */

  const filtrosAtivos = Boolean(
    buscaProduto.trim() ||
      dataInicial ||
      dataFinal ||
      tipoSelecionado !==
        "TODOS" ||
      motivoSelecionado !==
        "TODOS"
  );

  /*
    LIMPAR FILTROS
  */

  function limparFiltros() {
    setDataInicial("");
    setDataFinal("");
    setTipoSelecionado(
      "TODOS"
    );
    setBuscaProduto("");
    setMotivoSelecionado(
      "TODOS"
    );
  }

  /*
    FORMATAÇÃO DE DATA
  */

  function formatarData(
    data: string
  ) {
    return new Date(
      data
    ).toLocaleDateString(
      "pt-BR"
    );
  }

  /*
    COR DO TIPO
  */

  function classeTipo(
    tipo: string
  ) {
    const tipoNormalizado =
      normalizar(tipo);

    if (
      tipoNormalizado ===
      "entrada"
    ) {
      return "text-green-400";
    }

    if (
      tipoNormalizado ===
      "saida"
    ) {
      return "text-red-400";
    }

    return "text-blue-400";
  }

  return (
    <section className="mt-14">
      {/* CABEÇALHO */}

      <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
        ÚLTIMAS MOVIMENTAÇÕES
      </h2>

      {/* PLANILHA */}

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
              setMostrarMovimentacoes(
                !mostrarMovimentacoes
              )
            }
            className="grid w-full grid-cols-[1fr_180px_150px] bg-[#141414] text-left transition-colors hover:bg-[#1b1b1b]"
          >
            <div className="flex items-center gap-2 border-r border-[#343434] px-4 py-4">
              {mostrarMovimentacoes ? (
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

              <span className="font-semibold text-white">
                Movimentações registradas
              </span>
            </div>

            <div className="border-r border-[#343434] px-4 py-4 text-right font-bold text-blue-400">
              {loading
                ? "--"
                : movimentacoes.length}
            </div>

            <div className="px-4 py-4 text-center text-sm font-semibold text-green-400">
              Histórico
            </div>
          </button>

          {/* CONTEÚDO EXPANDIDO */}

          {mostrarMovimentacoes && (
            <div className="border-t border-[#343434] bg-[#0f0f0f] p-4">
              {/* TÍTULO */}

              <div>
                <p className="font-bold text-white">
                  Histórico de movimentações
                </p>

                <p className="mt-1 text-xs text-[#F3E8D7]/45">
                  Consulte entradas e saídas
                  utilizando os filtros abaixo.
                </p>
              </div>

              {/* FILTROS */}

              <div className="mt-5 rounded-xl border border-[#343434] bg-[#151515] p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#C8A95B]">
                      Filtros
                    </p>

                    <p className="mt-1 text-xs text-[#F3E8D7]/40">
                      Refine os registros
                      exibidos na planilha.
                    </p>
                  </div>

                  {filtrosAtivos && (
                    <button
                      type="button"
                      onClick={
                        limparFiltros
                      }
                      className="flex items-center gap-2 rounded-lg border border-[#C8A95B]/30 px-3 py-2 text-xs font-semibold text-[#C8A95B] transition-colors hover:bg-[#C8A95B] hover:text-[#111111]"
                    >
                      <X size={14} />

                      Limpar filtros
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {/* PRODUTO */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#F3E8D7]/60">
                      Produto
                    </label>

                    <div className="flex items-center rounded-lg border border-[#343434] bg-[#0f0f0f] px-3">
                      <Search
                        size={16}
                        className="shrink-0 text-[#C8A95B]"
                      />

                      <input
                        type="text"
                        value={
                          buscaProduto
                        }
                        onChange={(
                          event
                        ) =>
                          setBuscaProduto(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Buscar produto..."
                        className="w-full bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-[#F3E8D7]/30"
                      />
                    </div>
                  </div>

                  {/* DATA INICIAL */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#F3E8D7]/60">
                      Data inicial
                    </label>

                    <input
                      type="date"
                      value={
                        dataInicial
                      }
                      onChange={(
                        event
                      ) =>
                        setDataInicial(
                          event
                            .target
                            .value
                        )
                      }
                      className="w-full rounded-lg border border-[#343434] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#C8A95B]"
                    />
                  </div>

                  {/* DATA FINAL */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#F3E8D7]/60">
                      Data final
                    </label>

                    <input
                      type="date"
                      value={
                        dataFinal
                      }
                      onChange={(
                        event
                      ) =>
                        setDataFinal(
                          event
                            .target
                            .value
                        )
                      }
                      className="w-full rounded-lg border border-[#343434] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#C8A95B]"
                    />
                  </div>

                  {/* TIPO */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#F3E8D7]/60">
                      Tipo
                    </label>

                    <select
                      value={
                        tipoSelecionado
                      }
                      onChange={(
                        event
                      ) =>
                        setTipoSelecionado(
                          event
                            .target
                            .value
                        )
                      }
                      className="w-full rounded-lg border border-[#343434] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#C8A95B]"
                    >
                      <option value="TODOS">
                        Todos
                      </option>

                      {tiposDisponiveis.map(
                        (tipo) => (
                          <option
                            key={
                              tipo
                            }
                            value={
                              tipo
                            }
                          >
                            {tipo}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* MOTIVO */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#F3E8D7]/60">
                      Motivo
                    </label>

                    <select
                      value={
                        motivoSelecionado
                      }
                      onChange={(
                        event
                      ) =>
                        setMotivoSelecionado(
                          event
                            .target
                            .value
                        )
                      }
                      className="w-full rounded-lg border border-[#343434] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#C8A95B]"
                    >
                      <option value="TODOS">
                        Todos
                      </option>

                      {motivosDisponiveis.map(
                        (motivo) => (
                          <option
                            key={
                              motivo
                            }
                            value={
                              motivo
                            }
                          >
                            {
                              motivo
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* RESULTADO DO FILTRO */}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-[#F3E8D7]/60">
                  Exibindo{" "}
                  <strong className="text-white">
                    {
                      movimentacoesFiltradas.length
                    }
                  </strong>{" "}
                  de{" "}
                  <strong className="text-white">
                    {
                      movimentacoes.length
                    }
                  </strong>{" "}
                  movimentações
                </p>

                {filtrosAtivos && (
                  <span className="rounded-full border border-[#C8A95B]/25 bg-[#C8A95B]/5 px-3 py-1 text-xs font-semibold text-[#C8A95B]">
                    Filtro ativo
                  </span>
                )}
              </div>

              {/* TABELA */}

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#222222]">
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Data
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Produto
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                        Tipo
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                        Qtd.
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Motivo
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="border border-[#343434] p-6 text-center text-[#F3E8D7]/60"
                        >
                          Carregando...
                        </td>
                      </tr>
                    ) : movimentacoesFiltradas.length ===
                      0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="border border-[#343434] p-6 text-center text-[#F3E8D7]/60"
                        >
                          Nenhuma movimentação
                          encontrada para os
                          filtros selecionados.
                        </td>
                      </tr>
                    ) : (
                      movimentacoesFiltradas.map(
                        (
                          mov,
                          index
                        ) => (
                          <tr
                            key={
                              mov.id
                            }
                            className={
                              index %
                                2 ===
                              0
                                ? "bg-[#121212]"
                                : "bg-[#171717]"
                            }
                          >
                            <td className="whitespace-nowrap border border-[#343434] px-4 py-3">
                              {formatarData(
                                mov.created_at
                              )}
                            </td>

                            <td className="border border-[#343434] px-4 py-3 font-semibold text-white">
                              {
                                mov.produto
                              }
                            </td>

                            <td className="border border-[#343434] px-4 py-3 text-center">
                              <span
                                className={`font-bold ${classeTipo(
                                  mov.tipo
                                )}`}
                              >
                                {
                                  mov.tipo
                                }
                              </span>
                            </td>

                            <td className="border border-[#343434] px-4 py-3 text-center font-black text-[#C8A95B]">
                              {
                                mov.quantidade
                              }
                            </td>

                            <td className="border border-[#343434] px-4 py-3">
                              {mov.motivo ||
                                "--"}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>

                  {/* RODAPÉ */}

                  <tfoot>
                    <tr className="bg-[#202020]">
                      <td
                        colSpan={3}
                        className="border border-[#343434] px-4 py-3 text-right font-bold text-white"
                      >
                        REGISTROS EXIBIDOS
                      </td>

                      <td className="border border-[#343434] px-4 py-3 text-center text-base font-black text-[#C8A95B]">
                        {
                          movimentacoesFiltradas.length
                        }
                      </td>

                      <td className="border border-[#343434] px-4 py-3 text-center text-xs font-semibold text-[#F3E8D7]/60">
                        de{" "}
                        {
                          movimentacoes.length
                        }{" "}
                        movimentações
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}