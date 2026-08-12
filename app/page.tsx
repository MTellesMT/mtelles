"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Footer from "@/components/Footer";
import Hero from "@/components/hero";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import AvaliacoesClientes from "@/components/AvaliacoesClientes";

import { registrarAcessoSite } from "@/services/acessos";
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
    // Pode estar separado por vírgulas.
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
  const carrosselMaisVendidos =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    filtrosMobileAbertos,
    setFiltrosMobileAbertos,
  ] = useState(false);

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

  /*
   * NAVEGAÇÃO MAIS VENDIDOS
   */

  function navegarMaisVendidos(
    direcao: "esquerda" | "direita"
  ) {
    const carrossel =
      carrosselMaisVendidos.current;

    if (!carrossel) {
      return;
    }

    const distancia =
      Math.max(
        300,
        carrossel.clientWidth * 0.8
      );

    carrossel.scrollBy({
      left:
        direcao === "direita"
          ? distancia
          : -distancia,
      behavior: "smooth",
    });
  }

  /*
   * REGISTRAR ACESSO
   */

  useEffect(() => {
    async function registrarAcesso() {
      try {
        await registrarAcessoSite();
      } catch (error) {
        console.error(
          "Erro ao registrar acesso ao site:",
          error
        );
      }
    }

    registrarAcesso();
  }, []);

  /*
   * BLOQUEAR SCROLL QUANDO
   * FILTRO MOBILE ESTIVER ABERTO
   */

  useEffect(() => {
    if (
      !filtrosMobileAbertos
    ) {
      return;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [filtrosMobileAbertos]);

  /*
   * RECEBER PESQUISA DO HEADER
   */

  useEffect(() => {
    function receberPesquisa(
      event: Event
    ) {
      const evento =
        event as CustomEvent<{
          busca: string;
        }>;

      const pesquisa =
        evento.detail?.busca?.trim();

      if (!pesquisa) {
        return;
      }

      setMarcaSelecionada(
        OPCAO_TODAS
      );

      setCategoriaSelecionada(
        OPCAO_TODAS
      );

      setCorSelecionada(
        OPCAO_TODAS
      );

      setBusca(pesquisa);
    }

    window.addEventListener(
      "mtelles-pesquisar",
      receberPesquisa
    );

    return () => {
      window.removeEventListener(
        "mtelles-pesquisar",
        receberPesquisa
      );
    };
  }, []);

  /*
   * CARREGAR PRODUTOS
   */

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
   */

  const produtosMaisVendidos =
    useMemo(() => {
      return produtosAtivos.filter(
        (produto) =>
          produto.mais_vendido
      );
    }, [produtosAtivos]);

  /*
   * MARCAS
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
   * CATEGORIAS
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
   * CORES
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
   * QUANTIDADE DE FILTROS ATIVOS
   */

  const quantidadeFiltrosAtivos =
    useMemo(() => {
      let quantidade = 0;

      if (
        marcaSelecionada !==
        OPCAO_TODAS
      ) {
        quantidade++;
      }

      if (
        categoriaSelecionada !==
        OPCAO_TODAS
      ) {
        quantidade++;
      }

      if (
        corSelecionada !==
        OPCAO_TODAS
      ) {
        quantidade++;
      }

      return quantidade;
    }, [
      marcaSelecionada,
      categoriaSelecionada,
      corSelecionada,
    ]);

  /*
   * VALIDAR MARCA
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
   * VALIDAR CATEGORIA
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
   * VALIDAR COR
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

    if (
      typeof window !==
      "undefined"
    ) {
      window.history.replaceState(
        {},
        "",
        window.location.pathname +
          window.location.hash
      );
    }
  }

  /*
   * FILTRAGEM
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
   * ORDENAÇÃO
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

  /*
   * ORGANIZAR POR CATEGORIA
   */

  const produtosPorCategoria =
    useMemo(() => {
      const grupos = new Map<
        string,
        {
          nome: string;
          produtos: Product[];
        }
      >();

      produtosOrdenados.forEach(
        (produto) => {
          const nomeCategoria =
            produto.categoria?.trim() ||
            "Outros";

          const chave =
            normalizar(
              nomeCategoria
            ) || "outros";

          const grupoExistente =
            grupos.get(chave);

          if (grupoExistente) {
            grupoExistente.produtos.push(
              produto
            );

            return;
          }

          grupos.set(chave, {
            nome: nomeCategoria,
            produtos: [produto],
          });
        }
      );

      return Array.from(
        grupos.values()
      ).sort((grupoA, grupoB) =>
        grupoA.nome.localeCompare(
          grupoB.nome,
          "pt-BR",
          {
            sensitivity: "base",
          }
        )
      );
    }, [produtosOrdenados]);

  const quantidadeResultados =
    produtosOrdenados.length;

  /*
   * PESQUISA
   */

  useEffect(() => {
    if (
      loading ||
      !busca.trim()
    ) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        const primeiroProduto =
          document.querySelector(
            "[data-produto-pesquisa]"
          );

        if (primeiroProduto) {
          primeiroProduto.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          return;
        }

        const colecao =
          document.getElementById(
            "colecao"
          );

        colecao?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

    return () =>
      window.clearTimeout(timer);
  }, [
    busca,
    loading,
    produtosOrdenados,
  ]);

  return (
    <>
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

                <div className="relative">
                  {/* SETA ESQUERDA */}

                  <button
                    type="button"
                    onClick={() =>
                      navegarMaisVendidos(
                        "esquerda"
                      )
                    }
                    aria-label="Ver produtos anteriores"
                    className="absolute left-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#C8A95B]/40 bg-[#111111]/90 text-2xl font-bold text-[#C8A95B] shadow-xl backdrop-blur-md transition hover:border-[#C8A95B] hover:bg-[#C8A95B] hover:text-[#111111] lg:flex"
                  >
                    ‹
                  </button>

                  {/* CARROSSEL */}

                  <div
                    ref={
                      carrosselMaisVendidos
                    }
                    className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:gap-6 sm:px-6 lg:mx-0 lg:px-2"
                  >
                    {produtosMaisVendidos.map(
                      (produto) => (
                        <div
                          key={
                            produto.id
                          }
                          className="relative w-[82vw] max-w-[330px] flex-none snap-start sm:w-[300px] sm:max-w-[300px] lg:w-[320px] lg:max-w-[320px] xl:w-[340px] xl:max-w-[340px]"
                        >
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

                  {/* SETA DIREITA */}

                  <button
                    type="button"
                    onClick={() =>
                      navegarMaisVendidos(
                        "direita"
                      )
                    }
                    aria-label="Ver próximos produtos"
                    className="absolute right-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#C8A95B]/40 bg-[#111111]/90 text-2xl font-bold text-[#C8A95B] shadow-xl backdrop-blur-md transition hover:border-[#C8A95B] hover:bg-[#C8A95B] hover:text-[#111111] lg:flex"
                  >
                    ›
                  </button>
                </div>
              </div>
            </section>
          )}

        {/* CATÁLOGO */}

        <section
          id="colecao"
          className="relative isolate scroll-mt-24 bg-[#111111]"
        >
          <div className="mx-auto w-full max-w-[1700px] px-4 py-10 sm:px-6 sm:py-20">
            <header className="mb-6 sm:mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C8A95B] sm:text-sm sm:tracking-[0.35em]">
                Nossa coleção
              </p>

              <h2 className="mt-3 max-w-4xl text-3xl font-black leading-tight sm:mt-4 sm:text-4xl lg:text-5xl">
                Encontre seu próximo par
              </h2>
            </header>

            <div className="block lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-8">
              {/* FILTROS */}

              <div className="relative z-10 mb-5 w-full lg:sticky lg:top-6 lg:mb-0">
                {/* MOBILE */}

                <div className="lg:hidden">
                  <div className="flex items-center gap-2 rounded-2xl border border-[#C8A95B]/20 bg-[#151515] p-2 shadow-lg shadow-black/10">
                    <button
                      type="button"
                      onClick={() =>
                        setFiltrosMobileAbertos(
                          true
                        )
                      }
                      className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                        quantidadeFiltrosAtivos >
                        0
                          ? "border-[#C8A95B] bg-[#C8A95B]/10 text-[#C8A95B]"
                          : "border-transparent bg-[#1d1d1d] text-white"
                      }`}
                    >
                      <span className="text-base">
                        ☰
                      </span>

                      <span>
                        Filtros
                      </span>

                      {quantidadeFiltrosAtivos >
                        0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C8A95B] px-1.5 text-[10px] font-black text-[#111111]">
                          {
                            quantidadeFiltrosAtivos
                          }
                        </span>
                      )}
                    </button>

                    <div className="relative min-w-0 flex-1">
                      <select
                        aria-label="Ordenar produtos"
                        value={ordenacao}
                        onChange={(
                          event
                        ) =>
                          setOrdenacao(
                            event.target
                              .value as TipoOrdenacao
                          )
                        }
                        className="w-full appearance-none rounded-xl border border-transparent bg-[#1d1d1d] px-4 py-3 pr-9 text-center text-sm font-bold text-white outline-none transition focus:border-[#C8A95B]"
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
                          A-Z
                        </option>
                      </select>

                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#C8A95B]">
                        ▾
                      </span>
                    </div>
                  </div>
                </div>

                {/* DESKTOP */}

                <div className="hidden lg:block">
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
              </div>

              {/* PRODUTOS */}

              <div className="relative z-0 min-w-0">
                {loading ? (
                  <div className="flex min-h-80 items-center justify-center rounded-3xl border border-[#C8A95B]/15 bg-[#181818] px-6 text-center text-lg text-[#F3E8D7]/60">
                    Carregando produtos...
                  </div>
                ) : produtosOrdenados.length >
                  0 ? (
                  <>
                    <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#C8A95B]/15 bg-[#151515] px-4 py-4 sm:mb-8 sm:rounded-3xl sm:p-6">
                      <div>
                        <h3 className="text-lg font-bold sm:text-2xl">
                          Produtos
                        </h3>

                        <p className="mt-1 text-xs text-[#F3E8D7]/60 sm:text-sm">
                          {
                            quantidadeResultados
                          }{" "}
                          {quantidadeResultados ===
                          1
                            ? "produto encontrado"
                            : "produtos encontrados"}
                        </p>
                      </div>

                      {/* ORDENAÇÃO DESKTOP */}

                      <select
                        aria-label="Ordenar produtos"
                        value={ordenacao}
                        onChange={(
                          event
                        ) =>
                          setOrdenacao(
                            event.target
                              .value as TipoOrdenacao
                          )
                        }
                        className="hidden rounded-xl border border-[#C8A95B]/20 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C8A95B] lg:block"
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
                                        {/* CATEGORIAS */}

                    <div className="space-y-12 sm:space-y-14">
                      {produtosPorCategoria.map(
                        (grupo) => (
                          <section
                            key={normalizar(
                              grupo.nome
                            )}
                            className="min-w-0"
                          >
                            <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#C8A95B]/15 pb-3 sm:mb-6 sm:pb-4">
                              <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C8A95B]/70 sm:text-[10px]">
                                  Categoria
                                </p>

                                <h3 className="mt-1.5 text-xl font-black text-white sm:mt-2 sm:text-3xl">
                                  {
                                    grupo.nome
                                  }
                                </h3>
                              </div>

                              <p className="shrink-0 text-xs text-[#F3E8D7]/45 sm:text-sm">
                                {
                                  grupo.produtos
                                    .length
                                }{" "}
                                {grupo.produtos
                                  .length ===
                                1
                                  ? "produto"
                                  : "produtos"}
                              </p>
                            </div>

                            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 lg:snap-none xl:grid-cols-3 2xl:grid-cols-4">
                              {grupo.produtos.map(
                                (
                                  produto
                                ) => (
                                  <div
                                    key={
                                      produto.id
                                    }
                                    data-produto-pesquisa
                                    className="relative w-[82vw] max-w-[330px] flex-none snap-start scroll-mt-28 sm:w-[46vw] sm:max-w-none lg:w-auto lg:min-w-0"
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
                          </section>
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
                      Nenhum produto encontrado
                    </h3>

                    <p className="mx-auto mt-4 max-w-xl leading-7 text-[#F3E8D7]/60">
                      Tente alterar os filtros
                      ou limpar a pesquisa para
                      visualizar novamente todos
                      os produtos.
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

        {/* AVALIAÇÕES */}

        <AvaliacoesClientes />

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

      {/* PAINEL DE FILTROS MOBILE */}

      {filtrosMobileAbertos && (
        <>
          <div
            className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm lg:hidden"
            onClick={() =>
              setFiltrosMobileAbertos(
                false
              )
            }
          />

          <div className="fixed inset-x-0 bottom-0 z-[210] max-h-[85dvh] overflow-y-auto rounded-t-[28px] border-t border-[#C8A95B]/30 bg-[#151515] text-white shadow-[0_-25px_80px_rgba(0,0,0,.6)] lg:hidden">
            {/* TOPO */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#C8A95B]/15 bg-[#151515] px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black">
                    Filtros
                  </h2>

                  {quantidadeFiltrosAtivos >
                    0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C8A95B] px-1.5 text-[10px] font-black text-[#111111]">
                      {
                        quantidadeFiltrosAtivos
                      }
                    </span>
                  )}
                </div>

                <p className="mt-0.5 text-xs text-[#F3E8D7]/45">
                  Refine sua busca
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFiltrosMobileAbertos(
                    false
                  )
                }
                aria-label="Fechar filtros"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C8A95B]/20 text-2xl text-[#C8A95B]"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 px-5 py-5">
              {/* BUSCA */}

              <div>
                <label
                  htmlFor="busca-mobile"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-[#C8A95B]"
                >
                  Buscar
                </label>

                <input
                  id="busca-mobile"
                  type="search"
                  value={busca}
                  onChange={(
                    event
                  ) =>
                    setBusca(
                      event.target
                        .value
                    )
                  }
                  placeholder="Nome, marca ou código..."
                  className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3.5 text-sm text-white outline-none placeholder:text-[#F3E8D7]/25 focus:border-[#C8A95B]"
                />
              </div>

              {/* MARCA */}

              <div>
                <label
                  htmlFor="marca-mobile"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-[#C8A95B]"
                >
                  Marca
                </label>

                <select
                  id="marca-mobile"
                  value={
                    marcaSelecionada
                  }
                  onChange={(
                    event
                  ) =>
                    setMarcaSelecionada(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3.5 text-sm text-white outline-none focus:border-[#C8A95B]"
                >
                  {marcasDisponiveis.map(
                    (marca) => (
                      <option
                        key={
                          marca
                        }
                        value={
                          marca
                        }
                      >
                        {marca}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* CATEGORIA */}

              <div>
                <label
                  htmlFor="categoria-mobile"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-[#C8A95B]"
                >
                  Categoria
                </label>

                <select
                  id="categoria-mobile"
                  value={
                    categoriaSelecionada
                  }
                  onChange={(
                    event
                  ) =>
                    setCategoriaSelecionada(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3.5 text-sm text-white outline-none focus:border-[#C8A95B]"
                >
                  {categoriasDisponiveis.map(
                    (
                      categoria
                    ) => (
                      <option
                        key={
                          categoria
                        }
                        value={
                          categoria
                        }
                      >
                        {
                          categoria
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* COR */}

              <div>
                <label
                  htmlFor="cor-mobile"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-[#C8A95B]"
                >
                  Cor
                </label>

                <select
                  id="cor-mobile"
                  value={
                    corSelecionada
                  }
                  onChange={(
                    event
                  ) =>
                    setCorSelecionada(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3.5 text-sm text-white outline-none focus:border-[#C8A95B]"
                >
                  {coresDisponiveis.map(
                    (cor) => (
                      <option
                        key={cor}
                        value={cor}
                      >
                        {cor}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* RESULTADO */}

              <div className="flex items-center justify-between rounded-xl border border-[#C8A95B]/15 bg-[#111111] px-4 py-3">
                <span className="text-sm text-[#F3E8D7]/55">
                  Resultados
                </span>

                <span className="font-black text-[#C8A95B]">
                  {
                    quantidadeResultados
                  }
                </span>
              </div>
            </div>

            {/* AÇÕES */}

            <div className="sticky bottom-0 border-t border-[#C8A95B]/15 bg-[#111111] px-5 py-4">
              <div className="grid grid-cols-[0.9fr_1.1fr] gap-3">
                <button
                  type="button"
                  onClick={
                    limparFiltros
                  }
                  className="rounded-full border border-[#C8A95B]/30 px-4 py-3 text-sm font-bold text-[#C8A95B]"
                >
                  Limpar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFiltrosMobileAbertos(
                      false
                    )
                  }
                  className="rounded-full bg-[#C8A95B] px-4 py-3 text-sm font-black text-[#111111]"
                >
                  Ver{" "}
                  {
                    quantidadeResultados
                  }{" "}
                  {quantidadeResultados ===
                  1
                    ? "produto"
                    : "produtos"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}