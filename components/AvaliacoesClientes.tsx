"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Avaliacao,
  enviarAvaliacao,
  getAvaliacoesAprovadas,
} from "@/services/avaliacoes";

type FiltroAvaliacao =
  | "TODAS"
  | "COM_FOTOS"
  | "5"
  | "4";

const QUANTIDADE_INICIAL = 3;
const QUANTIDADE_POR_VEZ = 3;

export default function AvaliacoesClientes() {
  const [avaliacoes, setAvaliacoes] =
    useState<Avaliacao[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [formularioAberto, setFormularioAberto] =
    useState(false);

  const [filtro, setFiltro] =
    useState<FiltroAvaliacao>("TODAS");

  const [quantidadeVisivel, setQuantidadeVisivel] =
    useState(QUANTIDADE_INICIAL);

  const [fotoAmpliada, setFotoAmpliada] =
    useState<string | null>(null);

  const [nome, setNome] =
    useState("");

  const [nota, setNota] =
    useState(0);

  const [comentario, setComentario] =
    useState("");

  const [fotos, setFotos] =
    useState<File[]>([]);

  const [enviando, setEnviando] =
    useState(false);

  const [mensagemSucesso, setMensagemSucesso] =
    useState("");

  const [mensagemErro, setMensagemErro] =
    useState("");

  /*
   * CARREGAR AVALIAÇÕES APROVADAS
   */

  const carregarAvaliacoes =
    useCallback(async () => {
      try {
        setLoading(true);

        const dados =
          await getAvaliacoesAprovadas();

        setAvaliacoes(
          dados ?? []
        );
      } catch (error) {
        console.error(
          "Erro ao carregar avaliações:",
          error
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    carregarAvaliacoes();
  }, [carregarAvaliacoes]);

  /*
   * MÉDIA DAS AVALIAÇÕES
   */

  const mediaAvaliacoes =
    useMemo(() => {
      if (
        avaliacoes.length === 0
      ) {
        return 0;
      }

      const total =
        avaliacoes.reduce(
          (
            acumulador,
            avaliacao
          ) =>
            acumulador +
            avaliacao.nota,
          0
        );

      return (
        total /
        avaliacoes.length
      );
    }, [avaliacoes]);

  /*
   * FILTRAR AVALIAÇÕES
   */

  const avaliacoesFiltradas =
    useMemo(() => {
      if (
        filtro === "COM_FOTOS"
      ) {
        return avaliacoes.filter(
          (avaliacao) =>
            Array.isArray(
              avaliacao.fotos
            ) &&
            avaliacao.fotos.length >
              0
        );
      }

      if (
        filtro === "5"
      ) {
        return avaliacoes.filter(
          (avaliacao) =>
            avaliacao.nota === 5
        );
      }

      if (
        filtro === "4"
      ) {
        return avaliacoes.filter(
          (avaliacao) =>
            avaliacao.nota === 4
        );
      }

      return avaliacoes;
    }, [
      avaliacoes,
      filtro,
    ]);

  /*
   * AVALIAÇÕES VISÍVEIS
   */

  const avaliacoesVisiveis =
    useMemo(
      () =>
        avaliacoesFiltradas.slice(
          0,
          quantidadeVisivel
        ),
      [
        avaliacoesFiltradas,
        quantidadeVisivel,
      ]
    );

  /*
   * TROCAR FILTRO
   */

  function alterarFiltro(
    novoFiltro: FiltroAvaliacao
  ) {
    setFiltro(novoFiltro);

    setQuantidadeVisivel(
      QUANTIDADE_INICIAL
    );
  }

  /*
   * SELECIONAR FOTOS
   */

  function selecionarFotos(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setMensagemErro("");
    setMensagemSucesso("");

    const arquivos =
      Array.from(
        event.target.files ?? []
      );

    if (arquivos.length > 3) {
      setMensagemErro(
        "Você pode selecionar no máximo 3 fotos."
      );

      event.target.value = "";

      return;
    }

    const tamanhoMaximo =
      5 * 1024 * 1024;

    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    for (
      const arquivo of arquivos
    ) {
      if (
        !tiposPermitidos.includes(
          arquivo.type
        )
      ) {
        setMensagemErro(
          "As fotos devem estar nos formatos JPG, PNG ou WEBP."
        );

        event.target.value = "";

        return;
      }

      if (
        arquivo.size >
        tamanhoMaximo
      ) {
        setMensagemErro(
          "Cada foto pode ter no máximo 5 MB."
        );

        event.target.value = "";

        return;
      }
    }

    setFotos(arquivos);
  }

  /*
   * ENVIAR AVALIAÇÃO
   */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMensagemErro("");
    setMensagemSucesso("");

    if (!nome.trim()) {
      setMensagemErro(
        "Informe seu nome."
      );

      return;
    }

    if (
      nota < 1 ||
      nota > 5
    ) {
      setMensagemErro(
        "Escolha de 1 a 5 estrelas."
      );

      return;
    }

    if (!comentario.trim()) {
      setMensagemErro(
        "Conte como foi sua experiência com a MTelles."
      );

      return;
    }

    try {
      setEnviando(true);

      await enviarAvaliacao({
        nome_cliente:
          nome.trim(),
        nota,
        comentario:
          comentario.trim(),
        fotos,
      });

      setNome("");
      setNota(0);
      setComentario("");
      setFotos([]);

      const inputFotos =
        document.getElementById(
          "fotos-avaliacao"
        ) as HTMLInputElement | null;

      if (inputFotos) {
        inputFotos.value = "";
      }

      setMensagemSucesso(
        "Obrigado pela sua avaliação! Ela foi enviada e será publicada após aprovação."
      );
    } catch (error) {
      console.error(
        "Erro ao enviar avaliação:",
        error
      );

      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível enviar sua avaliação.";

      setMensagemErro(
        mensagem
      );
    } finally {
      setEnviando(false);
    }
  }

  /*
   * ESTILO DOS FILTROS
   */

  function classeFiltro(
    filtroAtual: FiltroAvaliacao
  ) {
    return filtro ===
      filtroAtual
      ? "border-[#C8A95B] bg-[#C8A95B] text-[#111111]"
      : "border-[#C8A95B]/25 bg-[#181818] text-[#F3E8D7]/70 hover:border-[#C8A95B] hover:text-white";
  }

  return (
    <section
      id="avaliacoes"
      className="relative border-y border-[#C8A95B]/15 bg-[#151515]"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

        {/* CABEÇALHO */}

        <div className="flex flex-col gap-5 border-b border-[#C8A95B]/15 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C8A95B]">
              Clientes MTelles
            </p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Avaliações de Clientes
            </h2>

            <p className="mt-2 text-sm text-[#F3E8D7]/55">
              Experiências de
              clientes MTelles
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {!loading &&
              avaliacoes.length >
                0 && (
                <div className="text-left sm:text-right">
                  <div className="flex items-center gap-2 sm:justify-end">
                    <span className="text-xl font-black text-white">
                      {mediaAvaliacoes.toFixed(
                        1
                      )}
                    </span>

                    <span className="tracking-[0.08em] text-[#C8A95B]">
                      ★★★★★
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-[#F3E8D7]/45">
                    {
                      avaliacoes.length
                    }{" "}
                    {avaliacoes.length ===
                    1
                      ? "avaliação"
                      : "avaliações"}
                  </p>
                </div>
              )}

            <button
              type="button"
              onClick={() => {
                setFormularioAberto(
                  true
                );

                setMensagemErro("");
                setMensagemSucesso("");
              }}
              className="rounded-xl bg-[#C8A95B] px-5 py-3 text-sm font-black uppercase tracking-wide text-[#111111] transition hover:bg-[#e3c46f]"
            >
              Deixar avaliação
            </button>
          </div>
        </div>

        {/* FILTROS */}

        {!loading &&
          avaliacoes.length >
            0 && (
            <div className="flex flex-wrap gap-2 border-b border-[#C8A95B]/10 py-5">
              <button
                type="button"
                onClick={() =>
                  alterarFiltro(
                    "TODAS"
                  )
                }
                className={`rounded-lg border px-4 py-2 text-xs font-bold transition ${classeFiltro(
                  "TODAS"
                )}`}
              >
                Todas
              </button>

              <button
                type="button"
                onClick={() =>
                  alterarFiltro(
                    "COM_FOTOS"
                  )
                }
                className={`rounded-lg border px-4 py-2 text-xs font-bold transition ${classeFiltro(
                  "COM_FOTOS"
                )}`}
              >
                Com fotos
              </button>

              <button
                type="button"
                onClick={() =>
                  alterarFiltro(
                    "5"
                  )
                }
                className={`rounded-lg border px-4 py-2 text-xs font-bold transition ${classeFiltro(
                  "5"
                )}`}
              >
                5 ★
              </button>

              <button
                type="button"
                onClick={() =>
                  alterarFiltro(
                    "4"
                  )
                }
                className={`rounded-lg border px-4 py-2 text-xs font-bold transition ${classeFiltro(
                  "4"
                )}`}
              >
                4 ★
              </button>
            </div>
          )}

        {/* CARREGAMENTO */}

        {loading && (
          <div className="py-12 text-center text-sm text-[#F3E8D7]/50">
            Carregando avaliações...
          </div>
        )}

        {/* SEM AVALIAÇÕES */}

        {!loading &&
          avaliacoes.length ===
            0 && (
            <div className="py-12 text-center">
              <div className="text-3xl">
                ☆
              </div>

              <h3 className="mt-3 font-bold text-white">
                Seja a primeira a
                avaliar
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#F3E8D7]/50">
                Compartilhe sua
                experiência com a
                MTelles.
              </p>
            </div>
          )}

        {/* FILTRO SEM RESULTADO */}

        {!loading &&
          avaliacoes.length >
            0 &&
          avaliacoesFiltradas.length ===
            0 && (
            <div className="py-10 text-center text-sm text-[#F3E8D7]/50">
              Nenhuma avaliação
              encontrada neste filtro.
            </div>
          )}

        {/* LISTA */}

        {!loading &&
          avaliacoesVisiveis.length >
            0 && (
            <div>
              {avaliacoesVisiveis.map(
                (
                  avaliacao,
                  indiceAvaliacao
                ) => (
                  <article
                    key={
                      avaliacao.id
                    }
                    className={`py-7 ${
                      indiceAvaliacao !==
                      avaliacoesVisiveis.length -
                        1
                        ? "border-b border-[#C8A95B]/15"
                        : ""
                    }`}
                  >
                    {/* NOME E DATA */}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <h3 className="font-black text-white">
                        {
                          avaliacao.nome_cliente
                        }
                      </h3>

                      <span className="text-xs text-[#F3E8D7]/40">
                        {new Date(
                          avaliacao.created_at
                        ).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                    </div>

                    {/* ESTRELAS */}

                    <div
                      className="mt-2 text-lg tracking-[0.08em] text-[#C8A95B]"
                      aria-label={`${avaliacao.nota} estrelas`}
                    >
                      {Array.from(
                        {
                          length: 5,
                        },
                        (
                          _,
                          indice
                        ) => (
                          <span
                            key={
                              indice
                            }
                            className={
                              indice <
                              avaliacao.nota
                                ? "text-[#C8A95B]"
                                : "text-[#F3E8D7]/15"
                            }
                          >
                            ★
                          </span>
                        )
                      )}
                    </div>

                    {/* COMENTÁRIO */}

                    <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-[#F3E8D7]/75 sm:text-base">
                      {
                        avaliacao.comentario
                      }
                    </p>

                    {/* FOTOS ABAIXO DO COMENTÁRIO */}

                    {Array.isArray(
                      avaliacao.fotos
                    ) &&
                      avaliacao.fotos
                        .length >
                        0 && (
                        <div className="mt-4 flex flex-wrap items-start gap-2">
                          {avaliacao.fotos.map(
                            (
                              foto,
                              indice
                            ) => (
                              <button
                                key={`${avaliacao.id}-${indice}`}
                                type="button"
                                onClick={() =>
                                  setFotoAmpliada(
                                    foto
                                  )
                                }
                                className="group h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[#C8A95B]/20 bg-[#111111] sm:h-[90px] sm:w-[90px]"
                                aria-label={`Ampliar foto ${indice + 1}`}
                              >
                                <img
                                  src={
                                    foto
                                  }
                                  alt={`Foto ${indice + 1} da avaliação de ${avaliacao.nome_cliente}`}
                                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                              </button>
                            )
                          )}
                        </div>
                      )}
                  </article>
                )
              )}
            </div>
          )}

        {/* VER MAIS */}

        {!loading &&
          quantidadeVisivel <
            avaliacoesFiltradas.length && (
            <div className="border-t border-[#C8A95B]/10 pt-5 text-center">
              <button
                type="button"
                onClick={() =>
                  setQuantidadeVisivel(
                    (
                      quantidade
                    ) =>
                      quantidade +
                      QUANTIDADE_POR_VEZ
                  )
                }
                className="rounded-xl border border-[#C8A95B]/30 px-6 py-3 text-sm font-black uppercase tracking-wide text-[#C8A95B] transition hover:border-[#C8A95B] hover:bg-[#C8A95B] hover:text-[#111111]"
              >
                Ver mais avaliações
              </button>
            </div>
          )}
      </div>

      {/* MODAL FORMULÁRIO */}

      {formularioAberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setFormularioAberto(
                false
              );
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#C8A95B]/25 bg-[#111111] shadow-2xl">

            {/* TOPO MODAL */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#C8A95B]/15 bg-[#111111] px-6 py-5 sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8A95B]">
                  Sua opinião
                </p>

                <h3 className="mt-1 text-xl font-black text-white">
                  Conte sua experiência
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFormularioAberto(
                    false
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C8A95B]/20 text-xl text-[#F3E8D7]/70 transition hover:border-[#C8A95B] hover:text-white"
                aria-label="Fechar formulário"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6 sm:p-8"
            >

              {/* NOME */}

              <div>
                <label
                  htmlFor="nome-avaliacao"
                  className="mb-2 block text-sm font-bold text-[#F3E8D7]"
                >
                  Seu nome
                </label>

                <input
                  id="nome-avaliacao"
                  type="text"
                  value={nome}
                  onChange={(
                    event
                  ) =>
                    setNome(
                      event.target.value
                    )
                  }
                  maxLength={80}
                  placeholder="Digite seu nome"
                  className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#181818] px-5 py-4 text-white outline-none transition placeholder:text-[#F3E8D7]/30 focus:border-[#C8A95B]"
                />
              </div>

              {/* ESTRELAS */}

              <div>
                <p className="mb-3 text-sm font-bold text-[#F3E8D7]">
                  Sua avaliação
                </p>

                <div
                  className="flex gap-2"
                  role="radiogroup"
                  aria-label="Nota da avaliação"
                >
                  {[1, 2, 3, 4, 5].map(
                    (estrela) => (
                      <button
                        key={
                          estrela
                        }
                        type="button"
                        onClick={() =>
                          setNota(
                            estrela
                          )
                        }
                        aria-label={`${estrela} ${
                          estrela ===
                          1
                            ? "estrela"
                            : "estrelas"
                        }`}
                        className={`text-4xl leading-none transition hover:scale-110 ${
                          estrela <=
                          nota
                            ? "text-[#C8A95B]"
                            : "text-[#F3E8D7]/20"
                        }`}
                      >
                        ★
                      </button>
                    )
                  )}
                </div>

                <p className="mt-2 text-xs text-[#F3E8D7]/45">
                  {nota === 0
                    ? "Selecione de 1 a 5 estrelas."
                    : `${nota} ${
                        nota === 1
                          ? "estrela selecionada"
                          : "estrelas selecionadas"
                      }`}
                </p>
              </div>

              {/* COMENTÁRIO */}

              <div>
                <label
                  htmlFor="comentario-avaliacao"
                  className="mb-2 block text-sm font-bold text-[#F3E8D7]"
                >
                  Conte como foi sua
                  experiência
                </label>

                <textarea
                  id="comentario-avaliacao"
                  value={
                    comentario
                  }
                  onChange={(
                    event
                  ) =>
                    setComentario(
                      event.target.value
                    )
                  }
                  maxLength={
                    1000
                  }
                  rows={5}
                  placeholder="Conte como foi sua compra, o atendimento, o produto que recebeu e sua experiência com a MTelles..."
                  className="w-full resize-none rounded-xl border border-[#C8A95B]/20 bg-[#181818] px-5 py-4 leading-7 text-white outline-none transition placeholder:text-[#F3E8D7]/30 focus:border-[#C8A95B]"
                />

                <div className="mt-2 text-right text-xs text-[#F3E8D7]/40">
                  {
                    comentario.length
                  }
                  /1000
                </div>
              </div>

              {/* FOTOS */}

              <div>
                <label
                  htmlFor="fotos-avaliacao"
                  className="mb-2 block text-sm font-bold text-[#F3E8D7]"
                >
                  Fotos da sua compra
                  <span className="ml-2 font-normal text-[#F3E8D7]/45">
                    (opcional)
                  </span>
                </label>

                <label
                  htmlFor="fotos-avaliacao"
                  className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[#C8A95B]/30 bg-[#181818] px-5 py-5 transition hover:border-[#C8A95B]"
                >
                  <span className="text-2xl">
                    📷
                  </span>

                  <div>
                    <p className="font-bold text-[#C8A95B]">
                      Adicionar fotos
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#F3E8D7]/45">
                      Até 3 fotos • JPG,
                      PNG ou WEBP • máximo
                      5 MB por foto
                    </p>
                  </div>
                </label>

                <input
                  id="fotos-avaliacao"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={
                    selecionarFotos
                  }
                  className="hidden"
                />

                {fotos.length >
                  0 && (
                  <div className="mt-3 space-y-2">
                    {fotos.map(
                      (
                        foto,
                        indice
                      ) => (
                        <div
                          key={`${foto.name}-${indice}`}
                          className="flex items-center gap-3 rounded-xl bg-[#181818] px-4 py-3"
                        >
                          <span>
                            📷
                          </span>

                          <span className="min-w-0 flex-1 truncate text-sm text-[#F3E8D7]/70">
                            {
                              foto.name
                            }
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* ERRO */}

              {mensagemErro && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-300">
                  {
                    mensagemErro
                  }
                </div>
              )}

              {/* SUCESSO */}

              {mensagemSucesso && (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm font-semibold leading-6 text-green-300">
                  {
                    mensagemSucesso
                  }
                </div>
              )}

              {/* ENVIAR */}

              <button
                type="submit"
                disabled={
                  enviando
                }
                className="w-full rounded-xl bg-[#C8A95B] px-6 py-4 font-black text-[#111111] transition hover:bg-[#e3c46f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enviando
                  ? "Enviando avaliação..."
                  : "Enviar avaliação"}
              </button>

              <p className="text-center text-xs leading-5 text-[#F3E8D7]/40">
                As avaliações são
                analisadas antes de
                serem publicadas na
                loja.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOTO */}

      {fotoAmpliada && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setFotoAmpliada(
                null
              );
            }
          }}
        >
          <button
            type="button"
            onClick={() =>
              setFotoAmpliada(
                null
              )
            }
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-2xl text-white"
            aria-label="Fechar foto"
          >
            ×
          </button>

          <img
            src={
              fotoAmpliada
            }
            alt="Foto ampliada da avaliação"
            className="max-h-[88vh] max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </section>
  );
}