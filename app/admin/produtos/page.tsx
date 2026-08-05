// PARTE 1
// app/admin/produtos/page.tsx

"use client";

import { useCallback, useEffect, useState } from "react";

import ProductForm from "@/components/admin/ProductForm";
import ProductTable from "@/components/admin/ProductTable";

import {
  getProducts,
  deleteProduct,
} from "@/services/products";

import { Product } from "@/types/product";

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [produtoEmEdicao, setProdutoEmEdicao] =
    useState<Product | null>(null);

  const [busca, setBusca] = useState("");

  const carregarProdutos = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data ?? []);
    } catch (error) {
      console.error(error);

      alert("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  async function excluirProduto(id: number) {
    if (
      !confirm(
        "Deseja realmente excluir este produto?"
      )
    ) {
      return;
    }

    await deleteProduct(id);

    carregarProdutos();
  }

  function editarProduto(produto: Product) {
    setProdutoEmEdicao(produto);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const produtosFiltrados = products.filter(
    (produto) => {
      const texto = busca.toLowerCase();

      return (
        produto.nome
          .toLowerCase()
          .includes(texto) ||
        produto.marca
          .toLowerCase()
          .includes(texto) ||
        produto.codigo
          .toLowerCase()
          .includes(texto)
      );
    }
  );

  const produtosAtivos =
    products.filter(
      (produto) => produto.ativo
    ).length;

  const produtosDestaque =
    products.filter(
      (produto) => produto.em_destaque
    ).length;

  const estoqueTotal =
    products.reduce(
      (total, produto) =>
        total +
        Number(produto.estoque || 0),
      0
    );

  return (
    <main className="min-h-screen bg-[#111111] p-8 text-white">

      <div className="mx-auto max-w-7xl">

        <div className="mb-10">

          <h1 className="text-4xl font-black">
            Produtos
          </h1>

          <p className="mt-2 text-[#F3E8D7]/70">
            Gerenciamento completo dos
            produtos da MTelles.
          </p>

        </div>

        <div className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6">

            <p className="text-sm uppercase tracking-widest text-[#F3E8D7]/60">
              Produtos
            </p>

            <h2 className="mt-3 text-4xl font-black text-[#C8A95B]">
              {products.length}
            </h2>

          </div>

          <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6">

            <p className="text-sm uppercase tracking-widest text-[#F3E8D7]/60">
              Ativos
            </p>

            <h2 className="mt-3 text-4xl font-black text-green-500">
              {produtosAtivos}
            </h2>

          </div>

          <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6">

            <p className="text-sm uppercase tracking-widest text-[#F3E8D7]/60">
              Destaques
            </p>

            <h2 className="mt-3 text-4xl font-black text-[#C8A95B]">
              {produtosDestaque}
            </h2>

          </div>

          <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6">

            <p className="text-sm uppercase tracking-widest text-[#F3E8D7]/60">
              Estoque
            </p>

            <h2 className="mt-3 text-4xl font-black text-blue-400">
              {estoqueTotal}
            </h2>

          </div>

        </div>

        <div className="mb-8">

          <input
            type="text"
            value={busca}
            onChange={(e) =>
              setBusca(e.target.value)
            }
            placeholder="Pesquisar por nome, marca ou código..."
            className="w-full rounded-2xl border border-[#C8A95B]/20 bg-[#181818] px-5 py-4 text-white placeholder:text-[#F3E8D7]/40 focus:border-[#C8A95B] focus:outline-none"
          />

        </div>

        <ProductForm
          onProductCreated={carregarProdutos}
          productToEdit={produtoEmEdicao}
          onCancelEdit={() =>
            setProdutoEmEdicao(null)
          }
        />

        <div className="mt-10">
          {loading ? (

            <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8 text-center">

              Carregando produtos...

            </div>

          ) : (

            <ProductTable
              products={produtosFiltrados}
              onDelete={excluirProduto}
              onEdit={editarProduto}
            />

          )}

        </div>

      </div>

    </main>
  );
}