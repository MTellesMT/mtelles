"use client";
import { useState } from "react";
import { criarPedido } from "@/services/pedidos";
import { useCart } from "./CartContext";

const whatsapp = "5521966682941";

export default function CartDrawer() {
  const {
    aberto,
    fecharCarrinho,
    itens,
    quantidadeItens,
    total,
    aumentarQuantidade,
    diminuirQuantidade,
    removerProduto,
    limparCarrinho,
  } = useCart();

const [enviando, setEnviando] =
  useState(false);

if (!aberto) {
  return null;
}
  const mensagem = encodeURIComponent(
    `Olá! Gostaria de comprar:

${itens
  .map((item) => {
    const subtotal =
      item.produto.preco *
      item.quantidade;

    return `• ${item.produto.nome}
Código: ${item.produto.codigo}
Marca: ${item.produto.marca}
Cor: ${item.cor || "Não informada"}
Tamanho: ${
      item.tamanho || "Não informado"
    }
Quantidade: ${item.quantidade}
Subtotal: ${subtotal.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    )}`;
  })
  .join("\n\n")}

-----------------------

Quantidade total: ${quantidadeItens}

TOTAL:
${total.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL",
})}`
  );
async function finalizarPedido() {

  try {

    setEnviando(true);

    const nome =
      prompt("Informe seu nome:") ?? "";

    if (!nome.trim()) {
      setEnviando(false);
      return;
    }

    const telefone =
      prompt("Informe seu WhatsApp:") ?? "";

    if (!telefone.trim()) {
      setEnviando(false);
      return;
    }

    await criarPedido(

      {
        nome_cliente: nome,
        telefone,
        total,
      },

      itens.map((item) => ({

        produto_id:
          item.produto.id,

        nome_produto:
          item.produto.nome,

        codigo:
          item.produto.codigo,

        marca:
          item.produto.marca,

        cor:
          item.cor,

        tamanho:
          item.tamanho,

        quantidade:
          item.quantidade,

        preco:
          item.produto.preco,

        subtotal:
          item.produto.preco *
          item.quantidade,

      }))

    );

    const url = `https://wa.me/${whatsapp}?text=${mensagem}`;

console.log("URL:", url);

window.location.href = url;

limparCarrinho();

fecharCarrinho();

  } catch (error) {

  console.error("ERRO COMPLETO:", error);

  if (error instanceof Error) {

    alert(error.message);

  } else {

    alert(JSON.stringify(error, null, 2));

  }

} finally {

    setEnviando(false);

  }

}

  return (
    <>
      <div
        onClick={fecharCarrinho}
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
      />

      <aside className="fixed right-0 top-0 z-[100] flex h-screen w-full max-w-md flex-col border-l border-[#C8A95B]/20 bg-[#111111] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#C8A95B]/20 p-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              🛒 Carrinho
            </h2>

            <p className="mt-1 text-sm text-[#F3E8D7]/50">
              {quantidadeItens}{" "}
              {quantidadeItens === 1
                ? "item"
                : "itens"}
            </p>
          </div>

          <button
            type="button"
            onClick={fecharCarrinho}
            aria-label="Fechar carrinho"
            className="text-3xl text-[#C8A95B] transition hover:scale-110"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {itens.length === 0 ? (
            <div className="mt-24 text-center">
              <div className="text-6xl">
                🛒
              </div>

              <p className="mt-5 text-[#F3E8D7]/60">
                Seu carrinho está vazio.
              </p>

              <button
                type="button"
                onClick={fecharCarrinho}
                className="mt-7 rounded-full border border-[#C8A95B] px-6 py-3 font-semibold text-[#C8A95B] transition hover:bg-[#C8A95B] hover:text-[#111111]"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {itens.map((item) => {
                const subtotal =
                  item.produto.preco *
                  item.quantidade;

                const chaveItem = `${item.produto.id}-${item.tamanho}-${item.cor}`;

                console.log(itens);return (
                  <div
                    key={chaveItem}
                    className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-4"
                  >
                    {item.produto
                      .imagem_principal ? (
                      <img
                        src={
                          item.produto
                            .imagem_principal
                        }
                        alt={
                          item.produto.nome
                        }
                        className="h-40 w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-[#111111] text-6xl">
                        👠
                      </div>
                    )}

                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#C8A95B]">
                      {item.produto.marca}
                    </p>

                    <h3 className="mt-2 font-bold text-white">
                      {item.produto.nome}
                    </h3>

                    <p className="mt-2 text-sm text-[#F3E8D7]/55">
                      Código:{" "}
                      {item.produto.codigo}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-[#C8A95B]/15 bg-[#111111] p-3">
                        <p className="text-xs text-[#F3E8D7]/45">
                          Cor
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {item.cor ||
                            "Não informada"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#C8A95B]/15 bg-[#111111] p-3">
                        <p className="text-xs text-[#F3E8D7]/45">
                          Tamanho
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {item.tamanho ||
                            "Não informado"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-[#F3E8D7]/45">
                          Valor unitário
                        </p>

                        <p className="mt-1 font-semibold text-[#C8A95B]">
                          {item.produto.preco.toLocaleString(
                            "pt-BR",
                            {
                              style:
                                "currency",
                              currency:
                                "BRL",
                            }
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-[#F3E8D7]/45">
                          Subtotal
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#C8A95B]">
                          {subtotal.toLocaleString(
                            "pt-BR",
                            {
                              style:
                                "currency",
                              currency:
                                "BRL",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            diminuirQuantidade(
                              item.produto.id,
                              item.tamanho,
                              item.cor
                            )
                          }
                          aria-label="Diminuir quantidade"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C8A95B] text-[#C8A95B] transition hover:bg-[#C8A95B] hover:text-[#111111]"
                        >
                          −
                        </button>

                        <span className="min-w-6 text-center text-lg font-semibold">
                          {item.quantidade}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            aumentarQuantidade(
                              item.produto.id,
                              item.tamanho,
                              item.cor
                            )
                          }
                          aria-label="Aumentar quantidade"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C8A95B] text-[#C8A95B] transition hover:bg-[#C8A95B] hover:text-[#111111]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removerProduto(
                            item.produto.id
                          )
                        }
                        className="text-sm font-semibold text-red-400 transition hover:text-red-300"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {itens.length > 0 && (
          <div className="border-t border-[#C8A95B]/20 bg-[#0f0f0f] p-6">
            <div className="mb-3 flex items-center justify-between text-sm text-[#F3E8D7]/60">
              <span>
                Quantidade de itens
              </span>

              <span>{quantidadeItens}</span>
            </div>

            <div className="mb-5 flex items-center justify-between text-sm text-[#F3E8D7]/60">
              <span>Frete</span>

              <span>
                Calculado no atendimento
              </span>
            </div>

            <div className="mb-6 flex items-center justify-between border-t border-[#C8A95B]/15 pt-5">
              <span className="text-lg font-semibold">
                Total
              </span>

              <span className="text-2xl font-bold text-[#C8A95B]">
                {total.toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  }
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={fecharCarrinho}
              className="mb-3 w-full rounded-full border border-[#C8A95B] py-3 font-semibold text-[#C8A95B] transition hover:bg-[#C8A95B] hover:text-[#111111]"
            >
              Continuar comprando
            </button>

            <button
              type="button"
              onClick={limparCarrinho}
              className="mb-3 w-full rounded-full border border-red-500 py-3 text-red-400 transition hover:bg-red-500 hover:text-white"
            >
              Limpar Carrinho
            </button>

            <button
  type="button"
  onClick={finalizarPedido}
  disabled={enviando}
  className="block w-full rounded-full bg-[#C8A95B] py-4 text-center font-bold text-[#111111] transition hover:scale-[1.02] hover:bg-[#e5c96f] disabled:cursor-not-allowed disabled:opacity-60"
>
  {enviando
    ? "Registrando pedido..."
    : "Finalizar pelo WhatsApp"}
</button>
          </div>
        )}
      </aside>
    </>
  );
}