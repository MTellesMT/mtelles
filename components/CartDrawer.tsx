"use client";

import {
  useEffect,
  useState,
} from "react";

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

  const [
    mostrarConteudo,
    setMostrarConteudo,
  ] = useState(false);

  useEffect(() => {
    if (!aberto) {
      setMostrarConteudo(false);
      document.body.style.overflow = "";

      return;
    }

    document.body.style.overflow =
      "hidden";

    const timer =
      window.setTimeout(() => {
        setMostrarConteudo(true);
      }, 150);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  if (!aberto) {
    return null;
  }

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
        prompt(
          "Informe seu WhatsApp:"
        ) ?? "";

      if (!telefone.trim()) {
        setEnviando(false);
        return;
      }

      const mensagem =
        encodeURIComponent(
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

      await criarPedido(
        {
          nome_cliente: nome,
          telefone,
          total,
        },

        itens.map((item) => ({
          produto_id: item.produto.id,

          nome_produto:
            item.produto.nome,

          codigo:
            item.produto.codigo,

          marca:
            item.produto.marca,

          cor: item.cor,

          tamanho: item.tamanho,

          quantidade:
            item.quantidade,

          preco:
            item.produto.preco,

          subtotal:
            item.produto.preco *
            item.quantidade,
        }))
      );

      const url =
        `https://wa.me/${whatsapp}?text=${mensagem}`;

      window.location.href = url;

      limparCarrinho();
      fecharCarrinho();
    } catch (error) {
      console.error(
        "Erro ao registrar pedido:",
        error
      );

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(
          JSON.stringify(
            error,
            null,
            2
          )
        );
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      {/* FUNDO */}

      <div
        onClick={fecharCarrinho}
        className="fixed inset-0 z-[90] bg-black/60"
      />

      {/* CARRINHO */}

      <aside className="fixed right-0 top-0 z-[100] flex h-dvh w-full max-w-md flex-col overflow-hidden border-l border-[#C8A95B]/20 bg-[#111111] shadow-2xl">
        {/* CABEÇALHO */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#C8A95B]/20 px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              🛒 Carrinho
            </h2>

            <p className="mt-0.5 text-sm text-[#F3E8D7]/50">
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
            className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-full text-3xl text-[#C8A95B] active:bg-[#C8A95B]/10"
          >
            ×
          </button>
        </div>

        {/* CONTEÚDO AINDA NÃO MONTADO */}

        {!mostrarConteudo ? (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#C8A95B]/25 border-t-[#C8A95B]" />

              <p className="mt-3 text-sm text-[#F3E8D7]/50">
                Carregando carrinho...
              </p>
            </div>
          </div>
        ) : itens.length === 0 ? (
          /* CARRINHO VAZIO */

          <div className="flex min-h-0 flex-1 items-center justify-center p-4">
            <div className="text-center">
              <div className="text-6xl">
                🛒
              </div>

              <p className="mt-5 text-[#F3E8D7]/60">
                Seu carrinho está vazio.
              </p>

              <button
                type="button"
                onClick={fecharCarrinho}
                className="mt-7 touch-manipulation rounded-full border border-[#C8A95B] px-6 py-3 font-semibold text-[#C8A95B] active:bg-[#C8A95B] active:text-[#111111]"
              >
                Continuar comprando
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* PRODUTOS */}

            <div
              className="min-h-0 flex-1 overflow-y-auto p-4"
              style={{
                WebkitOverflowScrolling:
                  "touch",
              }}
            >
              <div className="space-y-4">
                {itens.map((item) => {
                  const subtotal =
                    item.produto.preco *
                    item.quantidade;

                  const chaveItem =
                    `${item.produto.id}-${item.tamanho}-${item.cor}`;

                  return (
                    <div
                      key={chaveItem}
                      className="rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-3.5"
                    >
                      {/* IMAGEM RESTAURADA */}

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
                          loading="lazy"
                          decoding="async"
                          className="h-40 w-full rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-[#111111] text-6xl">
                          👠
                        </div>
                      )}

                      {/* INFORMAÇÕES */}

                      <div className="mt-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C8A95B]">
                          {item.produto.marca}
                        </p>

                        <h3 className="mt-1.5 font-bold leading-snug text-white">
                          {item.produto.nome}
                        </h3>

                        <p className="mt-1 text-xs text-[#F3E8D7]/50">
                          Código:{" "}
                          {
                            item.produto
                              .codigo
                          }
                        </p>
                      </div>

                      {/* COR E TAMANHO */}

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-[#C8A95B]/15 bg-[#111111] px-3 py-2">
                          <p className="text-[11px] text-[#F3E8D7]/45">
                            Cor
                          </p>

                          <p className="mt-0.5 truncate text-sm font-semibold text-white">
                            {item.cor ||
                              "Não informada"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-[#C8A95B]/15 bg-[#111111] px-3 py-2">
                          <p className="text-[11px] text-[#F3E8D7]/45">
                            Tamanho
                          </p>

                          <p className="mt-0.5 text-sm font-semibold text-white">
                            {item.tamanho ||
                              "Não informado"}
                          </p>
                        </div>
                      </div>

                      {/* VALORES */}

                      <div className="mt-3 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[11px] text-[#F3E8D7]/45">
                            Valor unitário
                          </p>

                          <p className="mt-0.5 text-sm font-semibold text-[#C8A95B]">
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
                          <p className="text-[11px] text-[#F3E8D7]/45">
                            Subtotal
                          </p>

                          <p className="mt-0.5 text-lg font-bold text-[#C8A95B]">
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

                      {/* QUANTIDADE */}

                      <div className="mt-3 flex items-center justify-between border-t border-[#C8A95B]/10 pt-3">
                        <div className="flex items-center gap-2">
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
                            className="flex h-8 w-8 touch-manipulation items-center justify-center rounded-full border border-[#C8A95B] text-[#C8A95B] active:bg-[#C8A95B] active:text-[#111111]"
                          >
                            −
                          </button>

                          <span className="min-w-7 text-center font-semibold text-white">
                            {
                              item.quantidade
                            }
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
                            className="flex h-8 w-8 touch-manipulation items-center justify-center rounded-full border border-[#C8A95B] text-[#C8A95B] active:bg-[#C8A95B] active:text-[#111111]"
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
                          className="touch-manipulation text-sm font-semibold text-red-400"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RESUMO */}

            <div className="shrink-0 border-t border-[#C8A95B]/20 bg-[#0f0f0f] px-5 py-3">
              <div className="flex items-center justify-between gap-4 text-xs text-[#F3E8D7]/55">
                <span>
                  {quantidadeItens}{" "}
                  {quantidadeItens === 1
                    ? "item"
                    : "itens"}
                </span>

                <span className="text-right">
                  Frete calculado no
                  atendimento
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-[#C8A95B]/15 pt-2">
                <span className="font-semibold text-white">
                  Total
                </span>

                <span className="text-xl font-bold text-[#C8A95B]">
                  {total.toLocaleString(
                    "pt-BR",
                    {
                      style:
                        "currency",
                      currency:
                        "BRL",
                    }
                  )}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={fecharCarrinho}
                  className="touch-manipulation rounded-full border border-[#C8A95B] px-2 py-2 text-sm font-semibold text-[#C8A95B] active:bg-[#C8A95B] active:text-[#111111]"
                >
                  Continuar comprando
                </button>

                <button
                  type="button"
                  onClick={limparCarrinho}
                  className="touch-manipulation rounded-full border border-red-500 px-2 py-2 text-sm font-semibold text-red-400 active:bg-red-500 active:text-white"
                >
                  Limpar Carrinho
                </button>
              </div>

              <button
                type="button"
                onClick={finalizarPedido}
                disabled={enviando}
                className="mt-2.5 block w-full touch-manipulation rounded-full bg-[#C8A95B] py-3 text-center font-bold text-[#111111] active:bg-[#e5c96f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviando
                  ? "Registrando pedido..."
                  : "Finalizar pelo WhatsApp"}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}