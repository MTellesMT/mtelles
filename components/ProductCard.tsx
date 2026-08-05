"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

  const imagensDisponiveis = useMemo(() => {

    const lista: {
      cor: string;
      imagem: string;
    }[] = [];

    if (produto.imagem_principal) {
      lista.push({
        cor: "Principal",
        imagem: produto.imagem_principal,
      });
    }

    if (produto.galeria) {

      try {

        const galeria = JSON.parse(produto.galeria);

        if (Array.isArray(galeria)) {

          galeria.forEach(
            (
              imagem: string,
              index: number
            ) => {

              lista.push({
                cor: `Cor ${index + 1}`,
                imagem,
              });

            }
          );

        }

      } catch (error) {

        console.error(error);

      }

    }

    return lista;

  }, [produto]);

  const [corSelecionada, setCorSelecionada] =
    useState(
      imagensDisponiveis[0]?.cor ?? ""
    );

  const imagemSelecionada =
    imagensDisponiveis.find(
      (item) =>
        item.cor === corSelecionada
    )?.imagem ??
    imagensDisponiveis[0]?.imagem ??
    "";

  const mensagem = encodeURIComponent(
    `Olá! Tenho interesse no produto:

${produto.nome}

Código: ${produto.codigo}`
  );

  const linkWhatsApp =
    `https://wa.me/${whatsapp}?text=${mensagem}`;

  return (

    <article className="group overflow-hidden rounded-3xl border border-[#C8A95B]/20 bg-[#181818] shadow-2xl">

      {/* FOTO */}

      <div className="relative overflow-hidden">

        <div className="absolute left-4 top-4 z-20 rounded-full bg-[#C8A95B] px-3 py-2 text-sm font-bold uppercase tracking-[0.2em] text-[#111111] shadow-xl">
          Mais Vendido
        </div>

        <div className="absolute right-4 top-4 z-20 rounded-full bg-black/70 px-3 py-2 text-base font-bold text-white backdrop-blur-md">
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

      {/* CONTINUA NA PARTE 2 */}      {/* CONTEÚDO */}

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

        <Link href={`/produto/${produto.codigo}`}>

<h3 className="mt-3 line-clamp-2 min-h-[56px] text-xl font-bold leading-7 tracking-tight transition duration-500 group-hover:text-[#E4C97A]">            {produto.nome}
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
                  style: "currency",
                  currency: "BRL",
                }
              )}
            </span>


          </div>


        </div>

        <div className="mt-6 grid gap-3">

          <Link
  href={`/produto/${produto.codigo}`}
  className="rounded-full bg-white py-3 text-center text-base font-bold text-[#111111] transition-all duration-300 hover:scale-[1.03]"
>
  Escolher tamanho
</Link>

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

  );

}