"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useCart } from "@/components/CartContext";
import { getProducts } from "@/services/products";
import { Product } from "@/types/product";

interface ProductDetailsProps {
  produto: Product;
}

const WHATSAPP = "5521966682941";

const TAMANHOS_PADRAO = [
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
];

function transformarEmLista(
  valor: string | null | undefined
) {
  if (!valor) {
    return [];
  }

  try {
    const valorConvertido = JSON.parse(valor);

    if (Array.isArray(valorConvertido)) {
      return valorConvertido
        .map((item) => String(item).trim())
        .filter(Boolean);
    }
  } catch {
    // O campo também pode estar salvo como texto separado por vírgulas.
  }

  return valor
    .split(/[,;\n|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProductDetails({
  produto,
}: ProductDetailsProps) {
  const { adicionarProduto } = useCart();

  const imagens = useMemo(() => {
    const lista: string[] = [];

    if (produto.imagem_principal) {
      lista.push(produto.imagem_principal);
    }

    if (produto.galeria) {
      try {
        const galeria = JSON.parse(
          produto.galeria
        );

        if (Array.isArray(galeria)) {
          galeria.forEach((imagem) => {
            if (
              typeof imagem === "string" &&
              imagem.trim()
            ) {
              lista.push(imagem);
            }
          });
        }
      } catch (error) {
        console.error(
          "Erro ao carregar a galeria:",
          error
        );
      }
    }

    return [...new Set(lista)];
  }, [produto]);

  const coresDisponiveis = useMemo(() => {
    const cores = transformarEmLista(
      produto.cores
    );

    return cores.length > 0
      ? cores
      : ["Não informada"];
  }, [produto.cores]);

  const tamanhosDisponiveis = useMemo(() => {
    const tamanhos = transformarEmLista(
      produto.tamanhos
    );

    return tamanhos.length > 0
      ? tamanhos
      : TAMANHOS_PADRAO;
  }, [produto.tamanhos]);

  const [imagemSelecionada, setImagemSelecionada] =
    useState(imagens[0] ?? "");

  const [imagemAmpliada, setImagemAmpliada] =
    useState(false);

  const [tamanhoSelecionado, setTamanhoSelecionado] =
    useState("");

  const [corSelecionada, setCorSelecionada] =
    useState(coresDisponiveis[0] ?? "");

  const [
    produtosRelacionados,
    setProdutosRelacionados,
  ] = useState<Product[]>([]);

  useEffect(() => {
    if (imagens.length > 0) {
      setImagemSelecionada(imagens[0]);
    }
  }, [imagens]);

  useEffect(() => {
    setTamanhoSelecionado("");
    setCorSelecionada(
      coresDisponiveis[0] ?? ""
    );
  }, [produto.id, coresDisponiveis]);

  useEffect(() => {
    async function carregarRelacionados() {
      try {
        const produtos = await getProducts();

        const relacionados = produtos
          .filter(
            (item) =>
              item.id !== produto.id &&
              item.categoria ===
                produto.categoria &&
              item.ativo
          )
          .slice(0, 3);

        setProdutosRelacionados(
          relacionados
        );
      } catch (error) {
        console.error(
          "Erro ao carregar produtos relacionados:",
          error
        );
      }
    }

    carregarRelacionados();
  }, [produto]);

  function selecionarCor(
    cor: string,
    index: number
  ) {
    setCorSelecionada(cor);

    const imagemDaCor =
      imagens[index] ?? imagens[0];

    if (imagemDaCor) {
      setImagemSelecionada(imagemDaCor);
    }
  }

  function validarOpcoes() {
    if (!tamanhoSelecionado) {
      window.alert(
        "Escolha o tamanho do calçado antes de continuar."
      );

      return false;
    }

    if (!corSelecionada) {
      window.alert(
        "Escolha uma cor antes de continuar."
      );

      return false;
    }

    return true;
  }

  function adicionarAoCarrinho() {
    if (!validarOpcoes()) {
      return;
    }

    adicionarProduto(
      produto,
      tamanhoSelecionado,
      corSelecionada
    );
  }

  function comprarPeloWhatsApp() {
    if (!validarOpcoes()) {
      return;
    }

    const mensagem = encodeURIComponent(
      `Olá! Tenho interesse no produto:

${produto.nome}

Código: ${produto.codigo}
Marca: ${produto.marca}
Cor: ${corSelecionada}
Tamanho: ${tamanhoSelecionado}
Quantidade: 1

Valor: ${produto.preco.toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL",
        }
      )}`
    );

    window.open(
      `https://wa.me/${WHATSAPP}?text=${mensagem}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#111111] text-white">
        <header className="border-b border-[#C8A95B]/20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C8A95B] font-bold text-[#C8A95B]">
                MT
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-[0.18em] text-[#C8A95B]">
                  MTELLES
                </h1>

                <p className="text-xs text-[#F3E8D7]/70">
                  Elegância em cada passo
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="rounded-full border border-[#C8A95B] px-5 py-2 text-sm text-[#C8A95B] transition hover:bg-[#C8A95B] hover:text-black"
            >
              Voltar
            </Link>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl gap-14 px-6 py-14 lg:grid-cols-2">
          <div>
            <button
              type="button"
              onClick={() =>
                setImagemAmpliada(true)
              }
              className="flex w-full items-center justify-center overflow-hidden rounded-3xl border border-[#C8A95B]/20 bg-[#181818]"
            >
              {imagemSelecionada ? (
                <img
                  src={imagemSelecionada}
                  alt={produto.nome}
                  className="max-h-[650px] w-full object-contain"
                />
              ) : (
                <div className="flex h-[650px] items-center justify-center text-8xl">
                  👠
                </div>
              )}
            </button>

            {imagens.length > 1 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {imagens.map(
                  (imagem, index) => (
                    <button
                      key={`${imagem}-${index}`}
                      type="button"
                      onClick={() =>
                        setImagemSelecionada(
                          imagem
                        )
                      }
                      className={`overflow-hidden rounded-xl border transition ${
                        imagemSelecionada ===
                        imagem
                          ? "border-[#C8A95B]"
                          : "border-[#333333]"
                      }`}
                    >
                      <img
                        src={imagem}
                        alt={`${produto.nome} ${
                          index + 1
                        }`}
                        className="h-24 w-24 object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-sm uppercase tracking-[0.2em] text-[#C8A95B]">
              {produto.categoria}
            </span>

            <h1 className="mt-3 text-5xl font-bold leading-tight">
              {produto.nome}
            </h1>

            <p className="mt-2 text-lg text-[#F3E8D7]/70">
              {produto.marca}
            </p>

            <div className="mt-8">
              <p className="text-4xl font-bold text-[#C8A95B]">
                {produto.preco.toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  }
                )}
              </p>
            </div>

            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#C8A95B]">
                  Código:
                </span>

                <span>{produto.codigo}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#C8A95B]">
                  Estoque:
                </span>

                <span>{produto.estoque}</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold">
                Descrição
              </h3>

              <p className="leading-8 text-[#F3E8D7]/70">
                {produto.descricao}
              </p>
            </div>

            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold">
                Escolha a cor
              </h3>

              <div className="flex flex-wrap gap-3">
                {coresDisponiveis.map(
                  (cor, index) => (
                    <button
                      key={`${cor}-${index}`}
                      type="button"
                      onClick={() =>
                        selecionarCor(
                          cor,
                          index
                        )
                      }
                      className={`rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                        corSelecionada === cor
                          ? "border-[#C8A95B] bg-[#C8A95B] text-[#111111]"
                          : "border-[#444444] text-[#F3E8D7] hover:border-[#C8A95B]"
                      }`}
                    >
                      {cor}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold">
                Escolha o tamanho
              </h3>

              <div className="flex flex-wrap gap-3">
                {tamanhosDisponiveis.map(
                  (tamanho) => (
                    <button
                      key={tamanho}
                      type="button"
                      onClick={() =>
                        setTamanhoSelecionado(
                          tamanho
                        )
                      }
                      className={`flex h-12 min-w-12 items-center justify-center rounded-full border px-3 transition-all duration-200 ${
                        tamanhoSelecionado ===
                        tamanho
                          ? "border-[#C8A95B] bg-[#C8A95B] text-[#111111]"
                          : "border-[#444444] hover:border-[#C8A95B]"
                      }`}
                    >
                      {tamanho}
                    </button>
                  )
                )}
              </div>

              {!tamanhoSelecionado && (
                <p className="mt-3 text-sm text-[#F3E8D7]/50">
                  Selecione uma numeração antes
                  de adicionar ao carrinho.
                </p>
              )}
            </div>

            <div className="mt-12 grid gap-4">
              <button
                type="button"
                onClick={adicionarAoCarrinho}
                className="rounded-full bg-white px-8 py-5 text-center text-lg font-bold text-[#111111] transition hover:scale-[1.02] hover:bg-[#F3E8D7]"
              >
                Adicionar ao Carrinho
              </button>

              <button
                type="button"
                onClick={comprarPeloWhatsApp}
                className="rounded-full bg-[#C8A95B] px-8 py-5 text-center text-lg font-bold text-[#111111] transition hover:scale-[1.02] hover:bg-[#e5c96f]"
              >
                Comprar pelo WhatsApp
              </button>
            </div>
          </div>
        </section>        {produtosRelacionados.length >
          0 && (
          <section className="border-t border-[#2A2A2A] bg-[#151515]">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <h2 className="mb-10 text-3xl font-bold text-white">
                Produtos relacionados
              </h2>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {produtosRelacionados.map(
                  (item) => (
                    <Link
                      key={item.id}
                      href={`/produto/${item.codigo}`}
                      className="group overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#1A1A1A] transition-all duration-300 hover:-translate-y-2 hover:border-[#C8A95B]"
                    >
                      <div className="overflow-hidden bg-[#111111]">
                        {item.imagem_principal ? (
                          <img
                            src={
                              item.imagem_principal
                            }
                            alt={item.nome}
                            className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-80 items-center justify-center text-7xl">
                            👠
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 p-6">
                        <span className="text-xs uppercase tracking-[0.2em] text-[#C8A95B]">
                          {item.categoria}
                        </span>

                        <h3 className="text-xl font-semibold text-white">
                          {item.nome}
                        </h3>

                        <p className="line-clamp-2 text-sm text-[#F3E8D7]/65">
                          {item.descricao}
                        </p>

                        <div className="flex items-center justify-between gap-4 pt-3">
                          <span className="text-2xl font-bold text-[#C8A95B]">
                            {item.preco.toLocaleString(
                              "pt-BR",
                              {
                                style:
                                  "currency",
                                currency:
                                  "BRL",
                              }
                            )}
                          </span>

                          <span className="rounded-full border border-[#C8A95B] px-4 py-2 text-sm text-[#C8A95B] transition group-hover:bg-[#C8A95B] group-hover:text-[#111111]">
                            Ver produto
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {imagemAmpliada && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-6"
          onClick={() =>
            setImagemAmpliada(false)
          }
        >
          <button
            type="button"
            onClick={() =>
              setImagemAmpliada(false)
            }
            aria-label="Fechar imagem ampliada"
            className="absolute right-8 top-8 text-5xl text-white transition hover:text-[#C8A95B]"
          >
            ×
          </button>

          <img
            src={imagemSelecionada}
            alt={produto.nome}
            className="max-h-[92vh] max-w-[95vw] rounded-2xl object-contain"
            onClick={(evento) =>
              evento.stopPropagation()
            }
          />
        </div>
      )}
    </>
  );
}