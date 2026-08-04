"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#111111]">

      {/* Efeito de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#181818] to-[#111111]" />

      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#C8A95B]/10 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#C8A95B]/5 blur-3xl" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-between gap-16 px-6 py-16 lg:flex-row">

        {/* Texto */}

        <div className="max-w-xl">

          <span className="rounded-full border border-[#C8A95B]/30 px-4 py-2 text-sm uppercase tracking-[0.3em] text-[#C8A95B]">
            Nova Coleção 2026
          </span>

          <h1 className="mt-8 text-5xl font-black leading-tight text-white md:text-7xl">
            Elegância em
            <br />
            <span className="text-[#C8A95B]">
              cada passo.
            </span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-[#F3E8D7]/70">
            Descubra sandálias femininas que unem conforto,
            sofisticação e estilo para todas as ocasiões.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link
              href="#colecao"
              className="rounded-full bg-[#C8A95B] px-8 py-4 font-semibold text-[#111111] transition hover:scale-105"
            >
              Comprar Agora
            </Link>

            <Link
              href="#destaques"
              className="rounded-full border border-[#C8A95B] px-8 py-4 font-semibold text-[#C8A95B] transition hover:bg-[#C8A95B] hover:text-[#111111]"
            >
              Ver Coleção
            </Link>

          </div>

        </div>

        {/* Lado direito */}

        <div className="relative flex items-center justify-center">

          <div className="absolute h-96 w-96 rounded-full bg-[#C8A95B]/10 blur-3xl" />

          <div className="relative flex h-[520px] w-[420px] items-center justify-center rounded-[40px] border border-[#C8A95B]/20 bg-[#181818]">

            {/* Imagem temporária */}

            <div className="text-center">

              <div className="text-9xl">
                👠
              </div>

              <p className="mt-8 text-lg text-[#F3E8D7]/60">
                Em breve aqui ficará a foto principal
                <br />
                da coleção MTelles.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}