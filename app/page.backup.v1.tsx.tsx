const produtos = [
  {
    nome: "Scarpin Dourado",
    categoria: "Elegance",
    preco: "R$ 189,90",
    imagem:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
  },
  {
    nome: "Sandália Premium",
    categoria: "Collection",
    preco: "R$ 159,90",
    imagem:
      "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=80",
  },
  {
    nome: "Salto Clássico",
    categoria: "Exclusive",
    preco: "R$ 219,90",
    imagem:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Home() {
  const whatsapp = "5521999999999";

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-[#C8A95B]/20 bg-[#111111]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#inicio" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C8A95B] text-lg font-bold text-[#C8A95B]">
              MT
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-[0.2em] text-[#C8A95B]">
                MTELLES
              </h1>

              <p className="text-xs text-[#F3E8D7]/70">
                Elegância em cada passo
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a href="#inicio" className="transition hover:text-[#C8A95B]">
              Início
            </a>

            <a href="#colecao" className="transition hover:text-[#C8A95B]">
              Coleção
            </a>

            <a href="#beneficios" className="transition hover:text-[#C8A95B]">
              Benefícios
            </a>
          </nav>

          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#C8A95B] px-5 py-3 text-sm font-semibold text-black transition hover:scale-105 hover:bg-[#e2c46d]"
          >
            <span>💬</span>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </header>

      <section
        id="inicio"
        className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(200,169,91,0.18),_transparent_40%)]" />

        <div className="absolute -right-32 top-32 h-96 w-96 rounded-full bg-[#C8A95B]/10 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 py-20 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C8A95B]/30 bg-[#C8A95B]/10 px-4 py-2 text-sm text-[#C8A95B]">
              <span>✨</span>
              Nova coleção disponível
            </div>

            <h2 className="max-w-2xl text-5xl font-semibold leading-tight md:text-7xl">
              Elegância que acompanha
              <span className="block text-[#C8A95B]">cada passo.</span>
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#F3E8D7]/70">
              Calçados femininos selecionados para mulheres que valorizam
              sofisticação, conforto e personalidade em todos os momentos.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#colecao"
                className="flex items-center justify-center gap-2 rounded-full bg-[#C8A95B] px-8 py-4 font-semibold text-black transition hover:scale-105 hover:bg-[#e2c46d]"
              >
                <span>🛍️</span>
                Conhecer a coleção
              </a>

              <a
                href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de conhecer os produtos da MTelles.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-[#F3E8D7]/30 px-8 py-4 font-semibold transition hover:border-[#C8A95B] hover:text-[#C8A95B]"
              >
                <span>💬</span>
                Falar com a MTelles
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-6 text-sm text-[#F3E8D7]/60">
              <span className="flex items-center gap-2">
                <span className="text-[#C8A95B]">★</span>
                Produtos selecionados
              </span>

              <span className="flex items-center gap-2">
                <span className="text-[#C8A95B]">✓</span>
                Compra segura
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-[#C8A95B]/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[3rem] border border-[#C8A95B]/20 bg-[#1a1a1a] p-3 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85"
                alt="Calçado feminino elegante"
                className="h-[520px] w-full rounded-[2.5rem] object-cover"
              />

              <div className="absolute bottom-8 left-8 right-8 rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.3em] text-[#C8A95B]">
                  Destaque MTelles
                </p>

                <h3 className="mt-2 text-2xl font-semibold">
                  Coleção Elegance
                </h3>

                <p className="mt-2 text-sm text-white/70">
                  Design sofisticado para ocasiões inesquecíveis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="colecao"
        className="bg-[#F3E8D7] px-6 py-24 text-[#111111]"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9a7d38]">
                Nossa coleção
              </p>

              <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
                Escolhas que encantam
              </h2>
            </div>

            <p className="max-w-lg text-[#111111]/60">
              Modelos escolhidos para combinar beleza, conforto e versatilidade
              em diferentes ocasiões.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {produtos.map((produto) => (
              <article
                key={produto.nome}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9a7d38]">
                    {produto.categoria}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">
                    {produto.nome}
                  </h3>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="text-xl font-bold text-[#9a7d38]">
                      {produto.preco}
                    </span>

                    <a
                      href={`https://wa.me/${whatsapp}?text=Olá! Tenho interesse no produto ${produto.nome}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#C8A95B] hover:text-black"
                    >
                      Comprar
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="beneficios" className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-[#C8A95B]/20 bg-white/5 p-8">
            <div className="text-3xl">🚚</div>

            <h3 className="mt-5 text-xl font-semibold">Entrega combinada</h3>

            <p className="mt-3 text-sm leading-6 text-white/60">
              Consulte as opções disponíveis para sua região diretamente pelo
              WhatsApp.
            </p>
          </div>

          <div className="rounded-3xl border border-[#C8A95B]/20 bg-white/5 p-8">
            <div className="text-3xl">🔒</div>

            <h3 className="mt-5 text-xl font-semibold">Atendimento seguro</h3>

            <p className="mt-3 text-sm leading-6 text-white/60">
              Tire suas dúvidas e confirme todos os detalhes antes de finalizar
              seu pedido.
            </p>
          </div>

          <div className="rounded-3xl border border-[#C8A95B]/20 bg-white/5 p-8">
            <div className="text-3xl">💬</div>

            <h3 className="mt-5 text-xl font-semibold">
              Atendimento personalizado
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/60">
              Receba ajuda para escolher o modelo ideal para cada ocasião.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-[#C8A95B] px-8 py-16 text-center text-black md:px-16">
          <h2 className="text-4xl font-semibold md:text-5xl">
            Encontre o seu próximo favorito
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-black/70">
            Fale agora com a MTelles e consulte modelos, tamanhos,
            disponibilidade e formas de entrega.
          </p>

          <a
            href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de fazer um pedido na MTelles.`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 font-semibold text-white transition hover:scale-105"
          >
            <span>💬</span>
            Comprar pelo WhatsApp
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <p className="font-semibold tracking-[0.2em] text-[#C8A95B]">
              MTELLES
            </p>

            <p className="mt-2 text-sm text-white/50">
              Elegância em cada passo.
            </p>
          </div>

          <a
            href="#"
            className="text-sm text-white/60 transition hover:text-[#C8A95B]"
          >
            Instagram
          </a>

          <p className="text-sm text-white/40">
            © 2026 MTelles. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}