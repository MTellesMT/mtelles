"use client";

import { useCallback, useEffect, useState } from "react";
import ProductForm from "@/components/admin/ProductForm";
import ProductTable from "@/components/admin/ProductTable";
import {
  deleteProduct,
  getProducts,
} from "@/services/products";
import { Product } from "@/types/product";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

const [produtoEmEdicao, setProdutoEmEdicao] =
  useState<Product | null>(null);
  const carregarProdutos = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      alert("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  async function excluirProduto(id: number) {
    try {
      await deleteProduct(id);

      await carregarProdutos();

      alert("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Não foi possível excluir o produto.");
    }
  }

 function editarProduto(product: Product) {
  setProdutoEmEdicao(product);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

  return (
    <main className="min-h-screen bg-[#111111] px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-[#C8A95B]">
            MTelles
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Painel Administrativo
          </h1>

          <p className="mt-3 text-[#F3E8D7]/60">
            Cadastre e gerencie os produtos da loja.
          </p>
        </div>

        <ProductForm
  onProductCreated={carregarProdutos}
  productToEdit={produtoEmEdicao}
  onCancelEdit={() => setProdutoEmEdicao(null)}
/>

        {loading ? (
          <div className="mt-12 rounded-3xl border border-[#C8A95B]/20 p-10 text-center text-[#F3E8D7]/60">
            Carregando produtos...
          </div>
        ) : (
          <ProductTable
            products={products}
            onDelete={excluirProduto}
            onEdit={editarProduto}
          />
        )}
      </div>
    </main>
  );
}