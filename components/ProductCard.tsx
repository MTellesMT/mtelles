"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
} from "react";

import { Product } from "@/types/product";
import { useCart } from "./CartContext";

const whatsapp = "5521966682941";

interface ProductCardProps {
  produto: Product;
}

export default function ProductCard({
  produto,
}: ProductCardProps) {
  const { adicionarProduto } = useCart();

  const [seletorAberto, setSeletorAberto] =
    useState(false);

  const [
    corCompraSelecionada,
    setCorCompraSelecionada,
  ] = useState("");

  const [
    tamanhoSelecionado,
    setTamanhoSelecionado,
  ] = useState("");

  const imagensDisponiveis = useMemo(() => {
    const lista: {
      cor: string;
      imagem: string;
    }[] = [];

    if (produto.imagem_principal) {
      lista.push({
        cor: "Principal",
        imagem:
          produto.imagem_principal,
      });
    }

    if (produto.galeria) {
      try {
        const galeria = JSON.parse(
          produto.galeria
        );

        if (Array.isArray(galeria)) {
          galeria.forEach(
            (
              imagem: string,
              index: number
            ) => {
              lista.push({
                cor: `Cor ${
                  index + 1
                }`,
                imagem,
              });
            }
          );
        }
      } catch (error) {
        console.error(
          "Erro ao carregar galeria:",
          error
        );
      }
    }

    return lista;
  }, [produto]);

  const [corSelecionada] = useState(
    imagensDisponiveis[0]?.cor ?? ""
  );

  const imagemSelecionada =
    imagensDisponiveis.find(
      (item) =>
        item.cor === corSelecionada
    )?.imagem ??
    imagensDisponiveis[0]?.imagem ??
    "";

  const coresDisponiveis =
    useMemo(() => {
      if (!produto.cores) {
        return [];
      }

      return produto.cores
        .split(",")
        .map((cor) => cor.trim())
        .filter(Boolean);
    }, [produto.cores]);

  const tamanhosDisponiveis =
    useMemo(() => {
      if (!produto.tamanhos) {
        return [];
      }

      return produto.tamanhos
        .split(",")
        .map((tamanho) =>
          tamanho.trim()
        )
        .filter(Boolean);
    }, [produto.tamanhos]);

  const mensagem = encodeURIComponent(
    `Olá! Tenho interesse no produto:

${produto.nome}

Código: ${produto.codigo}`
  );

  const linkWhatsApp =
    `https://wa.me/${whatsapp}?text=${mensagem}`;

  function abrirSeletor() {
    setCorCompraSelecionada("");
    setTamanhoSelecionado("");
    setSeletorAberto(true);
  }

  function fecharSeletor() {
    setSeletorAberto(false);
    setCorCompraSelecionada("");
    setTamanhoSelecionado("");
  }

  function adicionarAoCarrinho() {
    if (
      !corCompraSelecionada ||
      !tamanhoSelecionado
    ) {
      return;
    }

    adicionarProduto(
      produto,
      tamanhoSelecionado,
      corCompraSelecionada
    );

    fecharSeletor();
  }

  const podeAdicionar =
    Boolean(corCompraSelecionada) &&
    Boolean(tamanhoSelecionado);

  return (
    <>
      <article className="group overflow-hidden rounded-3xl border border-[#C8A95B]/20 bg-[#181818] shadow-2xl">
        {/* FOTO */}

        <div className="relative overflow-hidden">
          <div className="absolute left-4 top-4 z-20 rounded-full bg-[#C8A95B] px-3 py-2 text-sm font-bold uppercase tracking-[0.2em] text-[#111111] shadow-xl">
            Mais Vendido
          </div>

          <div className="absolute right-4 top-4 z-20 rounded-full bg-black px-3 py-2 text-base font-bold text-white">
            ★ 4.9
          </div>

          <Link
            href={`/produto/${produto.codigo}`}
            className="flex h-[260px] items-center justify-center bg-gradient-to-br from-[#2a2a2a] via-[#1b1b1b] to-[#0f0f0f] p-4"
          >
            {imagemSelecionada ? (
              <img
                src={imagemSelecionada}
                alt={produto.nome}
                className="h-[260px] w-full object-contain"
              />
            ) : (
              <div className="text-center">
                <div className="text-6xl transition group-hover:scale-110">
                  👠
                </div>

                <p className="mt-5 text-[#F3E8D7]/50">
                  Imagem em breve
                </p>
              </div>
            )}
          </Link>
        </div>

        {/* CONTEÚDO */}

        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-[#C8A95B]/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#C8A95B]">
              {produto.categoria}
            </span>

            <span className="text-sm text-[#F3E8D7]/45">
              #{produto.codigo}
            </span>
          </div>

          <p className="mt-4 text-sm font-bold uppercase tracking-[0.25em] text-[#C8A95B]">
            {produto.marca}
          </p>

          <Link
            href={`/produto/${produto.codigo}`}
          >
            <h3 className="mt-3 line-clamp-2 min-h-[56px] text-xl font-bold leading-7 tracking-tight transition duration-500 group-hover:text-[#E4C97A]">
              {produto.nome}
            </h3>
          </Link>

          <div className="mt-6">
            <p className="text-sm text-[#F3E8D7]/45">
              Preço
            </p>

            <div className="mt-2">
              <span className="text-3xl font-black tracking-tight text-[#C8A95B]">
                {produto.preco.toLocaleString(
                  "pt-BR",
                  {
                    style:
                      "currency",
                    currency:
                      "BRL",
                  }
                )}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={abrirSeletor}
              className="rounded-full bg-white py-3 text-center text-base font-bold text-[#111111] transition-all duration-300 hover:scale-[1.03] hover:bg-[#F3E8D7]"
            >
              Adicionar ao Carrinho
            </button>

            <Link
              href={`/produto/${produto.codigo}`}
              className="rounded-full border-2 border-[#C8A95B] py-3 text-center text-base font-bold text-[#C8A95B] transition-all duration-300 hover:bg-[#C8A95B] hover:text-[#111111]"
            >
              Ver detalhes
            </Link>

            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#C8A95B] py-3 text-center text-base font-bold text-[#111111] transition-all duration-300 hover:scale-[1.04] hover:bg-[#e5c96f]"
            >
              Comprar pelo WhatsApp
            </a>
          </div>
        </div>
      </article>

      {/* SELETOR RÁPIDO DE COR E TAMANHO */}

      {seletorAberto && (
        <>
          <div
            className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm"
            onClick={fecharSeletor}
          />

          <div className="fixed left-1/2 top-1/2 z-[120] w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-[#C8A95B]/30 bg-[#181818] shadow-2xl">
            {/* CABEÇALHO */}

            <div className="flex items-start justify-between border-b border-[#C8A95B]/15 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C8A95B]">
                  Adicionar ao Carrinho
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  {produto.nome}
                </h2>

                <p className="mt-1 text-sm text-[#F3E8D7]/45">
                  {produto.marca} • #
                  {produto.codigo}
                </p>
              </div>

              <button
                type="button"
                onClick={fecharSeletor}
                aria-label="Fechar"
                className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-2xl text-[#C8A95B] transition hover:bg-[#C8A95B]/10"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* COR */}

              <div>
                <p className="text-sm font-semibold text-white">
                  Escolha a cor
                </p>

                {coresDisponiveis.length >
                0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {coresDisponiveis.map(
                      (cor) => {
                        const selecionada =
                          corCompraSelecionada ===
                          cor;

                        return (
                          <button
                            key={cor}
                            type="button"
                            onClick={() =>
                              setCorCompraSelecionada(
                                cor
                              )
                            }
                            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                              selecionada
                                ? "border-[#C8A95B] bg-[#C8A95B] text-[#111111]"
                                : "border-[#C8A95B]/30 bg-[#111111] text-[#F3E8D7] hover:border-[#C8A95B]"
                            }`}
                          >
                            {cor}
                          </button>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-red-400">
                    Nenhuma cor
                    disponível.
                  </p>
                )}
              </div>

              {/* TAMANHO */}

              <div className="mt-6">
                <p className="text-sm font-semibold text-white">
                  Escolha o tamanho
                </p>

                {tamanhosDisponiveis.length >
                0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tamanhosDisponiveis.map(
                      (tamanho) => {
                        const selecionado =
                          tamanhoSelecionado ===
                          tamanho;

                        return (
                          <button
                            key={tamanho}
                            type="button"
                            onClick={() =>
                              setTamanhoSelecionado(
                                tamanho
                              )
                            }
                            className={`flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 font-bold transition ${
                              selecionado
                                ? "border-[#C8A95B] bg-[#C8A95B] text-[#111111]"
                                : "border-[#C8A95B]/30 bg-[#111111] text-white hover:border-[#C8A95B]"
                            }`}
                          >
                            {tamanho}
                          </button>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-red-400">
                    Nenhum tamanho
                    disponível.
                  </p>
                )}
              </div>

              {/* RESUMO */}

              <div className="mt-6 flex items-center justify-between border-t border-[#C8A95B]/15 pt-5">
                <span className="text-sm text-[#F3E8D7]/55">
                  Valor
                </span>

                <span className="text-2xl font-black text-[#C8A95B]">
                  {produto.preco.toLocaleString(
                    "pt-BR",
                    {
                      style:
                        "currency",
                      currency:
                        "BRL",
                    }
                  )}
                </span>
              </div>

              {/* ADICIONAR */}

              <button
                type="button"
                onClick={adicionarAoCarrinho}
                disabled={!podeAdicionar}
                className="mt-5 w-full rounded-full bg-[#C8A95B] py-4 font-bold text-[#111111] transition hover:bg-[#e5c96f] disabled:cursor-not-allowed disabled:opacity-35"
              >
                {podeAdicionar
                  ? "Adicionar ao Carrinho"
                  : "Selecione cor e tamanho"}
              </button>

              <button
                type="button"
                onClick={fecharSeletor}
                className="mt-3 w-full py-2 text-sm font-semibold text-[#F3E8D7]/55 transition hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}