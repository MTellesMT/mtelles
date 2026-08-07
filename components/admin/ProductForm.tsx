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

import { Product } from "@/types/product";

interface ProductFormProps {
  onProductCreated?: () => void;

  productToEdit?: Product | null;

  onCancelEdit?: () => void;
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

  const [codigo, setCodigo] =
    useState("");

  const [categoria, setCategoria] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  const [preco, setPreco] =
    useState("");

  const [material, setMaterial] =
    useState("");

  const [altura, setAltura] =
    useState("");

  const [estoque, setEstoque] =
    useState("");

  const [cores, setCores] =
    useState("");

  const [tamanhos, setTamanhos] =
    useState("");

  // GALERIA DE IMAGENS

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

  useEffect(() => {
    if (!productToEdit) {
      return;
    }

    setNome(productToEdit.nome);

    setMarca(productToEdit.marca);

    setCodigo(productToEdit.codigo);

    setCategoria(
      productToEdit.categoria
    );

    setDescricao(
      productToEdit.descricao
    );

    setPreco(
      String(productToEdit.preco)
    );

    setMaterial(
      productToEdit.material
    );

    setAltura(
      productToEdit.altura_do_calcanhar
    );

    setEstoque(
      String(productToEdit.estoque)
    );

    setCores(productToEdit.cores);

    setTamanhos(
      productToEdit.tamanhos
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

    setImagens([
      productToEdit.imagem_principal,
      ...galeria,
    ]);

    setAtivo(productToEdit.ativo);

    setDestaque(
      productToEdit.em_destaque
    );

    setMaisVendido(
      productToEdit.mais_vendido ??
        false
    );
  }, [productToEdit]);

  async function salvarProduto() {
    if (!nome || !preco) {
      alert(
        "Preencha nome e preço."
      );

      return;
    }

    if (imagens.length === 0) {
      alert(
        "Selecione pelo menos uma imagem."
      );

      return;
    }

    try {
      setLoading(true);

      const dadosProduto = {
        nome,
        marca,
        codigo,
        categoria,
        descricao,

        preco: Number(preco),

        material,

        altura_do_calcanhar:
          altura,

        tamanhos,
        cores,

        imagem_principal:
          imagens[0],

        galeria: JSON.stringify(
          imagens.slice(1)
        ),

        em_destaque: destaque,

        mais_vendido: maisVendido,

        ativo,

        estoque: Number(estoque),
      };

      if (productToEdit) {
        console.log(
          "ID DO PRODUTO:",
          productToEdit.id
        );

        console.log(
          "PRODUTO:",
          productToEdit
        );

        await updateProduct(
          productToEdit.id,
          dadosProduto
        );
      } else {
        await createProduct(
          dadosProduto
        );
      }

      setNome("");
      setMarca("");
      setCodigo("");
      setCategoria("");
      setDescricao("");
      setPreco("");
      setMaterial("");
      setAltura("");
      setEstoque("");
      setCores("");
      setTamanhos("");

      setImagens([]);

      setAtivo(true);

      setDestaque(false);

      setMaisVendido(false);

      if (onProductCreated) {
        await onProductCreated();
      }

      alert(
        productToEdit
          ? "Produto atualizado com sucesso!"
          : "Produto cadastrado com sucesso!"
      );

      if (
        productToEdit &&
        onCancelEdit
      ) {
        onCancelEdit();
      }
    } catch (error) {
      console.error(
        "ERRO COMPLETO:",
        error
      );

      if (
        error instanceof Error
      ) {
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
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8">
      <h2 className="mb-8 text-3xl font-bold">
        {productToEdit
          ? "Editar Produto"
          : "Novo Produto"}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
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
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Marca
          </label>

          <input
            value={marca}
            onChange={(e) =>
              setMarca(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
          />
        </div>

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
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Categoria
          </label>

          <input
            value={categoria}
            onChange={(e) =>
              setCategoria(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Preço
          </label>

          <input
            type="number"
            value={preco}
            onChange={(e) =>
              setPreco(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Estoque
          </label>

          <input
            type="number"
            value={estoque}
            onChange={(e) =>
              setEstoque(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Material
          </label>

          <input
            value={material}
            onChange={(e) =>
              setMaterial(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Altura do salto
          </label>

          <input
            value={altura}
            onChange={(e) =>
              setAltura(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Cores
          </label>

          <input
            value={cores}
            onChange={(e) =>
              setCores(
                e.target.value
              )
            }
            placeholder="Preto, Nude, Branco..."
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Tamanhos
          </label>

          <input
            value={tamanhos}
            onChange={(e) =>
              setTamanhos(
                e.target.value
              )
            }
            placeholder="34,35,36..."
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block">
          Descrição
        </label>

        <textarea
          rows={5}
          value={descricao}
          onChange={(e) =>
            setDescricao(
              e.target.value
            )
          }
          className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
        />
      </div>

      <div className="mt-8">
        <ImageUpload
          value={imagens}
          onChange={setImagens}
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) =>
              setAtivo(
                e.target.checked
              )
            }
          />

          Produto ativo
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={destaque}
            onChange={(e) =>
              setDestaque(
                e.target.checked
              )
            }
          />

          Produto em destaque
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={maisVendido}
            onChange={(e) =>
              setMaisVendido(
                e.target.checked
              )
            }
          />

          Mais vendido
        </label>
      </div>

      <div className="mt-10 flex gap-4">
        <button
          type="button"
          onClick={salvarProduto}
          disabled={loading}
          className="rounded-full bg-[#C8A95B] px-8 py-4 font-semibold text-[#111111] hover:opacity-90 disabled:opacity-50"
        >
          {loading
            ? "Salvando..."
            : productToEdit
              ? "Salvar Alterações"
              : "Salvar Produto"}
        </button>

        {productToEdit && (
          <button
            type="button"
            onClick={
              onCancelEdit
            }
            className="rounded-full border border-[#C8A95B]/30 px-8 py-4 text-white hover:bg-[#222]"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}