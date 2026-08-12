"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useCart } from "@/components/CartContext";
import { criarPedido } from "@/services/pedidos";
import { getProducts } from "@/services/products";
import { Product } from "@/types/product";

interface ProductDetailsProps {
  produto: Product;
}

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

const WHATSAPP = "5521966682941";

const TAMANHOS_PADRAO = [
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
];

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

function transformarEmLista(
  valor: string | null | undefined
) {
  if (!valor) {
    return [];
  }

  try {
    const valorConvertido =
      JSON.parse(valor);

    if (
      Array.isArray(
        valorConvertido
      )
    ) {
      return valorConvertido
        .map((item) =>
          String(item).trim()
        )
        .filter(Boolean);
    }
  } catch {
    // O campo também pode estar
    // salvo separado por vírgulas.
  }

  return valor
    .split(/[,;\n|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProductDetails({
  produto,
}: ProductDetailsProps) {
  const { adicionarProduto } =
    useCart();

  const imagens = useMemo(() => {
    const lista: string[] = [];

    if (
      produto.imagem_principal
    ) {
      lista.push(
        produto.imagem_principal
      );
    }

    if (produto.galeria) {
      try {
        const galeria =
          JSON.parse(
            produto.galeria
          );

        if (
          Array.isArray(
            galeria
          )
        ) {
          galeria.forEach(
            (imagem) => {
              if (
                typeof imagem ===
                  "string" &&
                imagem.trim()
              ) {
                lista.push(
                  imagem
                );
              }
            }
          );
        }
      } catch (error) {
        console.error(
          "Erro ao carregar a galeria:",
          error
        );
      }
    }

    return [
      ...new Set(lista),
    ];
  }, [produto]);

  const coresDisponiveis =
    useMemo(() => {
      const cores =
        transformarEmLista(
          produto.cores
        );

      return cores.length > 0
        ? cores
        : ["Não informada"];
    }, [produto.cores]);

  const tamanhosDisponiveis =
    useMemo(() => {
      const tamanhos =
        transformarEmLista(
          produto.tamanhos
        );

      return tamanhos.length >
        0
        ? tamanhos
        : TAMANHOS_PADRAO;
    }, [produto.tamanhos]);

  const [
    imagemSelecionada,
    setImagemSelecionada,
  ] = useState(
    imagens[0] ?? ""
  );

  const [
    imagemAmpliada,
    setImagemAmpliada,
  ] = useState(false);

  const [
    tamanhoSelecionado,
    setTamanhoSelecionado,
  ] = useState("");

  const [
    corSelecionada,
    setCorSelecionada,
  ] = useState(
    coresDisponiveis[0] ?? ""
  );

  const [
    produtosRelacionados,
    setProdutosRelacionados,
  ] = useState<Product[]>([]);

  const [
    mostrarFinalizacao,
    setMostrarFinalizacao,
  ] = useState(false);

  const [
    enviando,
    setEnviando,
  ] = useState(false);

  const [dados, setDados] =
    useState<DadosCliente>(
      dadosIniciais
    );

  useEffect(() => {
    if (imagens.length > 0) {
      setImagemSelecionada(
        imagens[0]
      );
    }
  }, [imagens]);

  useEffect(() => {
    setTamanhoSelecionado(
      ""
    );

    setCorSelecionada(
      coresDisponiveis[0] ??
        ""
    );
  }, [
    produto.id,
    coresDisponiveis,
  ]);

  useEffect(() => {
    async function carregarRelacionados() {
      try {
        const produtos =
          await getProducts();

        const relacionados =
          produtos
            .filter(
              (item) =>
                item.id !==
                  produto.id &&
                item.categoria ===
                  produto.categoria &&
                item.ativo
            )
            .slice(0, 3);

        setProdutosRelacionados(
          relacionados
        );
      } catch (error) {
        console.error(
          "Erro ao carregar produtos relacionados:",
          error
        );
      }
    }

    carregarRelacionados();
  }, [produto]);

  useEffect(() => {
    if (
      !mostrarFinalizacao
    ) {
      return;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [mostrarFinalizacao]);

  function selecionarCor(
    cor: string,
    index: number
  ) {
    setCorSelecionada(cor);

    const imagemDaCor =
      imagens[index] ??
      imagens[0];

    if (imagemDaCor) {
      setImagemSelecionada(
        imagemDaCor
      );
    }
  }

  function validarOpcoes() {
    if (
      !tamanhoSelecionado
    ) {
      window.alert(
        "Escolha o tamanho do calçado antes de continuar."
      );

      return false;
    }

    if (!corSelecionada) {
      window.alert(
        "Escolha uma cor antes de continuar."
      );

      return false;
    }

    return true;
  }

  function adicionarAoCarrinho() {
    if (!validarOpcoes()) {
      return;
    }

    adicionarProduto(
      produto,
      tamanhoSelecionado,
      corSelecionada
    );
  }

  function comprarPeloWhatsApp() {
    if (!validarOpcoes()) {
      return;
    }

    setMostrarFinalizacao(
      true
    );
  }

  function atualizarCampo(
    campo: keyof DadosCliente,
    valor: string
  ) {
    setDados(
      (estadoAtual) => ({
        ...estadoAtual,
        [campo]: valor,
      })
    );
  }

  function formatarCep(
    valor: string
  ) {
    const numeros = valor
      .replace(/\D/g, "")
      .slice(0, 8);

    if (
      numeros.length <= 5
    ) {
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

    if (
      numeros.length <= 2
    ) {
      return numeros;
    }

    if (
      numeros.length <= 7
    ) {
      return `(${numeros.slice(
        0,
        2
      )}) ${numeros.slice(2)}`;
    }

    if (
      numeros.length <= 10
    ) {
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

  async function finalizarCompraDireta(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !validarOpcoes()
    ) {
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
      window.alert(
        "Preencha todos os campos obrigatórios."
      );

      return;
    }

    try {
      setEnviando(true);

      const total =
        Number(produto.preco);

      const complementoMensagem =
        dados.complemento.trim()
          ? `\nComplemento: ${dados.complemento.trim()}`
          : "";

      const referenciaMensagem =
        dados.referencia.trim()
          ? `\nReferência: ${dados.referencia.trim()}`
          : "";

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

👠 ${produto.nome}
${produto.marca} | Cód. ${produto.codigo}
Cor: ${corSelecionada}
Tamanho: ${tamanhoSelecionado}
Quantidade: 1
Valor: ${total.toLocaleString(
          "pt-BR",
          {
            style: "currency",
            currency: "BRL",
          }
        )}

───────────────

📦 Resumo
1 item
Frete: a calcular

Total dos produtos: ${total.toLocaleString(
          "pt-BR",
          {
            style: "currency",
            currency: "BRL",
          }
        )}

Gostaria de confirmar a disponibilidade e finalizar meu pedido. 😊`;

      await criarPedido(
        {
          nome_cliente:
            dados.nome.trim(),

          telefone:
            dados.telefone.trim(),

          total,

          cep:
            dados.cep.trim(),

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

          estado:
            dados.estado
              .trim()
              .toUpperCase(),

          referencia:
            dados.referencia.trim(),
        },
        [
          {
            produto_id:
              produto.id,

            nome_produto:
              produto.nome,

            codigo:
              produto.codigo,

            marca:
              produto.marca,

            cor:
              corSelecionada,

            tamanho:
              tamanhoSelecionado,

            quantidade: 1,

            preco:
              Number(
                produto.preco
              ),

            subtotal: total,
          },
        ]
      );

      const mensagem =
        encodeURIComponent(
          textoMensagem
        );

      const url =
        `https://wa.me/${WHATSAPP}?text=${mensagem}`;

      setDados(
        dadosIniciais
      );

      setMostrarFinalizacao(
        false
      );

      window.location.href =
        url;
    } catch (error) {
      console.error(
        "Erro ao registrar pedido:",
        error
      );

      if (
        error instanceof Error
      ) {
        window.alert(
          error.message
        );
      } else {
        window.alert(
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
      <main className="min-h-screen bg-[#111111] text-white">
        <header className="border-b border-[#C8A95B]/20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C8A95B] font-bold text-[#C8A95B]">
                MT
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-[0.18em] text-[#C8A95B]">
                  MTELLES
                </h1>

                <p className="text-xs text-[#F3E8D7]/70">
                  Elegância em cada passo
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="rounded-full border border-[#C8A95B] px-5 py-2 text-sm text-[#C8A95B] transition hover:bg-[#C8A95B] hover:text-black"
            >
              Voltar
            </Link>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl gap-14 px-6 py-14 lg:grid-cols-2">
          <div>
            <button
              type="button"
              onClick={() =>
                setImagemAmpliada(
                  true
                )
              }
              className="flex w-full items-center justify-center overflow-hidden rounded-3xl border border-[#C8A95B]/20 bg-[#181818]"
            >
              {imagemSelecionada ? (
                <img
                  src={
                    imagemSelecionada
                  }
                  alt={produto.nome}
                  className="max-h-[650px] w-full object-contain"
                />
              ) : (
                <div className="flex h-[650px] items-center justify-center text-8xl">
                  👠
                </div>
              )}
            </button>

            {imagens.length >
              1 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {imagens.map(
                  (
                    imagem,
                    index
                  ) => (
                    <button
                      key={`${imagem}-${index}`}
                      type="button"
                      onClick={() =>
                        setImagemSelecionada(
                          imagem
                        )
                      }
                      className={`overflow-hidden rounded-xl border transition ${
                        imagemSelecionada ===
                        imagem
                          ? "border-[#C8A95B]"
                          : "border-[#333333]"
                      }`}
                    >
                      <img
                        src={imagem}
                        alt={`${produto.nome} ${
                          index + 1
                        }`}
                        className="h-24 w-24 object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-sm uppercase tracking-[0.2em] text-[#C8A95B]">
              {produto.categoria}
            </span>

            <h1 className="mt-3 text-5xl font-bold leading-tight">
              {produto.nome}
            </h1>

            <p className="mt-2 text-lg text-[#F3E8D7]/70">
              {produto.marca}
            </p>

            <div className="mt-8">
              <p className="text-4xl font-bold text-[#C8A95B]">
                {produto.preco.toLocaleString(
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

            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#C8A95B]">
                  Código:
                </span>

                <span>
                  {produto.codigo}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#C8A95B]">
                  Estoque:
                </span>

                <span>
                  {produto.estoque}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold">
                Descrição
              </h3>

              <p className="leading-8 text-[#F3E8D7]/70">
                {
                  produto.descricao
                }
              </p>
            </div>

            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold">
                Escolha a cor
              </h3>

              <div className="flex flex-wrap gap-3">
                {coresDisponiveis.map(
                  (
                    cor,
                    index
                  ) => (
                    <button
                      key={`${cor}-${index}`}
                      type="button"
                      onClick={() =>
                        selecionarCor(
                          cor,
                          index
                        )
                      }
                      className={`rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                        corSelecionada ===
                        cor
                          ? "border-[#C8A95B] bg-[#C8A95B] text-[#111111]"
                          : "border-[#444444] text-[#F3E8D7] hover:border-[#C8A95B]"
                      }`}
                    >
                      {cor}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold">
                Escolha o tamanho
              </h3>

              <div className="flex flex-wrap gap-3">
                {tamanhosDisponiveis.map(
                  (tamanho) => (
                    <button
                      key={
                        tamanho
                      }
                      type="button"
                      onClick={() =>
                        setTamanhoSelecionado(
                          tamanho
                        )
                      }
                      className={`flex h-12 min-w-12 items-center justify-center rounded-full border px-3 transition-all duration-200 ${
                        tamanhoSelecionado ===
                        tamanho
                          ? "border-[#C8A95B] bg-[#C8A95B] text-[#111111]"
                          : "border-[#444444] hover:border-[#C8A95B]"
                      }`}
                    >
                      {tamanho}
                    </button>
                  )
                )}
              </div>

              {!tamanhoSelecionado && (
                <p className="mt-3 text-sm text-[#F3E8D7]/50">
                  Selecione uma
                  numeração antes de
                  continuar.
                </p>
              )}
            </div>

            <div className="mt-12 grid gap-4">
              <button
                type="button"
                onClick={
                  adicionarAoCarrinho
                }
                className="rounded-full bg-white px-8 py-5 text-center text-lg font-bold text-[#111111] transition hover:scale-[1.02] hover:bg-[#F3E8D7]"
              >
                Adicionar ao Carrinho
              </button>

              <button
                type="button"
                onClick={
                  comprarPeloWhatsApp
                }
                className="rounded-full bg-[#C8A95B] px-8 py-5 text-center text-lg font-bold text-[#111111] transition hover:scale-[1.02] hover:bg-[#e5c96f]"
              >
                Comprar pelo WhatsApp
              </button>
            </div>
          </div>
        </section>
                {produtosRelacionados.length >
          0 && (
          <section className="border-t border-[#2A2A2A] bg-[#151515]">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <h2 className="mb-10 text-3xl font-bold text-white">
                Produtos relacionados
              </h2>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {produtosRelacionados.map(
                  (item) => (
                    <Link
                      key={item.id}
                      href={`/produto/${item.codigo}`}
                      className="group overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#1A1A1A] transition-all duration-300 hover:-translate-y-2 hover:border-[#C8A95B]"
                    >
                      <div className="overflow-hidden bg-[#111111]">
                        {item.imagem_principal ? (
                          <img
                            src={
                              item.imagem_principal
                            }
                            alt={
                              item.nome
                            }
                            className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-80 items-center justify-center text-7xl">
                            👠
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 p-6">
                        <span className="text-xs uppercase tracking-[0.2em] text-[#C8A95B]">
                          {
                            item.categoria
                          }
                        </span>

                        <h3 className="text-xl font-semibold text-white">
                          {item.nome}
                        </h3>

                        <p className="line-clamp-2 text-sm text-[#F3E8D7]/65">
                          {
                            item.descricao
                          }
                        </p>

                        <div className="flex items-center justify-between gap-4 pt-3">
                          <span className="text-2xl font-bold text-[#C8A95B]">
                            {item.preco.toLocaleString(
                              "pt-BR",
                              {
                                style:
                                  "currency",
                                currency:
                                  "BRL",
                              }
                            )}
                          </span>

                          <span className="rounded-full border border-[#C8A95B] px-4 py-2 text-sm text-[#C8A95B] transition group-hover:bg-[#C8A95B] group-hover:text-[#111111]">
                            Ver produto
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* IMAGEM AMPLIADA */}

      {imagemAmpliada && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-6"
          onClick={() =>
            setImagemAmpliada(
              false
            )
          }
        >
          <button
            type="button"
            onClick={() =>
              setImagemAmpliada(
                false
              )
            }
            aria-label="Fechar imagem ampliada"
            className="absolute right-8 top-8 text-5xl text-white transition hover:text-[#C8A95B]"
          >
            ×
          </button>

          <img
            src={
              imagemSelecionada
            }
            alt={produto.nome}
            className="max-h-[92vh] max-w-[95vw] rounded-2xl object-contain"
            onClick={(evento) =>
              evento.stopPropagation()
            }
          />
        </div>
      )}

      {/* FINALIZAÇÃO DA COMPRA DIRETA */}

      {mostrarFinalizacao && (
        <>
          <div
            className="fixed inset-0 z-[130] bg-black/70"
            onClick={() => {
              if (!enviando) {
                setMostrarFinalizacao(
                  false
                );
              }
            }}
          />

          <aside className="fixed right-0 top-0 z-[140] flex h-dvh w-full max-w-md flex-col overflow-hidden border-l border-[#C8A95B]/20 bg-[#111111] text-white shadow-2xl">
            {/* CABEÇALHO */}

            <div className="flex shrink-0 items-center justify-between border-b border-[#C8A95B]/20 px-6 py-4">
              <div>
                <h2 className="text-2xl font-bold">
                  Finalizar pedido
                </h2>

                <p className="mt-0.5 text-sm text-[#F3E8D7]/50">
                  Dados para entrega
                </p>
              </div>

              <button
                type="button"
                disabled={enviando}
                onClick={() =>
                  setMostrarFinalizacao(
                    false
                  )
                }
                aria-label="Fechar finalização"
                className="flex h-10 w-10 items-center justify-center rounded-full text-3xl text-[#C8A95B] disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                finalizarCompraDireta
              }
              className="flex min-h-0 flex-1 flex-col"
            >
              <div
                className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
                style={{
                  WebkitOverflowScrolling:
                    "touch",
                }}
              >
                {/* PRODUTO */}

                <div className="rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8A95B]">
                    Seu pedido
                  </p>

                  <div className="mt-4 flex gap-4">
                    {produto.imagem_principal ? (
                      <img
                        src={
                          produto.imagem_principal
                        }
                        alt={
                          produto.nome
                        }
                        className="h-24 w-24 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-4xl">
                        👠
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="font-bold">
                        {produto.nome}
                      </p>

                      <p className="mt-1 text-xs text-[#F3E8D7]/50">
                        {
                          produto.marca
                        }{" "}
                        | Cód.{" "}
                        {
                          produto.codigo
                        }
                      </p>

                      <p className="mt-2 text-sm text-[#F3E8D7]/70">
                        Cor:{" "}
                        <strong className="text-white">
                          {
                            corSelecionada
                          }
                        </strong>
                      </p>

                      <p className="text-sm text-[#F3E8D7]/70">
                        Tamanho:{" "}
                        <strong className="text-white">
                          {
                            tamanhoSelecionado
                          }
                        </strong>
                      </p>

                      <p className="mt-2 font-bold text-[#C8A95B]">
                        {produto.preco.toLocaleString(
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
                </div>

                {/* DADOS DO CLIENTE */}

                <div className="mt-4 rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-4">
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
                        value={
                          dados.nome
                        }
                        onChange={(
                          event
                        ) =>
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
                        onChange={(
                          event
                        ) =>
                          atualizarCampo(
                            "telefone",
                            formatarTelefone(
                              event
                                .target
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
                        value={
                          dados.cep
                        }
                        onChange={(
                          event
                        ) =>
                          atualizarCampo(
                            "cep",
                            formatarCep(
                              event
                                .target
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
                        onChange={(
                          event
                        ) =>
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
                              event
                                .target
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
                              event
                                .target
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
                        value={
                          dados.bairro
                        }
                        onChange={(
                          event
                        ) =>
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
                              event
                                .target
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
                                .slice(
                                  0,
                                  2
                                )
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
                        onChange={(
                          event
                        ) =>
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
                    <span>
                      Itens
                    </span>

                    <span>
                      1
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#C8A95B]/10 pt-3">
                    <span className="font-semibold text-white">
                      Total do pedido
                    </span>

                    <span className="text-xl font-bold text-[#C8A95B]">
                      {produto.preco.toLocaleString(
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

              {/* BOTÕES */}

              <div className="shrink-0 border-t border-[#C8A95B]/20 bg-[#0f0f0f] px-5 py-3">
                <button
                  type="button"
                  disabled={enviando}
                  onClick={() =>
                    setMostrarFinalizacao(
                      false
                    )
                  }
                  className="w-full touch-manipulation rounded-full border border-[#C8A95B] py-2.5 text-sm font-semibold text-[#C8A95B] active:bg-[#C8A95B] active:text-[#111111] disabled:opacity-50"
                >
                  Voltar ao produto
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
          </aside>
        </>
      )}
    </>
  );
}