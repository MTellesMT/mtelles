"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Footer from "@/components/Footer";
import Hero from "@/components/hero";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

import { getProducts } from "@/services/products";
import { Product } from "@/types/product";

const OPCAO_TODAS = "Todas";

type TipoOrdenacao =
  | "recentes"
  | "menor-preco"
  | "maior-preco"
  | "alfabetica";

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
  if (!valor) {
    return [];
  }

  try {
    const convertido = JSON.parse(valor);

    if (Array.isArray(convertido)) {
      return convertido
        .map((item) =>
          String(item).trim()
        )
        .filter(Boolean);
    }
  } catch {
    // O campo também pode conter valores
    // separados por vírgulas.
  }

  return valor
    .split(/[,;\n|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function criarListaUnica(
  valores: string[]
) {
  const mapa = new Map<
    string,
    string
  >();

  valores.forEach((valor) => {
    const valorLimpo =
      String(valor ?? "").trim();

    const chave =
      normalizar(valorLimpo);

    if (
      valorLimpo &&
      chave &&
      !mapa.has(chave)
    ) {
      mapa.set(
        chave,
        valorLimpo
      );
    }
  });

  return Array.from(
    mapa.values()
  ).sort((valorA, valorB) =>
    valorA.localeCompare(
      valorB,
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

  const [
    ordenacao,
    setOrdenacao,
  ] =
    useState<TipoOrdenacao>(
      "recentes"
    );

  useEffect(() => {
    async function carregarProdutos() {
      try {
        setLoading(true);

        const dados =
          await getProducts();

        setProducts(dados);
      } catch (error) {
        console.error(
          "Erro ao carregar produtos:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, []);

  /*
   * PRODUTOS ATIVOS
   */

  const produtosAtivos =
    useMemo(() => {
      return products.filter(
        (produto) =>
          produto.ativo
      );
    }, [products]);

  /*
   * MAIS VENDIDOS
   *
   * A seleção é manual através do campo
   * mais_vendido cadastrado no produto.
   *
   * Apenas produtos ativos aparecem aqui.
   */

  const produtosMaisVendidos =
    useMemo(() => {
      return produtosAtivos.filter(
        (produto) =>
          produto.mais_vendido
      );
    }, [produtosAtivos]);

  /*
   * MARCAS DINÂMICAS
   */

  const marcasDisponiveis =
    useMemo(() => {
      const marcas =
        produtosAtivos.map(
          (produto) =>
            produto.marca
        );

      return [
        OPCAO_TODAS,
        ...criarListaUnica(
          marcas
        ),
      ];
    }, [produtosAtivos]);

  /*
   * CATEGORIAS DINÂMICAS
   */

  const categoriasDisponiveis =
    useMemo(() => {
      const categorias =
        produtosAtivos.map(
          (produto) =>
            produto.categoria
        );

      return [
        OPCAO_TODAS,
        ...criarListaUnica(
          categorias
        ),
      ];
    }, [produtosAtivos]);

  /*
   * CORES DINÂMICAS
   */

  const coresDisponiveis =
    useMemo(() => {
      const cores =
        produtosAtivos.flatMap(
          (produto) =>
            transformarEmLista(
              produto.cores
            )
        );

      return [
        OPCAO_TODAS,
        ...criarListaUnica(
          cores
        ),
      ];
    }, [produtosAtivos]);

  /*
   * GARANTE QUE UMA MARCA REMOVIDA
   * NÃO CONTINUE SELECIONADA
   */

  useEffect(() => {
    const marcaAindaExiste =
      marcasDisponiveis.some(
        (marca) =>
          normalizar(marca) ===
          normalizar(
            marcaSelecionada
          )
      );

    if (!marcaAindaExiste) {
      setMarcaSelecionada(
        OPCAO_TODAS
      );
    }
  }, [
    marcasDisponiveis,
    marcaSelecionada,
  ]);

  /*
   * GARANTE QUE UMA CATEGORIA REMOVIDA
   * NÃO CONTINUE SELECIONADA
   */

  useEffect(() => {
    const categoriaAindaExiste =
      categoriasDisponiveis.some(
        (categoria) =>
          normalizar(
            categoria
          ) ===
          normalizar(
            categoriaSelecionada
          )
      );

    if (!categoriaAindaExiste) {
      setCategoriaSelecionada(
        OPCAO_TODAS
      );
    }
  }, [
    categoriasDisponiveis,
    categoriaSelecionada,
  ]);

  /*
   * GARANTE QUE UMA COR REMOVIDA
   * NÃO CONTINUE SELECIONADA
   */

  useEffect(() => {
    const corAindaExiste =
      coresDisponiveis.some(
        (cor) =>
          normalizar(cor) ===
          normalizar(
            corSelecionada
          )
      );

    if (!corAindaExiste) {
      setCorSelecionada(
        OPCAO_TODAS
      );
    }
  }, [
    coresDisponiveis,
    corSelecionada,
  ]);

  /*
   * LIMPAR FILTROS
   */

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

  /*
   * FILTRAGEM DO CATÁLOGO
   */

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

        

          const coresTexto =
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
            
            coresTexto.includes(
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
            ).map((cor) =>
              normalizar(cor)
            );

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

  /*
   * ORDENAÇÃO DO CATÁLOGO
   */

  const produtosOrdenados =
    useMemo(() => {
      const lista = [
        ...produtosFiltrados,
      ];

      if (
        ordenacao ===
        "menor-preco"
      ) {
        return lista.sort(
          (produtoA, produtoB) =>
            Number(
              produtoA.preco
            ) -
            Number(
              produtoB.preco
            )
        );
      }

      if (
        ordenacao ===
        "maior-preco"
      ) {
        return lista.sort(
          (produtoA, produtoB) =>
            Number(
              produtoB.preco
            ) -
            Number(
              produtoA.preco
            )
        );
      }

      if (
        ordenacao ===
        "alfabetica"
      ) {
        return lista.sort(
          (produtoA, produtoB) =>
            produtoA.nome.localeCompare(
              produtoB.nome,
              "pt-BR",
              {
                sensitivity:
                  "base",
              }
            )
        );
      }

      /*
       * MAIS RECENTES
       */

      return lista.sort(
        (produtoA, produtoB) => {
          const dataA =
            produtoA.created_at
              ? new Date(
                  produtoA.created_at
                ).getTime()
              : produtoA.id;

          const dataB =
            produtoB.created_at
              ? new Date(
                  produtoB.created_at
                ).getTime()
              : produtoB.id;

          return dataB - dataA;
        }
      );
    }, [
      produtosFiltrados,
      ordenacao,
    ]);

  const quantidadeResultados =
    produtosOrdenados.length;

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {/* HERO */}

      <Hero
        produtos={products}
        loading={loading}
      />

      {/* MAIS VENDIDOS */}

      {!loading &&
        produtosMaisVendidos.length >
          0 && (
          <section
            id="mais-vendidos"
            className="relative border-b border-[#C8A95B]/15 bg-[#151515]"
          >
            <div className="mx-auto w-full max-w-[1700px] px-4 py-14 sm:px-6 sm:py-20">
              {/* CABEÇALHO */}

              <header className="mb-10 flex flex-col gap-5 sm:mb-12 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C8A95B] sm:text-sm sm:tracking-[0.35em]">
                    Os favoritos
                  </p>

                  <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                    Mais vendidos
                  </h2>

                  <p className="mt-4 max-w-2xl leading-7 text-[#F3E8D7]/60">
                    Conheça os modelos que
                    estão entre os favoritos
                    da MTelles.
                  </p>
                </div>

                <a
                  href="#colecao"
                  className="inline-flex w-fit items-center justify-center rounded-full border border-[#C8A95B]/30 px-6 py-3 text-sm font-bold text-[#C8A95B] transition hover:bg-[#C8A95B] hover:text-[#111111]"
                >
                  Ver coleção completa
                </a>
              </header>

              {/* PRODUTOS */}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {produtosMaisVendidos.map(
                  (produto) => (
                    <div
                      key={
                        produto.id
                      }
                      className="relative min-w-0"
                    >
                      {/* SELO */}

                      <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full border border-[#C8A95B]/40 bg-[#111111]/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#C8A95B] shadow-lg backdrop-blur-md">
                        Mais vendido
                      </div>

                      <ProductCard
                        produto={
                          produto
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        )}

      {/* CATÁLOGO */}

      <section
        id="colecao"
        className="relative isolate bg-[#111111]"
      >
        <div className="mx-auto w-full max-w-[1700px] px-4 py-14 sm:px-6 sm:py-20">
          {/* TÍTULO DO CATÁLOGO */}

          <header className="mb-10 sm:mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C8A95B] sm:text-sm sm:tracking-[0.35em]">
              Nossa coleção
            </p>

            <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Encontre seu próximo par
            </h2>
          </header>

          {/*
            MOBILE:
            Os filtros ficam no fluxo normal da página.

            DESKTOP:
            A partir de lg, filtros e produtos
            ficam em duas colunas.
          */}

          <div className="block lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-8">
            {/* ÁREA DOS FILTROS */}

            <div className="relative z-10 mb-10 w-full lg:sticky lg:top-6 lg:mb-0">
              <SearchBar
                busca={busca}
                setBusca={setBusca}
                produtos={products}
                marcas={
                  marcasDisponiveis
                }
                marcaSelecionada={
                  marcaSelecionada
                }
                setMarcaSelecionada={
                  setMarcaSelecionada
                }
                categorias={
                  categoriasDisponiveis
                }
                categoriaSelecionada={
                  categoriaSelecionada
                }
                setCategoriaSelecionada={
                  setCategoriaSelecionada
                }
                cores={
                  coresDisponiveis
                }
                corSelecionada={
                  corSelecionada
                }
                setCorSelecionada={
                  setCorSelecionada
                }
                quantidadeResultados={
                  quantidadeResultados
                }
                limparFiltros={
                  limparFiltros
                }
              />
            </div>

            {/* ÁREA DOS PRODUTOS */}

            <div className="relative z-0 min-w-0">
              {loading ? (
                <div className="flex min-h-80 items-center justify-center rounded-3xl border border-[#C8A95B]/15 bg-[#181818] px-6 text-center text-lg text-[#F3E8D7]/60">
                  Carregando produtos...
                </div>
              ) : produtosOrdenados.length >
                0 ? (
                <>
                  {/* CABEÇALHO DOS RESULTADOS */}

                  <div className="mb-8 flex flex-col gap-5 rounded-3xl border border-[#C8A95B]/15 bg-[#151515] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                      <h3 className="text-2xl font-bold">
                        Produtos
                      </h3>

                      <p className="mt-1 text-sm text-[#F3E8D7]/60">
                        {
                          quantidadeResultados
                        }{" "}
                        {quantidadeResultados ===
                        1
                          ? "produto encontrado"
                          : "produtos encontrados"}
                      </p>
                    </div>

                    <select
                      aria-label="Ordenar produtos"
                      value={
                        ordenacao
                      }
                      onChange={(
                        event
                      ) =>
                        setOrdenacao(
                          event
                            .target
                            .value as TipoOrdenacao
                        )
                      }
                      className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C8A95B] sm:w-auto"
                    >
                      <option value="recentes">
                        Mais recentes
                      </option>

                      <option value="menor-preco">
                        Menor preço
                      </option>

                      <option value="maior-preco">
                        Maior preço
                      </option>

                      <option value="alfabetica">
                        Ordem alfabética
                      </option>
                    </select>
                  </div>

                  {/* GRID DOS PRODUTOS */}

                  <div className="relative grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {produtosOrdenados.map(
                      (produto) => (
                        <div
                          key={
                            produto.id
                          }
                          className="relative min-w-0"
                        >
                          <ProductCard
                            produto={
                              produto
                            }
                          />
                        </div>
                      )
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] px-5 py-20 text-center sm:px-8 sm:py-24">
                  <div className="text-6xl">
                    🔍
                  </div>

                  <h3 className="mt-6 text-2xl font-bold sm:text-3xl">
                    Nenhum produto
                    encontrado
                  </h3>

                  <p className="mx-auto mt-4 max-w-xl leading-7 text-[#F3E8D7]/60">
                    Tente alterar os
                    filtros ou limpar a
                    pesquisa para visualizar
                    novamente todos os
                    produtos.
                  </p>

                  <button
                    type="button"
                    onClick={
                      limparFiltros
                    }
                    className="mt-8 rounded-full bg-[#C8A95B] px-8 py-4 font-bold text-[#111111] transition hover:bg-[#e3c46f]"
                  >
                    Mostrar todos
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}

      <section className="relative border-y border-[#C8A95B]/15 bg-[#151515]">
        <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-14 sm:px-6 sm:py-16 md:grid-cols-3">
          <article className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-7 sm:p-8">
            <div className="text-4xl">
              ✨
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Elegância
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#F3E8D7]/60">
              Produtos escolhidos para
              mulheres que valorizam
              conforto, qualidade e
              sofisticação em cada detalhe.
            </p>
          </article>

          <article className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-7 sm:p-8">
            <div className="text-4xl">
              💬
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Atendimento personalizado
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#F3E8D7]/60">
              Tire dúvidas e finalize sua
              compra diretamente pelo
              WhatsApp com atendimento
              rápido e humanizado.
            </p>
          </article>

          <article className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-7 sm:p-8">
            <div className="text-4xl">
              🚚
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Compra segura
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#F3E8D7]/60">
              Processo simples, seguro e
              acompanhado do início ao fim.
            </p>
          </article>
        </div>
      </section>

      {/* SOBRE */}

      <section
        id="sobre"
        className="relative mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-16"
      >
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C8A95B] sm:text-sm sm:tracking-[0.35em]">
          Sobre a MTelles
        </p>

        <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
          Elegância em cada passo.
        </h2>

        <p className="mx-auto mt-6 max-w-3xl leading-8 text-[#F3E8D7]/60">
          A MTelles nasceu para oferecer
          calçados femininos modernos,
          elegantes e confortáveis,
          proporcionando uma experiência de
          compra premium desde a escolha do
          produto até o atendimento.
        </p>
      </section>

      {/* FOOTER */}

      <Footer />
    </main>
  );
}