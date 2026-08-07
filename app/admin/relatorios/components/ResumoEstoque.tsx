import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";

interface ProdutoEstoque {
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

interface ResumoEstoqueProps {
  loading: boolean;
  estoqueTotal: number;
  produtos: ProdutoEstoque[];
  produtosBaixoEstoque: ProdutoBaixoEstoque[];
}

export default function ResumoEstoque({
  loading,
  estoqueTotal,
  produtos,
  produtosBaixoEstoque,
}: ResumoEstoqueProps) {
  const [
    mostrarItensDisponiveis,
    setMostrarItensDisponiveis,
  ] = useState(false);

  const [
    mostrarBaixoEstoque,
    setMostrarBaixoEstoque,
  ] = useState(false);

  return (
    <section className="mt-14">
      {/* CABEÇALHO */}

      <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
        RESUMO DE ESTOQUE
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

        {/* ITENS DISPONÍVEIS */}

        <div className="border-t border-[#343434]">
          <button
            type="button"
            onClick={() =>
              setMostrarItensDisponiveis(
                !mostrarItensDisponiveis
              )
            }
            className="grid w-full grid-cols-[1fr_180px_150px] bg-[#141414] text-left transition-colors hover:bg-[#1b1b1b]"
          >
            <div className="flex items-center gap-2 border-r border-[#343434] px-4 py-4">
              {mostrarItensDisponiveis ? (
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
                Itens disponíveis
              </span>
            </div>

            <div className="border-r border-[#343434] px-4 py-4 text-right font-bold text-blue-400">
              {loading
                ? "--"
                : estoqueTotal}
            </div>

            <div className="px-4 py-4 text-center text-sm font-semibold text-green-400">
              Disponível
            </div>
          </button>

          {/* RELAÇÃO COMPLETA DO ESTOQUE */}

          {mostrarItensDisponiveis && (
            <div className="border-t border-[#343434] bg-[#0f0f0f] p-4">
              <div className="mb-4">
                <p className="font-bold text-white">
                  Composição do estoque
                </p>

                <p className="mt-1 text-xs text-[#F3E8D7]/45">
                  Relação dos produtos que
                  compõem o estoque atual.
                </p>
              </div>

              <div className="overflow-x-auto">
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

                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Cor
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-right text-[#C8A95B]">
                        Estoque
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                        Situação
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {produtos.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="border border-[#343434] p-6 text-center text-[#F3E8D7]/50"
                        >
                          Nenhum produto
                          cadastrado.
                        </td>
                      </tr>
                    ) : (
                      produtos.map(
                        (
                          produto,
                          index
                        ) => {
                          const estoque =
                            Number(
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

                              <td className="border border-[#343434] px-4 py-3">
                                {produto.cores ||
                                  "--"}
                              </td>

                              <td
                                className={`border border-[#343434] px-4 py-3 text-right font-black ${
                                  estoque === 0
                                    ? "text-red-400"
                                    : estoque <=
                                        5
                                      ? "text-orange-400"
                                      : "text-blue-400"
                                }`}
                              >
                                {
                                  estoque
                                }
                              </td>

                              <td className="border border-[#343434] px-4 py-3 text-center">
                                <span
                                  className={`font-semibold ${
                                    estoque ===
                                    0
                                      ? "text-red-400"
                                      : estoque <=
                                          5
                                        ? "text-orange-400"
                                        : "text-green-400"
                                  }`}
                                >
                                  {estoque ===
                                  0
                                    ? "Sem estoque"
                                    : estoque <=
                                        5
                                      ? "Atenção"
                                      : "Disponível"}
                                </span>
                              </td>
                            </tr>
                          );
                        }
                      )
                    )}
                  </tbody>

                  <tfoot>
                    <tr className="bg-[#202020]">
                      <td
                        colSpan={4}
                        className="border border-[#343434] px-4 py-3 text-right font-bold text-white"
                      >
                        TOTAL DE UNIDADES
                      </td>

                      <td className="border border-[#343434] px-4 py-3 text-right text-base font-black text-blue-400">
                        {estoqueTotal}
                      </td>

                      <td className="border border-[#343434] px-4 py-3 text-center font-bold text-green-400">
                        Disponível
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* PRODUTOS COM ESTOQUE BAIXO */}

        <div className="border-t border-[#343434]">
          <button
            type="button"
            onClick={() =>
              setMostrarBaixoEstoque(
                !mostrarBaixoEstoque
              )
            }
            className="grid w-full grid-cols-[1fr_180px_150px] bg-[#171717] text-left transition-colors hover:bg-[#1f1f1f]"
          >
            <div className="flex items-center gap-2 border-r border-[#343434] px-4 py-4">
              {mostrarBaixoEstoque ? (
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
                Produtos com estoque baixo
              </span>
            </div>

            <div className="border-r border-[#343434] px-4 py-4 text-right font-bold text-orange-400">
              {loading
                ? "--"
                : produtosBaixoEstoque.length}
            </div>

            <div className="px-4 py-4 text-center text-sm font-semibold text-orange-400">
              {produtosBaixoEstoque.length >
              0
                ? "Atenção"
                : "Normal"}
            </div>
          </button>

          {/* RELAÇÃO ESTOQUE BAIXO */}

          {mostrarBaixoEstoque && (
            <div className="border-t border-[#343434] bg-[#0f0f0f] p-4">
              <div className="mb-4">
                <p className="font-bold text-white">
                  Produtos que exigem atenção
                </p>

                <p className="mt-1 text-xs text-[#F3E8D7]/45">
                  Relação dos produtos
                  identificados com estoque
                  baixo ou sem estoque.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#222222]">
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Produto
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Marca
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-right text-[#C8A95B]">
                        Estoque
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                        Situação
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {produtosBaixoEstoque.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="border border-[#343434] p-6 text-center font-semibold text-green-400"
                        >
                          Nenhum produto com
                          estoque baixo.
                        </td>
                      </tr>
                    ) : (
                      produtosBaixoEstoque.map(
                        (
                          produto,
                          index
                        ) => (
                          <tr
                            key={`${produto.marca}-${produto.nome}-${index}`}
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
                                produto.marca
                              }
                            </td>

                            <td
                              className={`border border-[#343434] px-4 py-3 text-right text-base font-black ${
                                Number(
                                  produto.estoque
                                ) ===
                                0
                                  ? "text-red-400"
                                  : "text-orange-400"
                              }`}
                            >
                              {
                                produto.estoque
                              }
                            </td>

                            <td
                              className={`border border-[#343434] px-4 py-3 text-center font-semibold ${
                                Number(
                                  produto.estoque
                                ) ===
                                0
                                  ? "text-red-400"
                                  : "text-orange-400"
                              }`}
                            >
                              {Number(
                                produto.estoque
                              ) ===
                              0
                                ? "Sem estoque"
                                : "Reposição"}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>

                  <tfoot>
                    <tr className="bg-[#202020]">
                      <td
                        colSpan={2}
                        className="border border-[#343434] px-4 py-3 text-right font-bold text-white"
                      >
                        PRODUTOS EM ATENÇÃO
                      </td>

                      <td className="border border-[#343434] px-4 py-3 text-right text-base font-black text-orange-400">
                        {
                          produtosBaixoEstoque.length
                        }
                      </td>

                      <td className="border border-[#343434] px-4 py-3 text-center font-bold text-orange-400">
                        {produtosBaixoEstoque.length >
                        0
                          ? "Atenção"
                          : "Normal"}
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