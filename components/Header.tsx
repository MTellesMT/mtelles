"use client";

import Link from "next/link";
import {
  Search,
  Menu,
  X,
  MoreVertical,
  Settings,
} from "lucide-react";

import CartButton from "./CartButton";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const [menuAberto, setMenuAberto] =
    useState(false);

  const [
    menuAdministracaoAberto,
    setMenuAdministracaoAberto,
  ] = useState(false);

  const [buscaHeader, setBuscaHeader] =
    useState("");

  const menuAdministracaoRef =
    useRef<HTMLDivElement>(null);

  /*
   * FECHAR MENU DOS TRÊS PONTINHOS
   * AO CLICAR FORA
   */

  useEffect(() => {
    function fecharAoClicarFora(
      event: MouseEvent
    ) {
      if (
        menuAdministracaoRef.current &&
        !menuAdministracaoRef.current.contains(
          event.target as Node
        )
      ) {
        setMenuAdministracaoAberto(false);
      }
    }

    document.addEventListener(
      "mousedown",
      fecharAoClicarFora
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        fecharAoClicarFora
      );
    };
  }, []);

  /*
   * PESQUISA DO HEADER
   *
   * A pesquisa é enviada para a Home
   * através da URL.
   *
   * Usamos navegação normal do navegador
   * para garantir que a Home receba a
   * nova pesquisa imediatamente.
   *
   * Isso também permite pesquisar várias
   * vezes seguidas sem precisar atualizar
   * manualmente a página.
   */

  function pesquisar(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const pesquisa =
      buscaHeader.trim();

    setMenuAberto(false);

    if (!pesquisa) {
      /*
       * Se a pesquisa estiver vazia,
       * vai para a coleção.
       */

      if (pathname === "/") {
        window.location.href =
          "/#colecao";
      } else {
        window.location.href =
          "/#colecao";
      }

      return;
    }

    /*
     * Navegação completa.
     *
     * A Home será carregada já com o
     * parâmetro de pesquisa disponível.
     */

    window.location.href =
      `/?busca=${encodeURIComponent(
        pesquisa
      )}`;
  }

  return (
    <header className="relative z-[200] border-b border-[#C8A95B]/20 bg-[#111111]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* LOGO */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C8A95B]">
            <span className="text-lg font-bold tracking-widest text-[#C8A95B]">
              MT
            </span>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-[0.25em] text-[#C8A95B]">
              MTELLES
            </h1>

            <p className="text-xs text-[#F3E8D7]/70">
              Elegância em cada passo
            </p>
          </div>
        </Link>

        {/* MENU DESKTOP */}

        <nav className="hidden items-center gap-10 lg:flex">
          <Link
            href="/"
            className="transition hover:text-[#C8A95B]"
          >
            Início
          </Link>

          <Link
            href="/#colecao"
            className="transition hover:text-[#C8A95B]"
          >
            Coleção
          </Link>

          <Link
            href="/#destaques"
            className="transition hover:text-[#C8A95B]"
          >
            Destaques
          </Link>

          <Link
            href="/#contato"
            className="transition hover:text-[#C8A95B]"
          >
            Contato
          </Link>
        </nav>

        {/* PESQUISA DESKTOP */}

        <form
          onSubmit={pesquisar}
          className="hidden items-center rounded-full border border-[#C8A95B]/30 bg-[#181818] px-4 transition focus-within:border-[#C8A95B] lg:flex"
        >
          <button
            type="submit"
            aria-label="Pesquisar produtos"
            className="flex items-center justify-center"
          >
            <Search
              size={18}
              className="text-[#C8A95B]"
            />
          </button>

          <input
            type="search"
            value={buscaHeader}
            onChange={(event) =>
              setBuscaHeader(
                event.target.value
              )
            }
            placeholder="Buscar produtos..."
            className="w-56 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-[#F3E8D7]/40"
          />
        </form>

        {/* ÍCONES */}

        <div className="flex items-center gap-4">
          {/* CARRINHO */}

          <CartButton />

          {/* ADMINISTRAÇÃO */}

          <div
            ref={menuAdministracaoRef}
            className="relative"
          >
            <button
              type="button"
              aria-label="Abrir opções"
              onClick={() =>
                setMenuAdministracaoAberto(
                  (estado) => !estado
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C8A95B]/20 text-[#C8A95B] transition hover:border-[#C8A95B] hover:bg-[#C8A95B]/10"
            >
              <MoreVertical size={22} />
            </button>

            {menuAdministracaoAberto && (
              <div className="absolute right-0 top-[calc(100%+12px)] z-[300] min-w-[210px] overflow-hidden rounded-2xl border border-[#C8A95B]/25 bg-[#181818] p-2 shadow-[0_20px_60px_rgba(0,0,0,.7)]">
                <Link
                  href="/admin"
                  onClick={() =>
                    setMenuAdministracaoAberto(
                      false
                    )
                  }
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#C8A95B]/10 hover:text-[#C8A95B]"
                >
                  <Settings size={18} />

                  Administração
                </Link>
              </div>
            )}
          </div>

          {/* BOTÃO MENU MOBILE */}

          <button
            type="button"
            aria-label={
              menuAberto
                ? "Fechar menu"
                : "Abrir menu"
            }
            className="lg:hidden"
            onClick={() =>
              setMenuAberto(
                (estado) => !estado
              )
            }
          >
            {menuAberto ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}

      {menuAberto && (
        <div className="border-t border-[#C8A95B]/20 bg-[#111111] lg:hidden">
          <nav className="flex flex-col px-6 py-5">
            <Link
              href="/"
              className="py-3 transition hover:text-[#C8A95B]"
              onClick={() =>
                setMenuAberto(false)
              }
            >
              Início
            </Link>

            <Link
              href="/#colecao"
              className="py-3 transition hover:text-[#C8A95B]"
              onClick={() =>
                setMenuAberto(false)
              }
            >
              Coleção
            </Link>

            <Link
              href="/#destaques"
              className="py-3 transition hover:text-[#C8A95B]"
              onClick={() =>
                setMenuAberto(false)
              }
            >
              Destaques
            </Link>

            <Link
              href="/#contato"
              className="py-3 transition hover:text-[#C8A95B]"
              onClick={() =>
                setMenuAberto(false)
              }
            >
              Contato
            </Link>

            {/* PESQUISA MOBILE */}

            <form
              onSubmit={pesquisar}
              className="mt-5 flex items-center rounded-full border border-[#C8A95B]/20 bg-[#181818] px-4 transition focus-within:border-[#C8A95B]"
            >
              <button
                type="submit"
                aria-label="Pesquisar produtos"
                className="flex items-center justify-center"
              >
                <Search
                  size={18}
                  className="text-[#C8A95B]"
                />
              </button>

              <input
                type="search"
                value={buscaHeader}
                onChange={(event) =>
                  setBuscaHeader(
                    event.target.value
                  )
                }
                placeholder="Buscar produtos..."
                className="w-full bg-transparent px-3 py-3 text-white outline-none placeholder:text-[#F3E8D7]/40"
              />
            </form>
          </nav>
        </div>
      )}
    </header>
  );
}