"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { criarPedido } from "@/services/pedidos";
import { useCart } from "./CartContext";

const whatsapp = "5521966682941";

interface DadosCliente {
  nome: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  referencia: string;
}

const dadosIniciais: DadosCliente = {
  nome: "",
  telefone: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  referencia: "",
};

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

  const [
    mostrarFinalizacao,
    setMostrarFinalizacao,
  ] = useState(false);

  const [dados, setDados] =
    useState<DadosCliente>(
      dadosIniciais
    );

  useEffect(() => {
    if (!aberto) {
      setMostrarConteudo(false);
      setMostrarFinalizacao(false);

      document.body.style.overflow =
        "";

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

      document.body.style.overflow =
        "";
    };
  }, [aberto]);

  if (!aberto) {
    return null;
  }

  function atualizarCampo(
    campo: keyof DadosCliente,
    valor: string
  ) {
    setDados((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
  }

  function formatarCep(valor: string) {
    const numeros = valor
      .replace(/\D/g, "")
      .slice(0, 8);

    if (numeros.length <= 5) {
      return numeros;
    }

    return `${numeros.slice(
      0,
      5
    )}-${numeros.slice(5)}`;
  }

  function formatarTelefone(
    valor: string
  ) {
    const numeros = valor
      .replace(/\D/g, "")
      .slice(0, 11);

    if (numeros.length <= 2) {
      return numeros;
    }

    if (numeros.length <= 7) {
      return `(${numeros.slice(
        0,
        2
      )}) ${numeros.slice(2)}`;
    }

    if (numeros.length <= 10) {
      return `(${numeros.slice(
        0,
        2
      )}) ${numeros.slice(
        2,
        6
      )}-${numeros.slice(6)}`;
    }

    return `(${numeros.slice(
      0,
      2
    )}) ${numeros.slice(
      2,
      7
    )}-${numeros.slice(7)}`;
  }

  async function finalizarPedido(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (itens.length === 0) {
      return;
    }

    if (
      !dados.nome.trim() ||
      !dados.telefone.trim() ||
      !dados.cep.trim() ||
      !dados.logradouro.trim() ||
      !dados.numero.trim() ||
      !dados.bairro.trim() ||
      !dados.cidade.trim() ||
      !dados.estado.trim()
    ) {
      alert(
        "Preencha todos os campos obrigatórios."
      );

      return;
    }

    try {
      setEnviando(true);

      const complementoMensagem =
        dados.complemento.trim()
          ? `\nComplemento: ${dados.complemento.trim()}`
          : "";

      const referenciaMensagem =
        dados.referencia.trim()
          ? `\nReferência: ${dados.referencia.trim()}`
          : "";

      const produtosMensagem =
        itens
          .map((item) => {
            const subtotal =
              item.produto.preco *
              item.quantidade;

            return `👠 ${item.produto.nome}
${item.produto.marca} | Cód. ${item.produto.codigo}
Cor: ${item.cor || "Não informada"}
Tamanho: ${
              item.tamanho ||
              "Não informado"
            }
Quantidade: ${item.quantidade}
Valor: ${subtotal.toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            )}`;
          })
          .join(
            "\n\n───────────────\n\n"
          );

      const textoMensagem =
        `🛍️ PEDIDO MTELLES
_______________________________________________________

Olá, MTelles

Seguem os dados do meu pedido realizado pelo site:

👤 Cliente
${dados.nome.trim()}
WhatsApp: ${dados.telefone.trim()}

📍 Entrega
${dados.logradouro.trim()}, ${dados.numero.trim()}${complementoMensagem}
${dados.bairro.trim()}
${dados.cidade.trim()} - ${dados.estado
          .trim()
          .toUpperCase()}
CEP: ${dados.cep.trim()}${referenciaMensagem}

───────────────

${produtosMensagem}

───────────────

📦 Resumo
${quantidadeItens} ${
          quantidadeItens === 1
            ? "item"
            : "itens"
        }
Frete: a calcular

Total dos produtos: ${total.toLocaleString(
          "pt-BR",
          {
            style: "currency",
            currency: "BRL",
          }
        )}

Gostaria de confirmar a disponibilidade e finalizar meu pedido. 😊`;

      const mensagem =
        encodeURIComponent(
          textoMensagem
        );

      await criarPedido(
        {
          nome_cliente:
            dados.nome.trim(),

          telefone:
            dados.telefone.trim(),

          total,

          cep: dados.cep.trim(),

          logradouro:
            dados.logradouro.trim(),

          numero:
            dados.numero.trim(),

          complemento:
            dados.complemento.trim(),

          bairro:
            dados.bairro.trim(),

          cidade:
            dados.cidade.trim(),

          estado: dados.estado
            .trim()
            .toUpperCase(),

          referencia:
            dados.referencia.trim(),
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

      setDados(dadosIniciais);

      limparCarrinho();
      fecharCarrinho();

      window.location.href = url;
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
        onClick={
          mostrarFinalizacao
            ? undefined
            : fecharCarrinho
        }
        className="fixed inset-0 z-[90] bg-black/60"
      />

      {/* CARRINHO */}

      <aside className="fixed right-0 top-0 z-[100] flex h-dvh w-full max-w-md flex-col overflow-hidden border-l border-[#C8A95B]/20 bg-[#111111] shadow-2xl">
        {/* CABEÇALHO */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#C8A95B]/20 px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {mostrarFinalizacao
                ? "Finalizar pedido"
                : "🛒 Carrinho"}
            </h2>

            <p className="mt-0.5 text-sm text-[#F3E8D7]/50">
              {mostrarFinalizacao
                ? "Dados para entrega"
                : `${quantidadeItens} ${
                    quantidadeItens ===
                    1
                      ? "item"
                      : "itens"
                  }`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (
                mostrarFinalizacao
              ) {
                setMostrarFinalizacao(
                  false
                );

                return;
              }

              fecharCarrinho();
            }}
            aria-label={
              mostrarFinalizacao
                ? "Voltar ao carrinho"
                : "Fechar carrinho"
            }
            className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-full text-3xl text-[#C8A95B] active:bg-[#C8A95B]/10"
          >
            {mostrarFinalizacao
              ? "‹"
              : "×"}
          </button>
        </div>

        {/* CARREGANDO */}

        {!mostrarConteudo ? (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#C8A95B]/25 border-t-[#C8A95B]" />

              <p className="mt-3 text-sm text-[#F3E8D7]/50">
                Carregando carrinho...
              </p>
            </div>
          </div>
        ) : mostrarFinalizacao ? (
          /* FINALIZAÇÃO */

          <form
            onSubmit={finalizarPedido}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div
              className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
              style={{
                WebkitOverflowScrolling:
                  "touch",
              }}
            >
              {/* DADOS DO CLIENTE */}

              <div className="rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8A95B]">
                  Dados do cliente
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs text-[#F3E8D7]/60">
                      Nome completo *
                    </label>

                    <input
                      type="text"
                      value={dados.nome}
                      onChange={(event) =>
                        atualizarCampo(
                          "nome",
                          event.target
                            .value
                        )
                      }
                      required
                      autoComplete="name"
                      placeholder="Seu nome"
                      className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3 text-base text-white outline-none placeholder:text-[#F3E8D7]/25 focus:border-[#C8A95B]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs text-[#F3E8D7]/60">
                      WhatsApp *
                    </label>

                    <input
                      type="tel"
                      inputMode="tel"
                      value={
                        dados.telefone
                      }
                      onChange={(event) =>
                        atualizarCampo(
                          "telefone",
                          formatarTelefone(
                            event.target
                              .value
                          )
                        )
                      }
                      required
                      autoComplete="tel"
                      placeholder="(21) 99999-9999"
                      className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3 text-base text-white outline-none placeholder:text-[#F3E8D7]/25 focus:border-[#C8A95B]"
                    />
                  </div>
                </div>
              </div>

              {/* ENDEREÇO */}

              <div className="mt-4 rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8A95B]">
                  Endereço de entrega
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs text-[#F3E8D7]/60">
                      CEP *
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={dados.cep}
                      onChange={(event) =>
                        atualizarCampo(
                          "cep",
                          formatarCep(
                            event.target
                              .value
                          )
                        )
                      }
                      required
                      autoComplete="postal-code"
                      placeholder="00000-000"
                      className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3 text-base text-white outline-none placeholder:text-[#F3E8D7]/25 focus:border-[#C8A95B]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs text-[#F3E8D7]/60">
                      Rua / Logradouro *
                    </label>

                    <input
                      type="text"
                      value={
                        dados.logradouro
                      }
                      onChange={(event) =>
                        atualizarCampo(
                          "logradouro",
                          event.target
                            .value
                        )
                      }
                      required
                      autoComplete="address-line1"
                      placeholder="Rua, avenida..."
                      className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3 text-base text-white outline-none placeholder:text-[#F3E8D7]/25 focus:border-[#C8A95B]"
                    />
                  </div>

                  <div className="grid grid-cols-[0.8fr_1.2fr] gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs text-[#F3E8D7]/60">
                        Número *
                      </label>

                      <input
                        type="text"
                        value={
                          dados.numero
                        }
                        onChange={(
                          event
                        ) =>
                          atualizarCampo(
                            "numero",
                            event.target
                              .value
                          )
                        }
                        required
                        placeholder="123"
                        className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3 text-base text-white outline-none placeholder:text-[#F3E8D7]/25 focus:border-[#C8A95B]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs text-[#F3E8D7]/60">
                        Complemento
                      </label>

                      <input
                        type="text"
                        value={
                          dados.complemento
                        }
                        onChange={(
                          event
                        ) =>
                          atualizarCampo(
                            "complemento",
                            event.target
                              .value
                          )
                        }
                        autoComplete="address-line2"
                        placeholder="Apto, casa..."
                        className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3 text-base text-white outline-none placeholder:text-[#F3E8D7]/25 focus:border-[#C8A95B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs text-[#F3E8D7]/60">
                      Bairro *
                    </label>

                    <input
                      type="text"
                      value={dados.bairro}
                      onChange={(event) =>
                        atualizarCampo(
                          "bairro",
                          event.target
                            .value
                        )
                      }
                      required
                      placeholder="Bairro"
                      className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3 text-base text-white outline-none placeholder:text-[#F3E8D7]/25 focus:border-[#C8A95B]"
                    />
                  </div>

                  <div className="grid grid-cols-[1fr_90px] gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs text-[#F3E8D7]/60">
                        Cidade *
                      </label>

                      <input
                        type="text"
                        value={
                          dados.cidade
                        }
                        onChange={(
                          event
                        ) =>
                          atualizarCampo(
                            "cidade",
                            event.target
                              .value
                          )
                        }
                        required
                        autoComplete="address-level2"
                        placeholder="Cidade"
                        className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3 text-base text-white outline-none placeholder:text-[#F3E8D7]/25 focus:border-[#C8A95B]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs text-[#F3E8D7]/60">
                        UF *
                      </label>

                      <input
                        type="text"
                        value={
                          dados.estado
                        }
                        onChange={(
                          event
                        ) =>
                          atualizarCampo(
                            "estado",
                            event.target.value
                              .replace(
                                /[^a-zA-Z]/g,
                                ""
                              )
                              .slice(0, 2)
                              .toUpperCase()
                          )
                        }
                        required
                        maxLength={2}
                        autoComplete="address-level1"
                        placeholder="RJ"
                        className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3 text-center text-base font-bold uppercase text-white outline-none placeholder:text-[#F3E8D7]/25 focus:border-[#C8A95B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs text-[#F3E8D7]/60">
                      Ponto de referência
                    </label>

                    <textarea
                      value={
                        dados.referencia
                      }
                      onChange={(event) =>
                        atualizarCampo(
                          "referencia",
                          event.target
                            .value
                        )
                      }
                      rows={2}
                      placeholder="Ex.: próximo ao mercado..."
                      className="w-full resize-none rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3 text-base text-white outline-none placeholder:text-[#F3E8D7]/25 focus:border-[#C8A95B]"
                    />
                  </div>
                </div>
              </div>

              {/* TOTAL */}

              <div className="mt-4 rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-4">
                <div className="flex items-center justify-between text-sm text-[#F3E8D7]/60">
                  <span>Itens</span>

                  <span>
                    {quantidadeItens}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#C8A95B]/10 pt-3">
                  <span className="font-semibold text-white">
                    Total do pedido
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
              </div>
            </div>

            {/* BOTÕES FINALIZAÇÃO */}

            <div className="shrink-0 border-t border-[#C8A95B]/20 bg-[#0f0f0f] px-5 py-3">
              <button
                type="button"
                onClick={() =>
                  setMostrarFinalizacao(
                    false
                  )
                }
                disabled={enviando}
                className="w-full touch-manipulation rounded-full border border-[#C8A95B] py-2.5 text-sm font-semibold text-[#C8A95B] active:bg-[#C8A95B] active:text-[#111111] disabled:opacity-50"
              >
                Voltar ao carrinho
              </button>

              <button
                type="submit"
                disabled={enviando}
                className="mt-2.5 block w-full touch-manipulation rounded-full bg-[#C8A95B] py-3 text-center font-bold text-[#111111] active:bg-[#e5c96f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviando
                  ? "Registrando pedido..."
                  : "Confirmar e abrir WhatsApp"}
              </button>
            </div>
          </form>
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
                      {/* IMAGEM */}

                      {item.produto
                        .imagem_principal ? (
                        <img
                          src={
                            item.produto
                              .imagem_principal
                          }
                          alt={
                            item.produto
                              .nome
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
                          {
                            item.produto
                              .marca
                          }
                        </p>

                        <h3 className="mt-1.5 font-bold leading-snug text-white">
                          {
                            item.produto
                              .nome
                          }
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
                onClick={() =>
                  setMostrarFinalizacao(
                    true
                  )
                }
                className="mt-2.5 block w-full touch-manipulation rounded-full bg-[#C8A95B] py-3 text-center font-bold text-[#111111] active:bg-[#e5c96f]"
              >
                Finalizar pedido
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}