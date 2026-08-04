"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Product } from "@/types/product";

const whatsapp = "5521966682941";

interface HeroProps {
  produtos: Product[];
  loading: boolean;
}

export default function Hero({
  produtos,
  loading,
}: HeroProps) {
  const [indiceBanner, setIndiceBanner] =
    useState(0);

  const produtosAtivos = useMemo(() => {
    return produtos.filter(
      (produto) => produto.ativo
    );
  }, [produtos]);

  const produtosDestaque = useMemo(() => {
    return produtosAtivos.filter(
      (produto) => produto.em_destaque
    );
  }, [produtosAtivos]);

  const produtosDoBanner =
    produtosDestaque.length > 0
      ? produtosDestaque
      : produtosAtivos;

  const produtoDestaque =
    produtosDoBanner.length > 0
      ? produtosDoBanner[
          indiceBanner %
            produtosDoBanner.length
        ]
      : undefined;

  useEffect(() => {
    setIndiceBanner(0);
  }, [produtosDoBanner.length]);

  useEffect(() => {
    if (produtosDoBanner.length <= 1) {
      return;
    }

    const intervalo = window.setInterval(() => {
      setIndiceBanner((indiceAtual) => {
        if (
          indiceAtual >=
          produtosDoBanner.length - 1
        ) {
          return 0;
        }

        return indiceAtual + 1;
      });
    }, 5000);

    return () => {
      window.clearInterval(intervalo);
    };
  }, [produtosDoBanner.length]);

  function bannerAnterior() {
    if (produtosDoBanner.length <= 1) {
      return;
    }

    setIndiceBanner((indiceAtual) => {
      if (indiceAtual === 0) {
        return produtosDoBanner.length - 1;
      }

      return indiceAtual - 1;
    });
  }

  function proximoBanner() {
    if (produtosDoBanner.length <= 1) {
      return;
    }

    setIndiceBanner((indiceAtual) => {
      if (
        indiceAtual >=
        produtosDoBanner.length - 1
      ) {
        return 0;
      }

      return indiceAtual + 1;
    });
  }

  const mensagemBanner = produtoDestaque
    ? encodeURIComponent(
        `Olá! Tenho interesse no produto:

${produtoDestaque.nome}

Código: ${produtoDestaque.codigo}`
      )
    : "";

  const linkWhatsAppBanner =
    produtoDestaque
      ? `https://wa.me/${whatsapp}?text=${mensagemBanner}`
      : `https://wa.me/${whatsapp}`;

  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-[#C8A95B]/15"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#171717] to-[#0c0c0c]" />

      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#C8A95B]/10 blur-[150px]" />

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#C8A95B]/10 blur-[120px]" />

      <div className="relative mx-auto grid min-h-[680px] max-w-[1600px] items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        {/* TEXTO */}

        <div>
          <span className="inline-block rounded-full border border-[#C8A95B]/30 bg-[#C8A95B]/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#C8A95B]">
            Nova Coleção
          </span>

          <h1 className="mt-8 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            Elegância para mulheres que deixam
            sua marca.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#F3E8D7]/70">
            Descubra modelos exclusivos da
            MTelles que unem sofisticação,
            conforto e personalidade para
            acompanhar você em qualquer ocasião.
          </p>

          {produtoDestaque && (
            <div className="mt-8 rounded-3xl border border-[#C8A95B]/20 bg-white/[0.03] p-4 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8A95B]">
                Produto em Destaque
              </p>

              <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#F3E8D7]/55">
                    {produtoDestaque.marca}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {produtoDestaque.nome}
                  </h2>
                </div>

                <span className="text-3xl font-black text-[#C8A95B]">
                  {Number(
                    produtoDestaque.preco
                  ).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-5">
            {produtoDestaque ? (
              <Link
                href={`/produto/${produtoDestaque.codigo}`}
                className="rounded-full bg-[#C8A95B] px-8 py-4 font-bold text-[#111111] transition hover:scale-105 hover:bg-[#e3c46f]"
              >
                Ver Produto
              </Link>
            ) : (
              <Link
                href="#colecao"
                className="rounded-full bg-[#C8A95B] px-8 py-4 font-bold text-[#111111] transition hover:scale-105 hover:bg-[#e3c46f]"
              >
                Ver Coleção
              </Link>
            )}

            <a
              href={linkWhatsAppBanner}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-[#C8A95B] px-8 py-4 font-bold text-[#C8A95B] transition hover:bg-[#C8A95B] hover:text-[#111111]"
            >
              Comprar pelo WhatsApp
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-8">
            <div>
              <h3 className="text-3xl font-black text-[#C8A95B]">
                +500
              </h3>

              <p className="text-[#F3E8D7]/60">
                Clientes satisfeitas
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-black text-[#C8A95B]">
                ★ 4.9
              </h3>

              <p className="text-[#F3E8D7]/60">
                Avaliação média
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-black text-[#C8A95B]">
                Premium
              </h3>

              <p className="text-[#F3E8D7]/60">
                Produtos selecionados
              </p>
            </div>
          </div>
        </div>

        {/* IMAGEM */}

        <div className="relative">
          <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-[#C8A95B]/20 via-transparent to-transparent blur-3xl" />

          <div className="relative min-h-[540px] overflow-hidden rounded-[48px] border border-[#C8A95B]/25 bg-[#191919] shadow-[0_30px_100px_rgba(0,0,0,.55)]">
            {produtoDestaque ? (
              <div
                key={produtoDestaque.id}
                className="relative min-h-[540px]"
              >
                <img
                  src={
                    produtoDestaque.imagem_principal
                  }
                  alt={produtoDestaque.nome}
                  className="h-[540px] w-full object-cover transition-all duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                <div className="absolute left-6 top-6 rounded-full bg-[#C8A95B] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#111111] shadow-xl">
                  Em Destaque
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C8A95B]">
                    {produtoDestaque.marca}
                  </p>

                  <h2 className="mt-2 text-4xl font-black">
                    {produtoDestaque.nome}
                  </h2>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-3xl font-black text-[#C8A95B]">
                      {Number(
                        produtoDestaque.preco
                      ).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}
                    </span>

                    <Link
                      href={`/produto/${produtoDestaque.codigo}`}
                      className="rounded-full border border-[#C8A95B] bg-black/40 px-6 py-3 font-bold text-[#C8A95B] backdrop-blur transition hover:bg-[#C8A95B] hover:text-[#111111]"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[540px] items-center justify-center px-6 text-center text-[#F3E8D7]/50">
                {loading
                  ? "Carregando produtos..."
                  : "Nenhum produto disponível."}
              </div>
            )}

            {produtosDoBanner.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={bannerAnterior}
                  aria-label="Produto anterior"
                  className="absolute left-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#C8A95B]/40 bg-black/60 text-3xl text-[#C8A95B] backdrop-blur transition hover:bg-[#C8A95B] hover:text-[#111111]"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={proximoBanner}
                  aria-label="Próximo produto"
                  className="absolute right-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#C8A95B]/40 bg-black/60 text-3xl text-[#C8A95B] backdrop-blur transition hover:bg-[#C8A95B] hover:text-[#111111]"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {produtosDoBanner.length > 1 && (
            <div className="mt-6 flex justify-center gap-3">
              {produtosDoBanner.map(
                (produto, index) => (
                  <button
                    key={produto.id}
                    type="button"
                    onClick={() =>
                      setIndiceBanner(index)
                    }
                    aria-label={`Exibir ${produto.nome}`}
                    className={`h-3 rounded-full transition-all ${
                      indiceBanner === index
                        ? "w-10 bg-[#C8A95B]"
                        : "w-3 bg-[#C8A95B]/30 hover:bg-[#C8A95B]/60"
                    }`}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}