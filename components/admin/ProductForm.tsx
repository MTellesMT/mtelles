"use client";

import {
  useEffect,
  useState,
} from "react";

import ImageUpload from "./ImageUpload";

import {
  createProduct,
  updateProduct,
} from "@/services/products";

import {
  categoriasProduto,
  marcasProduto,
  coresProduto,
  tamanhosProduto,
} from "@/data/productOptions";

import { Product } from "@/types/product";

interface ProductFormProps {
  onProductCreated?: () => void;
  productToEdit?: Product | null;
  onCancelEdit?: () => void;
}

function transformarEmLista(
  valor: string | null | undefined
) {
  if (!valor) {
    return [];
  }

  return valor
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function criarListaSemDuplicados(
  valores: string[]
) {
  return Array.from(
    new Set(
      valores
        .map((valor) => valor.trim())
        .filter(Boolean)
    )
  );
}

export default function ProductForm({
  onProductCreated,
  productToEdit,
  onCancelEdit,
}: ProductFormProps) {
  const [loading, setLoading] =
    useState(false);

  const [nome, setNome] =
    useState("");

  const [marca, setMarca] =
    useState("");

  const [novaMarca, setNovaMarca] =
    useState("");

  const [categoria, setCategoria] =
    useState("");

  const [
    novaCategoria,
    setNovaCategoria,
  ] = useState("");

  const [
    coresSelecionadas,
    setCoresSelecionadas,
  ] = useState<string[]>([]);

  const [
    tamanhosSelecionados,
    setTamanhosSelecionados,
  ] = useState<string[]>(
    tamanhosProduto
  );

  const [novaCor, setNovaCor] =
    useState("");

  const [
    novoTamanho,
    setNovoTamanho,
  ] = useState("");

  const [
    mostrarNovaCor,
    setMostrarNovaCor,
  ] = useState(false);

  const [
    mostrarNovoTamanho,
    setMostrarNovoTamanho,
  ] = useState(false);

  const [
    listaCores,
    setListaCores,
  ] =
    useState<string[]>(
      coresProduto
    );

  const [
    listaTamanhos,
    setListaTamanhos,
  ] =
    useState<string[]>(
      tamanhosProduto
    );

  const [codigo, setCodigo] =
    useState("");

  const [
    descricao,
    setDescricao,
  ] = useState("");

  const [preco, setPreco] =
    useState("");

  const [estoque, setEstoque] =
    useState("");

  const [
    mostrarNovaMarca,
    setMostrarNovaMarca,
  ] = useState(false);

  const [
    mostrarNovaCategoria,
    setMostrarNovaCategoria,
  ] = useState(false);

  const [
    listaMarcas,
    setListaMarcas,
  ] =
    useState<string[]>(
      marcasProduto
    );

  const [
    listaCategorias,
    setListaCategorias,
  ] =
    useState<string[]>(
      categoriasProduto
    );

  const [imagens, setImagens] =
    useState<string[]>([]);

  const [ativo, setAtivo] =
    useState(true);

  const [destaque, setDestaque] =
    useState(false);

  const [
    maisVendido,
    setMaisVendido,
  ] = useState(false);

  /*
   * CARREGAR CORES SALVAS
   */

  useEffect(() => {
    const coresSalvas =
      localStorage.getItem(
        "mtelles_cores"
      );

    if (!coresSalvas) {
      return;
    }

    try {
      const lista =
        JSON.parse(
          coresSalvas
        );

      if (Array.isArray(lista)) {
        setListaCores(
          criarListaSemDuplicados([
            ...coresProduto,
            ...lista,
          ])
        );
      }
    } catch {
      console.error(
        "Erro ao carregar cores salvas."
      );
    }
  }, []);

  /*
   * CARREGAR TAMANHOS SALVOS
   */

  useEffect(() => {
    const tamanhosSalvos =
      localStorage.getItem(
        "mtelles_tamanhos"
      );

    if (!tamanhosSalvos) {
      setListaTamanhos(
        criarListaSemDuplicados(
          tamanhosProduto
        )
      );

      if (!productToEdit) {
        setTamanhosSelecionados(
          criarListaSemDuplicados(
            tamanhosProduto
          )
        );
      }

      return;
    }

    try {
      const lista =
        JSON.parse(
          tamanhosSalvos
        );

      if (Array.isArray(lista)) {
        const listaCompleta =
          criarListaSemDuplicados([
            ...tamanhosProduto,
            ...lista,
          ]);

        setListaTamanhos(
          listaCompleta
        );

        if (!productToEdit) {
          setTamanhosSelecionados(
            listaCompleta
          );
        }
      }
    } catch {
      console.error(
        "Erro ao carregar tamanhos salvos."
      );
    }
  }, [productToEdit]);

  /*
   * CARREGAR PRODUTO PARA EDIÇÃO
   */

  useEffect(() => {
    if (!productToEdit) {
      return;
    }

    setNome(
      productToEdit.nome ?? ""
    );

    setMarca(
      productToEdit.marca ?? ""
    );

    setCategoria(
      productToEdit.categoria ?? ""
    );

    setCodigo(
      productToEdit.codigo ?? ""
    );

    setDescricao(
      productToEdit.descricao ?? ""
    );

    setPreco(
      String(
        productToEdit.preco ?? ""
      )
    );

    setEstoque(
      String(
        productToEdit.estoque ?? ""
      )
    );

    setCoresSelecionadas(
      transformarEmLista(
        productToEdit.cores
      )
    );

    setTamanhosSelecionados(
      transformarEmLista(
        productToEdit.tamanhos
      )
    );

    /*
     * GARANTIR QUE CORES DO PRODUTO
     * APAREÇAM NA LISTA
     */

    setListaCores(
      (listaAtual) =>
        criarListaSemDuplicados([
          ...listaAtual,
          ...transformarEmLista(
            productToEdit.cores
          ),
        ])
    );

    /*
     * GARANTIR QUE TAMANHOS DO PRODUTO
     * APAREÇAM NA LISTA
     */

    setListaTamanhos(
      (listaAtual) =>
        criarListaSemDuplicados([
          ...listaAtual,
          ...transformarEmLista(
            productToEdit.tamanhos
          ),
        ])
    );

    let galeria: string[] = [];

    try {
      galeria =
        productToEdit.galeria
          ? JSON.parse(
              productToEdit.galeria
            )
          : [];
    } catch {
      galeria = [];
    }

    const imagensProduto = [
      productToEdit.imagem_principal,
      ...galeria,
    ].filter(Boolean);

    setImagens(
      imagensProduto
    );

    setAtivo(
      productToEdit.ativo
    );

    setDestaque(
      productToEdit.em_destaque
    );

    setMaisVendido(
      productToEdit.mais_vendido ??
        false
    );
  }, [productToEdit]);

  /*
   * ADICIONAR MARCA
   */

  function adicionarMarca() {
    const valor =
      novaMarca.trim();

    if (!valor) {
      return;
    }

    setListaMarcas(
      (lista) =>
        criarListaSemDuplicados([
          ...lista,
          valor,
        ])
    );

    setMarca(valor);

    setNovaMarca("");

    setMostrarNovaMarca(
      false
    );
  }

  /*
   * ADICIONAR CATEGORIA
   */

  function adicionarCategoria() {
    const valor =
      novaCategoria.trim();

    if (!valor) {
      return;
    }

    setListaCategorias(
      (lista) =>
        criarListaSemDuplicados([
          ...lista,
          valor,
        ])
    );

    setCategoria(valor);

    setNovaCategoria("");

    setMostrarNovaCategoria(
      false
    );
  }

  /*
   * ADICIONAR COR
   */

  function adicionarCor() {
    const valor =
      novaCor.trim();

    if (!valor) {
      return;
    }

    const novaLista =
      criarListaSemDuplicados([
        ...listaCores,
        valor,
      ]);

    setListaCores(
      novaLista
    );

    localStorage.setItem(
      "mtelles_cores",
      JSON.stringify(
        novaLista
      )
    );

    setCoresSelecionadas(
      (selecionadas) =>
        criarListaSemDuplicados([
          ...selecionadas,
          valor,
        ])
    );

    setNovaCor("");

    setMostrarNovaCor(
      false
    );
  }

  /*
   * ADICIONAR NOVO TAMANHO
   */

  function adicionarTamanho() {
    const valor =
      novoTamanho.trim();

    if (!valor) {
      return;
    }

    const novaLista =
      criarListaSemDuplicados([
        ...listaTamanhos,
        valor,
      ]);

    setListaTamanhos(
      novaLista
    );

    localStorage.setItem(
      "mtelles_tamanhos",
      JSON.stringify(
        novaLista
      )
    );

    /*
     * NOVO TAMANHO É CRIADO
     * COMO DISPONÍVEL
     */

    setTamanhosSelecionados(
      (selecionados) =>
        criarListaSemDuplicados([
          ...selecionados,
          valor,
        ])
    );

    setNovoTamanho("");

    setMostrarNovoTamanho(
      false
    );
  }

  /*
   * ALTERAR DISPONIBILIDADE
   * DE UM TAMANHO
   */

  function alternarTamanho(
    tamanho: string
  ) {
    setTamanhosSelecionados(
      (selecionados) => {
        const estaDisponivel =
          selecionados.includes(
            tamanho
          );

        if (estaDisponivel) {
          return selecionados.filter(
            (item) =>
              item !== tamanho
          );
        }

        return [
          ...selecionados,
          tamanho,
        ];
      }
    );
  }

  /*
   * LIMPAR FORMULÁRIO
   */

  function limparFormulario() {
    setNome("");

    setMarca("");

    setNovaMarca("");

    setCategoria("");

    setNovaCategoria("");

    setCodigo("");

    setDescricao("");

    setPreco("");

    setEstoque("");

    setCoresSelecionadas(
      []
    );

    /*
     * PRODUTO NOVO COMEÇA
     * COM TODOS OS TAMANHOS
     * DISPONÍVEIS
     */

    setTamanhosSelecionados(
      listaTamanhos
    );

    setNovaCor("");

    setNovoTamanho("");

    setMostrarNovaMarca(
      false
    );

    setMostrarNovaCategoria(
      false
    );

    setMostrarNovaCor(
      false
    );

    setMostrarNovoTamanho(
      false
    );

    setImagens([]);

    setAtivo(true);

    setDestaque(false);

    setMaisVendido(false);
  }

  /*
   * SALVAR PRODUTO
   */

  async function salvarProduto() {
    if (
      !nome.trim() ||
      !preco
    ) {
      alert(
        "Preencha nome e preço."
      );

      return;
    }

    if (
      imagens.length === 0
    ) {
      alert(
        "Selecione pelo menos uma imagem."
      );

      return;
    }

    try {
      setLoading(true);

      const dadosProduto = {
        nome:
          nome.trim(),

        marca:
          marca.trim(),

        codigo:
          codigo.trim(),

        categoria:
          categoria.trim(),

        descricao:
          descricao.trim(),

        preco:
          Number(preco),

        estoque:
          Number(
            estoque || 0
          ),

        cores:
          coresSelecionadas.join(
            ", "
          ),

        tamanhos:
          tamanhosSelecionados.join(
            ", "
          ),

        imagem_principal:
          imagens[0],

        galeria:
          JSON.stringify(
            imagens.slice(1)
          ),

        em_destaque:
          destaque,

        mais_vendido:
          maisVendido,

        ativo,
      };

      if (productToEdit) {
        await updateProduct(
          productToEdit.id,
          dadosProduto
        );
      } else {
        await createProduct(
          dadosProduto
        );
      }

      if (
        onProductCreated
      ) {
        await onProductCreated();
      }

      alert(
        productToEdit
          ? "Produto atualizado com sucesso!"
          : "Produto cadastrado com sucesso!"
      );

      if (!productToEdit) {
        limparFormulario();
      }
    } catch (error) {
      console.error(
        "Erro ao salvar produto:",
        error
      );

      alert(
        "Erro ao salvar produto."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6 sm:p-8">
      <h2 className="mb-8 text-3xl font-bold">
        {productToEdit
          ? "Editar Produto"
          : "Novo Produto"}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* NOME */}

        <div>
          <label className="mb-2 block">
            Nome
          </label>

          <input
            value={nome}
            onChange={(e) =>
              setNome(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3 outline-none focus:border-[#C8A95B]"
          />
        </div>

        {/* MARCA */}

        <div>
          <label className="mb-2 block">
            Marca
          </label>

          <select
            value={marca}
            onChange={(e) => {
              const valor =
                e.target.value;

              if (
                valor ===
                "__nova__"
              ) {
                setMostrarNovaMarca(
                  true
                );

                setMarca("");

                return;
              }

              setMarca(valor);
            }}
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3 outline-none focus:border-[#C8A95B]"
          >
            <option value="">
              Selecione uma marca
            </option>

            {listaMarcas.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

            <option value="__nova__">
              Criar nova marca
            </option>
          </select>

          {mostrarNovaMarca && (
            <div className="mt-3">
              <input
                value={novaMarca}
                onChange={(e) =>
                  setNovaMarca(
                    e.target.value
                  )
                }
                placeholder="Digite a nova marca"
                className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
              />

              <button
                type="button"
                onClick={
                  adicionarMarca
                }
                className="mt-3 rounded-xl bg-[#C8A95B] px-5 py-3 font-semibold text-[#111]"
              >
                Salvar marca
              </button>
            </div>
          )}
        </div>

        {/* CÓDIGO */}

        <div>
          <label className="mb-2 block">
            Código
          </label>

          <input
            value={codigo}
            onChange={(e) =>
              setCodigo(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3 outline-none focus:border-[#C8A95B]"
          />
        </div>

        {/* CATEGORIA */}

        <div>
          <label className="mb-2 block">
            Categoria
          </label>

          <select
            value={categoria}
            onChange={(e) => {
              const valor =
                e.target.value;

              if (
                valor ===
                "__nova__"
              ) {
                setMostrarNovaCategoria(
                  true
                );

                setCategoria("");

                return;
              }

              setCategoria(valor);
            }}
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3 outline-none focus:border-[#C8A95B]"
          >
            <option value="">
              Selecione uma categoria
            </option>

            {listaCategorias.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

            <option value="__nova__">
              Criar nova categoria
            </option>
          </select>

          {mostrarNovaCategoria && (
            <div className="mt-3">
              <input
                value={
                  novaCategoria
                }
                onChange={(e) =>
                  setNovaCategoria(
                    e.target.value
                  )
                }
                placeholder="Digite a nova categoria"
                className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
              />

              <button
                type="button"
                onClick={
                  adicionarCategoria
                }
                className="mt-3 rounded-xl bg-[#C8A95B] px-5 py-3 font-semibold text-[#111]"
              >
                Salvar categoria
              </button>
            </div>
          )}
        </div>

        {/* COR */}

        <div>
          <label className="mb-2 block">
            Cor
          </label>

          <select
            value=""
            onChange={(e) => {
              const valor =
                e.target.value;

              if (
                valor ===
                "__nova__"
              ) {
                setMostrarNovaCor(
                  true
                );

                return;
              }

              if (!valor) {
                return;
              }

              setCoresSelecionadas(
                (selecionadas) => {
                  if (
                    selecionadas.includes(
                      valor
                    )
                  ) {
                    return selecionadas;
                  }

                  return [
                    ...selecionadas,
                    valor,
                  ];
                }
              );
            }}
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
          >
            <option value="">
              Selecione uma cor
            </option>

            {listaCores.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

            <option value="__nova__">
              Criar nova cor
            </option>
          </select>

          {coresSelecionadas.length >
            0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {coresSelecionadas.map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-full border border-[#C8A95B]/40 bg-[#111] px-4 py-2"
                  >
                    <span className="text-sm text-[#F3E8D7]">
                      {item}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setCoresSelecionadas(
                          (
                            selecionadas
                          ) =>
                            selecionadas.filter(
                              (
                                corSelecionada
                              ) =>
                                corSelecionada !==
                                item
                            )
                        )
                      }
                      className="font-bold text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          {mostrarNovaCor && (
            <div className="mt-3">
              <input
                value={novaCor}
                onChange={(e) =>
                  setNovaCor(
                    e.target.value
                  )
                }
                placeholder="Digite a nova cor"
                className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
              />

              <button
                type="button"
                onClick={
                  adicionarCor
                }
                className="mt-3 rounded-xl bg-[#C8A95B] px-5 py-3 font-semibold text-[#111]"
              >
                Adicionar cor
              </button>
            </div>
          )}
        </div>

        {/* TAMANHOS */}

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block">
              Tamanhos
            </label>

            <button
              type="button"
              onClick={() =>
                setMostrarNovoTamanho(
                  (
                    valorAtual
                  ) =>
                    !valorAtual
                )
              }
              className="text-sm font-semibold text-[#C8A95B] hover:text-[#e3c46f]"
            >
              + Novo tamanho
            </button>
          </div>

          <div className="rounded-xl border border-[#333] bg-[#111] p-4">
            <p className="mb-4 text-xs leading-5 text-[#F3E8D7]/55">
              Verde = disponível.
              Vermelho =
              indisponível. Clique
              no tamanho para alterar.
            </p>

            <div className="flex flex-wrap gap-2">
              {listaTamanhos.map(
                (item) => {
                  const disponivel =
                    tamanhosSelecionados.includes(
                      item
                    );

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        alternarTamanho(
                          item
                        )
                      }
                      className={`min-w-[52px] rounded-xl border px-4 py-3 text-sm font-bold transition ${
                        disponivel
                          ? "border-green-500/60 bg-green-500/15 text-green-400 hover:bg-green-500/25"
                          : "border-red-500/60 bg-red-500/15 text-red-400 hover:bg-red-500/25"
                      }`}
                    >
                      {item}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {mostrarNovoTamanho && (
            <div className="mt-3">
              <input
                value={
                  novoTamanho
                }
                onChange={(e) =>
                  setNovoTamanho(
                    e.target.value
                  )
                }
                placeholder="Digite o novo tamanho"
                className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
              />

              <button
                type="button"
                onClick={
                  adicionarTamanho
                }
                className="mt-3 rounded-xl bg-[#C8A95B] px-5 py-3 font-semibold text-[#111]"
              >
                Salvar tamanho
              </button>
            </div>
          )}
        </div>

        {/* PREÇO */}

        <div>
          <label className="mb-2 block">
            Preço
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={preco}
            onChange={(e) =>
              setPreco(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3 outline-none focus:border-[#C8A95B]"
          />
        </div>

        {/* ESTOQUE */}

        <div>
          <label className="mb-2 block">
            Estoque
          </label>

          <input
            type="number"
            min="0"
            step="1"
            value={estoque}
            onChange={(e) =>
              setEstoque(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3 outline-none focus:border-[#C8A95B]"
          />
        </div>

        {/* DESCRIÇÃO - AGORA ABAIXO DE PREÇO E ESTOQUE */}

        <div className="md:col-span-2">
          <label className="mb-2 block">
            Descrição
          </label>

          <textarea
            value={descricao}
            onChange={(e) =>
              setDescricao(
                e.target.value
              )
            }
            rows={5}
            placeholder="Digite a descrição do produto"
            className="w-full resize-none rounded-xl border border-[#333] bg-[#111] px-4 py-3 outline-none focus:border-[#C8A95B]"
          />
        </div>
      </div>

      {/* IMAGENS */}

      <div className="mt-8">
        <ImageUpload
          value={imagens}
          onChange={
            setImagens
          }
        />
      </div>

      {/* STATUS - LADO A LADO */}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <label
          className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-5 transition ${
            ativo
              ? "border-green-500/40 bg-green-500/10"
              : "border-red-500/30 bg-red-500/10"
          }`}
        >
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) =>
              setAtivo(
                e.target.checked
              )
            }
            className="h-5 w-5 accent-[#C8A95B]"
          />

          <div>
            <p className="font-semibold">
              Produto ativo
            </p>

            <p className="mt-1 text-xs text-[#F3E8D7]/50">
              Exibir produto na
              loja
            </p>
          </div>
        </label>

        <label
          className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-5 transition ${
            destaque
              ? "border-[#C8A95B]/50 bg-[#C8A95B]/10"
              : "border-[#333] bg-[#111]"
          }`}
        >
          <input
            type="checkbox"
            checked={destaque}
            onChange={(e) =>
              setDestaque(
                e.target.checked
              )
            }
            className="h-5 w-5 accent-[#C8A95B]"
          />

          <div>
            <p className="font-semibold">
              Banner de destaque
            </p>

            <p className="mt-1 text-xs text-[#F3E8D7]/50">
              Exibir no banner
              principal
            </p>
          </div>
        </label>

        <label
          className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-5 transition ${
            maisVendido
              ? "border-[#C8A95B]/50 bg-[#C8A95B]/10"
              : "border-[#333] bg-[#111]"
          }`}
        >
          <input
            type="checkbox"
            checked={
              maisVendido
            }
            onChange={(e) =>
              setMaisVendido(
                e.target.checked
              )
            }
            className="h-5 w-5 accent-[#C8A95B]"
          />

          <div>
            <p className="font-semibold">
              Mais vendido
            </p>

            <p className="mt-1 text-xs text-[#F3E8D7]/50">
              Exibir na seção
              Mais Vendidos
            </p>
          </div>
        </label>
      </div>

      {/* BOTÕES */}

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={
            salvarProduto
          }
          disabled={loading}
          className="rounded-xl bg-[#C8A95B] px-8 py-3 font-bold text-[#111] transition hover:bg-[#e3c46f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Salvando..."
            : productToEdit
              ? "Atualizar Produto"
              : "Cadastrar Produto"}
        </button>

        {productToEdit &&
          onCancelEdit && (
            <button
              type="button"
              onClick={
                onCancelEdit
              }
              disabled={
                loading
              }
              className="rounded-xl border border-[#F3E8D7]/20 px-8 py-3 font-semibold text-[#F3E8D7] transition hover:border-[#C8A95B]/50 hover:text-[#C8A95B]"
            >
              Cancelar edição
            </button>
          )}
      </div>
    </div>
  );
}