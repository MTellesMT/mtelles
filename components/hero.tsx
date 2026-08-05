"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  const [indiceBanner, setIndiceBanner] = useState(0);

  const produtosAtivos = useMemo(() => {
    return produtos.filter((produto) => produto.ativo);
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
          indiceBanner % produtosDoBanner.length
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

  const linkWhatsAppBanner = produtoDestaque
    ? `https://wa.me/${whatsapp}?text=${mensagemBanner}`
    : `https://wa.me/${whatsapp}`;

  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-[#C8A95B]/15"
    >
      {/* FUNDO */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#171717] to-[#0c0c0c]" />

      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#C8A95B]/10 blur-[150px]" />

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#C8A95B]/10 blur-[120px]" />

      {/* CONTEÚDO */}

      <div className="relative mx-auto grid w-full max-w-[1600px] items-center gap-10 px-5 py-10 sm:px-6 lg:min-h-[680px] lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
        {/* TEXTO */}

<div className="order-2 min-w-0 lg:order-1">
          <span className="inline-block rounded-full border border-[#C8A95B]/30 bg-[#C8A95B]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#C8A95B] sm:px-5 sm:text-sm sm:tracking-[0.2em]">
            Nova Coleção
          </span>

          <h1 className="mt-6 max-w-3xl text-3xl font-black leading-[1.08] tracking-tight sm:mt-8 sm:text-4xl md:text-5xl lg:text-6xl">
            Elegância para mulheres que deixam sua marca.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#F3E8D7]/70 sm:mt-8 sm:text-lg sm:leading-8">
            Descubra modelos exclusivos da MTelles que unem
            sofisticação, conforto e personalidade para
            acompanhar você em qualquer ocasião.
          </p>

          {produtoDestaque && (
            <div className="mt-6 hidden rounded-2xl border border-[#C8A95B]/20 bg-white/[0.03] p-4 backdrop-blur sm:mt-8 sm:rounded-3xl lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C8A95B] sm:tracking-[0.25em]">
                Produto em destaque
              </p>

              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#F3E8D7]/55 sm:text-sm">
                    {produtoDestaque.marca}
                  </p>

                  <h2 className="mt-2 break-words text-xl font-bold sm:text-2xl lg:text-3xl">
                    {produtoDestaque.nome}
                  </h2>
                </div>

                <span className="shrink-0 text-2xl font-black text-[#C8A95B] sm:text-3xl">
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

          {/* BOTÕES */}

          <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:gap-4">
            {produtoDestaque ? (
              <Link
                href={`/produto/${produtoDestaque.codigo}`}
                className="w-full rounded-full bg-[#C8A95B] px-6 py-3.5 text-center font-bold text-[#111111] transition hover:scale-[1.02] hover:bg-[#e3c46f] sm:w-auto sm:px-8 sm:py-4"
              >
                Ver produto
              </Link>
            ) : (
              <Link
                href="#colecao"
                className="w-full rounded-full bg-[#C8A95B] px-6 py-3.5 text-center font-bold text-[#111111] transition hover:scale-[1.02] hover:bg-[#e3c46f] sm:w-auto sm:px-8 sm:py-4"
              >
                Ver coleção
              </Link>
            )}

            <a
              href={linkWhatsAppBanner}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full border-2 border-[#C8A95B] px-6 py-3.5 text-center font-bold text-[#C8A95B] transition hover:bg-[#C8A95B] hover:text-[#111111] sm:w-auto sm:px-8 sm:py-4"
            >
              Comprar pelo WhatsApp
            </a>
          </div>

          {/* INFORMAÇÕES */}

          <div className="mt-8 grid grid-cols-2 gap-5 sm:mt-10 sm:flex sm:flex-wrap sm:gap-8">
            <div>
              <h3 className="text-2xl font-black text-[#C8A95B] sm:text-3xl">
                +500
              </h3>

              <p className="mt-1 text-sm text-[#F3E8D7]/60 sm:text-base">
                Clientes satisfeitas
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-black text-[#C8A95B] sm:text-3xl">
                ★ 4.9
              </h3>

              <p className="mt-1 text-sm text-[#F3E8D7]/60 sm:text-base">
                Avaliação média
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-2xl font-black text-[#C8A95B] sm:text-3xl">
                Premium
              </h3>

              <p className="mt-1 text-sm text-[#F3E8D7]/60 sm:text-base">
                Produtos selecionados
              </p>
            </div>
          </div>
        </div>

        {/* IMAGEM */}

<div className="order-1 relative min-w-0 lg:order-2">
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[#C8A95B]/20 via-transparent to-transparent blur-3xl lg:rounded-[48px]" />

          <div className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-[#C8A95B]/25 bg-[#191919] shadow-[0_30px_100px_rgba(0,0,0,.55)] sm:min-h-[420px] sm:rounded-[36px] lg:min-h-[540px] lg:rounded-[48px]">
            {produtoDestaque ? (
              <div
                key={produtoDestaque.id}
                className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[540px]"
              >
                {produtoDestaque.imagem_principal ? (
                  <img
                    src={produtoDestaque.imagem_principal}
                    alt={produtoDestaque.nome}
                    className="h-[320px] w-full object-cover transition-all duration-700 hover:scale-105 sm:h-[420px] lg:h-[540px]"
                  />
                ) : (
                  <div className="flex h-[320px] items-center justify-center px-6 text-center text-[#F3E8D7]/50 sm:h-[420px] lg:h-[540px]">
                    Imagem em breve
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                <div className="absolute left-4 top-4 rounded-full bg-[#C8A95B] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#111111] shadow-xl sm:left-6 sm:top-6 sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.18em]">
                  Em destaque
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8A95B] sm:text-sm sm:tracking-[0.2em]">
                    {produtoDestaque.marca}
                  </p>

                  <h2 className="mt-2 line-clamp-2 text-2xl font-black sm:text-3xl lg:text-4xl">
                    {produtoDestaque.nome}
                  </h2>

                  <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="text-2xl font-black text-[#C8A95B] sm:text-3xl">
                      {Number(
                        produtoDestaque.preco
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>

                    <Link
                      href={`/produto/${produtoDestaque.codigo}`}
                      className="w-fit rounded-full border border-[#C8A95B] bg-black/40 px-5 py-2.5 text-sm font-bold text-[#C8A95B] backdrop-blur transition hover:bg-[#C8A95B] hover:text-[#111111] sm:px-6 sm:py-3 sm:text-base"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center px-6 text-center text-[#F3E8D7]/50 sm:min-h-[420px] lg:min-h-[540px]">
                {loading
                  ? "Carregando produtos..."
                  : "Nenhum produto disponível."}
              </div>
            )}

            {/* SETAS */}

            {produtosDoBanner.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={bannerAnterior}
                  aria-label="Produto anterior"
                  className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#C8A95B]/40 bg-black/60 text-2xl text-[#C8A95B] backdrop-blur transition hover:bg-[#C8A95B] hover:text-[#111111] sm:left-5 sm:h-12 sm:w-12 sm:text-3xl"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={proximoBanner}
                  aria-label="Próximo produto"
                  className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#C8A95B]/40 bg-black/60 text-2xl text-[#C8A95B] backdrop-blur transition hover:bg-[#C8A95B] hover:text-[#111111] sm:right-5 sm:h-12 sm:w-12 sm:text-3xl"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* INDICADORES */}

          {produtosDoBanner.length > 1 && (
            <div className="mt-4 flex justify-center gap-2 sm:mt-6 sm:gap-3">
              {produtosDoBanner.map(
                (produto, index) => (
                  <button
                    key={produto.id}
                    type="button"
                    onClick={() =>
                      setIndiceBanner(index)
                    }
                    aria-label={`Exibir ${produto.nome}`}
                    className={`h-2.5 rounded-full transition-all sm:h-3 ${
                      indiceBanner === index
                        ? "w-8 bg-[#C8A95B] sm:w-10"
                        : "w-2.5 bg-[#C8A95B]/30 hover:bg-[#C8A95B]/60 sm:w-3"
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