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
      aria-label={`Abrir carrinho${
        quantidadeItens > 0
          ? ` com ${quantidadeItens} ${
              quantidadeItens === 1
                ? "item"
                : "itens"
            }`
          : ""
      }`}
      className="relative z-20 flex h-14 w-14 shrink-0 touch-manipulation select-none items-center justify-center rounded-full border border-[#C8A95B]/40 bg-[#181818] text-2xl text-[#C8A95B] transition-colors duration-200 hover:border-[#C8A95B] hover:bg-[#202020] active:bg-[#252525]"
      style={{
        WebkitTapHighlightColor:
          "transparent",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none"
      >
        🛒
      </span>

      {quantidadeItens > 0 && (
        <span className="pointer-events-none absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#C8A95B] px-1 text-xs font-bold text-[#111111] shadow-lg">
          {quantidadeItens}
        </span>
      )}
    </button>
  );
}