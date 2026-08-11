"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Avaliacao,
} from "@/services/avaliacoes";

type FiltroStatus =
  | "TODAS"
  | "PENDENTE"
  | "APROVADA"
  | "REJEITADA";

type StatusAvaliacao =
  | "PENDENTE"
  | "APROVADA"
  | "REJEITADA";

function formatarData(
  data: string
) {
  return new Date(
    data
  ).toLocaleString(
    "pt-BR",
    {
      dateStyle: "short",
      timeStyle: "short",
    }
  );
}

export default function AvaliacoesAdminPage() {
  const [
    avaliacoes,
    setAvaliacoes,
  ] = useState<Avaliacao[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    filtroStatus,
    setFiltroStatus,
  ] =
    useState<FiltroStatus>(
      "PENDENTE"
    );

  const [
    processandoId,
    setProcessandoId,
  ] = useState<
    number | null
  >(null);

  const [
    acessoPermitido,
    setAcessoPermitido,
  ] = useState<
    boolean | null
  >(null);

  /*
   * CONTROLE DE ACESSO
   */

  useEffect(() => {
    const logado =
      sessionStorage.getItem(
        "adminLogado"
      );

    if (
      logado !== "true"
    ) {
      window.location.replace(
        "/login"
      );

      return;
    }

    setAcessoPermitido(
      true
    );
  }, []);

  /*
   * CARREGAR AVALIAÇÕES
   *
   * Agora usamos a API administrativa.
   *
   * A API utiliza a
   * SUPABASE_SERVICE_ROLE_KEY
   * somente no servidor.
   */

  const carregarAvaliacoes =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const resposta =
            await fetch(
              "/api/admin/avaliacoes",
              {
                method: "GET",
                cache: "no-store",
              }
            );

          if (
            !resposta.ok
          ) {
            const erro =
              await resposta
                .json()
                .catch(
                  () => null
                );

            throw new Error(
              erro?.error ||
                "Não foi possível carregar as avaliações."
            );
          }

          const dados =
            (await resposta.json()) as Avaliacao[];

          setAvaliacoes(
            Array.isArray(dados)
              ? dados
              : []
          );
        } catch (error) {
          console.error(
            "Erro ao carregar avaliações:",
            error
          );

          alert(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar as avaliações."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    if (
      acessoPermitido
    ) {
      carregarAvaliacoes();
    }
  }, [
    acessoPermitido,
    carregarAvaliacoes,
  ]);

  /*
   * CONTADORES
   */

  const quantidadePendentes =
    useMemo(
      () =>
        avaliacoes.filter(
          (avaliacao) =>
            avaliacao.status ===
            "PENDENTE"
        ).length,
      [avaliacoes]
    );

  const quantidadeAprovadas =
    useMemo(
      () =>
        avaliacoes.filter(
          (avaliacao) =>
            avaliacao.status ===
            "APROVADA"
        ).length,
      [avaliacoes]
    );

  const quantidadeRejeitadas =
    useMemo(
      () =>
        avaliacoes.filter(
          (avaliacao) =>
            avaliacao.status ===
            "REJEITADA"
        ).length,
      [avaliacoes]
    );

  /*
   * FILTRO
   */

  const avaliacoesFiltradas =
    useMemo(() => {
      if (
        filtroStatus ===
        "TODAS"
      ) {
        return avaliacoes;
      }

      return avaliacoes.filter(
        (avaliacao) =>
          avaliacao.status ===
          filtroStatus
      );
    }, [
      avaliacoes,
      filtroStatus,
    ]);

  /*
   * ALTERAR STATUS
   *
   * Agora a alteração também
   * passa pela API administrativa.
   */

  async function alterarStatus(
    avaliacao: Avaliacao,
    novoStatus:
      | "APROVADA"
      | "REJEITADA"
  ) {
    const acao =
      novoStatus ===
      "APROVADA"
        ? "aprovar"
        : "rejeitar";

    const confirmar =
      window.confirm(
        `Deseja ${acao} a avaliação de ${avaliacao.nome_cliente}?`
      );

    if (!confirmar) {
      return;
    }

    try {
      setProcessandoId(
        avaliacao.id
      );

      const resposta =
        await fetch(
          "/api/admin/avaliacoes",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: avaliacao.id,
              status:
                novoStatus,
            }),
          }
        );

      if (
        !resposta.ok
      ) {
        const erro =
          await resposta
            .json()
            .catch(
              () => null
            );

        throw new Error(
          erro?.error ||
            "Não foi possível alterar a avaliação."
        );
      }

      /*
       * Atualiza novamente a lista
       * depois da aprovação/rejeição.
       */

      await carregarAvaliacoes();
    } catch (error) {
      console.error(
        "Erro ao alterar avaliação:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível alterar a avaliação."
      );
    } finally {
      setProcessandoId(
        null
      );
    }
  }

  /*
   * AGUARDANDO VERIFICAÇÃO
   */

  if (
    acessoPermitido ===
    null
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#111111] text-white">
        Carregando...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111111] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* CABEÇALHO */}

        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C8A95B]">
              MTelles
            </p>

            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Avaliações de Clientes
            </h1>

            <p className="mt-3 max-w-2xl text-[#F3E8D7]/60">
              Analise as experiências
              enviadas pelos clientes
              antes de publicá-las na
              loja.
            </p>
          </div>

          <select
            value={
              filtroStatus
            }
            onChange={(
              event
            ) =>
              setFiltroStatus(
                event.target
                  .value as FiltroStatus
              )
            }
            className="w-full rounded-xl border border-[#C8A95B]/30 bg-[#181818] px-5 py-3 text-white outline-none transition focus:border-[#C8A95B] lg:w-auto"
          >
            <option value="TODAS">
              Todas
            </option>

            <option value="PENDENTE">
              Pendentes
            </option>

            <option value="APROVADA">
              Aprovadas
            </option>

            <option value="REJEITADA">
              Rejeitadas
            </option>
          </select>
        </div>

        {/* RESUMO */}

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6">
            <p className="text-sm uppercase tracking-widest text-[#F3E8D7]/60">
              Total
            </p>

            <p className="mt-3 text-4xl font-black text-[#C8A95B]">
              {
                avaliacoes.length
              }
            </p>
          </div>

          <div className="rounded-3xl border border-yellow-500/20 bg-[#181818] p-6">
            <p className="text-sm uppercase tracking-widest text-[#F3E8D7]/60">
              Pendentes
            </p>

            <p className="mt-3 text-4xl font-black text-yellow-400">
              {
                quantidadePendentes
              }
            </p>
          </div>

          <div className="rounded-3xl border border-green-500/20 bg-[#181818] p-6">
            <p className="text-sm uppercase tracking-widest text-[#F3E8D7]/60">
              Aprovadas
            </p>

            <p className="mt-3 text-4xl font-black text-green-400">
              {
                quantidadeAprovadas
              }
            </p>
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-[#181818] p-6">
            <p className="text-sm uppercase tracking-widest text-[#F3E8D7]/60">
              Rejeitadas
            </p>

            <p className="mt-3 text-4xl font-black text-red-400">
              {
                quantidadeRejeitadas
              }
            </p>
          </div>
        </div>

        {/* AVALIAÇÕES */}

        {loading ? (
          <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-12 text-center text-[#F3E8D7]/60">
            Carregando
            avaliações...
          </div>
        ) : avaliacoesFiltradas.length ===
          0 ? (
          <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-12 text-center">
            <div className="text-5xl">
              ⭐
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Nenhuma avaliação
              encontrada
            </h2>

            <p className="mt-2 text-sm text-[#F3E8D7]/60">
              Não existem
              avaliações neste
              status.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {avaliacoesFiltradas.map(
              (avaliacao) => (
                <article
                  key={
                    avaliacao.id
                  }
                  className="overflow-hidden rounded-3xl border border-[#C8A95B]/20 bg-[#181818]"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-bold">
                            {
                              avaliacao.nome_cliente
                            }
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              avaliacao.status ===
                              "APROVADA"
                                ? "bg-green-500/15 text-green-400"
                                : avaliacao.status ===
                                    "REJEITADA"
                                  ? "bg-red-500/15 text-red-400"
                                  : "bg-yellow-500/15 text-yellow-400"
                            }`}
                          >
                            {
                              avaliacao.status
                            }
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-[#F3E8D7]/50">
                          {formatarData(
                            avaliacao.created_at
                          )}
                        </p>
                      </div>

                      {/* ESTRELAS */}

                      <div
                        className="flex gap-1 text-2xl"
                        aria-label={`${avaliacao.nota} de 5 estrelas`}
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
                                  ? "text-yellow-400"
                                  : "text-white/15"
                              }
                            >
                              ★
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* COMENTÁRIO */}

                    <div className="mt-6 rounded-2xl border border-[#C8A95B]/10 bg-[#111111] p-5">
                      <p className="whitespace-pre-wrap leading-7 text-[#F3E8D7]/80">
                        {
                          avaliacao.comentario
                        }
                      </p>
                    </div>

                    {/* FOTOS */}

                    {Array.isArray(
                      avaliacao.fotos
                    ) &&
                      avaliacao.fotos
                        .length >
                        0 && (
                        <div className="mt-6">
                          <p className="mb-3 text-sm font-bold text-[#F3E8D7]/70">
                            Fotos enviadas
                            pelo cliente
                          </p>

                          <div className="grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
                            {avaliacao.fotos.map(
                              (
                                foto,
                                indice
                              ) => (
                                <a
                                  key={`${avaliacao.id}-${indice}`}
                                  href={
                                    foto
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group aspect-square overflow-hidden rounded-2xl border border-[#C8A95B]/20 bg-[#111111]"
                                >
                                  <img
                                    src={
                                      foto
                                    }
                                    alt={`Foto ${indice + 1} da avaliação de ${avaliacao.nome_cliente}`}
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                  />
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* AÇÕES */}

                    <div className="mt-7 flex flex-col gap-3 border-t border-[#C8A95B]/10 pt-6 sm:flex-row sm:justify-end">
                      {avaliacao.status !==
                        "REJEITADA" && (
                        <button
                          type="button"
                          disabled={
                            processandoId ===
                            avaliacao.id
                          }
                          onClick={() =>
                            alterarStatus(
                              avaliacao,
                              "REJEITADA"
                            )
                          }
                          className="rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-3 font-bold text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {processandoId ===
                          avaliacao.id
                            ? "Processando..."
                            : "Rejeitar"}
                        </button>
                      )}

                      {avaliacao.status !==
                        "APROVADA" && (
                        <button
                          type="button"
                          disabled={
                            processandoId ===
                            avaliacao.id
                          }
                          onClick={() =>
                            alterarStatus(
                              avaliacao,
                              "APROVADA"
                            )
                          }
                          className="rounded-xl bg-[#C8A95B] px-6 py-3 font-bold text-[#111111] transition hover:bg-[#e3c46f] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {processandoId ===
                          avaliacao.id
                            ? "Processando..."
                            : "Aprovar"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}