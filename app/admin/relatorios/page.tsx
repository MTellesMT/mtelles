"use client";
import AcessoRestritoPage from "@/components/admin/AcessoRestritoPage";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResumoOperacional from "./components/ResumoOperacional";
import { getResumoRelatorio } from "@/services/relatorios";
import ResumoFinanceiro from "./components/ResumoFinanceiro";
import ResumoEstoque from "./components/ResumoEstoque";
import Alertas from "./components/Alertas";
import Movimentacoes from "./components/Movimentacoes";
import TabelaEstoque from "./components/TabelaEstoque";
interface ResumoRelatorio {

  totalPedidos: number;
  pedidosEntregues: number;
  faturamento: number;
  estoqueTotal: number;
  valorMedioPedido: number;
  percentualEntregues: number;

  produtosBaixoEstoque: {
  marca: string;
  nome: string;
  estoque: number;
}[];

  movimentacoes: {
    id: number;
    tipo: string;
    produto: string;
    quantidade: number;
    motivo: string;
    created_at: string;
  }[];

  pedidos: {
    id: number;
    cliente: string;
    status: string;
    total: number;
    created_at: string;
  }[];

  produtos: {
    id: number;
    nome: string;
    codigo: string;
    marca: string;
    cores: string;
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

movimentacoes: [],
pedidos: [],
produtos: [],

  });

 useEffect(() => {
  const logado =
    sessionStorage.getItem("adminLogado");

  if (logado !== "true") {
    window.location.replace("/login");
    return;
  }

  const nivel =
    sessionStorage.getItem("adminNivel");

  if (nivel === "MASTER") {
    setAcessoPermitido(true);
  } else {
    setAcessoPermitido(false);

    setTimeout(() => {
      window.location.replace("/admin");
    }, 3000);
  }
}, []);

const [acessoPermitido, setAcessoPermitido] =
  useState<boolean | null>(null);
  

useEffect(() => {
  if (acessoPermitido !== true) {
    return;
  }

  async function carregarRelatorio() {
    try {
      setLoading(true);

      const data =
        await getResumoRelatorio();

      setResumo(data);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  }

  carregarRelatorio();
}, [acessoPermitido]);

 if (acessoPermitido === false) {
  return (
    <AcessoRestritoPage
      onOk={() =>
        window.location.replace("/admin")
      }
    />
  );
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
        

<Alertas
  loading={loading}
  produtosBaixoEstoque={
    resumo.produtosBaixoEstoque
  }
/>
<ResumoOperacional
  loading={loading}
  totalPedidos={resumo.totalPedidos}
  pedidosEntregues={resumo.pedidosEntregues}
  percentualEntregues={resumo.percentualEntregues}
  produtos={resumo.produtos}
  pedidos={resumo.pedidos}
  produtosBaixoEstoque={
  resumo.produtosBaixoEstoque
}
/>

<ResumoFinanceiro
  loading={loading}
  faturamento={resumo.faturamento}
  valorMedioPedido={resumo.valorMedioPedido}
  pedidos={resumo.pedidos}
/>

<ResumoEstoque
  loading={loading}
  estoqueTotal={resumo.estoqueTotal}
  produtos={resumo.produtos}
  produtosBaixoEstoque={resumo.produtosBaixoEstoque}
/>



<Movimentacoes
  loading={loading}
  movimentacoes={resumo.movimentacoes}
/>
<TabelaEstoque
  loading={loading}
  produtos={resumo.produtos}
/>


      </div>

    </main>
  );
}