"use client";

import {
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  Search,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

interface Produto {
  id: number;
  nome: string;
  codigo: string;
  marca: string;
  cores: string;
  estoque: number;
}

interface ProdutoBaixoEstoque {
  marca: string;
  nome: string;
  estoque: number;
}

interface Pedido {
  id: number;
  cliente: string;
  telefone?: string;
  status: string;
  total: number;
  created_at: string;

  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

interface ResumoOperacionalProps {
  loading: boolean;
  totalPedidos: number;
  pedidosEntregues: number;
  percentualEntregues: number;
  produtos: Produto[];
  produtosBaixoEstoque: ProdutoBaixoEstoque[];
  pedidos: Pedido[];
}

export default function ResumoOperacional({
  loading,
  totalPedidos,
  pedidosEntregues,
  percentualEntregues,
  produtos,
  pedidos,
  produtosBaixoEstoque,
}: ResumoOperacionalProps) {
  const [
    mostrarProdutos,
    setMostrarProdutos,
  ] = useState(false);

  const [
    mostrarPedidos,
    setMostrarPedidos,
  ] = useState(false);

  const [
    mostrarBaixoEstoque,
    setMostrarBaixoEstoque,
  ] = useState(false);

  /* FILTROS DOS PRODUTOS */

  const [
    buscaProduto,
    setBuscaProduto,
  ] = useState("");

  const [
    marcaProduto,
    setMarcaProduto,
  ] = useState("TODAS");

  const [
    situacaoProduto,
    setSituacaoProduto,
  ] = useState("TODOS");

  /* FILTROS DOS PEDIDOS */

  const [
    buscaPedido,
    setBuscaPedido,
  ] = useState("");

  const [
    statusPedido,
    setStatusPedido,
  ] = useState("TODOS");

  const [
    dataInicialPedido,
    setDataInicialPedido,
  ] = useState("");

  const [
    dataFinalPedido,
    setDataFinalPedido,
  ] = useState("");

  /* FILTROS DO ESTOQUE BAIXO */

  const [
    buscaBaixoEstoque,
    setBuscaBaixoEstoque,
  ] = useState("");

  const [
    situacaoBaixoEstoque,
    setSituacaoBaixoEstoque,
  ] = useState("TODOS");

  const pedidosPendentes =
    totalPedidos - pedidosEntregues;

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

  function formatarMoeda(
    valor: number
  ) {
    return Number(valor).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }

  function formatarData(
    data: string
  ) {
    return new Date(
      data
    ).toLocaleDateString("pt-BR");
  }

  function obterDataLocal(
    data: string
  ) {
    const valor = new Date(data);

    return new Date(
      valor.getFullYear(),
      valor.getMonth(),
      valor.getDate()
    );
  }

  function montarEndereco(
    pedido: Pedido
  ) {
    const linha1 = [
      pedido.rua,
      pedido.numero,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      linha1,
    };
  }

  /* MARCAS DINÂMICAS */

  const marcasProdutos =
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

  /* STATUS DINÂMICOS */

  const statusPedidos =
    useMemo(() => {
      return Array.from(
        new Set(
          pedidos
            .map((pedido) =>
              String(
                pedido.status ?? ""
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
    }, [pedidos]);

  /* PRODUTOS FILTRADOS */

  const produtosFiltrados =
    useMemo(() => {
      return produtos.filter(
        (produto) => {
          const texto =
            normalizar(
              buscaProduto
            );

          const correspondeBusca =
            !texto ||
            normalizar(
              produto.nome
            ).includes(texto) ||
            normalizar(
              produto.codigo
            ).includes(texto) ||
            normalizar(
              produto.marca
            ).includes(texto);

          const correspondeMarca =
            marcaProduto ===
              "TODAS" ||
            normalizar(
              produto.marca
            ) ===
              normalizar(
                marcaProduto
              );

          let correspondeSituacao =
            true;

          if (
            situacaoProduto ===
            "NORMAL"
          ) {
            correspondeSituacao =
              produto.estoque > 5;
          }

          if (
            situacaoProduto ===
            "REPOR"
          ) {
            correspondeSituacao =
              produto.estoque > 0 &&
              produto.estoque <= 5;
          }

          if (
            situacaoProduto ===
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
      buscaProduto,
      marcaProduto,
      situacaoProduto,
    ]);

  /* PEDIDOS FILTRADOS */

  const pedidosFiltrados =
    useMemo(() => {
      return pedidos.filter(
        (pedido) => {
          const texto =
            normalizar(
              buscaPedido
            );

          const correspondeBusca =
            !texto ||
            normalizar(
              pedido.cliente
            ).includes(texto) ||
            normalizar(
              pedido.telefone ?? ""
            ).includes(texto) ||
            String(
              pedido.id
            ).includes(texto);

          const correspondeStatus =
            statusPedido ===
              "TODOS" ||
            normalizar(
              pedido.status
            ) ===
              normalizar(
                statusPedido
              );

          const dataPedido =
            obterDataLocal(
              pedido.created_at
            );

          let correspondeInicial =
            true;

          let correspondeFinal =
            true;

          if (dataInicialPedido) {
            const [
              ano,
              mes,
              dia,
            ] =
              dataInicialPedido
                .split("-")
                .map(Number);

            const inicio =
              new Date(
                ano,
                mes - 1,
                dia
              );

            correspondeInicial =
              dataPedido >= inicio;
          }

          if (dataFinalPedido) {
            const [
              ano,
              mes,
              dia,
            ] =
              dataFinalPedido
                .split("-")
                .map(Number);

            const fim =
              new Date(
                ano,
                mes - 1,
                dia
              );

            correspondeFinal =
              dataPedido <= fim;
          }

          return (
            correspondeBusca &&
            correspondeStatus &&
            correspondeInicial &&
            correspondeFinal
          );
        }
      );
    }, [
      pedidos,
      buscaPedido,
      statusPedido,
      dataInicialPedido,
      dataFinalPedido,
    ]);

  /* ESTOQUE BAIXO FILTRADO */

  const baixoEstoqueFiltrado =
    useMemo(() => {
      return produtosBaixoEstoque.filter(
        (produto) => {
          const texto =
            normalizar(
              buscaBaixoEstoque
            );

          const correspondeBusca =
            !texto ||
            normalizar(
              produto.nome
            ).includes(texto) ||
            normalizar(
              produto.marca
            ).includes(texto);

          let correspondeSituacao =
            true;

          if (
            situacaoBaixoEstoque ===
            "REPOR"
          ) {
            correspondeSituacao =
              produto.estoque > 0 &&
              produto.estoque <= 5;
          }

          if (
            situacaoBaixoEstoque ===
            "SEM"
          ) {
            correspondeSituacao =
              produto.estoque === 0;
          }

          return (
            correspondeBusca &&
            correspondeSituacao
          );
        }
      );
    }, [
      produtosBaixoEstoque,
      buscaBaixoEstoque,
      situacaoBaixoEstoque,
    ]);

  const filtrosProdutosAtivos =
    Boolean(
      buscaProduto.trim() ||
        marcaProduto !==
          "TODAS" ||
        situacaoProduto !==
          "TODOS"
    );

  const filtrosPedidosAtivos =
    Boolean(
      buscaPedido.trim() ||
        statusPedido !==
          "TODOS" ||
        dataInicialPedido ||
        dataFinalPedido
    );

  const filtrosBaixoAtivos =
    Boolean(
      buscaBaixoEstoque.trim() ||
        situacaoBaixoEstoque !==
          "TODOS"
    );

  function limparFiltrosProdutos() {
    setBuscaProduto("");
    setMarcaProduto("TODAS");
    setSituacaoProduto(
      "TODOS"
    );
  }

  function limparFiltrosPedidos() {
    setBuscaPedido("");
    setStatusPedido("TODOS");
    setDataInicialPedido("");
    setDataFinalPedido("");
  }

  function limparFiltrosBaixo() {
    setBuscaBaixoEstoque("");
    setSituacaoBaixoEstoque(
      "TODOS"
    );
  }

  return (
    <section className="mt-12">
      {/* TÍTULO */}

      <div className="flex flex-col gap-3 border-b border-[#C8A95B]/30 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <FileSpreadsheet
              size={26}
              className="text-[#C8A95B]"
            />

            <h2 className="text-2xl font-black text-[#C8A95B]">
              RELATÓRIO OPERACIONAL
            </h2>
          </div>

          <p className="mt-2 text-sm text-[#F3E8D7]/45">
            Visão consolidada da operação
            da MTelles
          </p>
        </div>

        <div className="text-xs uppercase tracking-[0.18em] text-[#F3E8D7]/35">
          Controle administrativo
        </div>
      </div>

      {/* RESUMO */}

      <div className="mt-6 overflow-x-auto rounded-xl border border-[#343434]">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="bg-[#202020]">
              <th className="border-r border-[#343434] px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.15em] text-[#C8A95B]">
                Indicador
              </th>

              <th className="border-r border-[#343434] px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.15em] text-[#C8A95B]">
                Total de pedidos
              </th>

              <th className="border-r border-[#343434] px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.15em] text-[#C8A95B]">
                Entregues
              </th>

              <th className="border-r border-[#343434] px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.15em] text-[#C8A95B]">
                Pendentes
              </th>

              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.15em] text-[#C8A95B]">
                Conclusão
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="bg-[#141414]">
              <td className="border-r border-t border-[#343434] px-4 py-4 font-semibold text-white">
                Situação atual
              </td>

              <td className="border-r border-t border-[#343434] px-4 py-4 text-center text-lg font-black text-white">
                {loading
                  ? "--"
                  : totalPedidos}
              </td>

              <td className="border-r border-t border-[#343434] px-4 py-4 text-center text-lg font-black text-green-400">
                {loading
                  ? "--"
                  : pedidosEntregues}
              </td>

              <td className="border-r border-t border-[#343434] px-4 py-4 text-center text-lg font-black text-orange-400">
                {loading
                  ? "--"
                  : pedidosPendentes}
              </td>

              <td className="border-t border-[#343434] px-4 py-4 text-center text-lg font-black text-blue-400">
                {loading
                  ? "--"
                  : `${percentualEntregues.toFixed(
                      1
                    )}%`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-4">
        {/* PRODUTOS */}

        <div className="overflow-hidden rounded-xl border border-[#343434]">
          <button
            type="button"
            onClick={() =>
              setMostrarProdutos(
                !mostrarProdutos
              )
            }
            className="flex w-full items-center justify-between bg-[#181818] px-5 py-4 text-left transition-colors hover:bg-[#202020]"
          >
            <div className="flex items-center gap-3">
              {mostrarProdutos ? (
                <ChevronDown
                  size={18}
                  className="text-[#C8A95B]"
                />
              ) : (
                <ChevronRight
                  size={18}
                  className="text-[#C8A95B]"
                />
              )}

              <div>
                <p className="font-bold text-white">
                  PRODUTOS CADASTRADOS
                </p>

                <p className="mt-0.5 text-xs text-[#F3E8D7]/40">
                  Relação de produtos do
                  catálogo
                </p>
              </div>
            </div>

            <div className="min-w-12 rounded-md border border-[#C8A95B]/30 bg-[#111111] px-3 py-1.5 text-center font-bold text-[#C8A95B]">
              {loading
                ? "--"
                : produtos.length}
            </div>
          </button>

          {mostrarProdutos && (
            <div className="border-t border-[#343434] bg-[#0f0f0f] p-4">
              {/* FILTROS PRODUTOS */}

              <div className="rounded-xl border border-[#343434] bg-[#151515] p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#C8A95B]">
                    Filtros de produtos
                  </p>

                  {filtrosProdutosAtivos && (
                    <button
                      type="button"
                      onClick={
                        limparFiltrosProdutos
                      }
                      className="flex items-center gap-2 rounded-lg border border-[#C8A95B]/30 px-3 py-2 text-xs font-semibold text-[#C8A95B]"
                    >
                      <X size={14} />
                      Limpar filtros
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs text-[#F3E8D7]/60">
                      Produto ou código
                    </label>

                    <div className="flex items-center rounded-lg border border-[#343434] bg-[#0f0f0f] px-3">
                      <Search
                        size={16}
                        className="text-[#C8A95B]"
                      />

                      <input
                        value={buscaProduto}
                        onChange={(e) =>
                          setBuscaProduto(
                            e.target.value
                          )
                        }
                        placeholder="Pesquisar..."
                        className="w-full bg-transparent px-2 py-2.5 text-sm text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-[#F3E8D7]/60">
                      Marca
                    </label>

                    <select
                      value={marcaProduto}
                      onChange={(e) =>
                        setMarcaProduto(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-[#343434] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white outline-none"
                    >
                      <option value="TODAS">
                        Todas
                      </option>

                      {marcasProdutos.map(
                        (marca) => (
                          <option
                            key={marca}
                            value={marca}
                          >
                            {marca}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-[#F3E8D7]/60">
                      Situação
                    </label>

                    <select
                      value={
                        situacaoProduto
                      }
                      onChange={(e) =>
                        setSituacaoProduto(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-[#343434] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white outline-none"
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

              <p className="mt-4 text-sm text-[#F3E8D7]/60">
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

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#222222]">
                      <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                        #
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Código
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Produto
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Marca
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Cor
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                        Estoque
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {produtosFiltrados.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="border border-[#343434] p-6 text-center text-[#F3E8D7]/50"
                        >
                          Nenhum produto
                          encontrado.
                        </td>
                      </tr>
                    ) : (
                      produtosFiltrados.map(
                        (
                          produto,
                          index
                        ) => (
                          <tr
                            key={produto.id}
                            className={
                              index % 2 === 0
                                ? "bg-[#121212]"
                                : "bg-[#171717]"
                            }
                          >
                            <td className="border border-[#343434] px-4 py-3 text-center text-[#F3E8D7]/40">
                              {index + 1}
                            </td>

                            <td className="border border-[#343434] px-4 py-3 font-mono">
                              {produto.codigo}
                            </td>

                            <td className="border border-[#343434] px-4 py-3 font-semibold text-white">
                              {produto.nome}
                            </td>

                            <td className="border border-[#343434] px-4 py-3">
                              {produto.marca}
                            </td>

                            <td className="border border-[#343434] px-4 py-3">
                              {produto.cores}
                            </td>

                            <td
                              className={`border border-[#343434] px-4 py-3 text-center font-bold ${
                                produto.estoque === 0
                                  ? "text-red-400"
                                  : produto.estoque <= 5
                                    ? "text-orange-400"
                                    : "text-green-400"
                              }`}
                            >
                              {produto.estoque}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
                {/* PEDIDOS CADASTRADOS */}

        <div className="overflow-hidden rounded-xl border border-[#343434]">
          <button
            type="button"
            onClick={() =>
              setMostrarPedidos(
                !mostrarPedidos
              )
            }
            className="flex w-full items-center justify-between bg-[#181818] px-5 py-4 text-left transition-colors hover:bg-[#202020]"
          >
            <div className="flex items-center gap-3">
              {mostrarPedidos ? (
                <ChevronDown
                  size={18}
                  className="text-[#C8A95B]"
                />
              ) : (
                <ChevronRight
                  size={18}
                  className="text-[#C8A95B]"
                />
              )}

              <div>
                <p className="font-bold text-white">
                  PEDIDOS CADASTRADOS
                </p>

                <p className="mt-0.5 text-xs text-[#F3E8D7]/40">
                  Relação geral dos pedidos
                  recebidos
                </p>
              </div>
            </div>

            <div className="min-w-12 rounded-md border border-[#C8A95B]/30 bg-[#111111] px-3 py-1.5 text-center font-bold text-[#C8A95B]">
              {loading
                ? "--"
                : pedidos.length}
            </div>
          </button>

          {mostrarPedidos && (
            <div className="border-t border-[#343434] bg-[#0f0f0f] p-4">
              {/* FILTROS PEDIDOS */}

              <div className="rounded-xl border border-[#343434] bg-[#151515] p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#C8A95B]">
                    Filtros de pedidos
                  </p>

                  {filtrosPedidosAtivos && (
                    <button
                      type="button"
                      onClick={
                        limparFiltrosPedidos
                      }
                      className="flex items-center gap-2 rounded-lg border border-[#C8A95B]/30 px-3 py-2 text-xs font-semibold text-[#C8A95B]"
                    >
                      <X size={14} />
                      Limpar filtros
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-xs text-[#F3E8D7]/60">
                      Cliente / Pedido /
                      WhatsApp
                    </label>

                    <div className="flex items-center rounded-lg border border-[#343434] bg-[#0f0f0f] px-3">
                      <Search
                        size={16}
                        className="text-[#C8A95B]"
                      />

                      <input
                        value={buscaPedido}
                        onChange={(e) =>
                          setBuscaPedido(
                            e.target.value
                          )
                        }
                        placeholder="Pesquisar..."
                        className="w-full bg-transparent px-2 py-2.5 text-sm text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-[#F3E8D7]/60">
                      Status
                    </label>

                    <select
                      value={statusPedido}
                      onChange={(e) =>
                        setStatusPedido(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-[#343434] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white outline-none"
                    >
                      <option value="TODOS">
                        Todos
                      </option>

                      {statusPedidos.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-[#F3E8D7]/60">
                      Data inicial
                    </label>

                    <input
                      type="date"
                      value={
                        dataInicialPedido
                      }
                      onChange={(e) =>
                        setDataInicialPedido(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-[#343434] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-[#F3E8D7]/60">
                      Data final
                    </label>

                    <input
                      type="date"
                      value={
                        dataFinalPedido
                      }
                      onChange={(e) =>
                        setDataFinalPedido(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-[#343434] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-[#F3E8D7]/60">
                Exibindo{" "}
                <strong className="text-white">
                  {
                    pedidosFiltrados.length
                  }
                </strong>{" "}
                de{" "}
                <strong className="text-white">
                  {pedidos.length}
                </strong>{" "}
                pedidos
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[1350px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#222222]">
                      <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                        Pedido
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Data
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Cliente
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        WhatsApp
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Endereço
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Bairro
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Cidade / UF
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        CEP
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                        Status
                      </th>
                      <th className="border border-[#343434] px-4 py-3 text-right text-[#C8A95B]">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {pedidosFiltrados.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={10}
                          className="border border-[#343434] p-6 text-center text-[#F3E8D7]/50"
                        >
                          Nenhum pedido
                          encontrado.
                        </td>
                      </tr>
                    ) : (
                      pedidosFiltrados.map(
                        (
                          pedido,
                          index
                        ) => {
                          const endereco =
                            montarEndereco(
                              pedido
                            );

                          return (
                            <tr
                              key={pedido.id}
                              className={
                                index % 2 === 0
                                  ? "bg-[#121212]"
                                  : "bg-[#171717]"
                              }
                            >
                              <td className="border border-[#343434] px-4 py-3 text-center font-bold text-[#C8A95B]">
                                #{pedido.id}
                              </td>

                              <td className="whitespace-nowrap border border-[#343434] px-4 py-3">
                                {formatarData(
                                  pedido.created_at
                                )}
                              </td>

                              <td className="border border-[#343434] px-4 py-3 font-semibold text-white">
                                {
                                  pedido.cliente
                                }
                              </td>

                              <td className="whitespace-nowrap border border-[#343434] px-4 py-3">
                                {pedido.telefone ||
                                  "—"}
                              </td>

                              <td className="min-w-[230px] border border-[#343434] px-4 py-3">
                                {endereco.linha1 ? (
                                  <div>
                                    <p className="text-white">
                                      {
                                        endereco.linha1
                                      }
                                    </p>

                                    {pedido.complemento && (
                                      <p className="mt-1 text-xs text-[#F3E8D7]/50">
                                        {
                                          pedido.complemento
                                        }
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[#F3E8D7]/35">
                                    Não informado
                                  </span>
                                )}
                              </td>

                              <td className="border border-[#343434] px-4 py-3">
                                {pedido.bairro ||
                                  "—"}
                              </td>

                              <td className="whitespace-nowrap border border-[#343434] px-4 py-3">
                                {pedido.cidade ||
                                pedido.estado
                                  ? `${
                                      pedido.cidade ||
                                      ""
                                    }${
                                      pedido.cidade &&
                                      pedido.estado
                                        ? " - "
                                        : ""
                                    }${
                                      pedido.estado ||
                                      ""
                                    }`
                                  : "—"}
                              </td>

                              <td className="whitespace-nowrap border border-[#343434] px-4 py-3 font-mono">
                                {pedido.cep ||
                                  "—"}
                              </td>

                              <td className="border border-[#343434] px-4 py-3 text-center">
                                <span
                                  className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold ${
                                    pedido.status ===
                                    "ENTREGUE"
                                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                                      : pedido.status ===
                                          "CANCELADO"
                                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                                        : "border-orange-500/30 bg-orange-500/10 text-orange-400"
                                  }`}
                                >
                                  {
                                    pedido.status
                                  }
                                </span>
                              </td>

                              <td className="whitespace-nowrap border border-[#343434] px-4 py-3 text-right font-bold text-[#C8A95B]">
                                {formatarMoeda(
                                  pedido.total
                                )}
                              </td>
                            </tr>
                          );
                        }
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ESTOQUE BAIXO */}

        <div className="overflow-hidden rounded-xl border border-[#343434]">
          <button
            type="button"
            onClick={() =>
              setMostrarBaixoEstoque(
                !mostrarBaixoEstoque
              )
            }
            className="flex w-full items-center justify-between bg-[#181818] px-5 py-4 text-left transition-colors hover:bg-[#202020]"
          >
            <div className="flex items-center gap-3">
              {mostrarBaixoEstoque ? (
                <ChevronDown
                  size={18}
                  className="text-[#C8A95B]"
                />
              ) : (
                <ChevronRight
                  size={18}
                  className="text-[#C8A95B]"
                />
              )}

              <div>
                <p className="font-bold text-white">
                  PRODUTOS COM ESTOQUE
                  BAIXO
                </p>

                <p className="mt-0.5 text-xs text-[#F3E8D7]/40">
                  Produtos que exigem
                  atenção para reposição
                </p>
              </div>
            </div>

            <div className="min-w-12 rounded-md border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-center font-bold text-orange-400">
              {loading
                ? "--"
                : produtosBaixoEstoque.length}
            </div>
          </button>

          {mostrarBaixoEstoque && (
            <div className="border-t border-[#343434] bg-[#0f0f0f] p-4">
              {/* FILTROS ESTOQUE BAIXO */}

              <div className="rounded-xl border border-[#343434] bg-[#151515] p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#C8A95B]">
                    Filtros de reposição
                  </p>

                  {filtrosBaixoAtivos && (
                    <button
                      type="button"
                      onClick={
                        limparFiltrosBaixo
                      }
                      className="flex items-center gap-2 rounded-lg border border-[#C8A95B]/30 px-3 py-2 text-xs font-semibold text-[#C8A95B]"
                    >
                      <X size={14} />
                      Limpar filtros
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs text-[#F3E8D7]/60">
                      Produto ou marca
                    </label>

                    <div className="flex items-center rounded-lg border border-[#343434] bg-[#0f0f0f] px-3">
                      <Search
                        size={16}
                        className="text-[#C8A95B]"
                      />

                      <input
                        value={
                          buscaBaixoEstoque
                        }
                        onChange={(e) =>
                          setBuscaBaixoEstoque(
                            e.target.value
                          )
                        }
                        placeholder="Pesquisar..."
                        className="w-full bg-transparent px-2 py-2.5 text-sm text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-[#F3E8D7]/60">
                      Situação
                    </label>

                    <select
                      value={
                        situacaoBaixoEstoque
                      }
                      onChange={(e) =>
                        setSituacaoBaixoEstoque(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-[#343434] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white outline-none"
                    >
                      <option value="TODOS">
                        Todos
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

              <p className="mt-4 text-sm text-[#F3E8D7]/60">
                Exibindo{" "}
                <strong className="text-white">
                  {
                    baixoEstoqueFiltrado.length
                  }
                </strong>{" "}
                de{" "}
                <strong className="text-white">
                  {
                    produtosBaixoEstoque.length
                  }
                </strong>{" "}
                produtos
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[650px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#222222]">
                      <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                        #
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Marca
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Produto
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                        Estoque atual
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                        Situação
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {baixoEstoqueFiltrado.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="border border-[#343434] p-6 text-center text-green-400"
                        >
                          Nenhum produto
                          encontrado.
                        </td>
                      </tr>
                    ) : (
                      baixoEstoqueFiltrado.map(
                        (
                          produto,
                          index
                        ) => {
                          const semEstoque =
                            produto.estoque ===
                            0;

                          return (
                            <tr
                              key={`${produto.marca}-${produto.nome}`}
                              className={
                                index % 2 === 0
                                  ? "bg-[#121212]"
                                  : "bg-[#171717]"
                              }
                            >
                              <td className="border border-[#343434] px-4 py-3 text-center text-[#F3E8D7]/40">
                                {index + 1}
                              </td>

                              <td className="border border-[#343434] px-4 py-3">
                                {produto.marca}
                              </td>

                              <td className="border border-[#343434] px-4 py-3 font-semibold text-white">
                                {produto.nome}
                              </td>

                              <td
                                className={`border border-[#343434] px-4 py-3 text-center text-lg font-black ${
                                  semEstoque
                                    ? "text-red-400"
                                    : "text-orange-400"
                                }`}
                              >
                                {
                                  produto.estoque
                                }
                              </td>

                              <td
                                className={`border border-[#343434] px-4 py-3 text-center font-bold ${
                                  semEstoque
                                    ? "text-red-400"
                                    : "text-orange-400"
                                }`}
                              >
                                {semEstoque
                                  ? "Sem estoque"
                                  : "Repor"}
                              </td>
                            </tr>
                          );
                        }
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RODAPÉ */}

      <div className="mt-6 border-t border-[#343434] pt-3 text-right text-xs text-[#F3E8D7]/30">
        MTelles • Relatório Operacional
      </div>
    </section>
  );
}