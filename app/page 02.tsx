"use client";

import { useEffect, useMemo, useState } from "react";

import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/services/products";
import { Product } from "@/types/product";

const whatsapp = "5521966682941";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
const produtosDestaque = useMemo(() => {
  return products.filter((produto) => produto.em_destaque);
}, [products]);

const bannerPrincipal =
  produtosDestaque.length > 0
    ? produtosDestaque[0]
    : products[0];
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      setLoading(true);

      const dados = await getProducts();

      setProducts(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const produtosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return products.filter((produto) => {
      const correspondeBusca =
        produto.nome.toLowerCase().includes(termo) ||
        produto.codigo.toLowerCase().includes(termo) ||
        produto.marca.toLowerCase().includes(termo) ||
        produto.categoria.toLowerCase().includes(termo);

      const correspondeFiltro =
        filtro === "Todos" ||
        produto.categoria.toLowerCase() === filtro.toLowerCase();

      return correspondeBusca && correspondeFiltro;
    });
  }, [products, busca, filtro]);

  const produtoDestaque = bannerPrincipal;
const produtosEmDestaque = useMemo(() => {
  return products.filter((produto) => produto.em_destaque);
}, [products]);

const outrosProdutos = useMemo(() => {
  return produtosFiltrados.filter(
    (produto) => produto.id !== produtoDestaque?.id
  );
}, [produtosFiltrados, produtoDestaque]);
  return (
    <main className="min-h-screen bg-[#111111] text-white">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b border-[#C8A95B]/20 bg-[#111111]/95 backdrop-blur">

        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-4">

          <a href="#inicio" className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C8A95B] text-lg font-bold text-[#C8A95B]">
              MT
            </div>

            <div>

              <h1 className="text-xl font-semibold tracking-[0.18em] text-[#C8A95B]">
                MTELLES
              </h1>

              <p className="text-xs text-[#F3E8D7]/70">
                Elegância em cada passo
              </p>

            </div>

          </a>

          <nav className="hidden gap-7 text-sm md:flex">

            <a href="#inicio" className="hover:text-[#C8A95B] transition">
              Início
            </a>

            <a href="#colecao" className="hover:text-[#C8A95B] transition">
              Coleção
            </a>

            <a href="#sobre" className="hover:text-[#C8A95B] transition">
              Sobre
            </a>

          </nav>

          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#C8A95B] px-6 py-3 font-semibold text-[#111111] transition hover:scale-105 hover:bg-[#e3c46f]"
          >
            WhatsApp
          </a>

        </div>

      </header>

      {/* ================= HERO ================= */}

      <section
        id="inicio"
        className="relative overflow-hidden border-b border-[#C8A95B]/15"
      >

        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#C8A95B]/10 blur-[150px]" />

        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#C8A95B]/10 blur-[120px]" />

<div className="relative mx-auto grid max-w-[1600px] items-center gap-24 px-8 py-28 lg:grid-cols-2">

          {/* TEXTO */}
          <div>

            <span className="inline-block rounded-full border border-[#C8A95B]/30 bg-[#C8A95B]/10 px-5 py-2 text-sm tracking-[0.2em] text-[#C8A95B]">
              NOVA COLEÇÃO
            </span>

            <h2 className="mt-8 text-5xl font-bold leading-tight md:text-7xl">
              Elegância para mulheres que deixam sua marca.
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#F3E8D7]/70">
              Descubra modelos exclusivos da MTelles que unem sofisticação,
              conforto e personalidade para acompanhar você em qualquer ocasião.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <a
                href="#colecao"
                className="rounded-full bg-[#C8A95B] px-8 py-4 font-semibold text-[#111111] transition hover:scale-105"
              >
                Comprar Agora
              </a>

              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#C8A95B] px-8 py-4 font-semibold text-[#C8A95B] transition hover:bg-[#C8A95B] hover:text-[#111111]"
              >
                Atendimento
              </a>

            </div>

            <div className="mt-12 flex flex-wrap gap-10">

              <div>

                <h3 className="text-3xl font-bold text-[#C8A95B]">
                  +500
                </h3>

                <p className="text-[#F3E8D7]/60">
                  Clientes atendidas
                </p>

              </div>

              <div>

                <h3 className="text-3xl font-bold text-[#C8A95B]">
                  ★ 4.9
                </h3>

                <p className="text-[#F3E8D7]/60">
                  Avaliação média
                </p>

              </div>

              <div>

                <h3 className="text-3xl font-bold text-[#C8A95B]">
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

            <div className="absolute inset-0 rounded-[45px] bg-gradient-to-br from-[#C8A95B]/20 to-transparent blur-3xl" />

            <div className="relative overflow-hidden rounded-[40px] border border-[#C8A95B]/20 bg-[#1a1a1a] shadow-2xl">

              {produtoDestaque ? (

                <>
                  <img
                    src={produtoDestaque.imagem_principal}
                    alt={produtoDestaque.nome}
                    className="h-[620px] w-full object-cover transition duration-500 hover:scale-105"
                  />

                  <div className="absolute left-6 top-6 rounded-full bg-[#C8A95B] px-5 py-2 text-sm font-semibold text-[#111111]">
                    MAIS VENDIDO
                  </div>

                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent p-8">

                    <p className="text-sm uppercase tracking-[0.25em] text-[#C8A95B]">
                      {produtoDestaque.marca}
                    </p>

                    <h3 className="mt-2 text-3xl font-semibold">
                      {produtoDestaque.nome}
                    </h3>

                    <p className="mt-2 text-2xl font-bold text-[#C8A95B]">
                      {produtoDestaque.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>

                  </div>
                </>

              ) : (

                <div className="flex h-[620px] items-center justify-center text-[#F3E8D7]/40">
                  {loading ? "Carregando produtos..." : "Nenhum produto cadastrado"}
                </div>

              )}

            </div>

          </div>

        </div>

      </section>

      {/* ================= CATÁLOGO ================= */}

      <section
        id="colecao"
        className="mx-auto max-w-[1600px] px-8 py-24"
      >

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C8A95B]">
            Nossa Coleção
          </p>

          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">
            Escolha seu próximo par
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[#F3E8D7]/60">
            Pesquise pelo nome, código, marca ou categoria.
          </p>

        </div>        <div className="mx-auto mt-12 max-w-3xl">

          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full rounded-full border border-[#C8A95B]/30 bg-[#1a1a1a] px-6 py-4 text-white outline-none transition placeholder:text-white/35 focus:border-[#C8A95B]"
          />

        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">

          {["Todos", "Tamanco", "Sandália", "Scarpin"].map((opcao) => (

            <button
              key={opcao}
              type="button"
              onClick={() => setFiltro(opcao)}
              className={`rounded-full border px-5 py-2 text-sm transition ${
                filtro === opcao
                  ? "border-[#C8A95B] bg-[#C8A95B] text-[#111111]"
                  : "border-[#C8A95B]/30 text-[#F3E8D7] hover:border-[#C8A95B]"
              }`}
            >
              {opcao}
            </button>

          ))}

        </div>

        {loading ? (

          <div className="mt-16 text-center text-[#F3E8D7]/60">
            Carregando produtos...
          </div>

        ) : produtosFiltrados.length > 0 ? (

          <>
            {produtosEmDestaque.length > 0 && (
              <>
                <div className="mt-14 mb-8 text-center">
                  <h3 className="text-3xl font-bold text-[#C8A95B]">
                    ⭐ Produtos em Destaque
                  </h3>

                  <p className="mt-2 text-[#F3E8D7]/60">
                    Os modelos mais especiais da MTelles.
                  </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  {produtosEmDestaque.map((produto) => (
                    <ProductCard
                      key={produto.id}
                      produto={produto}
                    />
                  ))}
                </div>

                <div className="my-16 border-t border-[#C8A95B]/20"></div>
              </>
            )}

            <div className="mb-8 text-center">
              <h3 className="text-3xl font-bold">
                Todos os Produtos
              </h3>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {outrosProdutos.map((produto) => (
                <ProductCard
                  key={produto.id}
                  produto={produto}
                />
              ))}
            </div>
          </>

        ) : (

          <div className="mt-14 rounded-3xl border border-[#C8A95B]/20 bg-[#181818] px-6 py-16 text-center">

            <p className="text-2xl font-semibold">
              Nenhum produto encontrado
            </p>

            <p className="mt-3 text-[#F3E8D7]/50">
              Tente outra pesquisa.
            </p>

          </div>

        )}

      </section>

      <section className="border-y border-[#C8A95B]/15 bg-[#151515]">

        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-3">

          <div className="rounded-3xl border border-[#C8A95B]/20 p-8">

            <div className="mb-4 text-4xl">
              ✨
            </div>

            <h3 className="text-xl font-semibold">
              Elegância
            </h3>

            <p className="mt-3 leading-7 text-[#F3E8D7]/60">
              Produtos escolhidos para mulheres exigentes.
            </p>

          </div>

          <div className="rounded-3xl border border-[#C8A95B]/20 p-8">

            <div className="mb-4 text-4xl">
              💬
            </div>

            <h3 className="text-xl font-semibold">
              Atendimento Humanizado
            </h3>

            <p className="mt-3 leading-7 text-[#F3E8D7]/60">
              Atendimento direto pelo WhatsApp.
            </p>

          </div>

          <div className="rounded-3xl border border-[#C8A95B]/20 p-8">

            <div className="mb-4 text-4xl">
              🚚
            </div>

            <h3 className="text-xl font-semibold">
              Compra Segura
            </h3>

            <p className="mt-3 leading-7 text-[#F3E8D7]/60">
              Atendimento personalizado antes da compra.
            </p>

          </div>

        </div>

      </section>

      <section
        id="sobre"
        className="mx-auto max-w-4xl px-5 py-24 text-center"
      >

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C8A95B]">
          Sobre a MTelles
        </p>

        <h2 className="mt-5 text-4xl font-semibold">
          Elegância em cada detalhe
        </h2>

        <p className="mt-7 text-lg leading-8 text-[#F3E8D7]/60">
          A MTelles nasceu para oferecer calçados que unem beleza,
          conforto e sofisticação, proporcionando uma experiência
          diferenciada para cada cliente.
        </p>

      </section>

      <footer className="border-t border-[#C8A95B]/20 bg-[#0b0b0b]">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 text-center md:flex-row md:text-left">

          <div>

            <p className="font-semibold tracking-[0.2em] text-[#C8A95B]">
              MTELLES
            </p>

            <p className="mt-2 text-sm text-[#F3E8D7]/50">
              Elegância em cada passo
            </p>

          </div>

          <div className="flex gap-6">

            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#C8A95B]"
            >
              WhatsApp
            </a>

            <a
              href="https://instagram.com/mtellesoficial"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#C8A95B]"
            >
              Instagram
            </a>

          </div>

          <p className="text-sm text-[#F3E8D7]/40">
            © 2026 MTelles. Todos os direitos reservados.
          </p>

        </div>

      </footer>

    </main>
  );
}