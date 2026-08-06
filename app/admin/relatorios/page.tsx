"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getResumoRelatorio } from "@/services/relatorios";

interface ResumoRelatorio {
  totalPedidos: number;
  pedidosEntregues: number;
  faturamento: number;
  estoqueTotal: number;
  valorMedioPedido: number;
  percentualEntregues: number;

  produtosBaixoEstoque: {
    nome: string;
    estoque: number;
  }[];
}

export default function RelatoriosPage() {
  const [loading, setLoading] =
    useState(true);

  const [resumo, setResumo] =
    useState<ResumoRelatorio>({
      totalPedidos: 0,
      pedidosEntregues: 0,
      faturamento: 0,
      estoqueTotal: 0,
      valorMedioPedido: 0,
      percentualEntregues: 0,
      produtosBaixoEstoque: [],
    });

  useEffect(() => {
    carregarResumo();
  }, []);

  async function carregarResumo() {
    try {
      const dados =
        await getResumoRelatorio();

      setResumo(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white">

      <div className="mx-auto max-w-7xl px-8 py-10">

        <div className="mb-10 flex items-start justify-between">

          <div>

            <h1 className="text-5xl font-black tracking-wide text-[#C8A95B]">
              RELATÓRIO GERAL
            </h1>

            <p className="mt-2 text-lg text-[#F3E8D7]/70">
              Sistema de Gestão MTelles ERP
            </p>

          </div>

          <Link
            href="/admin"
            className="rounded-xl border border-[#C8A95B]/20 bg-[#181818] px-5 py-3 transition hover:border-[#C8A95B]"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Voltar
            </div>
          </Link>

        </div>

        <div className="h-px w-full bg-[#C8A95B]/30" />

        <div className="mt-8 grid gap-4 text-sm lg:grid-cols-3">

          <div>

            <span className="font-semibold text-[#C8A95B]">
              Emitido em
            </span>

            <p className="mt-1 text-[#F3E8D7]/70">
              {new Date().toLocaleString("pt-BR")}
            </p>

          </div>

          <div>

            <span className="font-semibold text-[#C8A95B]">
              Última atualização
            </span>

            <p className="mt-1 text-[#F3E8D7]/70">
              Em tempo real
            </p>

          </div>

          <div>

            <span className="font-semibold text-[#C8A95B]">
              Sistema
            </span>

            <p className="mt-1 text-[#F3E8D7]/70">
              MTelles ERP
            </p>

          </div>

        </div>

        <section className="mt-12">

          <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
            RESUMO OPERACIONAL
          </h2>

          <div className="mt-8 space-y-5">

            <div className="flex justify-between border-b border-[#2A2A2A] pb-3">

              <span>
                Pedidos cadastrados
              </span>

              <strong>
                {loading
                  ? "--"
                  : resumo.totalPedidos}
              </strong>

            </div>

            <div className="flex justify-between border-b border-[#2A2A2A] pb-3">

              <span>
                Pedidos entregues
              </span>

              <strong className="text-green-400">
                {loading
                  ? "--"
                  : resumo.pedidosEntregues}
              </strong>

            </div>

            <div className="flex justify-between border-b border-[#2A2A2A] pb-3">

              <span>
                Pedidos pendentes
              </span>

              <strong className="text-orange-400">
                {loading
                  ? "--"
                  : resumo.totalPedidos -
                    resumo.pedidosEntregues}
              </strong>

            </div>

            <div className="flex justify-between border-b border-[#2A2A2A] pb-3">

              <span>
                Taxa de conclusão
              </span>

              <strong className="text-blue-400">
                {loading
                  ? "--"
                  : `${resumo.percentualEntregues.toFixed(
                      1
                    )}%`}
              </strong>

            </div>

          </div>

        </section>
 <section className="mt-14">

          <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
            RESUMO FINANCEIRO
          </h2>

          <div className="mt-8 space-y-5">

            <div className="flex justify-between border-b border-[#2A2A2A] pb-3">

              <span>Faturamento bruto</span>

              <strong className="text-[#C8A95B]">
                {loading
                  ? "--"
                  : resumo.faturamento.toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
              </strong>

            </div>

            <div className="flex justify-between border-b border-[#2A2A2A] pb-3">

              <span>Valor médio por pedido</span>

              <strong className="text-green-400">
                {loading
                  ? "--"
                  : resumo.valorMedioPedido.toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
              </strong>

            </div>

            <div className="flex justify-between border-b border-[#2A2A2A] pb-3">

              <span>Ticket médio</span>

              <strong className="text-blue-400">
                {loading
                  ? "--"
                  : resumo.valorMedioPedido.toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
              </strong>

            </div>

          </div>

        </section>

        <section className="mt-14">

          <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
            RESUMO DE ESTOQUE
          </h2>

          <div className="mt-8 space-y-5">

            <div className="flex justify-between border-b border-[#2A2A2A] pb-3">

              <span>Itens disponíveis</span>

              <strong className="text-blue-400">
                {loading
                  ? "--"
                  : resumo.estoqueTotal}
              </strong>

            </div>

            <div className="flex justify-between border-b border-[#2A2A2A] pb-3">

              <span>Produtos com estoque baixo</span>

              <strong className="text-orange-400">
                {loading
                  ? "--"
                  : resumo.produtosBaixoEstoque.length}
              </strong>

            </div>

          </div>

        </section>

        <section className="mt-14">

          <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
            ALERTAS
          </h2>

          <div className="mt-8">

            {loading ? (

              <p>Carregando...</p>

            ) : resumo.produtosBaixoEstoque.length === 0 ? (

              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">

                <span className="font-semibold text-green-400">
                  ✓ Nenhum produto com estoque baixo.
                </span>

              </div>

            ) : (

              <div className="space-y-4">

                {resumo.produtosBaixoEstoque.map(
                  (produto) => (

                    <div
                      key={produto.nome}
                      className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 p-5"
                    >

                      <span className="font-semibold">
                        {produto.nome}
                      </span>

                      <span className="font-bold text-red-400">
                        {produto.estoque} unidades
                      </span>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </section>

      </div>

    </main>
  );
}