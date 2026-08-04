"use client";

import { useEffect, useMemo, useState } from "react";

import Footer from "@/components/Footer";
import Hero from "@/components/hero";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

import { getProducts } from "@/services/products";
import { Product } from "@/types/product";

const whatsapp = "5521966682941";

const OPCAO_TODAS = "Todas";

function normalizar(
  texto: string | null | undefined
) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function transformarEmLista(
  valor: string | null | undefined
) {
  if (!valor) return [];

  try {
    const convertido = JSON.parse(valor);

    if (Array.isArray(convertido)) {
      return convertido
        .map((item) => String(item).trim())
        .filter(Boolean);
    }
  } catch {}

  return valor
    .split(/[,;\n|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function criarListaUnica(
  valores: string[]
) {
  const mapa = new Map<string, string>();

  valores.forEach((valor) => {
    const limpo = valor.trim();

    const chave = normalizar(limpo);

    if (
      limpo &&
      chave &&
      !mapa.has(chave)
    ) {
      mapa.set(chave, limpo);
    }
  });

  return Array.from(
    mapa.values()
  ).sort((a, b) =>
    a.localeCompare(
      b,
      "pt-BR",
      {
        sensitivity: "base",
      }
    )
  );
}

export default function Home() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [busca, setBusca] =
    useState("");

  const [
    marcaSelecionada,
    setMarcaSelecionada,
  ] = useState(OPCAO_TODAS);

  const [
    categoriaSelecionada,
    setCategoriaSelecionada,
  ] = useState(OPCAO_TODAS);

  const [
    corSelecionada,
    setCorSelecionada,
  ] = useState(OPCAO_TODAS);

  const produtosAtivos =
    useMemo(() => {
      return products.filter(
        (produto) => produto.ativo
      );
    }, [products]);

  const marcasDisponiveis =
    useMemo(() => {
      return [
        OPCAO_TODAS,
        ...criarListaUnica(
          produtosAtivos.map(
            (produto) =>
              produto.marca
          )
        ),
      ];
    }, [produtosAtivos]);

  const categoriasDisponiveis =
    useMemo(() => {
      return [
        OPCAO_TODAS,
        ...criarListaUnica(
          produtosAtivos.map(
            (produto) =>
              produto.categoria
          )
        ),
      ];
    }, [produtosAtivos]);

  const coresDisponiveis =
    useMemo(() => {
      return [
        OPCAO_TODAS,
        ...criarListaUnica(
          produtosAtivos.flatMap(
            (produto) =>
              transformarEmLista(
                produto.cores
              )
          )
        ),
      ];
    }, [produtosAtivos]);
  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    if (
      !marcasDisponiveis.some(
        (marca) =>
          normalizar(marca) ===
          normalizar(
            marcaSelecionada
          )
      )
    ) {
      setMarcaSelecionada(
        OPCAO_TODAS
      );
    }
  }, [
    marcasDisponiveis,
    marcaSelecionada,
  ]);

  useEffect(() => {
    if (
      !categoriasDisponiveis.some(
        (categoria) =>
          normalizar(categoria) ===
          normalizar(
            categoriaSelecionada
          )
      )
    ) {
      setCategoriaSelecionada(
        OPCAO_TODAS
      );
    }
  }, [
    categoriasDisponiveis,
    categoriaSelecionada,
  ]);

  useEffect(() => {
    if (
      !coresDisponiveis.some(
        (cor) =>
          normalizar(cor) ===
          normalizar(
            corSelecionada
          )
      )
    ) {
      setCorSelecionada(
        OPCAO_TODAS
      );
    }
  }, [
    coresDisponiveis,
    corSelecionada,
  ]);

  async function carregarProdutos() {
    try {
      setLoading(true);

      const dados =
        await getProducts();

      setProducts(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function limparFiltros() {
    setBusca("");

    setMarcaSelecionada(
      OPCAO_TODAS
    );

    setCategoriaSelecionada(
      OPCAO_TODAS
    );

    setCorSelecionada(
      OPCAO_TODAS
    );
  }

  const produtosFiltrados =
    useMemo(() => {
      const pesquisa =
        normalizar(busca);

      return produtosAtivos.filter(
        (produto) => {
          const marca =
            normalizar(
              produto.marca
            );

          const nome =
            normalizar(
              produto.nome
            );

          const codigo =
            normalizar(
              produto.codigo
            );

          const categoria =
            normalizar(
              produto.categoria
            );

          const descricao =
            normalizar(
              produto.descricao
            );

          const material =
            normalizar(
              produto.material
            );

          const cores =
            normalizar(
              produto.cores
            );

          const tamanhos =
            normalizar(
              produto.tamanhos
            );

          const buscaOk =
            pesquisa === "" ||
            marca.includes(
              pesquisa
            ) ||
            nome.includes(
              pesquisa
            ) ||
            codigo.includes(
              pesquisa
            ) ||
            categoria.includes(
              pesquisa
            ) ||
            descricao.includes(
              pesquisa
            ) ||
            material.includes(
              pesquisa
            ) ||
            cores.includes(
              pesquisa
            ) ||
            tamanhos.includes(
              pesquisa
            );

          const marcaOk =
            marcaSelecionada ===
              OPCAO_TODAS ||
            marca ===
              normalizar(
                marcaSelecionada
              );

          const categoriaOk =
            categoriaSelecionada ===
              OPCAO_TODAS ||
            categoria ===
              normalizar(
                categoriaSelecionada
              );

          const coresProduto =
            transformarEmLista(
              produto.cores
            ).map(normalizar);

          const corOk =
            corSelecionada ===
              OPCAO_TODAS ||
            coresProduto.includes(
              normalizar(
                corSelecionada
              )
            );

          return (
            buscaOk &&
            marcaOk &&
            categoriaOk &&
            corOk
          );
        }
      );
    }, [
      produtosAtivos,
      busca,
      marcaSelecionada,
      categoriaSelecionada,
      corSelecionada,
    ]);

  const quantidadeResultados =
    produtosFiltrados.length;
  return (
    <main className="min-h-screen bg-[#111111] text-white">

      {/* ================= HEADER ================= */}


      {/* ================= HERO ================= */}

      <Hero
        produtos={products}
        loading={loading}
      />

      {/* ================= CATÁLOGO ================= */}

      <section
        id="colecao"
        className="mx-auto max-w-[1700px] px-6 py-20"
      >

        <div className="mb-12">

          <p className="text-sm uppercase tracking-[0.35em] text-[#C8A95B]">
            Nossa coleção
          </p>

          <h2 className="mt-4 text-5xl font-black">
            Encontre seu próximo par
          </h2>

        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">

          {/* ================= SIDEBAR ================= */}

<SearchBar
  busca={busca}
  setBusca={setBusca}
  produtos={products}
  marcas={marcasDisponiveis}
  marcaSelecionada={marcaSelecionada}
  setMarcaSelecionada={setMarcaSelecionada}
  categorias={categoriasDisponiveis}
  categoriaSelecionada={categoriaSelecionada}
  setCategoriaSelecionada={setCategoriaSelecionada}
  cores={coresDisponiveis}
  corSelecionada={corSelecionada}
  setCorSelecionada={setCorSelecionada}
  quantidadeResultados={quantidadeResultados}
  limparFiltros={limparFiltros}
/>

    
          {/* ================= PRODUTOS ================= */}

          <div>
            {loading ? (

              <div className="flex h-80 items-center justify-center text-lg text-[#F3E8D7]/60">
                Carregando produtos...
              </div>

            ) : produtosFiltrados.length > 0 ? (

              <>

                <div className="mb-8 flex items-center justify-between">

                  <div>

                    <h3 className="text-2xl font-bold">
                      Produtos
                    </h3>

                    <p className="mt-1 text-sm text-[#F3E8D7]/60">
                      {quantidadeResultados} produtos encontrados
                    </p>

                  </div>

                  <select
                    className="rounded-xl border border-[#C8A95B]/20 bg-[#181818] px-4 py-3 text-sm outline-none"
                  >
                    <option>
                      Mais recentes
                    </option>

                    <option>
                      Menor preço
                    </option>

                    <option>
                      Maior preço
                    </option>

                    <option>
                      Ordem alfabética
                    </option>

                  </select>

                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                  {produtosFiltrados.map(
                    (produto) => (

                      <ProductCard
                        key={produto.id}
                        produto={produto}
                      />

                    )
                  )}

                </div>

              </>

            ) : (

              <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] py-24 text-center">

                <div className="text-6xl">
                  🔍
                </div>

                <h3 className="mt-6 text-3xl font-bold">
                  Nenhum produto encontrado
                </h3>

                <p className="mt-4 text-[#F3E8D7]/60">
                  Tente alterar os filtros ou limpar a pesquisa.
                </p>

                <button
                  onClick={limparFiltros}
                  className="mt-8 rounded-full bg-[#C8A95B] px-8 py-4 font-bold text-[#111111]"
                >
                  Mostrar todos
                </button>

              </div>

            )}

          </div>

        </div>

      </section>
      {/* ================= BENEFÍCIOS ================= */}

      <section className="border-y border-[#C8A95B]/15 bg-[#151515]">

        <div className="mx-auto grid max-w-[1600px] gap-6 px-6 py-16 md:grid-cols-3">

          <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8">

            <div className="text-4xl">
              ✨
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Elegância
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#F3E8D7]/60">
              Produtos escolhidos para mulheres que valorizam conforto,
              qualidade e sofisticação em cada detalhe.
            </p>

          </div>

          <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8">

            <div className="text-4xl">
              💬
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Atendimento Personalizado
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#F3E8D7]/60">
              Tire dúvidas e finalize sua compra diretamente pelo WhatsApp
              com atendimento rápido e humanizado.
            </p>

          </div>

          <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8">

            <div className="text-4xl">
              🚚
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Compra Segura
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#F3E8D7]/60">
              Processo simples, seguro e acompanhado do início ao fim.
            </p>

          </div>

        </div>

      </section>

      {/* ================= SOBRE ================= */}

      <section
        id="sobre"
        className="mx-auto max-w-6xl px-6 py-16 text-center"
      >

        <p className="text-sm uppercase tracking-[0.35em] text-[#C8A95B]">
          Sobre a MTelles
        </p>

        <h2 className="mt-5 text-4xl font-bold">
          Elegância em cada passo.
        </h2>

        <p className="mx-auto mt-6 max-w-3xl leading-8 text-[#F3E8D7]/60">
          A MTelles nasceu para oferecer calçados femininos modernos,
          elegantes e confortáveis, proporcionando uma experiência de compra
          premium desde a escolha do produto até o atendimento.
        </p>

      </section>

      {/* ================= FOOTER ================= */}

      <Footer />

    </main>
  );
}

      