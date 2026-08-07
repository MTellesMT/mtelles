"use client";

import {
  ChevronDown,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

interface ProdutoEstoque {
  id: number;
  nome: string;
  codigo: string;
  marca: string;
  estoque: number;
}

interface TabelaEstoqueProps {
  loading: boolean;
  produtos: ProdutoEstoque[];
}

export default function TabelaEstoque({
  loading,
  produtos,
}: TabelaEstoqueProps) {
  const [
    mostrarEstoque,
    setMostrarEstoque,
  ] = useState(false);

  const [
    busca,
    setBusca,
  ] = useState("");

  const [
    marcaSelecionada,
    setMarcaSelecionada,
  ] = useState("TODAS");

  const [
    situacaoSelecionada,
    setSituacaoSelecionada,
  ] = useState("TODOS");

  function normalizar(
    texto: string
  ) {
    return String(texto ?? "")
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .trim();
  }

  /*
    MARCAS DISPONÍVEIS

    As marcas são geradas automaticamente
    conforme os produtos cadastrados.
  */

  const marcasDisponiveis =
    useMemo(() => {
      return Array.from(
        new Set(
          produtos
            .map((produto) =>
              String(
                produto.marca ?? ""
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
    }, [produtos]);

  /*
    PRODUTOS FILTRADOS
  */

  const produtosFiltrados =
    useMemo(() => {
      return produtos.filter(
        (produto) => {
          const textoBusca =
            normalizar(busca);

          /*
            BUSCA
          */

          const correspondeBusca =
            !textoBusca ||
            normalizar(
              produto.nome
            ).includes(
              textoBusca
            ) ||
            normalizar(
              produto.codigo
            ).includes(
              textoBusca
            ) ||
            normalizar(
              produto.marca
            ).includes(
              textoBusca
            );

          /*
            MARCA
          */

          const correspondeMarca =
            marcaSelecionada ===
              "TODAS" ||
            normalizar(
              produto.marca
            ) ===
              normalizar(
                marcaSelecionada
              );

          /*
            SITUAÇÃO
          */

          let correspondeSituacao =
            true;

          if (
            situacaoSelecionada ===
            "NORMAL"
          ) {
            correspondeSituacao =
              produto.estoque > 5;
          }

          if (
            situacaoSelecionada ===
            "REPOR"
          ) {
            correspondeSituacao =
              produto.estoque > 0 &&
              produto.estoque <= 5;
          }

          if (
            situacaoSelecionada ===
            "SEM"
          ) {
            correspondeSituacao =
              produto.estoque === 0;
          }

          return (
            correspondeBusca &&
            correspondeMarca &&
            correspondeSituacao
          );
        }
      );
    }, [
      produtos,
      busca,
      marcaSelecionada,
      situacaoSelecionada,
    ]);

  /*
    FILTROS ATIVOS
  */

  const filtrosAtivos =
    Boolean(
      busca.trim() ||
        marcaSelecionada !==
          "TODAS" ||
        situacaoSelecionada !==
          "TODOS"
    );

  /*
    TOTAIS DO ESTOQUE
  */

  const quantidadeTotalEstoque =
    useMemo(() => {
      return produtos.reduce(
        (
          acumulador,
          produto
        ) =>
          acumulador +
          Number(
            produto.estoque || 0
          ),
        0
      );
    }, [produtos]);

  const produtosNormais =
    useMemo(() => {
      return produtos.filter(
        (produto) =>
          produto.estoque > 5
      ).length;
    }, [produtos]);

  const produtosParaRepor =
    useMemo(() => {
      return produtos.filter(
        (produto) =>
          produto.estoque > 0 &&
          produto.estoque <= 5
      ).length;
    }, [produtos]);

  const produtosSemEstoque =
    useMemo(() => {
      return produtos.filter(
        (produto) =>
          produto.estoque === 0
      ).length;
    }, [produtos]);

  /*
    LIMPAR FILTROS
  */

  function limparFiltros() {
    setBusca("");
    setMarcaSelecionada(
      "TODAS"
    );
    setSituacaoSelecionada(
      "TODOS"
    );
  }

  /*
    SITUAÇÃO DO PRODUTO
  */

  function obterSituacao(
    estoque: number
  ) {
    if (estoque === 0) {
      return {
        texto: "Sem estoque",
        cor: "text-red-400",
      };
    }

    if (
      estoque > 0 &&
      estoque <= 5
    ) {
      return {
        texto: "Repor",
        cor: "text-orange-400",
      };
    }

    return {
      texto: "Normal",
      cor: "text-green-400",
    };
  }

  return (
    <section className="mt-14">
      {/* CABEÇALHO */}

      <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
        ESTOQUE GERAL
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
              setMostrarEstoque(
                !mostrarEstoque
              )
            }
            className="grid w-full grid-cols-[1fr_180px_150px] bg-[#141414] text-left transition-colors hover:bg-[#1b1b1b]"
          >
            <div className="flex items-center gap-2 border-r border-[#343434] px-4 py-4">
              {mostrarEstoque ? (
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
                Produtos em estoque
              </span>
            </div>

            <div className="border-r border-[#343434] px-4 py-4 text-right font-bold text-blue-400">
              {loading
                ? "--"
                : produtos.length}
            </div>

            <div className="px-4 py-4 text-center text-sm font-semibold text-green-400">
              Controle
            </div>
          </button>

          {/* ÁREA EXPANDIDA */}

          {mostrarEstoque && (
            <div className="border-t border-[#343434] bg-[#0f0f0f] p-4">
              {/* DESCRIÇÃO */}

              <div>
                <p className="font-bold text-white">
                  Controle geral de estoque
                </p>

                <p className="mt-1 text-xs text-[#F3E8D7]/45">
                  Consulte produtos,
                  quantidades e necessidade
                  de reposição.
                </p>
              </div>

              {/* RESUMO INTERNO */}

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-[#343434] bg-[#151515] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#F3E8D7]/50">
                    Itens disponíveis
                  </p>

                  <p className="mt-2 text-2xl font-black text-blue-400">
                    {loading
                      ? "--"
                      : quantidadeTotalEstoque}
                  </p>
                </div>

                <div className="rounded-xl border border-[#343434] bg-[#151515] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#F3E8D7]/50">
                    Estoque normal
                  </p>

                  <p className="mt-2 text-2xl font-black text-green-400">
                    {loading
                      ? "--"
                      : produtosNormais}
                  </p>
                </div>

                <div className="rounded-xl border border-[#343434] bg-[#151515] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#F3E8D7]/50">
                    Repor
                  </p>

                  <p className="mt-2 text-2xl font-black text-orange-400">
                    {loading
                      ? "--"
                      : produtosParaRepor}
                  </p>
                </div>

                <div className="rounded-xl border border-[#343434] bg-[#151515] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#F3E8D7]/50">
                    Sem estoque
                  </p>

                  <p className="mt-2 text-2xl font-black text-red-400">
                    {loading
                      ? "--"
                      : produtosSemEstoque}
                  </p>
                </div>
              </div>

              {/* FILTROS */}

              <div className="mt-5 rounded-xl border border-[#343434] bg-[#151515] p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#C8A95B]">
                      Filtros
                    </p>

                    <p className="mt-1 text-xs text-[#F3E8D7]/40">
                      Refine os produtos
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

                <div className="grid gap-4 md:grid-cols-3">
                  {/* BUSCA */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#F3E8D7]/60">
                      Produto, código ou marca
                    </label>

                    <div className="flex items-center rounded-lg border border-[#343434] bg-[#0f0f0f] px-3">
                      <Search
                        size={16}
                        className="shrink-0 text-[#C8A95B]"
                      />

                      <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={busca}
                        onChange={(
                          event
                        ) =>
                          setBusca(
                            event
                              .target
                              .value
                          )
                        }
                        className="w-full bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-[#F3E8D7]/30"
                      />
                    </div>
                  </div>

                  {/* MARCA */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#F3E8D7]/60">
                      Marca
                    </label>

                    <select
                      value={
                        marcaSelecionada
                      }
                      onChange={(
                        event
                      ) =>
                        setMarcaSelecionada(
                          event
                            .target
                            .value
                        )
                      }
                      className="w-full rounded-lg border border-[#343434] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#C8A95B]"
                    >
                      <option value="TODAS">
                        Todas
                      </option>

                      {marcasDisponiveis.map(
                        (marca) => (
                          <option
                            key={
                              marca
                            }
                            value={
                              marca
                            }
                          >
                            {marca}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* SITUAÇÃO */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#F3E8D7]/60">
                      Situação
                    </label>

                    <select
                      value={
                        situacaoSelecionada
                      }
                      onChange={(
                        event
                      ) =>
                        setSituacaoSelecionada(
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

                      <option value="NORMAL">
                        Normal
                      </option>

                      <option value="REPOR">
                        Repor
                      </option>

                      <option value="SEM">
                        Sem estoque
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* RESULTADOS */}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-[#F3E8D7]/60">
                  Exibindo{" "}
                  <strong className="text-white">
                    {
                      produtosFiltrados.length
                    }
                  </strong>{" "}
                  de{" "}
                  <strong className="text-white">
                    {produtos.length}
                  </strong>{" "}
                  produtos
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
                        Produto
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Código
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Marca
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                        Estoque
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                        Situação
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="border border-[#343434] p-8 text-center text-[#F3E8D7]/60"
                        >
                          Carregando...
                        </td>
                      </tr>
                    ) : produtos.length ===
                      0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="border border-[#343434] p-8 text-center text-[#F3E8D7]/60"
                        >
                          Nenhum produto
                          encontrado.
                        </td>
                      </tr>
                    ) : produtosFiltrados.length ===
                      0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="border border-[#343434] p-8 text-center text-[#F3E8D7]/60"
                        >
                          Nenhum produto
                          encontrado para os
                          filtros selecionados.
                        </td>
                      </tr>
                    ) : (
                      produtosFiltrados.map(
                        (
                          produto,
                          index
                        ) => {
                          const {
                            texto,
                            cor,
                          } =
                            obterSituacao(
                              produto.estoque
                            );

                          return (
                            <tr
                              key={
                                produto.id
                              }
                              className={
                                index %
                                  2 ===
                                0
                                  ? "bg-[#121212]"
                                  : "bg-[#171717]"
                              }
                            >
                              <td className="border border-[#343434] px-4 py-3 font-semibold text-white">
                                {
                                  produto.nome
                                }
                              </td>

                              <td className="border border-[#343434] px-4 py-3">
                                {
                                  produto.codigo
                                }
                              </td>

                              <td className="border border-[#343434] px-4 py-3">
                                {
                                  produto.marca
                                }
                              </td>

                              <td className="border border-[#343434] px-4 py-3 text-center text-base font-black text-[#C8A95B]">
                                {
                                  produto.estoque
                                }
                              </td>

                              <td
                                className={`border border-[#343434] px-4 py-3 text-center font-bold ${cor}`}
                              >
                                {texto}
                              </td>
                            </tr>
                          );
                        }
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
                        PRODUTOS EXIBIDOS
                      </td>

                      <td className="border border-[#343434] px-4 py-3 text-center text-base font-black text-[#C8A95B]">
                        {
                          produtosFiltrados.length
                        }
                      </td>

                      <td className="border border-[#343434] px-4 py-3 text-center text-xs font-semibold text-[#F3E8D7]/60">
                        de{" "}
                        {produtos.length}{" "}
                        produtos
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