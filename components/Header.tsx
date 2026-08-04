"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import CartButton from "./CartButton";
import { useState } from "react";
export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="border-b border-[#C8A95B]/20 bg-[#111111]">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link href="/" className="flex items-center gap-3">

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

        {/* Desktop */}

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

        {/* Pesquisa */}

        <div className="hidden items-center rounded-full border border-[#C8A95B]/30 bg-[#181818] px-4 lg:flex">

          <Search
            size={18}
            className="text-[#C8A95B]"
          />

          <input
            type="text"
            placeholder="Buscar sandálias..."
            className="w-56 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-[#F3E8D7]/40"
          />

        </div>

        {/* Ícones */}

        <div className="flex items-center gap-5">

          <CartButton />

          <button
            className="lg:hidden"
            onClick={() =>
              setMenuAberto(!menuAberto)
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

      {/* Menu Mobile */}

      {menuAberto && (

        <div className="border-t border-[#C8A95B]/20 bg-[#111111] lg:hidden">

          <nav className="flex flex-col px-6 py-5">

            <Link
              href="/"
              className="py-3"
              onClick={() => setMenuAberto(false)}
            >
              Início
            </Link>

            <Link
              href="/#colecao"
              className="py-3"
              onClick={() => setMenuAberto(false)}
            >
              Coleção
            </Link>

            <Link
              href="/#destaques"
              className="py-3"
              onClick={() => setMenuAberto(false)}
            >
              Destaques
            </Link>

            <Link
              href="/#contato"
              className="py-3"
              onClick={() => setMenuAberto(false)}
            >
              Contato
            </Link>

            <div className="mt-5 flex items-center rounded-full border border-[#C8A95B]/20 bg-[#181818] px-4">

              <Search
                size={18}
                className="text-[#C8A95B]"
              />

              <input
                type="text"
                placeholder="Buscar..."
                className="w-full bg-transparent px-3 py-3 outline-none placeholder:text-[#F3E8D7]/40"
              />

            </div>

          </nav>

        </div>

      )}

    </header>
  );
}