"use client";

import { useCart } from "./CartContext";

export default function CartButton() {
  const {
    quantidadeItens,
    abrirCarrinho,
  } = useCart();

  return (
    <button
      type="button"
      onClick={abrirCarrinho}
      className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#C8A95B]/40 bg-[#181818] text-2xl text-[#C8A95B] transition-all duration-300 hover:scale-105 hover:border-[#C8A95B] hover:bg-[#202020]"
    >
      🛒

      {quantidadeItens > 0 && (
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#C8A95B] text-xs font-bold text-[#111111] shadow-lg">
          {quantidadeItens}
        </span>
      )}
    </button>
  );
}