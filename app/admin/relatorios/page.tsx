"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RelatoriosPage() {
  return (
    <main className="min-h-screen bg-[#111111] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black">
              Relatórios
            </h1>

            <p className="mt-2 text-[#F3E8D7]/70">
              Estatísticas e indicadores da MTelles.
            </p>
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-2xl border border-[#C8A95B]/20 bg-[#181818] px-5 py-3 transition hover:border-[#C8A95B]"
          >
            <ArrowLeft size={18} />
            Voltar
          </Link>
        </div>

        <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-16 text-center">
          <h2 className="text-3xl font-bold text-[#C8A95B]">
            Relatórios
          </h2>

          <p className="mt-4 text-[#F3E8D7]/70">
            Em instantes este painel exibirá os indicadores
            completos da loja MTelles.
          </p>
        </div>
      </div>
    </main>
  );
}