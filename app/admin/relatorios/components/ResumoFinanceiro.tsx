import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";

interface PedidoFinanceiro {
  id: number;
  cliente: string;
  status: string;
  total: number;
  created_at: string;
}

interface ResumoFinanceiroProps {
  loading: boolean;
  faturamento: number;
  valorMedioPedido: number;
  pedidos: PedidoFinanceiro[];
}

export default function ResumoFinanceiro({
  loading,
  faturamento,
  valorMedioPedido,
  pedidos,
}: ResumoFinanceiroProps) {
  const [
    mostrarFaturamento,
    setMostrarFaturamento,
  ] = useState(false);

  const [
    mostrarValorMedio,
    setMostrarValorMedio,
  ] = useState(false);

  const [
    mostrarTicketMedio,
    setMostrarTicketMedio,
  ] = useState(false);

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

  const pedidosComValor =
    pedidos.filter(
      (pedido) =>
        Number(pedido.total) > 0
    );

  return (
    <section className="mt-14">
      {/* CABEÇALHO */}

      <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
        RESUMO FINANCEIRO
      </h2>

      {/* PLANILHA */}

      <div className="mt-8 overflow-hidden rounded-xl border border-[#343434]">
        {/* CABEÇALHO DA PLANILHA */}

        <div className="grid grid-cols-[1fr_180px_150px] bg-[#222222] text-xs font-bold uppercase tracking-[0.12em] text-[#C8A95B]">
          <div className="border-r border-[#343434] px-4 py-3">
            Indicador
          </div>

          <div className="border-r border-[#343434] px-4 py-3 text-right">
            Valor
          </div>

          <div className="px-4 py-3 text-center">
            Situação
          </div>
        </div>

        {/* FATURAMENTO BRUTO */}

        <div className="border-t border-[#343434]">
          <button
            type="button"
            onClick={() =>
              setMostrarFaturamento(
                !mostrarFaturamento
              )
            }
            className="grid w-full grid-cols-[1fr_180px_150px] bg-[#141414] text-left transition-colors hover:bg-[#1b1b1b]"
          >
            <div className="flex items-center gap-2 border-r border-[#343434] px-4 py-4">
              {mostrarFaturamento ? (
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
                Faturamento bruto
              </span>
            </div>

            <div className="border-r border-[#343434] px-4 py-4 text-right font-bold text-[#C8A95B]">
              {loading
                ? "--"
                : formatarMoeda(
                    faturamento
                  )}
            </div>

            <div className="px-4 py-4 text-center text-sm font-semibold text-green-400">
              Consolidado
            </div>
          </button>

          {mostrarFaturamento && (
            <div className="overflow-x-auto border-t border-[#343434] bg-[#0f0f0f] p-4">
              <div className="mb-3">
                <p className="font-bold text-white">
                  Composição do
                  faturamento
                </p>

                <p className="mt-1 text-xs text-[#F3E8D7]/45">
                  Relação dos pedidos
                  utilizados no valor
                  consolidado.
                </p>
              </div>

              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#222222]">
                    <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                      Pedido
                    </th>

                    <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                      Cliente
                    </th>

                    <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                      Data
                    </th>

                    <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                      Status
                    </th>

                    <th className="border border-[#343434] px-4 py-3 text-right text-[#C8A95B]">
                      Valor
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pedidosComValor.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="border border-[#343434] p-6 text-center text-[#F3E8D7]/50"
                      >
                        Nenhum pedido
                        disponível.
                      </td>
                    </tr>
                  ) : (
                    pedidosComValor.map(
                      (
                        pedido,
                        index
                      ) => (
                        <tr
                          key={
                            pedido.id
                          }
                          className={
                            index % 2 ===
                            0
                              ? "bg-[#121212]"
                              : "bg-[#171717]"
                          }
                        >
                          <td className="border border-[#343434] px-4 py-3 text-center font-bold text-[#C8A95B]">
                            #
                            {
                              pedido.id
                            }
                          </td>

                          <td className="border border-[#343434] px-4 py-3 font-semibold text-white">
                            {
                              pedido.cliente
                            }
                          </td>

                          <td className="whitespace-nowrap border border-[#343434] px-4 py-3">
                            {formatarData(
                              pedido.created_at
                            )}
                          </td>

                          <td className="border border-[#343434] px-4 py-3 text-center">
                            <span
                              className={`font-semibold ${
                                pedido.status ===
                                "ENTREGUE"
                                  ? "text-green-400"
                                  : pedido.status ===
                                      "CANCELADO"
                                    ? "text-red-400"
                                    : "text-orange-400"
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
                      )
                    )
                  )}
                </tbody>

                <tfoot>
                  <tr className="bg-[#202020]">
                    <td
                      colSpan={4}
                      className="border border-[#343434] px-4 py-3 text-right font-bold text-white"
                    >
                      FATURAMENTO BRUTO
                    </td>

                    <td className="border border-[#343434] px-4 py-3 text-right text-base font-black text-[#C8A95B]">
                      {formatarMoeda(
                        faturamento
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* VALOR MÉDIO POR PEDIDO */}

        <div className="border-t border-[#343434]">
          <button
            type="button"
            onClick={() =>
              setMostrarValorMedio(
                !mostrarValorMedio
              )
            }
            className="grid w-full grid-cols-[1fr_180px_150px] bg-[#171717] text-left transition-colors hover:bg-[#1f1f1f]"
          >
            <div className="flex items-center gap-2 border-r border-[#343434] px-4 py-4">
              {mostrarValorMedio ? (
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
                Valor médio por pedido
              </span>
            </div>

            <div className="border-r border-[#343434] px-4 py-4 text-right font-bold text-green-400">
              {loading
                ? "--"
                : formatarMoeda(
                    valorMedioPedido
                  )}
            </div>

            <div className="px-4 py-4 text-center text-sm font-semibold text-green-400">
              Média
            </div>
          </button>

          {mostrarValorMedio && (
            <div className="overflow-x-auto border-t border-[#343434] bg-[#0f0f0f] p-4">
              <p className="font-bold text-white">
                Composição da média
              </p>

              <p className="mt-1 text-xs text-[#F3E8D7]/45">
                Valores individuais dos
                pedidos considerados no
                cálculo.
              </p>

              <table className="mt-4 w-full min-w-[650px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#222222]">
                    <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                      Pedido
                    </th>

                    <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                      Cliente
                    </th>

                    <th className="border border-[#343434] px-4 py-3 text-center text-[#C8A95B]">
                      Status
                    </th>

                    <th className="border border-[#343434] px-4 py-3 text-right text-[#C8A95B]">
                      Valor
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pedidosComValor.map(
                    (
                      pedido,
                      index
                    ) => (
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

                        <td className="border border-[#343434] px-4 py-3 font-semibold">
                          {
                            pedido.cliente
                          }
                        </td>

                        <td className="border border-[#343434] px-4 py-3 text-center">
                          {
                            pedido.status
                          }
                        </td>

                        <td className="border border-[#343434] px-4 py-3 text-right font-bold">
                          {formatarMoeda(
                            pedido.total
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

                <tfoot>
                  <tr className="bg-[#202020]">
                    <td
                      colSpan={2}
                      className="border border-[#343434] px-4 py-3 font-semibold"
                    >
                      Pedidos considerados:{" "}
                      {
                        pedidosComValor.length
                      }
                    </td>

                    <td className="border border-[#343434] px-4 py-3 text-right font-bold">
                      MÉDIA
                    </td>

                    <td className="border border-[#343434] px-4 py-3 text-right text-base font-black text-green-400">
                      {formatarMoeda(
                        valorMedioPedido
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* TICKET MÉDIO */}

        <div className="border-t border-[#343434]">
          <button
            type="button"
            onClick={() =>
              setMostrarTicketMedio(
                !mostrarTicketMedio
              )
            }
            className="grid w-full grid-cols-[1fr_180px_150px] bg-[#141414] text-left transition-colors hover:bg-[#1b1b1b]"
          >
            <div className="flex items-center gap-2 border-r border-[#343434] px-4 py-4">
              {mostrarTicketMedio ? (
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
                Ticket médio
              </span>
            </div>

            <div className="border-r border-[#343434] px-4 py-4 text-right font-bold text-blue-400">
              {loading
                ? "--"
                : formatarMoeda(
                    valorMedioPedido
                  )}
            </div>

            <div className="px-4 py-4 text-center text-sm font-semibold text-blue-400">
              Média
            </div>
          </button>

          {mostrarTicketMedio && (
            <div className="border-t border-[#343434] bg-[#0f0f0f] p-4">
              <p className="font-bold text-white">
                Cálculo do ticket médio
              </p>

              <p className="mt-1 text-xs text-[#F3E8D7]/45">
                Indicador calculado a
                partir do valor total e
                da quantidade de pedidos
                considerados.
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#222222]">
                      <th className="border border-[#343434] px-4 py-3 text-left text-[#C8A95B]">
                        Indicador
                      </th>

                      <th className="border border-[#343434] px-4 py-3 text-right text-[#C8A95B]">
                        Valor
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="bg-[#121212]">
                      <td className="border border-[#343434] px-4 py-3">
                        Faturamento bruto
                      </td>

                      <td className="border border-[#343434] px-4 py-3 text-right font-bold">
                        {formatarMoeda(
                          faturamento
                        )}
                      </td>
                    </tr>

                    <tr className="bg-[#171717]">
                      <td className="border border-[#343434] px-4 py-3">
                        Quantidade de
                        pedidos
                      </td>

                      <td className="border border-[#343434] px-4 py-3 text-right font-bold">
                        {
                          pedidosComValor.length
                        }
                      </td>
                    </tr>

                    <tr className="bg-[#202020]">
                      <td className="border border-[#343434] px-4 py-3 font-bold text-white">
                        Ticket médio
                      </td>

                      <td className="border border-[#343434] px-4 py-3 text-right text-base font-black text-blue-400">
                        {formatarMoeda(
                          valorMedioPedido
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-xs text-[#F3E8D7]/40">
                Faturamento bruto ÷
                quantidade de pedidos =
                ticket médio.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}