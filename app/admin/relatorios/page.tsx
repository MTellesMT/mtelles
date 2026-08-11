"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import AcessoRestritoPage from "@/components/admin/AcessoRestritoPage";

import { getResumoRelatorio } from "@/services/relatorios";

import ResumoOperacional from "./components/ResumoOperacional";
import ResumoFinanceiro from "./components/ResumoFinanceiro";
import ResumoEstoque from "./components/ResumoEstoque";
import Alertas from "./components/Alertas";
import Movimentacoes from "./components/Movimentacoes";
import TabelaEstoque from "./components/TabelaEstoque";

interface ProdutoBaixoEstoque {
  marca: string;
  nome: string;
  estoque: number;
}

interface Movimentacao {
  id: number;
  tipo: string;
  produto: string;
  quantidade: number;
  motivo: string;
  created_at: string;
}

interface PedidoRelatorio {
  id: number;

  cliente: string;

  telefone?: string;

  status: string;

  total: number;

  created_at: string;

  excluido?: boolean;

  excluido_em?: string | null;

  rua?: string;

  numero?: string;

  complemento?: string;

  bairro?: string;

  cidade?: string;

  estado?: string;

  cep?: string;
}

interface ProdutoRelatorio {
  id: number;
  nome: string;
  codigo: string;
  marca: string;
  cores: string;
  estoque: number;
}

interface ResumoRelatorio {
  totalPedidos: number;

  pedidosEntregues: number;

  faturamento: number;

  estoqueTotal: number;

  valorMedioPedido: number;

  percentualEntregues: number;

  produtosBaixoEstoque:
    ProdutoBaixoEstoque[];

  movimentacoes:
    Movimentacao[];

  pedidos:
    PedidoRelatorio[];

  produtos:
    ProdutoRelatorio[];
}

export default function RelatoriosPage() {
  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    acessoPermitido,
    setAcessoPermitido,
  ] = useState<boolean | null>(
    null
  );

  const [
    resumo,
    setResumo,
  ] = useState<ResumoRelatorio>({
    totalPedidos: 0,

    pedidosEntregues: 0,

    faturamento: 0,

    estoqueTotal: 0,

    valorMedioPedido: 0,

    percentualEntregues: 0,

    produtosBaixoEstoque: [],

    movimentacoes: [],

    pedidos: [],

    produtos: [],
  });

  /*
   * CONTROLE DE ACESSO
   */

  useEffect(() => {
    const logado =
      sessionStorage.getItem(
        "adminLogado"
      );

    if (logado !== "true") {
      window.location.replace(
        "/login"
      );

      return;
    }

    const nivel =
      sessionStorage.getItem(
        "adminNivel"
      );

    if (nivel === "MASTER") {
      setAcessoPermitido(true);

      return;
    }

    setAcessoPermitido(false);

    setTimeout(() => {
      window.location.replace(
        "/admin"
      );
    }, 3000);
  }, []);

  /*
   * CARREGAR RELATÓRIO
   */

  useEffect(() => {
    if (
      acessoPermitido !== true
    ) {
      return;
    }

    async function carregarRelatorio() {
      try {
        setLoading(true);

        const data =
          await getResumoRelatorio();

        setResumo(data);
      } catch (error) {
        console.error(
          "Erro ao carregar relatório:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    carregarRelatorio();
  }, [acessoPermitido]);

  /*
   * ACESSO NEGADO
   */

  if (
    acessoPermitido === false
  ) {
    return (
      <AcessoRestritoPage
        onOk={() =>
          window.location.replace(
            "/admin"
          )
        }
      />
    );
  }

  /*
   * AGUARDANDO VERIFICAÇÃO
   * DE ACESSO
   */

  if (
    acessoPermitido === null
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#111111] text-white">
        <p className="text-[#F3E8D7]/60">
          Carregando...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl px-8 py-10">

        {/* CABEÇALHO */}

        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-black tracking-wide text-[#C8A95B]">
              RELATÓRIO GERAL
            </h1>

            <p className="mt-2 text-lg text-[#F3E8D7]/70">
              Sistema de Gestão
              MTelles ERP
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl border border-[#C8A95B]/20 bg-[#181818] px-5 py-3 transition hover:border-[#C8A95B]"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft
                size={18}
              />

              Voltar
            </div>
          </Link>
        </div>

        <div className="h-px w-full bg-[#C8A95B]/30" />

        {/* INFORMAÇÕES DO RELATÓRIO */}

        <div className="mt-8 grid gap-4 text-sm lg:grid-cols-3">
          <div>
            <span className="font-semibold text-[#C8A95B]">
              Emitido em
            </span>

            <p className="mt-1 text-[#F3E8D7]/70">
              {new Date().toLocaleString(
                "pt-BR"
              )}
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

        {/* ALERTAS */}

        <Alertas
          loading={loading}
          produtosBaixoEstoque={
            resumo.produtosBaixoEstoque
          }
        />

        {/* RELATÓRIO OPERACIONAL */}

        <ResumoOperacional
          loading={loading}
          totalPedidos={
            resumo.totalPedidos
          }
          pedidosEntregues={
            resumo.pedidosEntregues
          }
          percentualEntregues={
            resumo.percentualEntregues
          }
          produtos={
            resumo.produtos
          }
          pedidos={
            resumo.pedidos
          }
          produtosBaixoEstoque={
            resumo.produtosBaixoEstoque
          }
        />

        {/* RELATÓRIO FINANCEIRO */}

        <ResumoFinanceiro
          loading={loading}
          faturamento={
            resumo.faturamento
          }
          valorMedioPedido={
            resumo.valorMedioPedido
          }
          pedidos={
            resumo.pedidos
          }
        />

        {/* RELATÓRIO DE ESTOQUE */}

        <ResumoEstoque
          loading={loading}
          estoqueTotal={
            resumo.estoqueTotal
          }
          produtos={
            resumo.produtos
          }
          produtosBaixoEstoque={
            resumo.produtosBaixoEstoque
          }
        />

        {/* MOVIMENTAÇÕES */}

        <Movimentacoes
          loading={loading}
          movimentacoes={
            resumo.movimentacoes
          }
        />

        {/* TABELA DE ESTOQUE */}

        <TabelaEstoque
          loading={loading}
          produtos={
            resumo.produtos
          }
        />

      </div>
    </main>
  );
}