"use client";

import {
  KeyboardEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { Product } from "@/types/product";

type TipoSugestao =
  | "marca"
  | "produto"
  | "codigo"
  | "categoria"
  | "cor"
  | "tamanho";

interface Sugestao {
  id: string;
  tipo: TipoSugestao;
  valor: string;
  textoSecundario?: string;
  codigoProduto?: string;
}

interface SearchBarProps {
  busca: string;
  setBusca: (value: string) => void;

  produtos: Product[];

  marcas: string[];
  marcaSelecionada: string;
  setMarcaSelecionada: (value: string) => void;

  categorias: string[];
  categoriaSelecionada: string;
  setCategoriaSelecionada: (value: string) => void;

  cores: string[];
  corSelecionada: string;
  setCorSelecionada: (value: string) => void;

  quantidadeResultados: number;
  limparFiltros: () => void;
}

const OPCAO_TODAS = "Todas";
const CHAVE_HISTORICO =
  "mtelles-historico-pesquisas";

function normalizar(
  texto: string | null | undefined
) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function transformarEmLista(
  valor: string | null | undefined
) {
  if (!valor) {
    return [];
  }

  try {
    const convertido = JSON.parse(valor);

    if (Array.isArray(convertido)) {
      return convertido
        .map((item) => String(item).trim())
        .filter(Boolean);
    }
  } catch {
    // O campo também pode estar separado por vírgulas.
  }

  return valor
    .split(/[,;\n|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function removerDuplicados(
  valores: string[]
) {
  const mapa = new Map<string, string>();

  valores.forEach((valor) => {
    const valorLimpo = valor.trim();
    const chave = normalizar(valorLimpo);

    if (
      valorLimpo &&
      chave &&
      !mapa.has(chave)
    ) {
      mapa.set(chave, valorLimpo);
    }
  });

  return Array.from(mapa.values());
}

function iconeSugestao(
  tipo: TipoSugestao
) {
  const icones: Record<
    TipoSugestao,
    string
  > = {
    marca: "🏷️",
    produto: "👠",
    codigo: "🔖",
    categoria: "📂",
    cor: "🎨",
    tamanho: "📏",
  };

  return icones[tipo];
}

function nomeTipoSugestao(
  tipo: TipoSugestao
) {
  const nomes: Record<
    TipoSugestao,
    string
  > = {
    marca: "Marca",
    produto: "Produto",
    codigo: "Código",
    categoria: "Categoria",
    cor: "Cor",
    tamanho: "Tamanho",
  };

  return nomes[tipo];
}

function destacarTexto(
  texto: string,
  pesquisa: string
): ReactNode {
  const termo = pesquisa.trim();

  if (!termo) {
    return texto;
  }

  const textoNormalizado =
    normalizar(texto);

  const termoNormalizado =
    normalizar(termo);

  const inicio =
    textoNormalizado.indexOf(
      termoNormalizado
    );

  if (inicio === -1) {
    return texto;
  }

  const fim =
    inicio + termo.length;

  return (
    <>
      {texto.slice(0, inicio)}

      <mark className="rounded bg-[#C8A95B]/25 px-0.5 font-bold text-[#E4C97A]">
        {texto.slice(inicio, fim)}
      </mark>

      {texto.slice(fim)}
    </>
  );
}

function calcularPontuacaoProduto(
  produto: Product,
  pesquisa: string
) {
  const marca = normalizar(
    produto.marca
  );

  const nome = normalizar(
    produto.nome
  );

  const codigo = normalizar(
    produto.codigo
  );

  const categoria = normalizar(
    produto.categoria
  );

  const cores = normalizar(
    produto.cores
  );

  const tamanhos = normalizar(
    produto.tamanhos
  );

  let pontos = 0;

  if (marca === pesquisa) {
    pontos += 1200;
  }

  if (nome === pesquisa) {
    pontos += 1150;
  }

  if (codigo === pesquisa) {
    pontos += 1100;
  }

  if (marca.startsWith(pesquisa)) {
    pontos += 900;
  }

  if (nome.startsWith(pesquisa)) {
    pontos += 850;
  }

  if (codigo.startsWith(pesquisa)) {
    pontos += 800;
  }

  if (categoria.startsWith(pesquisa)) {
    pontos += 700;
  }

  if (cores.startsWith(pesquisa)) {
    pontos += 650;
  }

  if (tamanhos.startsWith(pesquisa)) {
    pontos += 600;
  }

  if (marca.includes(pesquisa)) {
    pontos += 500;
  }

  if (nome.includes(pesquisa)) {
    pontos += 450;
  }

  if (codigo.includes(pesquisa)) {
    pontos += 400;
  }

  if (categoria.includes(pesquisa)) {
    pontos += 350;
  }

  if (cores.includes(pesquisa)) {
    pontos += 300;
  }

  if (tamanhos.includes(pesquisa)) {
    pontos += 250;
  }

  if (produto.em_destaque) {
    pontos += 50;
  }

  return pontos;
}

export default function SearchBar({
  busca,
  setBusca,

  produtos,

  marcas,
  marcaSelecionada,
  setMarcaSelecionada,

  categorias,
  categoriaSelecionada,
  setCategoriaSelecionada,

  cores,
  corSelecionada,
  setCorSelecionada,

  quantidadeResultados,
  limparFiltros,
}: SearchBarProps) {
  const router = useRouter();

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [campoFocado, setCampoFocado] =
    useState(false);

  const [
    indiceSugestaoAtiva,
    setIndiceSugestaoAtiva,
  ] = useState(-1);

  const [historico, setHistorico] =
    useState<string[]>([]);

  const filtrosAtivos =
    busca.trim() !== "" ||
    marcaSelecionada !==
      OPCAO_TODAS ||
    categoriaSelecionada !==
      OPCAO_TODAS ||
    corSelecionada !== OPCAO_TODAS;

  const produtosAtivos = useMemo(() => {
    return produtos.filter(
      (produto) => produto.ativo
    );
  }, [produtos]);

  useEffect(() => {
    try {
      const historicoSalvo =
        window.localStorage.getItem(
          CHAVE_HISTORICO
        );

      if (!historicoSalvo) {
        return;
      }

      const historicoConvertido =
        JSON.parse(historicoSalvo);

      if (
        Array.isArray(
          historicoConvertido
        )
      ) {
        setHistorico(
          historicoConvertido
            .map((item) =>
              String(item).trim()
            )
            .filter(Boolean)
            .slice(0, 10)
        );
      }
    } catch {
      setHistorico([]);
    }
  }, []);

  const sugestoes = useMemo(() => {
    const pesquisa =
      normalizar(busca);

    const resultado: Sugestao[] =
      [];

    if (!pesquisa) {
      const produtosIniciais = [
        ...produtosAtivos.filter(
          (produto) =>
            produto.em_destaque
        ),
        ...produtosAtivos.filter(
          (produto) =>
            !produto.em_destaque
        ),
      ].slice(0, 6);

      produtosIniciais.forEach(
        (produto) => {
          resultado.push({
            id: `produto-inicial-${produto.id}`,
            tipo: "produto",
            valor: produto.nome,
            textoSecundario: `${produto.marca.trim()} • Código ${produto.codigo}`,
            codigoProduto:
              produto.codigo,
          });
        }
      );

      return resultado;
    }

    const marcasEncontradas =
      marcas
        .filter(
          (marca) =>
            marca !== OPCAO_TODAS &&
            normalizar(marca).includes(
              pesquisa
            )
        )
        .sort((marcaA, marcaB) => {
          const valorA =
            normalizar(marcaA);

          const valorB =
            normalizar(marcaB);

          if (
            valorA === pesquisa &&
            valorB !== pesquisa
          ) {
            return -1;
          }

          if (
            valorB === pesquisa &&
            valorA !== pesquisa
          ) {
            return 1;
          }

          if (
            valorA.startsWith(
              pesquisa
            ) &&
            !valorB.startsWith(
              pesquisa
            )
          ) {
            return -1;
          }

          if (
            valorB.startsWith(
              pesquisa
            ) &&
            !valorA.startsWith(
              pesquisa
            )
          ) {
            return 1;
          }

          return marcaA.localeCompare(
            marcaB,
            "pt-BR"
          );
        })
        .slice(0, 4);

    marcasEncontradas.forEach(
      (marca) => {
        resultado.push({
          id: `marca-${normalizar(
            marca
          )}`,
          tipo: "marca",
          valor: marca,
          textoSecundario:
            "Ver produtos desta marca",
        });
      }
    );

    const produtosEncontrados =
      produtosAtivos
        .filter((produto) => {
          return (
            normalizar(
              produto.nome
            ).includes(pesquisa) ||
            normalizar(
              produto.marca
            ).includes(pesquisa) ||
            normalizar(
              produto.codigo
            ).includes(pesquisa) ||
            normalizar(
              produto.categoria
            ).includes(pesquisa) ||
            normalizar(
              produto.cores
            ).includes(pesquisa) ||
            normalizar(
              produto.tamanhos
            ).includes(pesquisa)
          );
        })
        .sort(
          (produtoA, produtoB) => {
            const diferenca =
              calcularPontuacaoProduto(
                produtoB,
                pesquisa
              ) -
              calcularPontuacaoProduto(
                produtoA,
                pesquisa
              );

            if (diferenca !== 0) {
              return diferenca;
            }

            return produtoA.nome.localeCompare(
              produtoB.nome,
              "pt-BR"
            );
          }
        )
        .slice(0, 6);

    produtosEncontrados.forEach(
      (produto) => {
        resultado.push({
          id: `produto-${produto.id}`,
          tipo: "produto",
          valor: produto.nome,
          textoSecundario: `${produto.marca.trim()} • Código ${produto.codigo}`,
          codigoProduto:
            produto.codigo,
        });
      }
    );

    const codigosEncontrados =
      removerDuplicados(
        produtosAtivos
          .map(
            (produto) =>
              produto.codigo
          )
          .filter((codigo) =>
            normalizar(
              codigo
            ).includes(pesquisa)
          )
      )
        .sort((codigoA, codigoB) => {
          const valorA =
            normalizar(codigoA);

          const valorB =
            normalizar(codigoB);

          if (
            valorA.startsWith(
              pesquisa
            ) &&
            !valorB.startsWith(
              pesquisa
            )
          ) {
            return -1;
          }

          if (
            valorB.startsWith(
              pesquisa
            ) &&
            !valorA.startsWith(
              pesquisa
            )
          ) {
            return 1;
          }

          return codigoA.localeCompare(
            codigoB,
            "pt-BR"
          );
        })
        .slice(0, 3);

    codigosEncontrados.forEach(
      (codigo) => {
        resultado.push({
          id: `codigo-${normalizar(
            codigo
          )}`,
          tipo: "codigo",
          valor: codigo,
          textoSecundario:
            "Pesquisar por código",
        });
      }
    );

    const categoriasEncontradas =
      categorias
        .filter(
          (categoria) =>
            categoria !==
              OPCAO_TODAS &&
            normalizar(
              categoria
            ).includes(pesquisa)
        )
        .slice(0, 3);

    categoriasEncontradas.forEach(
      (categoria) => {
        resultado.push({
          id: `categoria-${normalizar(
            categoria
          )}`,
          tipo: "categoria",
          valor: categoria,
          textoSecundario:
            "Filtrar por categoria",
        });
      }
    );

    const coresEncontradas =
      cores
        .filter(
          (cor) =>
            cor !== OPCAO_TODAS &&
            normalizar(cor).includes(
              pesquisa
            )
        )
        .slice(0, 3);

    coresEncontradas.forEach(
      (cor) => {
        resultado.push({
          id: `cor-${normalizar(cor)}`,
          tipo: "cor",
          valor: cor,
          textoSecundario:
            "Filtrar por cor",
        });
      }
    );

    const tamanhosDisponiveis =
      removerDuplicados(
        produtosAtivos.flatMap(
          (produto) =>
            transformarEmLista(
              produto.tamanhos
            )
        )
      );

    const tamanhosEncontrados =
      tamanhosDisponiveis
        .filter((tamanho) =>
          normalizar(
            tamanho
          ).includes(pesquisa)
        )
        .slice(0, 4);

    tamanhosEncontrados.forEach(
      (tamanho) => {
        resultado.push({
          id: `tamanho-${normalizar(
            tamanho
          )}`,
          tipo: "tamanho",
          valor: tamanho,
          textoSecundario:
            "Pesquisar por numeração",
        });
      }
    );

    return resultado.slice(0, 14);
  }, [
    busca,
    produtosAtivos,
    marcas,
    categorias,
    cores,
  ]);

  const mostrarSugestoes =
    campoFocado;

  function salvarHistorico(
    pesquisa: string
  ) {
    const texto = pesquisa.trim();

    if (!texto) {
      return;
    }

    const novoHistorico = [
      texto,
      ...historico.filter(
        (item) =>
          normalizar(item) !==
          normalizar(texto)
      ),
    ].slice(0, 10);

    setHistorico(novoHistorico);

    try {
      window.localStorage.setItem(
        CHAVE_HISTORICO,
        JSON.stringify(
          novoHistorico
        )
      );
    } catch {
      // O navegador pode bloquear o armazenamento.
    }
  }

  function removerDoHistorico(
    itemRemovido: string
  ) {
    const novoHistorico =
      historico.filter(
        (item) =>
          normalizar(item) !==
          normalizar(itemRemovido)
      );

    setHistorico(novoHistorico);

    try {
      window.localStorage.setItem(
        CHAVE_HISTORICO,
        JSON.stringify(
          novoHistorico
        )
      );
    } catch {
      // O navegador pode bloquear o armazenamento.
    }
  }

  function limparHistorico() {
    setHistorico([]);

    try {
      window.localStorage.removeItem(
        CHAVE_HISTORICO
      );
    } catch {
      // O navegador pode bloquear o armazenamento.
    }
  }

  function selecionarSugestao(
    sugestao: Sugestao
  ) {
    salvarHistorico(
      sugestao.valor
    );

    setIndiceSugestaoAtiva(-1);
    setCampoFocado(false);

    switch (sugestao.tipo) {
      case "marca":
        setMarcaSelecionada(
          sugestao.valor
        );

        setBusca("");
        break;

      case "categoria":
        setCategoriaSelecionada(
          sugestao.valor
        );

        setBusca("");
        break;

      case "cor":
        setCorSelecionada(
          sugestao.valor
        );

        setBusca("");
        break;

      case "produto":
        if (
          sugestao.codigoProduto
        ) {
          router.push(
            `/produto/${sugestao.codigoProduto}`
          );
        }
        break;

      case "codigo":
      case "tamanho":
        setBusca(sugestao.valor);
        break;
    }

    inputRef.current?.blur();
  }

  function selecionarHistorico(
    item: string
  ) {
    salvarHistorico(item);

    setBusca(item);

    setIndiceSugestaoAtiva(-1);

    setCampoFocado(true);

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  function controlarTeclado(
    evento: KeyboardEvent<HTMLInputElement>
  ) {
    if (!mostrarSugestoes) {
      return;
    }

    if (evento.key === "ArrowDown") {
      evento.preventDefault();

      if (
        sugestoes.length === 0
      ) {
        return;
      }

      setIndiceSugestaoAtiva(
        (indiceAtual) =>
          indiceAtual >=
          sugestoes.length - 1
            ? 0
            : indiceAtual + 1
      );

      return;
    }

    if (evento.key === "ArrowUp") {
      evento.preventDefault();

      if (
        sugestoes.length === 0
      ) {
        return;
      }

      setIndiceSugestaoAtiva(
        (indiceAtual) =>
          indiceAtual <= 0
            ? sugestoes.length - 1
            : indiceAtual - 1
      );

      return;
    }

    if (evento.key === "Enter") {
      if (
        indiceSugestaoAtiva >= 0 &&
        sugestoes[
          indiceSugestaoAtiva
        ]
      ) {
        evento.preventDefault();

        selecionarSugestao(
          sugestoes[
            indiceSugestaoAtiva
          ]
        );

        return;
      }

      if (busca.trim()) {
        salvarHistorico(busca);

        setCampoFocado(false);

        inputRef.current?.blur();
      }

      return;
    }

    if (evento.key === "Escape") {
      setCampoFocado(false);

      setIndiceSugestaoAtiva(-1);

      inputRef.current?.blur();
    }
  }

  function abrirSugestoes() {
    setCampoFocado(true);
  }

  function limparPesquisa() {
    setBusca("");

    setIndiceSugestaoAtiva(-1);

    setCampoFocado(true);

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  return (
  <aside className="sticky top-24 rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6 shadow-2xl">
      <div className="relative z-50">
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={busca}
            autoComplete="off"
            aria-label="Pesquisar produtos"
            aria-expanded={
              mostrarSugestoes
            }
            aria-controls="sugestoes-pesquisa"
            onFocus={abrirSugestoes}
            onClick={abrirSugestoes}
            onPointerDown={
              abrirSugestoes
            }
            onBlur={() => {
              window.setTimeout(() => {
                setCampoFocado(false);

                setIndiceSugestaoAtiva(
                  -1
                );
              }, 180);
            }}
            onKeyDown={
              controlarTeclado
            }
            onChange={(evento) => {
              setBusca(
                evento.target.value
              );

              setCampoFocado(true);

              setIndiceSugestaoAtiva(
                -1
              );
            }}
            placeholder="Pesquisar por marca, produto, código, cor ou tamanho..."
            className="w-full rounded-full border border-[#C8A95B]/30 bg-[#111111] py-5 pl-7 pr-28 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#C8A95B] md:pr-32 md:text-lg"
          />

          {busca && (
            <button
              type="button"
              onMouseDown={(evento) => {
                evento.preventDefault();

                limparPesquisa();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[#C8A95B]/30 px-4 py-2 text-xs font-bold text-[#C8A95B] transition hover:bg-[#C8A95B] hover:text-[#111111] md:px-5 md:text-sm"
            >
              Limpar
            </button>
          )}
        </div>        {mostrarSugestoes && (
          <div
            id="sugestoes-pesquisa"
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+12px)] z-[100] max-h-[520px] overflow-y-auto rounded-[28px] border border-[#C8A95B]/30 bg-[#111111] p-3 shadow-[0_30px_90px_rgba(0,0,0,.85)]"
          >
            {historico.length > 0 &&
              busca.trim() === "" && (
                <div className="mb-4 border-b border-[#C8A95B]/15 px-2 pb-4 pt-2">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8A95B]">
                      🕒 Pesquisas recentes
                    </p>

                    <button
                      type="button"
                      onMouseDown={(
                        evento
                      ) => {
                        evento.preventDefault();

                        limparHistorico();
                      }}
                      className="text-xs font-semibold text-[#F3E8D7]/45 transition hover:text-[#C8A95B]"
                    >
                      Limpar histórico
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {historico.map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center overflow-hidden rounded-full border border-[#C8A95B]/20 bg-[#181818]"
                        >
                          <button
                            type="button"
                            onMouseDown={(
                              evento
                            ) => {
                              evento.preventDefault();

                              selecionarHistorico(
                                item
                              );
                            }}
                            className="px-4 py-2 text-sm text-white transition hover:bg-[#C8A95B]/10"
                          >
                            {item}
                          </button>

                          <button
                            type="button"
                            aria-label={`Remover ${item} do histórico`}
                            onMouseDown={(
                              evento
                            ) => {
                              evento.preventDefault();

                              evento.stopPropagation();

                              removerDoHistorico(
                                item
                              );
                            }}
                            className="border-l border-[#C8A95B]/15 px-3 py-2 text-sm text-[#F3E8D7]/40 transition hover:bg-red-500/10 hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {!busca.trim() &&
              sugestoes.length > 0 && (
                <p className="px-4 pb-3 pt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C8A95B]">
                  ⭐ Produtos em destaque
                </p>
              )}

            {sugestoes.length > 0 ? (
              <div className="space-y-2">
                {sugestoes.map(
                  (
                    sugestao,
                    index
                  ) => {
                    const ativa =
                      indiceSugestaoAtiva ===
                      index;

                    return (
                      <button
                        key={
                          sugestao.id
                        }
                        type="button"
                        role="option"
                        aria-selected={
                          ativa
                        }
                        onMouseEnter={() =>
                          setIndiceSugestaoAtiva(
                            index
                          )
                        }
                        onMouseDown={(
                          evento
                        ) => {
                          evento.preventDefault();

                          selecionarSugestao(
                            sugestao
                          );
                        }}
                        className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                          ativa
                            ? "border-[#C8A95B] bg-[#C8A95B]/15"
                            : "border-transparent hover:border-[#C8A95B]/30 hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#C8A95B]/20 bg-[#181818] text-xl">
                          {iconeSugestao(
                            sugestao.tipo
                          )}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#C8A95B]">
                            {nomeTipoSugestao(
                              sugestao.tipo
                            )}
                          </span>

                          <span className="mt-1 block truncate font-semibold text-white">
                            {destacarTexto(
                              sugestao.valor,
                              busca
                            )}
                          </span>

                          {sugestao.textoSecundario && (
                            <span className="mt-1 block truncate text-xs text-[#F3E8D7]/45">
                              {
                                sugestao.textoSecundario
                              }
                            </span>
                          )}
                        </span>

                        <span className="text-xl text-[#C8A95B]/60">
                          ›
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="px-5 py-8 text-center">
                <div className="text-4xl">
                  🔍
                </div>

                <p className="mt-4 font-semibold text-white">
                  Nenhuma sugestão encontrada
                </p>

                <p className="mt-2 text-sm text-[#F3E8D7]/45">
                  Altere os termos da
                  pesquisa para encontrar
                  outros produtos.
                </p>
              </div>
            )}

            <div className="mt-3 hidden items-center justify-between border-t border-[#C8A95B]/15 px-4 pt-3 text-xs text-[#F3E8D7]/35 md:flex">
              <span>
                ↑ ↓ para navegar
              </span>

              <span>
                Enter para selecionar
              </span>

              <span>
                Esc para fechar
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-[#C8A95B]/10 pt-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#C8A95B]">
          Marcas
        </p>

       <div className="flex flex-col gap-2">
          {marcas.map((marca) => (
            <button
              key={marca}
              type="button"
              onClick={() =>
                setMarcaSelecionada(
                  marca
                )
              }
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                marcaSelecionada ===
                marca
                  ? "border-[#C8A95B] bg-[#C8A95B] text-[#111111]"
                  : "border-[#C8A95B]/25 bg-[#111111] text-white hover:border-[#C8A95B]"
              }`}
            >
              {marca}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-[#C8A95B]/10 pt-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#C8A95B]">
          Categorias
        </p>

        <div className="flex flex-col gap-2">
          {categorias.map(
            (categoria) => (
              <button
                key={categoria}
                type="button"
                onClick={() =>
                  setCategoriaSelecionada(
                    categoria
                  )
                }
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  categoriaSelecionada ===
                  categoria
                    ? "border-[#C8A95B] bg-[#C8A95B] text-[#111111]"
                    : "border-[#C8A95B]/25 bg-[#111111] text-white hover:border-[#C8A95B]"
                }`}
              >
                {categoria}
              </button>
            )
          )}
        </div>
      </div>

      <div className="mt-8 border-t border-[#C8A95B]/10 pt-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#C8A95B]">
          Cores
        </p>

        <div className="flex flex-col gap-2">
          {cores.map((cor) => (
            <button
              key={cor}
              type="button"
              onClick={() =>
                setCorSelecionada(cor)
              }
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                corSelecionada === cor
                  ? "border-[#C8A95B] bg-[#C8A95B] text-[#111111]"
                  : "border-[#C8A95B]/25 bg-[#111111] text-white hover:border-[#C8A95B]"
              }`}
            >
              {cor}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-[#C8A95B]/20 pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-bold text-white">
            {quantidadeResultados}{" "}
            {quantidadeResultados === 1
              ? "produto encontrado"
              : "produtos encontrados"}
          </p>

          <p className="mt-1 text-sm text-[#F3E8D7]/50">
            O catálogo é atualizado
            automaticamente conforme os
            produtos cadastrados.
          </p>
        </div>

        {filtrosAtivos && (
          <button
            type="button"
            onClick={limparFiltros}
            className="rounded-full border border-[#C8A95B] px-7 py-3 font-bold text-[#C8A95B] transition hover:bg-[#C8A95B] hover:text-[#111111]"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </aside>
  );
}